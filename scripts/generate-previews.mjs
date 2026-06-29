// Renders page 1 of each case-study PDF to an 800px-wide .webp in
// public/previews/. Wired as `prebuild` so GitHub Actions regenerates them; the
// generated webps are also committed so local dev works offline.
//
// Resilient by design: if a download or render fails for one slug, it logs a
// warning and keeps whatever image is already committed — it never breaks the
// build.

import { createCanvas, DOMMatrix, ImageData, Path2D } from "@napi-rs/canvas";
import { mkdir, writeFile, access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// pdfjs reaches for these browser globals during rendering.
globalThis.DOMMatrix ??= DOMMatrix;
globalThis.ImageData ??= ImageData;
globalThis.Path2D ??= Path2D;

const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "previews");
const PDF_DIR = join(__dirname, "..", "public", "case-studies");
const WIDTH = 800;

// Keep slugs/files in sync with caseStudies in lib/content.ts. Reads the
// self-hosted PDFs in public/case-studies/ (no external dependency); Zomato
// uses its first document's page 1.
const TARGETS = [
  { slug: "bumble", file: "bumble.pdf" },
  { slug: "makemytrip", file: "makemytrip.pdf" },
  { slug: "zepto", file: "zepto.pdf" },
  { slug: "zomato", file: "zomato-1-product-outcomes.pdf" },
];

async function renderPreview({ slug, file }) {
  const out = join(OUT_DIR, `${slug}.webp`);
  try {
    const data = new Uint8Array(await readFile(join(PDF_DIR, file)));

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
