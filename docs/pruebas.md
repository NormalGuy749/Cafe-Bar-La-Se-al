# Pruebas y revisión

**Última revisión:** 22 de octubre de 2026 (fotografías reales integradas y favicon del logotipo).
**Entorno:** Windows 11 · Node v24.15.0 · Google Chrome 155.0.8059.85 (headless, vía CDP) y Chromium del panel de vista previa.
**Web probada:** archivos reales servidos en `http://127.0.0.1:8099/` con `node pruebas/serve.mjs`.
**Estado del repositorio:** rama `main`; esta sesión no ha hecho commit, push ni despliegue. La demo publicada en GitHub Pages **sigue siendo la versión anterior**.

> **Método.** No se ha probado la copia aplanada como si fuera la web. Todas las medidas de esta página salen de `index.html`, `css/styles.css`, `js/config.js` y `js/main.js` servidos por HTTP con sus rutas relativas. La copia `pruebas/render-check.html` se usa solo como vista de un archivo y su vigencia se comprueba automáticamente (§5).

---

## 1. Resumen

| Comprobación | Resultado |
|---|---|
| Comprobador estático (`node pruebas/check.mjs`) | **20/20** |
| Sintaxis del JavaScript (`node --check`) | ✅ 2/2 archivos |
| Carga de CSS, JS y favicon por HTTP | ✅ 200 con `content-type` correcto |
| Favicon del logotipo: SVG válido, 16/32/48 px y petición real | ✅ en local; producción pendiente de publicar (§12) |
| Fotografías por HTTP | ✅ 5/5 JPEG, 200, `image/jpeg` |
| Dimensiones declaradas frente al archivo real | ✅ 5/5 coinciden |
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
node pruebas/check.mjs            # 20/20 comprobaciones superadas.
node --check js/config.js && node --check js/main.js   # sin salida = correcto
node pruebas/build-render-check.mjs                    # render-check.html generado
node pruebas/capturas.mjs         # 9 capturas con viewport exacto (salen en docs/capturas/2026-10-21/)
```

Códigos HTTP comprobados con `curl`:

```
/                      200 text/html; charset=utf-8 17911
/css/styles.css        200 text/css; charset=utf-8 23844
/js/config.js          200 text/javascript; charset=utf-8 4811
/js/main.js            200 text/javascript; charset=utf-8 10973
/assets/favicon.svg    200 image/svg+xml 1068
/assets/favicon-32.png 200 image/png 723
/no-existe.css         404
```

El HTML servido coincidía byte a byte con `index.html` (mismo `md5`).

Peso propio: **59.330 bytes sin comprimir** (17,9 + 23,8 + 4,8 + 11,0 + 1,0 + 0,7 KB), **≈ 17,1 KB gzip**, más **423 KB** de fotografías (109 KB en la portada y 313 KB en diferido). Cero peticiones externas distintas del mapa.

---

## 3. Medidas por ancho

> Las alturas de la tabla siguiente corresponden a la versión **sin fotografías**. La revisión
del 22/10 confirma de nuevo la ausencia de desbordamiento en los cinco anchos (§11).

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
3. Se restauraron los archivos, se regeneró la copia y volvió a **19/19** (la cifra de aquella
   sesión; tras añadir la comprobación de imágenes, hoy son 20).

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
- **No publicado:** carta, precios, alérgenos, WhatsApp, redes, reseñas, ficha de Google, número de portal, datos legales.
- **Fotos:** integradas cinco, aportadas con el proyecto; el permiso escrito sigue pendiente.
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
9. **La web publicada no está actualizada.** No se ha desplegado nada: GitHub Pages sigue sirviendo `0ee1420`, con el favicon antiguo del cruce.

---

## 10. Qué falta para publicar

1. Cerrar los datos de `docs/pendientes-propietario.md` (carta, precios, horario, teléfono, portal, WhatsApp, ficha de Google, logotipo).
2. Documentar por escrito el permiso de las cinco fotografías usadas (ver `docs/derechos-imagenes.md`).
3. Aviso legal, titular y política de privacidad.
4. Dominio definitivo y actualización de `canonical`, `og:url` y `og:image`; retirar `noindex`.
5. Quitar la franja de propuesta (`proposal.active = false`) solo con la aprobación del dueño.
6. Repetir esta batería en móvil real y en Firefox/Safari.

---

## 11. Revisión del 22/10/2026 — fotografías reales

**Qué se cambió:** la placa SVG de la portada se sustituye por la fachada real; se añaden tres
fotos de platos a la sección de la carta y una segunda fachada a «Dónde estamos». No se toca el
mapa, la navegación, los datos ni los enlaces. Los originales se conservan en `images/`; las
versiones web están en `assets/images/`.

### 11.1 Comprobaciones ejecutadas

| Prueba | Resultado |
|---|---|
| `node pruebas/build-render-check.mjs` | ✅ copia generada; las fotos se incrustan para que la vista de un archivo no muestre huecos |
| `node pruebas/check.mjs` | ✅ **20/20** |
| `node --check js/config.js && node --check js/main.js` | ✅ sin salida |
| `node pruebas/capturas.mjs …/2026-10-22` | ✅ **9/9** capturas, viewport exacto, sin desbordamiento |
| HTTP de las cinco fotos | ✅ 200, `image/jpeg`, 43–150 KB |
| `naturalWidth > 0` tras recorrer la página a 1440 y 390 | ✅ 5/5 |
| `width`/`height` declarados frente al archivo | ✅ 5/5 (comprobación estática nueva) |
| Consola y excepciones en sesión limpia | ✅ 0 errores |
| Enlaces internos | ✅ 0 anclas rotas |
| Encabezados | ✅ 1 `h1`, 3 `h2`, 3 `h3`, sin saltos |
| Mapa bajo demanda | ✅ iframe inyectado, fachada retirada, `aria-busy` limpio, foco en `#map`, aviso «Mapa de Google cargado» |
| Menú móvil (390) | ✅ abre, `Escape` cierra y devuelve el foco a `summary` |
| Sin desbordamiento horizontal | ✅ 320 / 390 / 768 / 1024 / 1440 (`scrollWidth == innerWidth`) |
| Altura de página | 1440: 4359 px · 390: 5380 px |
| Carta sin datos inventados | ✅ 0 importes, 0 nombres de plato, 0 alérgenos; el comprobador sigue en verde |

