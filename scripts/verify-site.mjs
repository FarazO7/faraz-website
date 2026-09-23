// Site verification for the static export. Build first, then:
//   npm run verify                      screenshots, glass budget, axe, keyboard
//   npm run verify -- --links           also crawl every link (linkinator)
//   npm run verify -- --lighthouse=dir  also run Lighthouse into .review/dir/
//
// 1. Screenshots at 375/768/1024/1440 (hero, both metric tabs, Experience,
//    Skills, two impact pages) plus a reduced-motion set, in .review/screens/.
// 2. Glass budget: at most 6 painted, in-viewport backdrop-filter elements at
//    the hero, Impact, GitHub, GitHub-to-Skills and Skills scroll positions.
// 3. axe: zero serious or critical violations on / and two impact pages.
// 4. Keyboard: metric tablist, "Read the case" links, skills <details>.
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
const COUNT_UP_MS = 1800; // count-up (1.4 s) plus tile stagger
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

  const tabs = page.getByRole("tab");
  const tabCount = await tabs.count();
  for (let i = 0; i < tabCount; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(COUNT_UP_MS);
    await page.locator("#impact").screenshot({ path: shot(`impact-tab${i + 1}`) });
  }
  for (const id of ["experience", "skills"]) {
    await scrollToY(page, (await sectionY(page, id)) ?? 0);
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
const tabState = () =>
  [...document.querySelectorAll('[role="tab"]')].map((tab) => ({
    selected: tab.getAttribute("aria-selected") === "true",
    focused: tab === document.activeElement,
    panelVisible: getComputedStyle(document.getElementById(tab.getAttribute("aria-controls"))).visibility === "visible",
  }));

async function expectTab(page, index, key) {
  const state = await page.evaluate(tabState);
  const ok = state.every((t, i) => t.selected === (i === index) && t.panelVisible === (i === index)) && state[index].focused;
  if (!ok) fail(`keyboard: after ${key}, tab ${index + 1} should be selected, focused and showing its panel`);
}

async function checkTablist(page) {
  const tabs = page.getByRole("tab");
  const count = await tabs.count();
  if (count < 2) return fail("keyboard: metric tablist with two or more tabs not found");
  await tabs.first().focus();
  await expectTab(page, 0, "load (current role is the default)");
  for (const [key, index] of [["ArrowRight", 1 % count], ["End", count - 1], ["Home", 0], ["ArrowLeft", count - 1], ["Home", 0]]) {
    await page.keyboard.press(key);
    await expectTab(page, index, key);
  }
  await page.keyboard.press("Tab");
  const landed = await page.evaluate(() => {
    const panel = document.activeElement?.closest('[role="tabpanel"]');
    const selected = document.querySelector('[role="tab"][aria-selected="true"]');
    return Boolean(panel && selected && panel.id === selected.getAttribute("aria-controls"));
  });
  if (!landed) fail("keyboard: Tab from the tablist does not land in the active panel");
  note(`keyboard: tablist ${count} tabs, arrows/Home/End ok`);
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

async function checkSkillsIndex(page) {
  const summary = page.locator("#skills details > summary");
  if ((await summary.count()) === 0) return fail("keyboard: skills index <details> not found");
  const isOpen = () => summary.evaluate((el) => el.parentElement.open);
  await summary.focus();
  await page.keyboard.press("Enter");
  const opened = await isOpen();
  await page.keyboard.press("Enter");
  if (!opened || (await isOpen())) fail("keyboard: skills <details> does not toggle with Enter");
  else note("keyboard: skills index toggles with Enter");
}

async function checkKeyboard(browser) {
  const { context, page } = await openPage(browser);
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await checkTablist(page);
  await checkCaseLinks(page);
  await checkSkillsIndex(page);
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
