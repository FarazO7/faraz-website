// Site verification for the static export. Build first, then:
//   npm run verify                      screenshots, glass budget, axe, keyboard
//   npm run verify -- --links           also crawl every link (linkinator)
//   npm run verify -- --lighthouse=dir  also run Lighthouse into .review/dir/
//
// 1. Screenshots at 375/768/1024/1440 (hero, Impact, Experience, Skills, two
//    impact pages) plus a reduced-motion set, in .review/screens/.
// 2. Glass budget: at most 6 painted, in-viewport backdrop-filter elements at
//    the hero, Impact, GitHub, GitHub-to-Skills and Skills scroll positions.
// 3. axe: zero serious or critical violations on / and two impact pages.
// 4. Keyboard: Impact tiles, "Read the case" links, the Zomato documents
//    toggle and the mobile menu (Escape closes it and returns focus).
//
// Uses the installed Google Chrome when present, else Playwright's Chromium
// (`npx playwright install chromium`). Exits 1 on any failure.

import { spawn } from "node:child_process";
import { mkdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { startServer } from "./serve-out.mjs";

const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;
const REVIEW = resolve(import.meta.dirname, "..", ".review");
const SCREENS = join(REVIEW, "screens");
const WIDTHS = [375, 768, 1024, 1440];
const HEIGHT = 900;
const GLASS_BUDGET = 6;
const IMPACT_PAGES = ["/impact/risk-scoring/", "/impact/referral-growth/"];
const COUNT_UP_MS = 2400; // odometer roll (2 s) plus digit stagger
const SETTLE_MS = 900; // reveal transition (0.7 s) plus margin

const args = process.argv.slice(2);
const lighthouseDir = args.find((a) => a.startsWith("--lighthouse="))?.split("=")[1];
const crawlLinks = args.includes("--links");

const failures = [];
const fail = (message) => failures.push(message);
const report = [];
const note = (line) => report.push(line);

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: "chrome" });
  } catch {
    return chromium.launch();
  }
}

async function openPage(browser, { width = 1440, reduced = false } = {}) {
  const context = await browser.newContext({
    viewport: { width, height: HEIGHT },
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  return { context, page: await context.newPage() };
}

async function scrollToY(page, y) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(SETTLE_MS);
}

async function sectionY(page, id) {
  return page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    return el ? el.getBoundingClientRect().top + window.scrollY : null;
  }, id);
}

// ---------------------------------------------------------------- screenshots
async function captureScreens(browser, width, reduced) {
  const tag = `${width}${reduced ? "-reduced" : ""}`;
  const shot = (name) => join(SCREENS, `${name}-${tag}.png`);
  const { context, page } = await openPage(browser, { width, reduced });

  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(SETTLE_MS);
  await page.screenshot({ path: shot("hero") });

  for (const id of ["impact", "experience", "skills"]) {
    await scrollToY(page, (await sectionY(page, id)) ?? 0);
    await page.waitForTimeout(id === "impact" ? COUNT_UP_MS : 0);
    await page.locator(`#${id}`).screenshot({ path: shot(id) });
  }
  for (const path of IMPACT_PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: "load" });
    await page.waitForTimeout(SETTLE_MS);
    await page.screenshot({ path: shot(path.split("/")[2]), fullPage: true });
  }
  await context.close();
}