Un recorrido completo a 390 midió las secciones así: portada 744 px, datos 479, carta 1564 (con
las fotos), friso 154, ubicación 1839, pie 489.

### 11.2 Defectos encontrados y corregidos

| # | Defecto | Cómo se detectó | Corrección |
|---|---|---|---|
| 13 | Dos fotos de platos tenían el `alt` de la otra: el pulpo se describía como jamón y viceversa | Revisión visual de la captura larga a 390 | Se regeneraron las versiones web desde los originales correctos y se ajustó `width`/`height` |
| 14 | `.place` y `.details` estaban duplicados al final del CSS, con dos parches que repetían las mismas reglas | Lectura de la hoja | Se consolidaron en sus reglas originales con `minmax(0, 1fr)`; el resultado visual no cambia |
| 15 | La copia `render-check.html` no podía resolver las fotos y habría mostrado cinco huecos rotos | Ejecución de `build-render-check.mjs` | Las imágenes se incrustan como `data:` en la copia generada |

### 11.3 Revisión visual

- Capturas de viewport en `docs/capturas/2026-10-22/` a 1440, 1024, 768, 390 y 320. Para revisar
  las secciones completas se hicieron capturas de página entera a 1440 y 390, no conservadas en el
  repositorio.
- La foto de portada se recorta con `object-fit: cover` y `object-position: center 40%`; en móvil
  mantiene el rótulo y el escaparate dentro del encuadre.
- Los tres platos se recortan a 4:5 (cuadrado el primero en móvil) sin ampliar ninguna imagen por
  encima de su resolución nativa.
- La captura de página completa muestra el header fijo a media página: es un artefacto de
  `captureBeyondViewport` con `scroll-behavior: smooth`, no aparece en las capturas de viewport.

### 11.4 Limitaciones de esta revisión

- Sigue sin ejecutarse axe ni Lighthouse (no instalados) y sin probar en móvil real, Firefox o
  Safari. Solo Chromium.
- El contenido del iframe de Google es de Google; se comprobó que resuelve a «Café-Bar La Señal»
  en C. Manzanedo con C. Roble, pero no se audita su interfaz.
- `prefers-reduced-motion` no se ha forzado en el navegador; la regla existe y no se ha tocado.
- El permiso escrito de las fotos no se puede verificar desde el repositorio.

---

## 12. Favicon: el logotipo del rótulo (22/10/2026)

### 12.1 Qué se ha vectorizado

**Referencia:** `images/interior-exterior_del_bar/images (3).jpg` (640 × 480), la toma más frontal
del rótulo. La n ocupa unos 57 × 167 px y la pieza superior, 73 × 51 px; el conjunto mide
aproximadamente 73 × 217 px. Se descartó `cafebarlasealdonbenito.jpg`: la misma pieza es más
pequeña y queda tapada por un coche.

El propietario confirmó el 22/10/2026 que **la flecha y el zigzag superiores forman parte del
logotipo**, no son un rótulo aparte. El favicon reproduce el conjunto, no solo la letra:

- La pieza superior es una flecha que apunta arriba a la izquierda, con un tramo largo descendente
  y tres crestas de zigzag. Va separada de la n por una junta de 1–2 px.
- La n es una minúscula de palo largo: el palo izquierdo llega más arriba que el arco y el vértice
  superior tiene un pequeño escalón.
- Se conservan las proporciones: en el SVG el conjunto ocupa 20,3 × 59,6 px y la n, 15,3 × 45,8 px.
  El trazo de la pieza superior se ha fijado en 2 px (frente a los ~1,5 px proporcionales) para que
  no desaparezca a 16–32 px; la n mantiene su trazado.

