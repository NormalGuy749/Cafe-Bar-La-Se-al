/*Genera pruebas/render-check.html a partir de los archivos reales.

   Motivo: el previsualizador de este entorno solo sirve un archivo
   suelto, sin resolver rutas relativas (css/styles.css, js/*.js).
   En vez de mantener a mano una copia paralela del HTML —que se
   desincroniza—, esta copia se reconstruye siempre desde index.html.

   Uso:  node pruebas/build-render-check.mjs*/

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFile(join(root, p), "utf8");

const [html, css, config, main, favicon, faviconPng] = await Promise.all([
  read("index.html"),
  read("css/styles.css"),
  read("js/config.js"),
  read("js/main.js"),
  read("assets/favicon.svg"),
  readFile(join(root, "assets/favicon-32.png"))
]);

const warnings = [];

function replaceOnce(source, pattern, build, label) {
  if (!pattern.test(source)) {
    warnings.push(`No se encontró en index.html: ${label}`);
    return source;
  }
  return source.replace(pattern, () => build());
}

let out = html;

out = replaceOnce(
  out,
  /<link rel="stylesheet" href="css\/styles\.css">/,
  () => `<style>\n${css}\n</style>`,
  "hoja de estilos"
);

// El favicon se incrusta como data URI: la copia de pruebas no puede
out = replaceOnce(
  out,
  /<link rel="icon" href="assets\/favicon\.svg(?:\?[^"]*)?" type="image\/svg\+xml" sizes="any">/,
  () =>
    '<link rel="icon" type="image/svg+xml" sizes="any" href="data:image/svg+xml,' +
    encodeURIComponent(favicon) + '">',
  "favicon"
);

out = replaceOnce(
  out,
  /<link rel="icon" href="assets\/favicon-32\.png(?:\?[^"]*)?" sizes="32x32" type="image\/png">/,
  () =>
    '<link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,' +
    faviconPng.toString("base64") + '">',
  "favicon PNG"
);

out = replaceOnce(
  out,
  /<script src="js\/config\.js"><\/script>/,
  () => `<script>\n${config}\n</script>`,
  "js/config.js"
);

out = replaceOnce(
  out,
  /<script src="js\/main\.js"><\/script>/,
  () => `<script>\n${main}\n</script>`,
  "js/main.js"
);

// Las fotos también se incrustan: la copia de un archivo suelto no puede
const imageRefs = new Set(
  Array.from(out.matchAll(/src="(assets\/images\/[^"]+)"/g), (m) => m[1])
);
for (const ref of imageRefs) {
  const mime = ref.endsWith(".png") ? "image/png" : "image/jpeg";
  const data = await readFile(join(root, ref));
  out = out.split(`src="${ref}"`).join(`src="data:${mime};base64,${data.toString("base64")}"`);
}

const leftovers = out.match(/(?:href|src)="(?:css|js|assets)\/[^"]*"/g) || [];
if (leftovers.length) {
  for (const match of leftovers) warnings.push(`Ruta sin aplanar: ${match}`);
}

const sources = {
  "index.html": html,
  "css/styles.css": css,
  "js/config.js": config,
  "js/main.js": main
};

const fingerprint = Object.entries(sources)
  .map(([name, source]) =>
    name.replace(/[^a-z0-9.]/gi, "") +
    "=" +
    createHash("sha256").update(source).digest("hex").slice(0, 12)
  )
  .join(" ");

const banner =
  "<!-- GENERADO por pruebas/build-render-check.mjs desde index.html,\n" +
  "     css/styles.css, js/config.js y js/main.js. No editar a mano.\n" +
  `     fuentes: ${fingerprint} -->\n`;

out = out.replace("<!DOCTYPE html>\n", `<!DOCTYPE html>\n${banner}`);

await writeFile(join(root, "pruebas/render-check.html"), out, "utf8");

console.log(`render-check.html generado (${out.length} bytes).`);
if (warnings.length) {
  console.log("Avisos:");
  for (const warning of warnings) console.log(` - ${warning}`);
  process.exitCode = 1;
}
