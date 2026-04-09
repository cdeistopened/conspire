import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const PORT = process.env.PORT || 3000;
const DIST = join(import.meta.dirname, "dist");

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

createServer((req, res) => {
  let path = join(DIST, req.url === "/" ? "index.html" : req.url);
  if (!existsSync(path)) path = join(DIST, "index.html"); // SPA fallback

  const ext = extname(path);
  const mime = MIME[ext] || "application/octet-stream";

  try {
    const data = readFileSync(path);
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(PORT, () => console.log(`Conspire dashboard on :${PORT}`));
