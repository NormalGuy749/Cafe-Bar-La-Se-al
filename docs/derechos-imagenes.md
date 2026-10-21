# Derechos de imagen y recursos gráficos

**Fecha:** 21 de octubre de 2026

## 1. Situación actual: cero imágenes

La web **no incluye ninguna fotografía**, ni del establecimiento ni de ningún otro origen.

| Recurso | Estado |
|---|---|
| Fotografías del local | **Ninguna.** No hay galería: no se muestran huecos vacíos |
| Fotografía de portada | **Ninguna.** La portada es una composición tipográfica con la placa-señal |
| Logotipo | **Ninguno.** Marca tipográfica provisional |
| Iconos | **Solo dos dibujos propios en SVG**: el favicon (cruce y punto) y el alfiler del mapa. Ninguno de terceros |
| Fuentes web | **Ninguna.** Solo fuentes instaladas en el sistema |
| Imágenes generadas por IA | **Ninguna** |

Esto no es una carencia técnica, es una decisión: el brief prohíbe reutilizar imágenes de Google Maps, redes sociales o webs de terceros sin permiso documentado, y prohíbe presentar imágenes generadas como fotos del bar.

## 2. Qué se ha descartado y por qué

| Origen | Por qué no se usa |
|---|---|
| Google Maps / Google Business Profile | Las fotos de usuarios y del propietario están sujetas a los términos de Google y a los derechos de quien las subió. Publicarlas en otra web requiere permiso; no se ha obtenido. |
| Instagram / Facebook (publicaciones de APYME Vegas Altas–La Serena) | La cuenta es de la asociación, no del bar. Una publicación que menciona el negocio no transfiere derechos de imagen. |
| Restaurant Guru (galería de 40 fotos) | Agregador: no acredita autoría ni licencia. Además, muchas fichas se nutren de fotos de Google. |
| Prensa local | No se localizó ninguna pieza con permiso explícito de reutilización. |
| Bancos de imágenes gratuitos (Unsplash, Pexels…) | Servirían para «café genérico», pero darían a entender que son el local. Se descarta por honestidad, no por licencia. |

**Ninguna imagen se ha descargado, recortado ni enlazado en caliente (hotlink).**

## 3. Cómo incorporar fotos cuando el propietario las aporte

La versión actual **no tiene sección de galería**: con cero fotos autorizadas, cualquier rejilla
sería un hueco. Cuando lleguen, se añade una sección propia (portada → datos → carta → friso →
dónde estamos → **galería**), con `figure`/`figcaption` y estas reglas:

- tres a cinco fotos como máximo, todas del local;
- `width`/`height` declarados para no provocar saltos de maquetación;
- `loading="lazy"` salvo la primera;
- `alt` descriptivo y real (no palabras clave);
- pie con la autoría cuando la pidan las condiciones del permiso.

`js/config.js` ya reserva el bloque `gallery`, con `status: "pending"` e `items: []`, para no
inventar contenido mientras no haya archivos.

### Requisitos mínimos por fotografía

1. **Autoría identificada** (nombre de quien la hizo).
2. **Permiso de uso web** por escrito, aunque sea un WhatsApp del propietario: quién, qué fotos, para qué web, sin límite de tiempo.
3. **Derechos de las personas retratadas**: si se reconoce a clientes o personal, hace falta su consentimiento (RGPD, art. 6 y 9; imagen según LO 1/1982).
4. **Fotos del local**: si las hizo un fotógrafo profesional para el bar, el permiso debe cubrir la cesión de derechos de explotación, no solo la entrega del archivo.
5. **Sin incrustaciones ajenas**: nada de capturas de Google Maps con la interfaz visible.

### Formato y peso recomendados

| Uso | Tamaño | Formato |
|---|---|---|
| Portada / hero | 1600 × 1000 aprox. | `.webp` (respaldo `.jpg`) |
| Galería | 1200 × 900 aprox. | `.webp`, calidad 80 |
| Logo | SVG si existe; si no, PNG con fondo transparente | — |
| Peso por imagen | < 200 KB | — |

Renombrar en minúsculas y sin acentos (`fachada.webp`, `barra.webp`) y rellenar `alt` con una descripción real, no con palabras clave repetidas.

## 4. Registro de recursos usados

| Archivo | Origen | Licencia / permiso | Crédito en la web |
|---|---|---|---|
| *(ninguno)* | — | — | — |

Cuando se añada el primer recurso, esta tabla es la que hay que completar. Si un recurso no está aquí, no debe estar en la web.

## 5. Nota sobre el mapa incrustado

El mapa de Google **no se carga al abrir la página**: solo se inserta si el visitante pulsa «Cargar mapa», y el texto lo advierte antes. Así la visita inicial no envía datos a Google. Cuando se carga, Google muestra su propia interfaz —incluida, si existe, la valoración de la ficha—, que **no forma parte del contenido de esta web** y no se reproduce en ningún otro sitio de la página.
