/* ============================================================
   Servidor estático mínimo para revisar la web real en local.

   Sirve el contenido del repositorio con las rutas relativas de
   GitHub Pages (index.html, css/, js/, assets/). No añade nada al
   producto ni necesita dependencias.

   Uso:  node pruebas/serve.mjs [puerto]   (por defecto 8099)
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, normalize } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2] || 8099);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  let path = decodeURIComponent(url.pathname);
  if (path.endsWith("/")) path += "index.html";

  const file = join(root, normalize(path).replace(/^(\.\.[/\\])+/, ""));
  if (!file.startsWith(root)) {
    response.writeHead(403).end("Prohibido");
    return;
  }

  try {
    const info = await stat(file);
    const target = info.isDirectory() ? join(file, "index.html") : file;
    const body = await readFile(target);
    response.writeHead(200, {
      "content-type": types[extname(target)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(body);
    console.log(`200 ${request.method} ${path}`);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("404");
    console.log(`404 ${request.method} ${path}`);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}/  (raíz: ${root})`);
});
