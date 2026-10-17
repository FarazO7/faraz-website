// Content-preservation check for the redesign (docs/redesign/BRIEF.md §6, §15).
//
//   node scripts/content-check.mjs capture   save every route's text, links,
//                                            images and metadata as the baseline
//   node scripts/content-check.mjs compare   report baseline content that is
//                                            missing or changed, and new text
//
// Serves out/ (run `npm run build` first) unless --url=<origin> is given, e.g.
// --url=https://faraz-website.vercel.app to compare the live site. Routes are
// discovered by following internal links from "/". Text is read from the DOM,
// so collapsed and hidden UI counts; whitespace differences are ignored.
// External requests are blocked so every run renders the same. Exits 1 when
// anything is missing.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright";
import { startServer } from "./serve-out.mjs";

const PORT = 4174;
const BASELINE = resolve(import.meta.dirname, "..", "docs/redesign/baseline");
// Compare runs every mode against the one baseline (captured in the first).
const MODES = [
  { name: "reduced motion, 1440", width: 1440, reducedMotion: "reduce", js: true, settle: 800 },
  { name: "full motion, 1440", width: 1440, reducedMotion: "no-preference", js: true, settle: 2500 },
  { name: "reduced motion, 390", width: 390, reducedMotion: "reduce", js: true, settle: 800 },
  { name: "no JavaScript, 1440", width: 1440, reducedMotion: "no-preference", js: false, settle: 0 },
];
// Changes approved in docs/redesign/SPEC.md: the theme colour follows the new
// palette (BRIEF §4.7). Reported, but not counted as missing.
const APPROVED = [/^meta: theme-color: /];

const args = process.argv.slice(2);
const command = args[0];
const urlArg = args.find((a) => a.startsWith("--url="))?.slice("--url=".length);

// Runs in the page. Text is cut into runs the way innerText would lay it out:
// a run breaks at every element not rendered inline, so inline wrappers
// (split-letter spans, links) don't fragment it, while separate blocks never
// merge. Runs also break where aria-hidden starts or ends.
function extract() {
  const norm = (s) => (s ?? "").replace(/[\u200b-\u200d\ufeff]/g, "").replace(/\s+/g, " ").trim();
  const isInline = (el) => {
    if (el instanceof SVGElement) return true;
    const display = getComputedStyle(el).display;
    return display.startsWith("inline") || display === "contents";
  };
  const visible = (el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true });

  const text = [];
  let run = { parts: [], hidden: false, visible: false };
  const flush = () => {
    const t = norm(run.parts.join(""));
    if (t) text.push({ t, hidden: run.hidden, visible: run.visible });
    run = { parts: [], hidden: false, visible: false };
  };
  const walk = (node, hidden) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (run.parts.length && run.hidden !== hidden) flush();
        run.hidden = hidden;
        run.parts.push(child.textContent);
        run.visible ||= visible(node);
      } else if (child.nodeType === Node.ELEMENT_NODE && !child.matches("script, style, noscript, template")) {
        const block = !isInline(child);
        if (block) flush();
        walk(child, hidden || child.getAttribute("aria-hidden") === "true");
        if (block) flush();
      }
    }
  };
  walk(document.body, false);
  flush();

  const nameOf = (el) => {
    const label = el.getAttribute("aria-label");
    if (label) return norm(label);
    const ids = el.getAttribute("aria-labelledby");
    if (ids) return norm(ids.split(/\s+/).map((id) => document.getElementById(id)?.textContent).join(" "));
    let s = "";
    const visit = (n) => {
      if (n.nodeType === Node.TEXT_NODE) s += n.textContent;
      else if (n.nodeType === Node.ELEMENT_NODE && n.getAttribute("aria-hidden") !== "true") {
        if (n.tagName === "IMG") return void (s += ` ${n.getAttribute("alt") ?? ""} `);
        const pad = isInline(n) ? "" : " ";
        s += pad;
        n.childNodes.forEach(visit);
        s += pad;
      }
    };
    el.childNodes.forEach(visit);
    return norm(s);
  };
  const links = [...document.querySelectorAll("a[href]")].map((a) => ({
    href: a.getAttribute("href"),
    name: nameOf(a),
    target: a.getAttribute("target") ?? "",
    download: a.hasAttribute("download"),
  }));
  const images = [
    ...[...document.querySelectorAll("img")].map((i) => ({ src: i.getAttribute("src"), alt: i.getAttribute("alt") })),
    ...[...document.querySelectorAll('[role="img"][aria-label]')].map((e) => ({ src: "[role=img]", alt: norm(e.getAttribute("aria-label")) })),
  ];

  const meta = [["title", document.title]];
  for (const m of document.querySelectorAll("meta[name], meta[property]")) {
    const key = m.getAttribute("name") ?? m.getAttribute("property");
    // OG image URLs carry a content hash; the restyle changes it on purpose.
    const value = /image$/.test(key) ? m.getAttribute("content").split("?")[0] : m.getAttribute("content");
    if (/^(description|theme-color|og:|twitter:)/.test(key)) meta.push([key, value]);
  }
  for (const l of document.querySelectorAll('link[rel="canonical"], link[rel="icon"]')) meta.push([`link ${l.rel}`, l.getAttribute("href").split("?")[0]]);
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) meta.push(["json-ld", s.textContent]);

  return { text, links, images, meta };
}

