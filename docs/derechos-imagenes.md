# Derechos de imagen y recursos gráficos

**Última revisión:** 22 de octubre de 2026

## 1. Situación actual: ocho fotos del local integradas

El proyecto contiene fotografías aportadas para la propuesta en `images/`. Se han integrado las
ocho; no queda ninguna sin usar.

| Recurso | Estado |
|---|---|
| Fotografía de portada | `assets/images/fachada.jpg`: fachada completa con el rótulo, enmarcada sobre el verde |
| Fachada en «Dónde estamos» | `assets/images/fachada-calle.jpg`: detalle del rótulo y la entrada |
| Fotografías de platos en la portada | `plato-cachopo.jpg`, `plato-pulpo.jpg` y `plato-jamon.jpg`, en la sección de la carta |
| Fotografías de platos en la carta visual | Las seis: `plato-cachopo`, `plato-pulpo`, `plato-jamon`, `plato-huevos-jamon`, `plato-nachos` y `plato-calamares`, una por ficha |
| Autoría y permiso | **No constan por escrito en el repositorio.** Hay que confirmarlos antes de publicar |
| Galería | **No hay**: cada foto tiene una función, no forman una rejilla suelta |
| Logotipo | **La flecha con zigzag y la n del rótulo**, vectorizadas desde la foto de la fachada (ver §4). El propietario confirmó el 22/10/2026 que la flecha y el zigzag forman parte del logotipo. No hay archivo vectorial original |
| Iconos | **Dos dibujos propios en SVG**: el favicon con el logotipo del rótulo y el alfiler del mapa. Ninguno de terceros |
| Fuentes web | **Ninguna.** Solo fuentes instaladas en el sistema |
| Imágenes generadas por IA | **Ninguna** |

Los originales están en `images/`; las versiones web, en `assets/images/` (JPEG, 345–1000 px,
≈530 KB en total). Solo se han redimensionado y recomprimido, salvo dos recortes de encuadre: en
`plato-huevos-jamon.jpg` se elimina el pie con la marca de fecha de la cámara y en `plato-nachos.jpg`
se ajusta el borde inferior. En ambos casos el recorte no quita comida del plato.

El favicon no es una foto: es un trazado vectorial de la flecha, el zigzag y la n del rótulo, hecho
a mano a partir de `images (3).jpg`. Se ha idealizado la perspectiva y el grosor, y el color se ha
fijado en `#B58056`, tomado de la foto a pleno sol (la toma en sombra da `#7E6A52`). **No es un
color de marca confirmado**: la pintura real del rótulo puede ser algo más clara u oscura.

Las fotos integradas proceden de los archivos aportados con el proyecto, no de Google Maps,
redes ni webs de terceros. Se mantiene la prohibición de reutilizar imágenes ajenas sin permiso
documentado y de presentar imágenes generadas como fotos del bar.

## 2. Qué se ha descartado y por qué

| Origen | Por qué no se usa |
|---|---|
| Google Maps / Google Business Profile | Las fotos de usuarios y del propietario están sujetas a los términos de Google y a los derechos de quien las subió. Publicarlas en otra web requiere permiso; no se ha obtenido. |
| Instagram / Facebook (publicaciones de APYME Vegas Altas–La Serena) | La cuenta es de la asociación, no del bar. Una publicación que menciona el negocio no transfiere derechos de imagen. |
| Restaurant Guru (galería de 40 fotos) | Agregador: no acredita autoría ni licencia. Además, muchas fichas se nutren de fotos de Google. |
| Prensa local | No se localizó ninguna pieza con permiso explícito de reutilización. |
| Bancos de imágenes gratuitos (Unsplash, Pexels…) | Servirían para «café genérico», pero darían a entender que son el local. Se descarta por honestidad, no por licencia. |

**Ninguna imagen se ha descargado, recortado ni enlazado en caliente (hotlink).**

## 3. Cómo se han incorporado las fotos

No hay galería: las tres fotos de la portada se presentan dentro de la sección de la carta y las
seis de la carta visual, en fichas ordenadas con su `alt`, sin formar una rejilla suelta. Las dos
fachadas se usan en la portada y en «Dónde estamos».

Reglas aplicadas:

- ocho fotos en total (seis de platos y dos de fachada), todas del local, cada una con una función;
- `width`/`height` reales para no provocar saltos de maquetación;
- `loading="lazy"` en todas salvo la portada;
- `alt` descriptivo de lo que se ve, sin nombres de platos ni palabras clave;
- sin recortes que cambien lo que representa la imagen: solo se quitó el pie con la fecha de la cámara en una foto y se ajustó el borde inferior en otra;
- sin pies con autoría porque la autoría aún no consta.

Queda pendiente añadir el crédito si el permiso lo exige y documentar por escrito la cesión.

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

| Archivo web | Original | Uso | Licencia / permiso | Crédito en la web |
|---|---|---|---|---|
| `assets/images/fachada.jpg` | `images/interior-exterior_del_bar/cafebarlasealdonbenito.jpg` | Portada | Aportado para la propuesta; **permiso escrito pendiente** | No |
| `assets/images/fachada-calle.jpg` | `images/interior-exterior_del_bar/images (3).jpg` | «Dónde estamos» | Aportado para la propuesta; **permiso escrito pendiente** | No |
| `assets/images/plato-cachopo.jpg` | `images/platos/WhatsApp Image 2026-10-22 at 3.14.32 PM.jpeg` | Carta, cocina | Aportado para la propuesta; **permiso escrito pendiente** | No |
| `assets/images/plato-pulpo.jpg` | `images/platos/images (2).jpg` | Carta, cocina | Aportado para la propuesta; **permiso escrito pendiente** | No |
| `assets/images/plato-jamon.jpg` | `images/platos/Captura de pantalla 2026-10-22 151747.png` | Carta, cocina | Aportado para la propuesta; **permiso escrito pendiente** | No |
| `assets/images/plato-huevos-jamon.jpg` | `images/platos/images (1).jpg` | Carta visual, ficha | Aportado para la propuesta; **permiso escrito pendiente** | No |
| `assets/images/plato-nachos.jpg` | `images/platos/images.jpg` | Carta visual, ficha | Aportado para la propuesta; **permiso escrito pendiente** | No |
| `assets/images/plato-calamares.jpg` | `images/platos/Captura de pantalla 2026-10-22 151456.png` | Carta visual, ficha | Aportado para la propuesta; **permiso escrito pendiente** | No |
| `assets/favicon.svg` y `assets/favicon-32.png` | `images/interior-exterior_del_bar/images (3).jpg` (logotipo: flecha, zigzag y n) | Favicon | Trazado propio desde la foto; **permiso escrito pendiente** | No |

Los ocho originales aportados están en uso. Los archivos de `images/` se conservan intactos, sin
recortes ni cambios.

Si un recurso no está en esta tabla, no debe estar en la web.

## 5. Nota sobre el mapa incrustado

El mapa de Google **no se carga al abrir la página**: solo se inserta si el visitante pulsa «Cargar mapa», y el texto lo advierte antes. Así la visita inicial no envía datos a Google. Cuando se carga, Google muestra su propia interfaz —incluida, si existe, la valoración de la ficha—, que **no forma parte del contenido de esta web** y no se reproduce en ningún otro sitio de la página.
