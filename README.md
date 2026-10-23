# Café-Bar La Señal — propuesta de web

Landing page en español para un café-bar de barrio en Don Benito (Badajoz).
**HTML, CSS y JavaScript vanilla. Sin frameworks, sin dependencias, sin backend.**

> **Esta web no es la oficial del establecimiento.** Es una propuesta de diseño pendiente de la
> aprobación del propietario. El aviso se ve en la franja superior y en el pie.
> No se ha publicado, desplegado ni registrado ningún dominio, y no se ha contactado con el
> negocio.

## Estructura

```
index.html                      Marcado y textos de la portada
carta.html                      Carta visual: selección provisional de platos
css/styles.css                  Sistema visual (tokens + componentes y estilos de la carta)
js/config.js                    Datos variables, estados de verificación y URLs
js/main.js                      Comportamiento (enlaces, horario, menú, mapa)
assets/favicon.svg              Logotipo del rótulo (flecha, zigzag y n) vectorizado (1,1 KB)
assets/favicon-32.png           Respaldo PNG 32×32 del mismo logotipo (0,7 KB)
assets/images/                  Fotos optimizadas para la web: fachada y seis platos
images/                         Fotografías originales aportadas para la propuesta (sin tocar)
docs/investigacion.md           Fuentes, datos confirmados y discrepancias
docs/diseno.md                  Brief, tokens, contraste, jerarquía y comportamiento
docs/derechos-imagenes.md       Política de imágenes y cómo incorporar las del propietario
docs/pendientes-propietario.md  Qué falta y las preguntas para el dueño
docs/pruebas.md                 Pruebas ejecutadas, resultados y limitaciones
docs/capturas/                  Capturas: histórico + carpeta de la versión actual
docs/capturas/2026-10-22/       Capturas de la portada (viewport exacto por CDP)
docs/capturas/2026-10-22-carta/ Capturas de la carta visual
pruebas/serve.mjs               Servidor local mínimo (Node, sin dependencias)
pruebas/build-render-check.mjs  Genera la copia de un solo archivo
pruebas/check.mjs               Comprobaciones estáticas de la portada
pruebas/check-carta.mjs         Comprobaciones estáticas de la carta
pruebas/capturas.mjs            Capturas con viewport exacto (Chrome + CDP)
pruebas/render-check.html       Copia generada (no editar)
```

## Secciones de la página

1. **Portada**: nombre, qué es, dónde está, a qué se dedica, dos acciones reales («Cómo llegar»,
   «Ver la carta») y la fotografía de la fachada enmarcada.
2. **Datos de un vistazo**: dirección, horario publicado y teléfono, con su estado.
3. **La carta**: estado honesto (no hay carta publicada), las tres categorías citadas en guías y
   tres fotografías de platos sin nombres ni precios, con el enlace a la carta visual.

La **carta visual** (`carta.html`) es una subpágina aparte: seis platos que se reconocen en las
fotos del local, sin precios, alérgenos ni disponibilidad. No es la carta oficial y lo dice en la
entrada, en el cierre y en el pie.
4. **Friso**: el cruce de Manzanedo con Roble dibujado en SVG, con el rótulo del bar. Por debajo
   de 48rem el dibujo se sustituye por la banda escrita «Calle Manzanedo × Calle Roble».
5. **Dónde estamos**: dirección, fotografía de la fachada, mapa bajo demanda, horario, contacto y
   opiniones en Google.
6. **Pie**: marca, dirección, navegación y aviso de propuesta.

No hay galería aparte ni sección de reseñas: las fotos están integradas con una función concreta
(portada, cocina y llegada) y la ficha de Google sigue sin verificar. Ver
`docs/derechos-imagenes.md`.

## Qué se puede cambiar y dónde

Casi todo lo variable vive en `js/config.js`:

| Quiero… | Toca |
|---|---|
| Poner la carta real | `menu.status = "ready"` y rellenar `menu.categories` |
| Publicar el teléfono como enlace de llamada | `phone.status = "verified"` |
| Mostrar el botón de WhatsApp | `whatsapp.status = "verified"` y `whatsapp.number` |
| Enlazar la ficha de Google | `reviews.status = "verified"` y `reviews.url` |
| Confirmar el horario | `hours.status = "verified"` (y corregir `hours.days`) |
| Quitar el aviso de propuesta | `proposal.active = false` **solo** con la aprobación del dueño |

Los textos largos están en `index.html`. La dirección aparece allí y también en `config.js` (para
construir las URL de mapas): si cambia, hay que actualizar los dos sitios.

## Decisiones técnicas

- **Sin fuentes web**: Palatino/Georgia para titulares y Segoe UI/system sans para texto. Cero
  peticiones externas, cero parpadeo, ninguna licencia de terceros.
- **Fotografías reales, optimizadas**: los originales de `images/` se convierten a JPEG de 416–1000
  px en `assets/images/` (≈423 KB en total). La fachada de la portada carga con la página
  (`fetchpriority="high"`); el resto, en diferido. `width`/`height` reales para no provocar saltos.
- **Favicon de marca**: el logotipo del rótulo del local —la flecha con zigzag y la n—,
  vectorizado desde la foto de la fachada, con el verde y el tan de la propia web. El SVG es el
  icono principal y hay un PNG de 32 px de respaldo. Las URL llevan `?v=20261022` para que el
  navegador no reutilice el icono anterior. No se ha inventado ningún símbolo ni se ha usado una
  tipografía parecida.
- **La identidad sigue en el cruce**: el plano de la placa se retira de la portada —la foto ocupa
  ese lugar—, pero el friso ilustrado mantiene el dibujo del cruce y del rótulo.
- **La carta, a dos columnas** desde 56rem: estado y fuente a la izquierda, categorías a la derecha.
  En móvil y tablet vuelve a una columna.
- **La carta visual reutiliza el sistema**: misma cabecera, botones, tokens, pie y `js/main.js`; solo
  añade estructuras propias (entrada, pieza destacada, fichas). No hay CSS ni JavaScript duplicados,
  y las seis fichas usan fotos del local con `alt` descriptivo. Sin precios, sin alérgenos, sin citas
  de reseñas: los nombres se contrastaron con las reseñas públicas de Wanderlog (cachopo y nachos).
- **`hidden` se respeta** con `[hidden]{display:none !important}`: ninguna regla de componente
  puede reabrir un bloque oculto (pasaba con `#menu-ready`).
- **El foco no se pierde** al cargar el mapa: pasa a la región `#map`, no al `body`.
- **Mapa bajo demanda**: el iframe de Google se inyecta solo al pulsar «Cargar mapa», para no
  enviar la IP del visitante a Google sin permiso.
- **Enlaces de mapa por dirección**, nunca por coordenadas inventadas:
  `google.com/maps/dir/?api=1&destination=…` y `…/search/?api=1&query=…`.
- **Datos estructurados mínimos**: `CafeOrCoffeeShop` con nombre y dirección. Sin teléfono, sin
  horario, sin precios, sin valoraciones, sin coordenadas.
- **Canonical y `og:url`** apuntan a la URL real de GitHub Pages; `robots: noindex` mientras sea
  una propuesta no oficial.
- **Sin analítica, sin cookies, sin formularios.**
