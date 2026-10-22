/* ============================================================
   Comprobaciones de la carta visual (carta.html).

   No sustituye a pruebas/check.mjs: la portada conserva sus 20
   comprobaciones. Aquí se revisa lo propio de la subpágina:
   rutas bajo la subruta del proyecto, dimensiones reales de las
   fotos, navegación de ida y vuelta, aviso de carta orientativa,
   ausencia de precios/alérgenos inventados y enlaces de contacto.

   Uso: node pruebas/check-carta.mjs
   ============================================================ */

import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const exists = (p) => {
  try { return statSync(join(root, p)).isFile(); } catch { return false; }
};

const html = read("carta.html");
const css = read("css/styles.css");
const config = read("js/config.js");
const main = read("js/main.js");

const tests = [];
const check = (name, fn) => {
  let problems;
  try { problems = fn() || []; } catch (error) { problems = [error.message]; }
  tests.push({ name, problems });
};

const all = (re, text = html) => Array.from(text.matchAll(re), (m) => m[1]);
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : "";
};

function imageSize(file) {
  const buf = readFileSync(join(root, file));
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i += 1; continue; }
      const marker = buf[i + 1];
      i += 2;
      if (marker === 0xd8 || marker === 0xd9) continue;
      const length = buf.readUInt16BE(i);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return { height: buf.readUInt16BE(i + 3), width: buf.readUInt16BE(i + 5) };
      }
      i += length;
    }
  }
  return null;
}

/* ---------- 1. Rutas locales y subruta ---------- */
check("Rutas locales de la carta existen", () => {
  const problems = [];
  const refs = [
    ...all(/(?:href|src)="((?!https?:|#|mailto:|tel:|data:)[^"]+)"/g)
  ];
  for (const ref of refs) {
    const file = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (!exists(file)) problems.push(`No existe: ${ref}`);
  }
  return problems;
});

check("Sin rutas absolutas que se salgan de /Cafe-Bar-La-Se-al/", () => {
  const bad = [...all(/(?:href|src)="(\/[^"]*)"/g)];
  return bad.map((ref) => `Ruta absoluta: ${ref}`);
});

/* ---------- 2. Cabecera y navegación ---------- */
check("Navegación de ida y vuelta", () => {
  const problems = [];
  if (!/href="index\.html"[^>]*>Inicio</.test(html)) problems.push("Falta «Inicio» a la portada");
  if (!/href="index\.html"[^>]*aria-label="Café-Bar La Señal, volver a la portada"/.test(html))
    problems.push("El wordmark no vuelve a la portada");
  if (!/href="carta\.html"[^>]*aria-current="page"[^>]*>La carta</.test(html))
    problems.push("La carta no está marcada como página actual");
  if (!/href="index\.html#ubicacion"/.test(html)) problems.push("Falta enlace a ubicación");
  if (!/href="index\.html#horario"/.test(html)) problems.push("Falta enlace a horario");
  if (!/data-maps-link/.test(html)) problems.push("Falta el enlace de indicaciones");
  return problems;
});

check("Cabecera y pie reutilizan la estructura de la web", () => {
  const problems = [];
  for (const cls of ["site-header", "site-footer", "proposal", "skip-link", "mobile-nav"]) {
    if (!html.includes(`class="${cls}`) && !html.includes(` ${cls}`)) problems.push(`Falta ${cls}`);
  }
  if (!/id="contenido"/.test(html)) problems.push("Falta el destino de «Saltar al contenido»");
  if (!/id="year"/.test(html)) problems.push("Falta el año del pie");
  return problems;
});