// ---------------------------------------------------------------- glass budget
function countLiveBlur() {
  const hits = [];
  for (const el of document.querySelectorAll("body *")) {
    const style = getComputedStyle(el);
    const filter = style.backdropFilter || style.webkitBackdropFilter;
    if (!filter || filter === "none" || style.visibility !== "visible") continue;
    const r = el.getBoundingClientRect();
    const onScreen = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
    if (onScreen) hits.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}`);
  }
  return hits;
}

async function checkGlass(browser, width) {
  const { context, page } = await openPage(browser, { width });
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  const stops = [["hero", 0]];
  for (const id of ["impact", "github", "skills"]) stops.push([id, (await sectionY(page, id)) - 80]);
  stops.push(["github-to-skills", (await sectionY(page, "skills")) - HEIGHT / 2]);

  const counts = [];
  for (const [name, y] of stops) {
    await scrollToY(page, y);
    const hits = await page.evaluate(countLiveBlur);
    counts.push(`${name} ${hits.length}`);
    if (hits.length > GLASS_BUDGET) {
      fail(`glass: ${hits.length} live blurs at ${name}, ${width}px (${hits.join(", ")})`);
    }
  }
  note(`glass ${width}px: ${counts.join(" · ")}`);
  await context.close();
}

// ---------------------------------------------------------------- axe
async function checkAxe(browser) {
  const { context, page } = await openPage(browser);
  for (const path of ["/", ...IMPACT_PAGES]) {
    await page.goto(`${BASE}${path}`, { waitUntil: "load" });
    // Walk the page so every reveal-on-scroll block is visible to the checks.
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += HEIGHT / 2) await scrollToY(page, y);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    for (const v of serious) {
      const where = v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ");
      fail(`axe ${path}: ${v.id} (${v.impact}) at ${where}`);
    }
    note(`axe ${path}: ${serious.length} serious/critical, ${violations.length} total`);
  }
  await context.close();
}

// ---------------------------------------------------------------- keyboard
async function checkImpactTiles(page) {
  const tiles = await page.evaluate(() =>
    [...document.querySelectorAll('#impact a[href^="/impact/"]')].map((a) => ({
      name: a.getAttribute("aria-label") ?? "",
      tabIndex: a.tabIndex,
    })),
  );
  if (tiles.length < 8) return fail(`keyboard: expected 8 Impact tiles, found ${tiles.length}`);
  const names = tiles.map((t) => t.name);
  if (new Set(names).size !== names.length) fail("keyboard: Impact tiles share accessible names");
  if (tiles.some((t) => t.tabIndex < 0 || !t.name.endsWith("Read the full story."))) fail("keyboard: an Impact tile is unfocusable or unlabelled");
  note(`keyboard: ${tiles.length} Impact tiles, unique names`);
}

async function checkDocsToggle(page) {
  const toggle = page.getByRole("button", { name: /documents$/ });
  if ((await toggle.count()) !== 1) return fail('keyboard: "View 4 documents" toggle not found');
  const listHidden = () => toggle.evaluate((el) => document.getElementById(el.getAttribute("aria-controls")).hidden);
  await toggle.focus();
  await page.keyboard.press("Enter");
  const opened = !(await listHidden()) && (await toggle.getAttribute("aria-expanded")) === "true";
  await page.keyboard.press("Enter");
  if (!opened || !(await listHidden())) fail("keyboard: documents toggle does not open and close with Enter");
  else note("keyboard: documents toggle opens and closes");
}

async function checkMenu(browser) {
  const { context, page } = await openPage(browser, { width: 375 });
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  const toggle = page.locator('button[aria-controls="mobile-menu"]');
  const menuInert = () => page.locator("#mobile-menu").evaluate((el) => el.inert);
  const startsClosed = (await menuInert()) && (await toggle.getAttribute("aria-expanded")) === "false";
  await toggle.click();
  const opens = !(await menuInert()) && (await toggle.getAttribute("aria-expanded")) === "true";
  await page.keyboard.press("Escape");
  const closes = (await menuInert()) && (await toggle.evaluate((el) => el === document.activeElement));
  if (!startsClosed || !opens || !closes) fail("keyboard: mobile menu toggle, Escape or focus return failed");
  else note("keyboard: mobile menu opens, Escape closes it and returns focus");
  await context.close();
}

async function checkCaseLinks(page) {
  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a")]
      .filter((a) => a.textContent.trim().startsWith("Read the case"))
      .map((a) => ({ name: a.getAttribute("aria-label") ?? "", tabIndex: a.tabIndex })),
  );
  if (links.length === 0) return fail('keyboard: no "Read the case" links found');
  const names = links.map((l) => l.name);
  if (new Set(names).size !== names.length) fail('keyboard: "Read the case" links share accessible names');
  if (names.some((n) => !n.startsWith("Read the case: "))) fail('keyboard: a "Read the case" link lacks its "Read the case: {metric}" label');
  if (links.some((l) => l.tabIndex < 0)) fail('keyboard: a "Read the case" link is not focusable');
  const first = page.locator('a[aria-label^="Read the case"]').first();
  await first.focus();
  if (!(await first.evaluate((el) => el === document.activeElement))) fail('keyboard: "Read the case" link cannot take focus');
  note(`keyboard: ${links.length} "Read the case" links, unique names`);
}

async function checkKeyboard(browser) {
  const { context, page } = await openPage(browser);
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await checkImpactTiles(page);
  await checkCaseLinks(page);
  await checkDocsToggle(page);
  await context.close();
}

// ---------------------------------------------------------------- optional
function run(command, commandArgs, env = process.env) {
  return new Promise((done) => {
    const child = spawn(command, commandArgs, { env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.on("close", (code) => done({ code, stdout }));
  });
}

async function runLighthouse(dir) {
  const outDir = join(REVIEW, dir);
  await mkdir(outDir, { recursive: true });
  const env = { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" };
  for (const path of ["/", "/impact/risk-scoring/", "/impact/referral-growth/"]) {
    for (const preset of ["mobile", "desktop"]) {
      const name = `${path === "/" ? "home" : path.split("/")[2]}-${preset}`;
      const file = join(outDir, `${name}.json`);
      const flags = preset === "desktop" ? ["--preset=desktop"] : [];
      await run("npx", ["--yes", "lighthouse@12", `${BASE}${path}`, "--quiet", "--chrome-flags=--headless=new", "--output=json", `--output-path=${file}`, ...flags], env);
      const categories = JSON.parse(await readFile(file, "utf8")).categories;
      const scores = Object.values(categories).map((c) => `${c.title} ${Math.round(c.score * 100)}`);
      note(`lighthouse ${name}: ${scores.join(" · ")}`);
    }
  }
}

async function crawlAllLinks() {
  const { stdout } = await run("npx", ["--yes", "linkinator", BASE, "--recurse", "--skip", "^(mailto|tel):", "--format", "json"]);
  const broken = JSON.parse(stdout).links.filter((l) => l.state === "BROKEN");
  const internal = broken.filter((l) => l.url.startsWith(BASE));
  for (const l of internal) fail(`links: ${l.url} (${l.status}) on ${l.parent}`);
  const external = [];
  for (const l of broken.filter((b) => !b.url.startsWith(BASE))) {
    const retry = await fetch(l.url, { redirect: "follow" }).catch(() => null);
    if (!retry?.ok) external.push(`${l.url} (${retry?.status ?? "no response"})`);
  }
  note(`links: ${internal.length} broken internal; external still failing after retry: ${external.length ? external.join(", ") : "none"}`);
}

// ---------------------------------------------------------------- main
async function main() {
  await mkdir(SCREENS, { recursive: true });
  const server = await startServer(PORT);
  const browser = await launchBrowser();
  try {
    for (const width of WIDTHS) {
      await captureScreens(browser, width, false);
      await captureScreens(browser, width, true);
      await checkGlass(browser, width);
    }
    await checkAxe(browser);
    await checkKeyboard(browser);
    await checkMenu(browser);
    if (crawlLinks) await crawlAllLinks();
    if (lighthouseDir) await runLighthouse(lighthouseDir);
  } finally {
    await browser.close();
    server.close();
  }

  console.log(report.map((line) => `  ${line}`).join("\n"));
  console.log(`  screenshots: ${SCREENS}`);
  if (failures.length > 0) {
    console.error(`\nverify: ${failures.length} failure(s)`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log("\nverify: all checks passed");
}

await main();
