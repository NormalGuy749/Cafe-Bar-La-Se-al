# Pruebas y revisión

**Fecha:** 21 de octubre de 2026
**Entorno:** Windows 11 · Node v24.15.0 · Google Chrome 155.0.8059.85 (headless, vía CDP) y Chromium del panel de vista previa.
**Web probada:** archivos reales servidos en `http://127.0.0.1:8099/` con `node pruebas/serve.mjs`.
**Estado del repositorio:** sin `.git` en esta carpeta de trabajo; no se ha hecho commit, push ni despliegue. La demo publicada en GitHub Pages **sigue siendo la versión anterior** (`main`, `247d75b`).

> **Método.** No se ha probado la copia aplanada como si fuera la web. Todas las medidas de esta página salen de `index.html`, `css/styles.css`, `js/config.js` y `js/main.js` servidos por HTTP con sus rutas relativas. La copia `pruebas/render-check.html` se usa solo como vista de un archivo y su vigencia se comprueba automáticamente (§5).

---

## 1. Resumen

| Comprobación | Resultado |
|---|---|
| Comprobador estático (`node pruebas/check.mjs`) | **19/19** |
| Sintaxis del JavaScript (`node --check`) | ✅ 2/2 archivos |
| Carga de CSS, JS y favicon por HTTP | ✅ 200 con `content-type` correcto |
| Recurso inexistente | ✅ 404 |
| Desbordamiento horizontal a 320 / 390 / 768 / 1024 / 1440 px | ✅ ninguno (`scrollWidth == innerWidth`) |
| Un solo `h1`; jerarquía sin saltos | ✅ 1 `h1`, 3 `h2`, 2 `h3` |
| Consola del navegador | ✅ 0 errores, 0 avisos |
| Peticiones externas al abrir | ✅ 0 (ni iframes, ni imágenes, ni fuentes) |
| Menú móvil: abrir, cerrar con Escape y devolver foco, cerrar al elegir | ✅ medido |
| Mapa: no se carga al abrir; se carga con ratón y con teclado | ✅ medido |
| Foco tras cargar el mapa | ✅ pasa a la región `#map`, no al `body` |
| Enlaces internos y externos | ✅ 6 anclas, 0 destinos rotos; externos con `rel="noopener noreferrer"` |
| Contraste AA del texto HTML | ✅ mínimo medido **4,70:1**; 0 fallos en 87 nodos |
| `hidden` respetado | ✅ `#menu-ready` computa `display:none` |
| Copia de pruebas al día | ✅ huella verificada |
| axe / Lighthouse | ❌ no ejecutados (no instalados) |
| Lector de pantalla, móvil real, Firefox/Safari, `prefers-reduced-motion` | ❌ no probados |

---

## 2. Comandos y salida exacta

```bash
node pruebas/serve.mjs            # http://127.0.0.1:8099/
node pruebas/check.mjs            # 19/19 comprobaciones superadas.
node --check js/config.js && node --check js/main.js   # sin salida = correcto
node pruebas/build-render-check.mjs                    # render-check.html generado
node pruebas/capturas.mjs         # 9 capturas con viewport exacto (salen en docs/capturas/2026-10-21/)
```

Códigos HTTP comprobados con `curl`:

```
/                      200 text/html; charset=utf-8 15992
/css/styles.css        200 text/css; charset=utf-8 23702
/js/config.js          200 text/javascript; charset=utf-8 4869
/js/main.js            200 text/javascript; charset=utf-8 10973
/assets/favicon.svg    200 image/svg+xml 288
/no-existe.css         404
```

El HTML servido coincidía byte a byte con `index.html` (mismo `md5`).

Peso propio: **55.824 bytes sin comprimir** (16,0 + 23,7 + 4,9 + 11,0 + 0,3 KB), **≈ 15,9 KB gzip**. Cero peticiones externas en la carga inicial.

---

## 3. Medidas por ancho

Viewport fijado con `Emulation.setDeviceMetricsOverride` (CDP), no con `--window-size`.

| Ancho | Viewport real | `scrollWidth` | Alto de página | ¿Desborda? |
|---|---|---|---|---|
| 1440 | 1440 | 1440 | 3491 px | No |
| 1024 | 1024 | 1024 | 3456 px | No |
| 768 | 768 | 768 | 3312 px | No |
| 390 | 390 | 390 | 4295 px | No |
| 320 | 320 | 320 | 4622 px | No |

La captura por CDP oculta la barra de desplazamiento. Con barra visible (panel de vista previa), a 320
el ancho de maquetación es 303 px y `scrollWidth` sigue siendo 303: tampoco desborda. A 1024, 1007/1007.

