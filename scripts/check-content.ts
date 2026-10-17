// Content guard. Fails when lib/content.ts drifts from the resume PDF or from
// itself, so a stale title, an orphaned impact page or an unproven metric can
// never reach a build. Run with `npm run check:content`; it also runs as
// `prebuild`. Each failure names the field and the fix.
//
// The rule it enforces: update the resume PDF first, then content.ts.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import * as content from "../lib/content";
import {
  bioAccents,
  bioEmphasis,
  bulletParts,
  credibility,
  experience,
  getRole,
  identity,
  impactDetails,
  metricGroups,
} from "../lib/content";

const ROOT = resolve(__dirname, "..");

type Failure = { check: string; field: string; fix: string };
const failures: Failure[] = [];

function fail(check: string, field: string, fix: string) {
  failures.push({ check, field, fix });
}

const tiles = metricGroups.flatMap((group) =>
  group.metrics.map((metric) => ({ group: group.org, metric })),
);

// a. Exactly one current role, listed first, still running.
function checkCurrentRole() {
  const current = experience.filter((role) => role.current);
  if (current.length !== 1) {
    fail("a", "experience[].current", `${current.length} roles have current: true; mark exactly one.`);
  }
  if (experience.length > 0 && !experience[0].current) {
    fail("a", `experience[0] (${experience[0].id})`, "Move the current role to the top of experience.");
  }
  for (const role of current) {
    if (!role.dates.endsWith("Present")) {
      fail("a", `experience[${role.id}].dates`, `"${role.dates}" must end with "Present".`);
    }
  }
}

// b. Every tile and bullet link resolves, and every impact page is reachable.
function checkImpactLinks() {
  const pages = new Set(impactDetails.map((detail) => detail.slug));
  if (pages.size !== impactDetails.length) {
    fail("b", "impactDetails[].slug", "Two impact pages share a slug; make each slug unique.");
  }
  const referenced = new Set<string>();

  for (const { group, metric } of tiles) {
    referenced.add(metric.slug);
    if (!pages.has(metric.slug)) {
      fail("b", `metricGroups[${group}].${metric.slug}`, `No impact page "${metric.slug}"; add it to impactDetails or fix the slug.`);
    }
  }
  for (const role of experience) {
    role.bullets.forEach((bullet, i) => {
      const { impact } = bulletParts(bullet);
      if (!impact) return;
      referenced.add(impact);
      if (!pages.has(impact)) {
        fail("b", `experience[${role.id}].bullets[${i}].impact`, `No impact page "${impact}"; add it to impactDetails or fix the slug.`);
      }
    });
  }
  for (const detail of impactDetails) {
    if (!referenced.has(detail.slug)) {
      fail("b", `impactDetails[${detail.slug}]`, "Page is unreachable; link it from a metric tile or an experience bullet (impact).");
    }
    if (!getRole(detail.org)) {
      fail("b", `impactDetails[${detail.slug}].org`, `No experience entry with id "${detail.org}" to supply the Tenure row.`);
    }
  }
}

// c. The tile's headline number appears on its page (metric or Results).
function checkTileNumbers() {
  for (const { group, metric } of tiles) {
    const detail = impactDetails.find((d) => d.slug === metric.slug);
    if (!detail) continue; // reported by check b
    const results = detail.sections.find((s) => s.heading === "Results")?.body ?? "";
    const number = String(metric.value).replace(".", "\\.");
    const pattern = new RegExp(`(^|[^\\d.])${number}(?!\\d)`);
    if (!pattern.test(detail.metric) && !pattern.test(results)) {
      fail("c", `metricGroups[${group}].${metric.slug}.value`, `${metric.value} does not appear in the page's metric or Results; align the tile and the page.`);
    }
  }
}

// d. Every tile's resumeEvidence is present in the resume PDF.
const normalise = (text: string) =>
  text
    .toLowerCase()
    .replace(/[‐-―−-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Same-line text runs are joined as-is; a line break becomes a space.
async function extractPdfText(path: string): Promise<string> {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const task = getDocument({ data: new Uint8Array(readFileSync(path)) });
  const doc = await task.promise;
  const lines: string[] = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const { items } = await (await doc.getPage(n)).getTextContent();
    let line = "";
    let lastY: number | null = null;
    for (const item of items) {
      if (!("str" in item)) continue;
      const y = item.transform[5] as number;
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        lines.push(line);
        line = "";
      }
      line += item.str;
      lastY = item.hasEOL ? null : y;
      if (item.hasEOL) {
        lines.push(line);
        line = "";
      }
    }
    lines.push(line);
  }
  await task.destroy();
  return lines.join(" ");
}

async function checkResumeEvidence() {
  const pdf = join(ROOT, "public", identity.resumePath);
  if (!existsSync(pdf)) {
    fail("d", "identity.resumePath", `public${identity.resumePath} is missing; add the resume PDF.`);
    return;
  }
  let resume: string;
  try {
    resume = normalise(await extractPdfText(pdf));
  } catch (err) {
    fail("d", "identity.resumePath", `Could not read the PDF (${(err as Error).message}).`);
    return;
  }
  for (const { group, metric } of tiles) {
    if (!resume.includes(normalise(metric.resumeEvidence))) {
      fail("d", `metricGroups[${group}].${metric.slug}.resumeEvidence`, `"${metric.resumeEvidence}" is not in the resume; copy the exact phrase from the PDF, or update the PDF first.`);
    }
  }
}