/* ---------- 3. Metadatos ---------- */
check("Metadatos de la carta", () => {
  const problems = [];
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  if (title.length < 20 || title.length > 65) problems.push(`Título de ${title.length} caracteres`);
  if (description.length < 70 || description.length > 165)
    problems.push(`Description de ${description.length} caracteres`);
  if (!/<html lang="es">/.test(html)) problems.push("Falta lang=es");
  if (!/<meta name="viewport"/.test(html)) problems.push("Falta viewport");
  if (!/rel="canonical" href="https:\/\/normalguy749\.github\.io\/Cafe-Bar-La-Se-al\/carta\.html"/.test(html))
    problems.push("Canonical incorrecta");
  if (!/<meta name="robots" content="noindex">/.test(html)) problems.push("Falta noindex");
  if (!/rel="icon"[^>]*favicon-32\.png\?v=/.test(html)) problems.push("Falta favicon PNG");
  if (!/rel="icon"[^>]*favicon\.svg\?v=/.test(html)) problems.push("Falta favicon SVG");
  return problems;
});

/* ---------- 4. Jerarquía y accesibilidad ---------- */
check("Un h1 y jerarquía sin saltos", () => {
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  const problems = [];
  if (levels.filter((n) => n === 1).length !== 1) problems.push("Debe haber un solo h1");
  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i] - levels[i - 1] > 1) problems.push(`Salto de h${levels[i - 1]} a h${levels[i]}`);
  }
  return problems;
});

check("aria-labelledby e id existen y son únicos", () => {
  const ids = all(/\sid="([^"]+)"/g);
  const problems = [];
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) problems.push(`id duplicado: ${id}`);
    seen.add(id);
  }
  for (const ref of all(/aria-labelledby="([^"]+)"/g)) {
    if (!ids.includes(ref)) problems.push(`aria-labelledby roto: ${ref}`);
  }
  return problems;
});

/* ---------- 5. Fotografías ---------- */
check("Seis fotos con alt, dimensiones reales y carga diferida", () => {
  const problems = [];
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  if (imgs.length !== 6) problems.push(`Hay ${imgs.length} imágenes, esperadas 6`);
  for (const tag of imgs) {
    const src = attr(tag, "src");
    const alt = attr(tag, "alt");
    const width = Number(attr(tag, "width"));
    const height = Number(attr(tag, "height"));
    if (!src || !src.startsWith("assets/images/")) problems.push(`Imagen fuera de assets: ${src}`);
    if (!alt || alt.length < 20) problems.push(`Alt insuficiente: ${src}`);
    if (!/\bloading="lazy"/.test(tag)) problems.push(`Sin loading=lazy: ${src}`);
    if (!/\bdecoding="async"/.test(tag)) problems.push(`Sin decoding=async: ${src}`);
    if (!exists(src)) { problems.push(`No existe: ${src}`); continue; }
    const size = imageSize(src);
    if (!size) problems.push(`No se pudo leer la imagen: ${src}`);
    else if (size.width !== width || size.height !== height)
      problems.push(`${src}: HTML ${width}×${height}, archivo ${size.width}×${size.height}`);
  }
  return problems;
});

/* ---------- 6. Contenido honesto ---------- */
check("Aviso de selección orientativa y sin carta oficial", () => {
  const problems = [];
  if (!/No es la carta\s+oficial/i.test(html.replace(/\s+/g, " ")))
    problems.push("No se advierte de que no es la carta oficial");
  if (!/sin precios/i.test(html)) problems.push("No se advierte de la falta de precios");
  if (!/se consultan en el establecimiento/i.test(html))
    problems.push("No se remite al establecimiento");
  if (!/Selección orientativa/i.test(html)) problems.push("Falta el rótulo de selección orientativa");
  if (!/Sin carta oficial/i.test(html)) problems.push("Falta el aviso del panel de entrada");
  return problems;
});

check("Sin precios, alérgenos ni valoraciones inventadas", () => {
  const problems = [];
  if (/\d+[.,]\d{2}\s*€|€\s*\d/.test(html)) problems.push("Hay un precio");
  for (const claim of ["sin gluten", "sin lactosa", "apto para celíacos", "100 %", "el mejor", "estrellas"]) {
    if (new RegExp(claim, "i").test(html)) problems.push(`Afirmación no verificada: ${claim}`);
  }
  if (/valoración|puntuación|\b\d([.,]\d)?\s*\/\s*5\b/i.test(html))
    problems.push("Hay una valoración");
  return problems;
});

