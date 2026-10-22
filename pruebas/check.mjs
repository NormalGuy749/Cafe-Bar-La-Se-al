/* ============================================================
   Comprobaciones estáticas de la demo (sin dependencias).

   Uso:  node pruebas/check.mjs

   No sustituye a un validador de HTML ni a una auditoría de
   accesibilidad: comprueba los defectos que sí se pueden detectar
   de forma fiable leyendo los archivos (anclas, rutas, metadatos,
   orden de encabezados, datos inventados, JSON-LD…).
   ============================================================ */

import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFile(join(root, p), "utf8");
const exists = (p) => existsSync(join(root, p));
const readSync = (p) => readFileSync(join(root, p), "utf8");

const html = await read("index.html");
const css = await read("css/styles.css");
const config = await read("js/config.js");
const main = await read("js/main.js");

const results = [];
function check(name, fn) {
  try {
    const problems = fn() || [];
    if (typeof problems.then === "function") {
      throw new Error("la comprobación es asíncrona: usa existsSync o await");
    }
    results.push({ name, problems });
  } catch (error) {
    results.push({ name, problems: [`Error al comprobar: ${error.message}`] });
  }
}

const matchAll = (re, text) => Array.from(text.matchAll(re));
const textOnly = (fragment) =>
  fragment.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ");

/* ---------- 1. Rutas locales ---------- */
check("Rutas locales de CSS, JS e imágenes existen", () => {
  const problems = [];
  const refs = [
    ...matchAll(/(?:href|src)="((?!https?:|#|mailto:|tel:)[^"]+)"/g, html)
  ].map((m) => m[1]);

  if (!refs.length) problems.push("No se ha detectado ninguna ruta local");
  for (const ref of refs) {
    // El query (?v=…) solo bustea caché; el archivo local es la ruta sin él.
    const file = decodeURIComponent(ref.split(/[?#]/)[0]);
    if (!exists(file)) problems.push(`No existe: ${ref}`);
  }
  return problems;
});

/* ---------- 2. Anclas internas ---------- */
const ids = matchAll(/\sid="([^"]+)"/g, html).map((m) => m[1]);

check("Todas las anclas internas apuntan a un id existente", () => {
  const problems = [];
  let count = 0;
  for (const m of matchAll(/href="#([^"]+)"/g, html)) {
    count += 1;
    if (!ids.includes(m[1])) problems.push(`Ancla rota: #${m[1]}`);
  }
  if (count < 5) problems.push(`Solo ${count} anclas internas: revisar navegación`);
  return problems;
});

check("Los id del documento son únicos", () => {
  const seen = new Set();
  const problems = [];
  for (const id of ids) {
    if (seen.has(id)) problems.push(`id duplicado: ${id}`);
    seen.add(id);
  }
  return problems;
});

/* ---------- 3. Metadatos ---------- */
check("Metadatos de cabecera", () => {
  const problems = [];
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  const description =
    (html.match(/<meta name="description" content="([^"]*)">/) || [])[1] || "";

  if (!/^<html lang="es">/m.test(html)) problems.push("Falta lang=\"es\" en <html>");
  if (!/<meta charset="utf-8">/i.test(html)) problems.push("Falta charset utf-8");
  if (!/name="viewport" content="width=device-width, initial-scale=1"/.test(html))
    problems.push("Falta el viewport móvil esperado");

  if (title.length < 20 || title.length > 65)
    problems.push(`Título de ${title.length} caracteres (20–65)`);
  if (description.length < 70 || description.length > 165)
    problems.push(`Meta description de ${description.length} caracteres (70–165)`);

  for (const prop of ["og:title", "og:description", "og:url", "og:type", "og:locale"]) {
    if (!html.includes(`property="${prop}"`)) problems.push(`Falta ${prop}`);
  }
  if (!/<link rel="canonical"/.test(html)) problems.push("Falta canonical");
  if (!/<meta name="robots" content="noindex">/.test(html))
    problems.push("Falta noindex mientras sea una propuesta no oficial");

  return problems;
});