// e. Retired (October 2026): education shows no years.

// f. Every root-relative asset path in content exists under public/.
const ASSET_PATH = /^\/[\w\-./]+\.(pdf|png|jpe?g|webp|svg|gif|ico|html)$/i;

function collectStrings(value: unknown, path: string, out: [string, string][]) {
  if (typeof value === "string") out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value)) collectStrings(v, `${path}.${key}`, out);
  }
}

function contentStrings(): [string, string][] {
  const out: [string, string][] = [];
  for (const [name, value] of Object.entries(content)) collectStrings(value, name, out);
  return out;
}

function checkAssets() {
  for (const [path, value] of contentStrings()) {
    if (ASSET_PATH.test(value) && !existsSync(join(ROOT, "public", value))) {
      fail("f", path, `public${value} does not exist; add the file or fix the path.`);
    }
  }
}

// g. Components and routes never hardcode identity; h. retired claims stay retired.
const IDENTITY_LITERALS = ["Faraz Ali", "Product Manager", "Zamplitude", "Newton School", "Incanus", "HealthKart", "Healthmug"];
// Retired by the October 2026 resume; "2+ years" is back on the resume.
const RETIRED_CLAIMS = ["Nafath", "GCC", "Pharmacloud", "Remote, Dubai", "audit-preparation"];

function sourceFiles(dir: string): string[] {
  return readdirSync(join(ROOT, dir), { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .map((file) => join(dir, file));
}

function scanFiles(files: string[], literals: string[], check: string, fix: string) {
  for (const file of files) {
    readFileSync(join(ROOT, file), "utf8")
      .split("\n")
      .forEach((line, i) => {
        for (const literal of literals) {
          if (line.includes(literal)) fail(check, `${file}:${i + 1}`, `"${literal}": ${fix}`);
        }
      });
  }
}

// i. Every mailto: and external link renders through lib/links.ts, which opens
// it in a new tab (a web mail handler would otherwise replace the site).
const LINK_LITERALS = ['target="_blank"', 'target: "_blank"', "mailto:"];

// l. No component renders a <script>: React never runs one on the client and
// warns about it in development (the hero's former layout script).
function checkLiteralsAndClaims() {
  const code = [...sourceFiles("app"), ...sourceFiles("components")];
  scanFiles(code, IDENTITY_LITERALS, "g", "import it from lib/content.ts instead.");
  scanFiles([...code, "lib/content.ts", "README.md"], RETIRED_CLAIMS, "h", "retired claim; remove it.");
  scanFiles(code, LINK_LITERALS, "i", "render the link with linkProps() from lib/links.ts.");
  scanFiles(sourceFiles("components"), ["<script"], "l", "decide it in CSS or in an effect instead.");
}

// j. The About intro styles exact phrases of the bio; each must still be there.
function checkBioPhrases() {
  for (const phrase of [...bioAccents, ...bioEmphasis]) {
    if (!identity.bio.includes(phrase)) {
      fail("j", `bioAccents/bioEmphasis "${phrase}"`, "no longer in identity.bio; update the list to match the bio.");
    }
  }
}

// k. Logos are square images, so each fills its circle the same way.
function checkLogos() {
  for (const org of [...credibility.experience, ...credibility.education]) {
    if (!org.logo) continue;
    const bytes = readFileSync(join(ROOT, "public", org.logo));
    if (bytes.toString("ascii", 1, 4) !== "PNG") {
      fail("k", `credibility ${org.name}.logo`, "use a PNG so its size can be checked.");
      continue;
    }
    const [width, height] = [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
    if (width !== height) {
      fail("k", `credibility ${org.name}.logo`, `${width}×${height}: crop it to a square around the mark.`);
    }
  }
}

// m. Download links carry the resume's fingerprint (?v=), so a new PDF gets a
// new URL and nobody downloads a cached copy.
function checkResumeVersion() {
  const pdf = join(ROOT, "public", identity.resumePath);
  if (!existsSync(pdf)) return; // check d reports the missing file
  const version = createHash("sha256").update(readFileSync(pdf)).digest("hex").slice(0, 8);
  if (identity.resumeVersion !== version) {
    fail("m", "identity.resumeVersion", `"${identity.resumeVersion}" is stale: set it to "${version}" for the current PDF.`);
  }
}

async function main() {
  checkCurrentRole();
  checkImpactLinks();
  checkTileNumbers();
  await checkResumeEvidence();
  checkAssets();
  checkLiteralsAndClaims();
  checkBioPhrases();
  checkLogos();
  checkResumeVersion();

  if (failures.length > 0) {
    console.error(`\nContent guard: ${failures.length} failure(s)\n`);
    for (const f of failures) console.error(`  [${f.check}] ${f.field}\n      ${f.fix}`);
    console.error("");
    process.exit(1);
  }
  console.log(`Content guard passed: ${tiles.length} tiles, ${impactDetails.length} impact pages, checks a to m (e retired).`);
}

main().catch((err) => {
  console.error("Content guard crashed:", err);
  process.exit(1);
});