function routeOf(href, base) {
  const url = new URL(href, `${base}/`);
  if (url.origin !== new URL(base).origin) return null;
  const path = url.pathname;
  if (path.startsWith("/_next") || /\.[a-z0-9]+$/i.test(path)) return null;
  return path.endsWith("/") ? path : `${path}/`;
}

async function captureSite(browser, base, mode, seeds = ["/"]) {
  const context = await browser.newContext({
    viewport: { width: mode.width, height: 900 },
    reducedMotion: mode.reducedMotion,
    javaScriptEnabled: mode.js,
  });
  const origin = new URL(base).origin;
  await context.route("**/*", (route) => {
    // Same-origin only: external requests are blocked so every run is the same.
    return route.request().url().startsWith(origin) ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  const queue = [...seeds];
  const pages = {};
  for (let i = 0; i < queue.length; i++) {
    const response = await page.goto(`${base}${queue[i]}`, { waitUntil: "load" });
    if (!response?.ok()) {
      pages[queue[i]] = null;
      continue;
    }
    await page.waitForTimeout(mode.settle);
    pages[queue[i]] = await page.evaluate(extract);
    for (const link of pages[queue[i]].links) {
      const route = routeOf(link.href, base);
      if (route && !queue.includes(route)) queue.push(route);
    }
  }
  await context.close();
  return pages;
}

const fileOf = (route) => `${route === "/" ? "home" : route.replace(/^\/|\/$/g, "").replace(/\//g, "-")}.json`;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Occurrences of `needle` in `haystack` not flanked by letters or digits.
const countIn = (haystack, needle) =>
  (haystack.match(new RegExp(`(?<![\\p{L}\\p{N}])${escape(needle)}(?![\\p{L}\\p{N}])`, "gu")) ?? []).length;
const linkKey = (l) => `${l.href} | name: "${l.name}"${l.target ? ` | target=${l.target}` : ""}${l.download ? " | download" : ""}`;
const imageKey = (i) => `${i.src} | alt: ${i.alt === null ? "(none)" : `"${i.alt}"`}`;
const metaKey = ([k, v]) => `${k}: ${v}`;

function tally(keys) {
  const counts = new Map();
  for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
  return counts;
}

// Baseline items the current page has fewer of, and current items the
// baseline lacks entirely.
function diffKeys(before, after) {
  const b = tally(before);
  const a = tally(after);
  const missing = [...b].filter(([k, n]) => (a.get(k) ?? 0) < n).map(([k, n]) => `${k} (${a.get(k) ?? 0} of ${n})`);
  const added = [...a.keys()].filter((k) => !b.has(k));
  return { missing, added };
}

function diffPage(before, after) {
  const beforeText = before.text.map((c) => c.t);
  const afterText = after.text.map((c) => c.t);
  const beforeFull = beforeText.join(" ");
  const afterFull = afterText.join(" ");
  const missingText = [...new Set(beforeText)]
    .filter((t) => countIn(afterFull, t) < countIn(beforeFull, t))
    .map((t) => `${t} (${countIn(afterFull, t)} of ${countIn(beforeFull, t)})`);
  const newText = [...new Set(after.text.filter((c) => countIn(beforeFull, c.t) === 0).map((c) => `${c.t}${c.hidden ? " [aria-hidden]" : ""}${c.visible ? "" : " [not visible]"}`))];
  const links = diffKeys(before.links.map(linkKey), after.links.map(linkKey));
  const images = diffKeys(before.images.map(imageKey), after.images.map(imageKey));
  // Metadata is compared as a set: hydration can repeat the JSON-LD script.
  const meta = diffKeys([...new Set(before.meta.map(metaKey))], [...new Set(after.meta.map(metaKey))]);
  return {
    missing: [
      ...missingText.map((s) => `text: ${s}`),
      ...links.missing.map((s) => `link: ${s}`),
      ...images.missing.map((s) => `image: ${s}`),
      ...meta.missing.map((s) => `meta: ${s}`),
    ],
    added: [
      ...newText.map((s) => `text: ${s}`),
      ...links.added.map((s) => `link: ${s}`),
      ...images.added.map((s) => `image: ${s}`),
      ...meta.added.map((s) => `meta: ${s}`),
    ],
  };
}

// Text a JS visitor sees that a no-JS visitor (or a crawler) would not.
function hiddenWithoutJs(withJs, withoutJs) {
  const shown = (page) => new Set(page.text.filter((c) => c.visible && !c.hidden).map((c) => c.t));
  const noJs = shown(withoutJs);
  return [...shown(withJs)].filter((t) => !noJs.has(t));
}

async function withSite(fn) {
  const server = urlArg ? null : await startServer(PORT);
  const base = (urlArg ?? `http://127.0.0.1:${PORT}`).replace(/\/$/, "");
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
    return await fn(browser, base);
  } finally {
    await browser?.close();
    server?.close();
  }
}

async function capture() {
  const pages = await withSite((browser, base) => captureSite(browser, base, MODES[0]));
  await mkdir(BASELINE, { recursive: true });
  const routes = Object.keys(pages);
  for (const route of routes) {
    if (!pages[route]) throw new Error(`capture: ${route} did not load`);
    await writeFile(join(BASELINE, fileOf(route)), `${JSON.stringify({ route, ...pages[route] }, null, 2)}\n`);
  }
  await writeFile(join(BASELINE, "routes.json"), `${JSON.stringify(routes, null, 2)}\n`);
  const counts = routes.map((r) => `${r}: ${pages[r].text.length} text, ${pages[r].links.length} links, ${pages[r].images.length} images`);
  console.log(`Captured ${routes.length} routes into ${BASELINE}\n  ${counts.join("\n  ")}`);
}

async function compare() {
  const routes = JSON.parse(await readFile(join(BASELINE, "routes.json"), "utf8"));
  const baseline = {};
  for (const route of routes) baseline[route] = JSON.parse(await readFile(join(BASELINE, fileOf(route)), "utf8"));

  const runs = await withSite(async (browser, base) => {
    const out = [];
    for (const mode of MODES) out.push([mode, await captureSite(browser, base, mode, routes)]);
    return out;
  });

  let missingTotal = 0;
  const lines = [];
  for (const [mode, pages] of runs) {
    lines.push(`\n== ${mode.name}`);
    for (const route of Object.keys(pages)) {
      if (!baseline[route]) {
        lines.push(`  ${route}: NEW ROUTE`);
        continue;
      }
      if (!pages[route]) {
        missingTotal++;
        lines.push(`  ${route}: MISSING ROUTE (did not load)`);
        continue;
      }
      const diff = diffPage(baseline[route], pages[route]);
      const approved = diff.missing.filter((m) => APPROVED.some((re) => re.test(m)));
      const missing = diff.missing.filter((m) => !approved.includes(m));
      const added = diff.added.filter((a) => !APPROVED.some((re) => re.test(a)));
      missingTotal += missing.length;
      lines.push(`  ${route}: ${missing.length} missing or changed, ${added.length} new${approved.length ? `, ${approved.length} approved change` : ""}`);
      for (const m of missing) lines.push(`    - ${m}`);
      for (const a of added) lines.push(`    + ${a}`);
    }
  }
  const [, withJs] = runs[0];
  const [, withoutJs] = runs.find(([mode]) => !mode.js);
  lines.push("\n== Visible with JavaScript but hidden without it (guardrail, BRIEF §3)");
  for (const route of routes) {
    if (!withJs[route] || !withoutJs[route]) continue;
    const hidden = hiddenWithoutJs(withJs[route], withoutJs[route]);
    lines.push(`  ${route}: ${hidden.length}${hidden.length ? `, e.g. "${hidden.slice(0, 3).join('", "')}"` : ""}`);
  }
  console.log(lines.join("\n"));
  console.log(`\ncontent-check: ${missingTotal} missing or changed item(s) across ${runs.length} modes`);
  process.exit(missingTotal > 0 ? 1 : 0);
}

if (command === "capture") await capture();
else if (command === "compare") await compare();
else {
  console.error("usage: node scripts/content-check.mjs capture|compare [--url=<origin>]");
  process.exit(2);
}