/* ---------- 4. Encabezados ---------- */
check("Jerarquía de encabezados sin saltos", () => {
  const problems = [];
  const levels = matchAll(/<h([1-6])[\s>]/g, html).map((m) => Number(m[1]));

  if (levels.filter((l) => l === 1).length !== 1)
    problems.push(`Hay ${levels.filter((l) => l === 1).length} <h1> (debe haber 1)`);
  if (levels[0] !== 1) problems.push("El primer encabezado no es <h1>");

  let previous = 1;
  for (const level of levels) {
    if (level > previous + 1) problems.push(`Salto de h${previous} a h${level}`);
    previous = level;
  }
  return problems;
});

/* ---------- 5. JSON-LD ---------- */
check("Datos estructurados: válidos y sin datos no verificados", () => {
  const problems = [];
  const blocks = matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, html);

  if (!blocks.length) problems.push("No hay JSON-LD");
  for (const [, body] of blocks) {
    let data;
    try {
      data = JSON.parse(body);
    } catch (error) {
      problems.push(`JSON-LD inválido: ${error.message}`);
      continue;
    }
    for (const key of [
      "telephone", "openingHours", "openingHoursSpecification", "geo",
      "aggregateRating", "review", "priceRange", "image", "sameAs"
    ]) {
      if (key in data) problems.push(`JSON-LD incluye ${key}, que no está verificado`);
    }
  }
  return problems;
});