Alturas de sección a 1440: portada 560 · datos 254 · carta 711 · friso 490 · ubicación 1015 · pie 339.

> **Nota de método (importante).** El primer intento de capturas usó
> `chrome --headless --screenshot --window-size=390,844`. Windows impone un ancho mínimo de
> ventana: Chrome maquetaba a ~500 px y la imagen se recortaba, con textos cortados y el botón
> de menú a medias. Esas capturas se descartaron. `pruebas/capturas.mjs` fija el viewport por
> CDP y comprueba en cada captura que `innerWidth` es el pedido y que no hay desbordamiento; si
> no coincide, sale con código 1.

---

## 4. Defectos encontrados y corregidos en esta sesión

Todos son reproducibles y se comprobaron antes y después.

| # | Defecto | Evidencia | Corrección | Cómo se comprobó |
|---|---|---|---|---|
| 1 | «Abrir en Google Maps» mostraba **dos rayas**: subrayado del texto y `border-bottom` del cajón de 44 px | Visible a 768 y 1440 | `text-decoration` con `underline-offset`; sin borde | Captura 1440: una sola línea pegada al texto |
| 2 | `#menu-ready` tenía `hidden`, pero `.menu-ready{display:grid}` lo anulaba | `getComputedStyle(...).display === "grid"` con `hidden` presente | Regla global `[hidden]{display:none !important}` | Ahora computa `none`; comprobación nueva en `check.mjs` |
| 3 | Navegación del pie con huérfano: 3+1 a 1440 y 2+2 a 1024 | `getBoundingClientRect().top` de los `li` | 2×2 en móvil, una columna desde 40rem; 44 px por enlace | Tops iguales por filas; alto 44 px |
| 4 | Friso ilegible en móvil: 96–103 px de alto, rótulos ocultos y un rectángulo blanco sin texto | Captura 390 | Banda tipográfica «Calle Manzanedo × Calle Roble» por debajo de 48rem; rótulos del SVG a 22/17 px para tablet | Capturas 390 y 768 |
| 5 | Notas de la franja de datos desalineadas a 768 cuando un valor ocupa dos líneas | Notas a 314/328 px | `min-height: 2.5em` en `.fact__value` desde 40rem | Las tres notas a 314 px |
| 6 | Carta: tres filas cortas a lo ancho de 940 px y sección de 836 px | Captura 1440 | Dos columnas desde 56rem con filete vertical; sección 711 px | Captura 1440 |
| 7 | Al cargar el mapa, el botón enfocado desaparecía y el foco caía al `body` | `document.activeElement` = `BODY` | `#map` es región con `tabindex="-1"` y recibe el foco | Tras Enter: `activeElement` = `DIV#map` |
| 8 | Si el iframe fallaba, quedaba un marco roto en la página | Revisión de código | `frame.remove()` en el manejador de error | No reproducible en vivo (la red funcionó); corregido por inspección |
| 9 | Avisos repetidos: la misma cautela en la franja de datos, en la ficha y en el contacto | Lectura + comprobación automática de frases duplicadas | Textos condensados; fuente citada una vez | Comprobación nueva «Sin frases repetidas» en verde |
| 10 | Portada móvil de 799 px de alto a 320 px, con placa de 235 px | Medido | Lead a 16 px por debajo de 30rem, placa a 15rem y centrada | 718 px de alto; placa 240 px centrada (43/42 px de margen) |
| 11 | `role="img"` y `aria-hidden="true"` a la vez en el SVG del friso | Lectura | Se retira `role="img"` | Comprobación nueva en verde |
| 12 | Restos de pruebas mías: `probe.txt` y `css/_probe.html` | Archivos de 3 y 5 líneas | Eliminados | `ls` |

Cambios de texto (sin datos nuevos): titular de portada, entradilla de la carta («La carta se está cerrando con el local…»), «Lo que citan las guías», nota de dirección, fuente del horario, notas de contacto y aviso legal del pie en un solo párrafo.

---

## 5. El verificador también se prueba

Un test que nunca falla no demuestra nada. Se hicieron dos mutaciones controladas:

1. Se quitó la regla `[hidden]` y se añadió un salto de línea a `index.html`.
2. `node pruebas/check.mjs` falló exactamente en las dos comprobaciones esperadas:
   `El atributo hidden no queda anulado por una regla display` (dos avisos) y
   `pruebas/render-check.html está generada desde los archivos actuales`.
3. Se restauraron los archivos, se regeneró la copia y volvió a **19/19**.

Comprobaciones añadidas en esta sesión: atributo `hidden`, conflicto `role="img"` + `aria-hidden`, frases visibles repetidas y vigencia de la copia por huella SHA-256 de las cuatro fuentes.

