/* ============================================================
   Capturas de la web real con viewport exacto.

   Por qué existe: `chrome --headless --screenshot --window-size=390,844`
   NO sirve por debajo de ~500 px. Windows impone un ancho mínimo de
   ventana, Chrome maqueta a ese ancho y la captura se recorta: salen
   textos cortados y el botón de menú a medias. Aquí se fija el
   viewport con Emulation.setDeviceMetricsOverride, así que 320 y 390
   son de verdad 320 y 390.

   Requiere Google Chrome instalado. Sin dependencias: usa el
   WebSocket nativo de Node 22+ y el protocolo DevTools.

   Uso:
     node pruebas/capturas.mjs [url] [carpeta de salida]

   Por defecto captura http://127.0.0.1:8099/ en
   docs/capturas/2026-10-21/. Arranca el servidor antes:
     node pruebas/serve.mjs
   ============================================================ */

import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = process.argv[2] || "http://127.0.0.1:8099/";
const outDir = process.argv[3] || join(root, "docs/capturas/2026-10-21");
const only = process.argv[4] || "";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium"
].filter(Boolean);

const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromePath) {
  console.error("No se ha encontrado Chrome. Define CHROME_PATH.");
  process.exit(1);
}

/* Qué se captura: ancho, alto y ancla ("" = portada). */
const shots = [
  { name: "escritorio-1440-portada.png", width: 1440, height: 900, hash: "" },
  { name: "escritorio-1440-carta.png", width: 1440, height: 900, hash: "#carta" },
  { name: "escritorio-1440-ubicacion.png", width: 1440, height: 900, hash: "#ubicacion" },
  { name: "portatil-1024-portada.png", width: 1024, height: 800, hash: "" },
  { name: "tablet-768-carta.png", width: 768, height: 1024, hash: "#carta" },
  { name: "movil-390-portada.png", width: 390, height: 844, hash: "" },
  { name: "movil-390-carta.png", width: 390, height: 844, hash: "#carta" },
  { name: "movil-390-ubicacion.png", width: 390, height: 844, hash: "#ubicacion" },
  { name: "movil-320-portada.png", width: 320, height: 640, hash: "" },
  { name: "carta-1440.png", width: 1440, height: 900, hash: "carta.html" },
  { name: "carta-1440-completa.png", width: 1440, height: 900, hash: "carta.html", full: true },
  { name: "carta-768.png", width: 768, height: 1024, hash: "carta.html" },
  { name: "carta-390.png", width: 390, height: 844, hash: "carta.html" },
  { name: "carta-390-completa.png", width: 390, height: 844, hash: "carta.html", full: true },
  { name: "carta-320.png", width: 320, height: 640, hash: "carta.html" }
];

const profile = mkdtempSync(join(tmpdir(), "cb-capturas-"));
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank"
  ],
  { stdio: "ignore" }
);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function devtoolsPort() {
  const file = join(profile, "DevToolsActivePort");
  for (let i = 0; i < 100; i += 1) {
    if (existsSync(file)) {
      const [port, path] = readFileSync(file, "utf8").trim().split("\n");
      return { port: Number(port), path };
    }
    await wait(100);
  }
  throw new Error("Chrome no ha abierto el puerto de depuración");
}

const { port, path } = await devtoolsPort();
const ws = new WebSocket(`ws://127.0.0.1:${port}${path}`);

await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let nextId = 1;
const pending = new Map();
const listeners = new Map();

ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(`${msg.error.message} (${msg.error.code})`));
    else resolve(msg.result);
    return;
  }
  if (msg.method) {
    const key = `${msg.sessionId || ""}|${msg.method}`;
    const queue = listeners.get(key);
    if (queue && queue.length) queue.shift()(msg.params);
  }
});

function send(method, params = {}, sessionId) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}

function once(method, sessionId) {
  return new Promise((resolve) => {
    const key = `${sessionId || ""}|${method}`;
    const queue = listeners.get(key) || [];
    queue.push(resolve);
    listeners.set(key, queue);
  });
}

async function capture(shot) {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

  await send("Page.enable", {}, sessionId);
  await send("Emulation.setDeviceMetricsOverride", {
    width: shot.width,
    height: shot.height,
    deviceScaleFactor: 1,
    mobile: false
  }, sessionId);

  const loaded = once("Page.loadEventFired", sessionId);
  await send("Page.navigate", { url: baseUrl + shot.hash }, sessionId);
  await loaded;
  // Margen para fuentes del sistema y para el salto de ancla.
  await wait(500);

  let screenshot = { format: "png" };
  if (shot.full) {
    // Las imágenes de la carta usan loading="lazy": hay que recorrer la
    // página antes de capturarla entera o saldrían como huecos.
    await send("Runtime.evaluate", {
      expression: `(async () => {
        document.documentElement.style.scrollBehavior = 'auto';
        const h = document.documentElement.scrollHeight;
        for (let y = 0; y < h; y += 420) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 180));
        }
        window.scrollTo(0, h);
        await new Promise((r) => setTimeout(r, 700));
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 300));
      })()`,
      awaitPromise: true
    }, sessionId);
    const metrics = await send("Page.getLayoutMetrics", {}, sessionId);
    const { width, height } = metrics.cssContentSize;
    screenshot = {
      format: "png",
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width, height, scale: 1 }
    };
  }
  const { data } = await send("Page.captureScreenshot", screenshot, sessionId);
  writeFileSync(join(outDir, shot.name), Buffer.from(data, "base64"));

  const check = await send("Runtime.evaluate", {
    expression: `JSON.stringify({w: innerWidth, h: innerHeight, sw: document.documentElement.scrollWidth, y: Math.round(scrollY)})`,
    returnByValue: true
  }, sessionId);

  await send("Target.closeTarget", { targetId });
  return JSON.parse(check.result.value);
}

mkdirSync(outDir, { recursive: true });
let failures = 0;

for (const shot of (only ? shots.filter((s) => s.name.includes(only)) : shots)) {
  try {
    const info = await capture(shot);
    const overflow = info.sw > info.w;
    if (info.w !== shot.width) {
      failures += 1;
      console.log(`FALLO ${shot.name}: viewport ${info.w}px, esperado ${shot.width}px`);
    } else if (overflow) {
      failures += 1;
      console.log(`FALLO ${shot.name}: desbordamiento horizontal (${info.sw} > ${info.w})`);
    } else {
      console.log(`OK    ${shot.name}  ${info.w}x${info.h}  scroll ${info.y}`);
    }
  } catch (error) {
    failures += 1;
    console.log(`FALLO ${shot.name}: ${error.message}`);
  }
}

ws.close();
chrome.kill();
console.log(failures ? `\n${failures} captura(s) con problemas.` : "\nCapturas generadas.");
process.exitCode = failures ? 1 : 0;