**Archivos:** `assets/favicon.svg` (64 × 64, 1.068 bytes: un `rect` verde redondeado, tres trazos
para la flecha y el zigzag y un `path` para la n) y `assets/favicon-32.png` (32 × 32, RGBA,
723 bytes, rasterizado del mismo SVG). `index.html` enlaza ambos con `?v=20261022`: primero el PNG
de 32 px y después el SVG con `sizes="any"`. `pruebas/build-render-check.mjs` incrusta los dos en
la copia de un solo archivo.

**Hoja de tamaños:** `docs/capturas/2026-10-22/favicon-tamanos.png` (256 px, tamaños reales de
48/32/16 y ampliaciones con píxeles reales).

**Color:** el trazo usa `#B58056`, tomado de la foto a pleno sol (la toma en sombra da `#7E6A52`).
El fondo usa `#243B30`, el verde del sitio. Contraste trazo/fondo: **3,55:1**, suficiente para un
gráfico (≥ 3:1). No hay un color de marca confirmado: el hex es una aproximación documentada.

### 12.2 Por qué no se veía

No era una ruta mal escrita ni un problema de MIME. La página publicada seguía siendo el commit
`0ee1420`:

| Comprobación | Local | Publicado el 22/10/2026 |
|---|---|---|
| HTML | PNG y SVG con `?v=20261022` | solo `assets/favicon.svg`, sin PNG |
| SVG | 1.068 bytes, flecha + zigzag + n | 288 bytes, el cruce provisional |
| PNG de 32 | 723 bytes, 200 | **404** |
| `Last-Modified` del SVG | el del archivo local | 21/10/2026 20:17 |
| Caché | `no-store` en el servidor de pruebas | `Cache-Control: max-age=600` |

Las rutas relativas sí resuelven bajo `/Cafe-Bar-La-Se-al/`: el SVG antiguo respondía 200 en
`https://normalguy749.github.io/Cafe-Bar-La-Se-al/assets/favicon.svg`. El favicon nuevo **no estaba
desplegado**; el navegador seguía viendo el icono anterior. Además, el PNG no existía en esa
publicación.

Para que el icono nuevo no quede retenido por la caché del navegador cuando se publique, las dos
referencias llevan `?v=20261022`. La URL antigua sin query sigue sirviendo el SVG de 288 bytes
hasta que se despliegue; la nueva es una entrada distinta.

### 12.3 Pruebas realizadas

| Prueba | Resultado |
|---|---|
| `DOMParser` sobre el SVG | ✅ sin `parsererror`; raíz `svg`, `viewBox="0 0 64 64"`, 1 `rect`, 4 `path` |
| Recursos del SVG | ✅ solo rellenos locales; sin `image`, `href`, `url()` ni `@import` |
| HTTP del SVG y del PNG en `/Cafe-Bar-La-Se-al/` | ✅ 200, `image/svg+xml` (1.068 B) y `image/png` (723 B) |
| Petición real de Chromium | ✅ pide `assets/favicon.svg?v=20261022`; 200, `image/svg+xml`, sin fallos |
| PNG de respaldo | ✅ 32 × 32, RGBA, esquinas transparentes, 978 px opacos |
| 16 × 16 / 32 × 32 / 48 × 48 | ✅ renderizados sobre fondo oscuro; a 16 la n se identifica y la pieza superior es una línea fina; a 32 y 48 se lee el conjunto |
| `file://` | ✅ también pide el SVG nuevo y responde 200 |
| Consola y red | ✅ 0 errores, 0 recursos rotos |
| `node pruebas/check.mjs` | ✅ 20/20 |
| Copia de pruebas | ✅ regenerada con los dos favicons incrustados |

### 12.4 Limitaciones y estado de producción

- **La web publicada no está actualizada.** No se ha hecho commit, push ni despliegue: GitHub Pages
  sigue sirviendo `0ee1420`, con el SVG de 288 bytes del cruce y sin el PNG. Por tanto, **el favicon
  nuevo no se puede ver todavía en la URL publicada**; solo está verificado en local.
- No se ha podido ver el icono en una barra de pestañas real (el navegador de pruebas es headless).
  Tampoco se ha probado Firefox, Safari, iOS ni la caché de iconos de Windows.
- La vectorización es manual desde una foto de 57 × 167 px para la n y 73 × 51 px para la pieza
  superior; no hay vector original del propietario. Se han idealizado la perspectiva, la
  verticalidad de los palos y el grosor constante.
- A 16 px la pieza superior se reduce a una línea de menos de un píxel de grosor: la n domina y el
  conjunto se intuye, pero no se lee con la claridad de 32/48. No se ha creado una versión
  simplificada para 16 px porque sería un dibujo distinto del logotipo.
- No se ha generado `.ico`: el SVG cubre los navegadores actuales y el PNG de 32 hace de respaldo.
- El color sigue sin ser un dato de marca confirmado (ver §12.1).