---

## 6. Contraste medido sobre el navegador

Recorrido automático de los nodos de texto con `getComputedStyle`, mezclando el color sobre el fondo efectivo y aplicando el umbral AA (4,5:1 normal, 3:1 texto grande):

- **87 nodos de texto HTML a 1440 y 87 a 390, 0 fallos, mínimo 4,70:1 en ambos anchos.**
- El mínimo corresponde a `--ink-3` (#6E6859) sobre crema, usado en versalitas y metadatos.
- Los rótulos del SVG no entran en ese recorrido (usan `fill`, no `color`): el rótulo del toldo es verde sobre crema (10,7:1) y los nombres de calle son crema al 72 % sobre verde (≈6,4:1).

---

## 7. Interacción comprobada

- **Menú móvil (390):** abre; `Escape` cierra y devuelve el foco a `summary` (`activeElement` verificado); al pulsar «La carta» cierra, actualiza el hash y deja la sección a 100 px del borde superior con el header (73 px) despejado.
- **Mapa:** al cargar hay **0 iframes**. Con el botón enfocado, `Enter` inyecta el iframe, retira la fachada, anuncia «Mapa de Google cargado» en la región viva y deja el foco en `#map`. El mapa resolvió visualmente a **«Café-Bar La Señal, C. Manzanedo & C. Roble, 06400 Don Benito»**.
- **Ratón:** el mismo flujo con clic; sin errores de consola.
- **Teclado:** primer `Tab` → «Saltar al contenido», con `:focus-visible` activo y `outline: 2px solid rgb(36,59,48)` a 3 px.
- **Anclas:** `#carta`, `#horario` y `#ubicacion` resuelven; `#horario` queda a 100 px con el título a 105 px.
- **Teléfono:** `a[href^="tel:"]` = 0. **WhatsApp:** 0 nodos. **Formularios:** 0.
- **Enlaces de mapa:** `…/maps/dir/?api=1&destination=…` para «Cómo llegar» y `…/maps/search/?api=1&query=…` para buscar; todos con `target="_blank"` y `rel="noopener noreferrer"`.

---

## 8. Integridad de los datos

Se mantiene la separación de `docs/pendientes-propietario.md`:

- **Confirmado por fuentes públicas:** nombre, categoría, municipio, código postal y el cruce Manzanedo–Roble.
- **Publicado y sin confirmar por el local:** horario y teléfono, señalados como tales en la propia interfaz.
- **No publicado:** carta, precios, alérgenos, fotos, WhatsApp, redes, reseñas, ficha de Google, número de portal, datos legales.
- **Cero datos inventados:** la comprobación prohíbe importes, `tel:`, enlaces sociales, estrellas y textos de relleno. El JSON-LD solo lleva nombre y dirección.

---

## 9. Limitaciones declaradas (no son aprobados)

1. **Sin axe ni Lighthouse.** No instalados; la revisión de accesibilidad es manual + contraste calculado.
2. **Sin lector de pantalla** (NVDA/VoiceOver).
3. **Sin `prefers-reduced-motion` emulado.** La regla existe y anula transiciones, pero no se ha forzado la preferencia en el navegador.
4. **Hover y `:active` no capturados en imagen.** Están definidos en CSS y se comprobó su cómputo, pero no se ha congelado el estado `:hover` en una captura.
5. **Un solo motor.** Chromium. Sin Firefox ni Safari.
6. **Sin móvil real.** Viewports emulados a 320/390; no hay prueba en dispositivo físico (táctil, notch, barra del navegador).
7. **Sin validador W3C.** El HTML se parsea sin errores de consola, pero no se ha pasado por el validador oficial.
8. **Sin prueba de errores de red del mapa.** El camino de error está corregido por inspección; no se forzó un fallo.
9. **La web publicada no está actualizada.** No se ha desplegado nada: GitHub Pages sigue sirviendo `247d75b`.

---

## 10. Qué falta para publicar

1. Cerrar los datos de `docs/pendientes-propietario.md` (carta, precios, horario, teléfono, portal, WhatsApp, ficha de Google, fotos, logo).
2. Añadir la galería cuando haya fotos con permiso escrito (ver `docs/derechos-imagenes.md`).
3. Aviso legal, titular y política de privacidad.
4. Dominio definitivo y actualización de `canonical`, `og:url` y `og:image`; retirar `noindex`.
5. Quitar la franja de propuesta (`proposal.active = false`) solo con la aprobación del dueño.
6. Repetir esta batería en móvil real y en Firefox/Safari.
