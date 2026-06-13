// Renders page 1 of each case-study PDF to an 800px-wide .webp in
// public/previews/. Wired as `prebuild` so GitHub Actions regenerates them; the
// generated webps are also committed so local dev works offline.
//
// Resilient by design: if a download or render fails for one slug, it logs a
// warning and keeps whatever image is already committed — it never breaks the
// build.

import { createCanvas, DOMMatrix, ImageData, Path2D } from "@napi-rs/canvas";
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// pdfjs reaches for these browser globals during rendering.
globalThis.DOMMatrix ??= DOMMatrix;
globalThis.ImageData ??= ImageData;
globalThis.Path2D ??= Path2D;

const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "previews");
const WIDTH = 800;

// Keep slugs/URLs in sync with caseStudies in lib/content.ts. Zomato uses its
// first document's page 1.
const TARGETS = [
  {
    slug: "bumble",
    url: "https://assets.nextleap.app/submissions/NLBumble-da078847-c1b6-4b73-b9c3-760f63b97b4c.pdf",
  },
  {
    slug: "makemytrip",
    url: "https://assets.nextleap.app/submissions/Makemytrip-9eb8bfaa-0280-463f-a9df-6ca31ed1887f.pdf",
  },
  {
    slug: "zepto",
    url: "https://assets.nextleap.app/submissions/Zepto-da51ae3f-a48d-40c6-9f3a-7615f18849e7.pdf",
  },
  {
    slug: "zomato",
    url: "https://assets.nextleap.app/submissions/Zomato_milestone_1-649634e2-0d24-4ac4-8f94-c6501973d4da.pdf",
  },
];

async function renderPreview({ slug, url }) {
  const out = join(OUT_DIR, `${slug}.webp`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = new Uint8Array(await res.arrayBuffer());

    const doc = await getDocument({
      data,
      isEvalSupported: false,
      useSystemFonts: true,
    }).promise;
    const page = await doc.getPage(1);

    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: WIDTH / base.width });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d");
    // White backing so transparent PDFs don't render onto black.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, viewport.width, viewport.height);

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    await doc.cleanup();

    const webp = await canvas.encode("webp", 82);
    await writeFile(out, webp);
    console.log(`  ✓ ${slug}.webp  (${Math.round(webp.length / 1024)} KB)`);
  } catch (err) {
    // Keep any previously committed image; never fail the build.
    let kept = false;
    try {
      await access(out);
      kept = true;
    } catch {}
    console.warn(
      `  ⚠ ${slug}: ${err.message} — ${kept ? "keeping committed image" : "no committed image to fall back on"}`,
    );
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log("Generating case-study previews…");
  for (const target of TARGETS) {
    await renderPreview(target);
  }
}

await main();
