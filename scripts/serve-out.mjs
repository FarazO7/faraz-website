// Minimal static server for the `out/` export, mirroring how Vercel serves it
// (directory index.html, gzip for text). Used by scripts/verify-site.mjs, and
// runnable on its own for a local look: `node scripts/serve-out.mjs [port]`.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { basename, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const OUT = resolve(import.meta.dirname, "..", "out");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
};
const COMPRESSIBLE = /^(text\/|application\/json|image\/svg)/;

function contentType(file) {
  // Next exports OG cards as extension-less files named *-image.
  if (basename(file).endsWith("-image")) return "image/png";
  return TYPES[extname(file)] ?? "application/octet-stream";
}

async function resolveFile(urlPath) {
  const path = normalize(decodeURIComponent(urlPath.split("?")[0]));
  const base = join(OUT, path);
  if (base !== OUT && !base.startsWith(OUT + sep)) return null; // no traversal
  for (const candidate of [base, join(base, "index.html"), `${base}.html`]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

export function startServer(port = 4173) {
  const server = createServer(async (req, res) => {
    const file = await resolveFile(req.url ?? "/");
    if (!file) {
      const notFound = await resolveFile("/404.html");
      res.writeHead(404, { "content-type": TYPES[".html"] });
      res.end(notFound ? await readFile(notFound) : "Not found");
      return;
    }
    const type = contentType(file);
    let body = await readFile(file);
    const headers = { "content-type": type };
    if (COMPRESSIBLE.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "")) {
      body = gzipSync(body);
      headers["content-encoding"] = "gzip";
    }
    res.writeHead(200, headers);
    res.end(body);
  });
  return new Promise((ok, fail) => {
    server.once("error", fail);
    server.listen(port, "127.0.0.1", () => ok(server));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] ?? 4173);
  await startServer(port);
  console.log(`Serving out/ at http://localhost:${port} (Ctrl+C to stop)`);
}