check("Los seis platos identificados están presentes", () => {
  const names = [
    "Cachopo",
    "Pulpo con patatas",
    "Jamón con picos",
    "Huevos fritos con jamón",
    "Nachos con carne y queso",
    "Calamares fritos"
  ];
  return names.filter((name) => !html.includes(name)).map((name) => `Falta: ${name}`);
});

check("Las reseñas no se publican como citas", () => {
  const problems = [];
  if (/<blockquote/i.test(html)) problems.push("Hay una cita literal");
  if (/dijo|afirmó|según una reseña/i.test(html)) problems.push("Se atribuye una declaración");
  if (!/no se publican citas literales/i.test(html))
    problems.push("No se explica que no se publican citas");
  return problems;
});

/* ---------- 7. Contacto ---------- */
check("Llamada y ubicación reutilizan los datos existentes", () => {
  const problems = [];
  const call = html.match(/<a\b[^>]*id="menu-call"[^>]*>/);
  if (!call) problems.push("Falta el enlace de llamada");
  else {
    if (!/href="tel:\+34924965669"/.test(call[0])) problems.push("El teléfono de llamada no coincide");
    if (!/aria-describedby="phone-caveat"/.test(call[0])) problems.push("La llamada no cita el aviso");
  }
  if (!/924 96 56 69 · número publicado, sin confirmar/.test(html))
    problems.push("Falta el aviso del teléfono sin confirmar");
  if (!/data-maps-link/.test(html)) problems.push("Falta el enlace de ubicación");
  return problems;
});

check("main.js actualiza la llamada desde config", () => {
  const problems = [];
  if (!/#menu-call/.test(main)) problems.push("main.js no controla #menu-call");
  if (!/phoneDial/.test(main)) problems.push("main.js no reutiliza toDial");
  if (!/phone:\s*\{[\s\S]*?status:\s*"pending"/.test(config))
    problems.push("El teléfono ya no está pendiente");
  return problems;
});

/* ---------- 8. Recursos y CSS ---------- */
check("Sin recursos externos ni scripts de terceros", () => {
  const problems = [];
  for (const tag of html.match(/<(?:img|script|link)[^>]+(?:src|href)="(https?:[^"]+)"/g) || []) {
    if (!/rel="canonical"|rel="icon"|property="og:image"/.test(tag)) problems.push(`Recurso externo: ${tag}`);
  }
  if (/<script[^>]+src="https?:/.test(html)) problems.push("Script externo");
  return problems;
});

check("CSS propio y sin llaves descompensadas", () => {
  const problems = [];
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const open = (clean.match(/{/g) || []).length;
  const close = (clean.match(/}/g) || []).length;
  if (open !== close) problems.push(`Llaves: ${open}/${close}`);
  for (const cls of [".menu-hero", ".menu-feature", ".menu-dish", ".menu-cta", ".menu-notes"]) {
    if (!css.includes(cls)) problems.push(`Falta ${cls}`);
  }
  if (!/@media \(min-width: 56rem\)/.test(css)) problems.push("Falta el salto de dos columnas");
  return problems;
});

check("JavaScript sin dependencias ni console.log", () => {
  const problems = [];
  if (/console\.(log|debug)\(/.test(main)) problems.push("console.log en producción");
  if (/\bimport\s|\brequire\(/.test(main)) problems.push("main.js importa módulos");
  return problems;
});

/* ---------- Salida ---------- */
let failed = 0;
for (const test of tests) {
  if (test.problems.length) {
    failed += 1;
    console.log(`FALLO  ${test.name}`);
    for (const problem of test.problems) console.log(`       · ${problem}`);
  } else {
    console.log(`OK     ${test.name}`);
  }
}
console.log(`\n${tests.length - failed}/${tests.length} comprobaciones de la carta superadas.`);
process.exitCode = failed ? 1 : 0;