/* ---------- 6. Enlaces y controles ---------- */
check("Enlaces y controles con destino y tipo", () => {
  const problems = [];
  for (const m of matchAll(/<a\b[^>]*>/g, html)) {
    const tag = m[0];
    const href = (tag.match(/href="([^"]*)"/) || [])[1];
    if (href === undefined) problems.push(`Enlace sin href: ${tag.slice(0, 70)}`);
    else if (href.trim() === "" || href === "#")
      problems.push(`Enlace con destino vacío: ${tag.slice(0, 70)}`);
    if (href && /^https?:/.test(href) && !/rel="noopener/.test(tag))
      problems.push(`Enlace externo sin rel: ${href}`);
  }
  for (const m of matchAll(/<button\b[^>]*>/g, html)) {
    if (!/\stype="/.test(m[0])) problems.push(`Botón sin type: ${m[0].slice(0, 70)}`);
  }
  return problems;
});

check("aria-labelledby apunta a id existente", () => {
  const problems = [];
  for (const m of matchAll(/aria-labelledby="([^"]+)"/g, html)) {
    for (const id of m[1].split(/\s+/)) {
      if (!ids.includes(id)) problems.push(`aria-labelledby roto: ${id}`);
    }
  }
  return problems;
});

/* ---------- 7. Recursos externos ---------- */
check("Sin dependencias externas cargadas al abrir la página", () => {
  const problems = [];
  const remote = [
    ...matchAll(/<(?:img|script|link)[^>]+(?:src|href)="(https?:[^"]+)"/g, html)
  ].map((m) => m[1]);

  for (const url of remote) {
    if (!/^https:\/\/normalguy749\.github\.io\//.test(url))
      problems.push(`Recurso externo: ${url}`);
  }
  if (/@import\s+url\(/.test(css)) problems.push("@import externo en CSS");
  if (/url\(["']?https?:/.test(css)) problems.push("Fuente o imagen remota en CSS");
  return problems;
});

/* ---------- 8. Contenido y datos no inventados ---------- */
check("Sin marcadores de relleno ni datos inventados evidentes", () => {
  const problems = [];
  const visible = textOnly(html).toLowerCase();
  const banned = [
    "lorem", "ipsum", "todo:", "tbd", "xxx", "placeholder",
    "cuando el local la dicte", "texto de ejemplo", "reseña falsa"
  ];
  for (const word of banned) {
    if (visible.includes(word)) problems.push(`Texto prohibido: "${word}"`);
  }
  if (/€|\b\d+[.,]\d{2}\s*euros?\b/.test(visible))
    problems.push("Hay importes: no existe carta confirmada con precios");
  // Una mención negativa («sin WhatsApp ni redes verificadas») es correcta;
  // lo que no puede haber es un enlace o una invitación a usarlas.
  if (/\b(wa\.me|instagram\.com|facebook\.com|tiktok\.com)\b/i.test(html))
    problems.push("Hay un enlace a WhatsApp o a una red social sin verificar");
  for (const sentence of visible.split(/[.!?·]/)) {
    if (/\b(whatsapp|instagram|facebook|tiktok)\b/i.test(sentence) &&
        !/\b(sin|no|ni)\b/i.test(sentence))
      problems.push(`Se ofrece una red social no verificada: "${sentence.trim()}"`);
  }
  if (/\b\d,\d\s*★|\bestrellas\b/i.test(visible))
    problems.push("Se mencionan estrellas o puntuaciones");
  for (const m of matchAll(/<a[^>]+href="tel:[^"]*"/g, html)) {
    problems.push(`Enlace tel: presente sin teléfono confirmado (${m[0].slice(0, 60)})`);
  }
  return problems;
});

check("Aviso de propuesta no oficial visible", () => {
  const problems = [];
  if (!/class="proposal"/.test(html)) problems.push("No existe el aviso .proposal");
  if (!/no oficial/i.test(textOnly(html))) problems.push("El aviso no dice 'no oficial'");
  if (!/active:\s*true/.test(config)) problems.push("config.proposal.active no es true");
  return problems;
});

check("Estado honesto de los datos pendientes", () => {
  const problems = [];
  if (!/status:\s*"pending"/.test(config)) problems.push("Ningún dato marcado como pendiente");
  if (!/telephone|tel:/.test(main)) {
    // ok: el teléfono solo se enlaza si status === "verified"
  }
  if (/status:\s*"verified"/.test(config))
    problems.push("Hay un dato marcado como verificado: comprobar que sea cierto");
  return problems;
});

/* ---------- 8 bis. Atributo hidden ---------- */
check("El atributo hidden no queda anulado por una regla display", () => {
  const problems = [];
  const hiddenInHtml = matchAll(/\shidden(?:[\s>=])/g, html);

  if (hiddenInHtml.length && !/\[hidden\]\s*\{[^}]*display:\s*none/.test(css))
    problems.push("Hay elementos con hidden y el CSS no fuerza [hidden]{display:none}");

  // Reproduce el caso real: un elemento oculto con una clase que fija display
  // quedaría visible sin la regla [hidden].
  for (const m of matchAll(/<([a-z]+)([^>]*\shidden[^>]*)>/g, html)) {
    const classes = (m[2].match(/class="([^"]+)"/) || [])[1];
    if (!classes) continue;
    for (const cls of classes.split(/\s+/)) {
      const rule = css.match(new RegExp(`\\.${cls.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\s*\\{[^}]*display:`));
      if (rule && !/\[hidden\]\s*\{[^}]*display:\s*none/.test(css))
        problems.push(`.${cls} fija display y está marcado hidden sin protección [hidden]`);
    }
  }
  return problems;
});

check("Imágenes con alt, dimensiones reales y carga diferida", () => {
  const problems = [];
  const images = matchAll(/<img\b[^>]*>/g, html).map((m) => m[0]);
  if (!images.length) problems.push("No hay imágenes: revisar la integración de fotos");

  // Lee el tamaño real del archivo para comprobar que width/height declarados
  // coinciden: si no, el navegador reserva un hueco equivocado (CLS).
  const dimensions = (file) => {
    const b = readFileSync(join(root, file));
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i += 1; continue; }
        const marker = b[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
        }
        i += 2 + b.readUInt16BE(i + 2);
      }
      return null;
    }
    if (b.toString("ascii", 1, 4) === "PNG") {
      return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    }
    return null;
  };

  for (const tag of images) {
    const src = (tag.match(/src="([^"]+)"/) || [])[1] || "";
    const isHero = /class="hero__photo"/.test(tag);

    if (!/\salt="[^"]{15,}"/.test(tag)) problems.push(`Sin alt descriptivo: ${src}`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag))
      problems.push(`Sin width/height: ${src}`);
    if (!/\sdecoding="async"/.test(tag)) problems.push(`Sin decoding async: ${src}`);
    if (isHero && /\sloading="lazy"/.test(tag))
      problems.push("La foto de portada no debe cargarse en diferido");
    if (!isHero && !/\sloading="lazy"/.test(tag))
      problems.push(`Foto fuera de portada sin loading lazy: ${src}`);

    if (!exists(src)) {
      problems.push(`No existe la imagen: ${src}`);
      continue;
    }
    const real = dimensions(src);
    const declaredW = Number((tag.match(/\swidth="(\d+)"/) || [])[1]);
    const declaredH = Number((tag.match(/\sheight="(\d+)"/) || [])[1]);
    if (real && (real.width !== declaredW || real.height !== declaredH))
      problems.push(
        `${src}: declarado ${declaredW}x${declaredH}, real ${real.width}x${real.height}`
      );
  }
  return problems;
});

check("Sin role=img conviviendo con aria-hidden", () => {
  const problems = [];
  for (const m of matchAll(/<[^>]*\brole="img"[^>]*>/g, html)) {
    if (/aria-hidden="true"/.test(m[0]))
      problems.push(`Elemento con role="img" y aria-hidden: ${m[0].slice(0, 60)}`);
  }
  return problems;
});

check("Sin frases visibles repetidas literalmente", () => {
  const problems = [];
  const sentences = textOnly(html)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 24);
  const seen = new Map();
  for (const sentence of sentences) {
    if (seen.has(sentence)) problems.push(`Repetida: "${sentence.slice(0, 70)}…"`);
    seen.set(sentence, true);
  }
  return problems;
});

/* ---------- 9. CSS ---------- */
check("CSS sin llaves descompensadas", () => {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const open = (clean.match(/{/g) || []).length;
  const close = (clean.match(/}/g) || []).length;
  return open === close ? [] : [`Llaves: ${open} abiertas, ${close} cerradas`];
});

check("CSS con foco visible y movimiento reducido", () => {
  const problems = [];
  if (!/:focus-visible/.test(css)) problems.push("Sin regla :focus-visible");
  if (!/prefers-reduced-motion/.test(css)) problems.push("Sin prefers-reduced-motion");
  if (!/\.sr-only/.test(css)) problems.push("Sin utilidad .sr-only");
  return problems;
});

/* ---------- 10. JavaScript ---------- */
check("JavaScript sin dependencias ni console.log en producción", () => {
  const problems = [];
  const source = `${config}\n${main}`;
  if (/console\.(log|debug)\(/.test(source)) problems.push("console.log en el código servido");
  if (/\bimport\s|\brequire\(/.test(main)) problems.push("main.js importa módulos externos");
  if (/<script[^>]+src="https?:/.test(html)) problems.push("Script externo");
  return problems;
});

/* ---------- 11. Copia de pruebas al día ---------- */
check("pruebas/render-check.html está generada desde los archivos actuales", () => {
  const problems = [];
  if (!exists("pruebas/render-check.html")) {
    return ["No existe pruebas/render-check.html: ejecuta node pruebas/build-render-check.mjs"];
  }
  const copy = readSync("pruebas/render-check.html");
  const declared = (copy.match(/fuentes: ([^\n]+?)\s*-->/) || [])[1] || "";
  if (!declared) {
    problems.push("La copia no declara la huella de sus fuentes: regenérala");
    return problems;
  }
  const sources = {
    "index.html": html,
    "css/styles.css": css,
    "js/config.js": config,
    "js/main.js": main
  };
  const expected = Object.entries(sources)
    .map(([name, source]) =>
      name.replace(/[^a-z0-9.]/gi, "") +
      "=" +
      createHash("sha256").update(source).digest("hex").slice(0, 12)
    )
    .join(" ");
  if (declared.trim() !== expected)
    problems.push("La copia está desfasada: vuelve a ejecutar build-render-check.mjs");
  if (!copy.includes(css.slice(0, 200))) problems.push("La copia no contiene el CSS actual");
  return problems;
});

/* ---------- Resultado ---------- */
let failures = 0;
for (const { name, problems } of results) {
  if (problems.length) {
    failures += 1;
    console.log(`FALLO  ${name}`);
    for (const problem of problems) console.log(`       · ${problem}`);
  } else {
    console.log(`OK     ${name}`);
  }
}

console.log(`\n${results.length - failures}/${results.length} comprobaciones superadas.`);
process.exitCode = failures ? 1 : 0;
