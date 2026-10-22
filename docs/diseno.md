# Diseño — «Bar de barrio con carácter»

Dirección visual: **tradición extremeña, calidez y diseño contemporáneo**.
Documento escrito **antes** del código, según la skill `designing-frontend-interfaces` (Iron Law: no component code before the brief and token block exist).

---

## 1. Brief (8 líneas)

```
Purpose:    Presentar al propietario una propuesta de web para Café-Bar La Señal y,
            si la aprueba, servir como web real del local: qué es, cómo llegar, qué se puede pedir.
Audience:   Vecinos de Don Benito y visitantes de paso; mayoría en móvil, a pie o en coche,
            buscando desayuno, café o una ración. El propietario la verá en escritorio.
Tone:       Bar de barrio con carácter — editorial cálido, de andar por casa pero cuidado.
Reference:  Carta de taberna + señalética de carretera secundaria + cuaderno de campo.
Palette:    Verde de persiana metálica (base oscura), crema de papel (fondo),
            terracota de teja (único acento), tinta casi negra cálida.
Type:       Palatino/Book Antiqua (serif humanista instalada) para titulares;
            Segoe UI / system sans para interfaz y texto corrido.
            Sin fuentes web: cero peticiones externas, cero parpadeo, licencia del sistema.
Memorable:  El hero es la fachada real del local, enmarcada sobre el verde, con el rótulo del bar.
            El cruce de Manzanedo × Roble se mantiene dibujado en el friso.
Restraint:  Sin fotos de stock, sin degradados, sin glassmorphism, sin tarjetas en rejilla,
            sin iconos decorativos, sin animaciones aparatosas, sin sombras difusas.
```

**La línea de contención manda:** si apareciera una sombra grande, un degradado o un icono de
adorno, el diseño se habría desviado. Lo único que «flota» es la placa del hero y el mapa cuando
se carga.

---

## 2. Tokens

```css
:root{
  /* TIPO — una sola ratio, 1.250 (tercera mayor), títulos fluidos con clamp() */
  --font-display: "Palatino Linotype","Book Antiqua",Palatino,"Iowan Old Style",Georgia,serif;
  --font-text:    "Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;
  --step--1: 0.875rem;   /* 14   — metadatos, versalitas */
  --step-0:  1rem;       /* 16   — cuerpo */
  --step-1:  1.25rem;    /* 20   — entradilla */
  --step-2:  1.5625rem;  /* 25   — h3 */
  --step-3:  1.953rem;   /* 31,25 */
  --step-4:  2.441rem;   /* 39   — h2 */
  --step-5:  3.052rem;   /* 48,8 */
  --step-6:  3.815rem;   /* 61   — nombre en la placa */
  --step-7:  4.768rem;   /* 76   — h1 en escritorio */

  /* ESPACIO — base 4px, sin valores intermedios */
  --space-3xs: .25rem; --space-2xs: .5rem; --space-xs: .75rem;
  --space-s:   1rem;   --space-m:  1.5rem; --space-l:  2rem;
  --space-xl:  3rem;   --space-2xl: 4.5rem; --space-3xl: 7rem;

  /* COLOR — rampa, no valores sueltos */
  --base:      #F5EBDD;  --surface: #FFFDF8;  --paper: #EFE4D3;
  --ink:       #282722;  --ink-2:   #5A564C;  --ink-3: #6E6859;
  --line:      #DCD0BC;
  --green:     #243B30;  --green-2: #1B2D24;
  --accent:    #B96F43;  --accent-ink: #8E4A28;
  --on-dark:   #F7F1E6;

  /* FORMA — un radio, dos sombras */
  --radius: 2px;
  --border: 1px solid var(--line);
  --shadow-near: 0 1px 2px rgba(40,39,34,.08);
  --shadow-far:  0 18px 40px -28px rgba(40,39,34,.45);

  /* MOVIMIENTO — dos duraciones, una curva */
  --dur-fast: 120ms; --dur: 220ms;
  --ease: cubic-bezier(.2,0,0,1);
}
```

### Contraste (WCAG 2.2 AA) — medido sobre los valores finales

| Combinación | Ratio | Uso | Veredicto |
|---|---|---|---|
| `--ink` #282722 sobre `--base` | **12,69:1** | cuerpo | AAA |
| `--ink-2` #5A564C sobre `--base` | **6,21:1** | secundario | AA |
| `--ink-3` #6E6859 sobre `--base` | **4,70:1** | metadatos | AA (se oscureció desde #7A7466, que daba 3,9:1) |
| `--accent-ink` #8E4A28 sobre `--base` | **5,64:1** | enlaces y texto pequeño | AA |
| `--accent` #B96F43 sobre `--base` | **3,29:1** | **solo** elementos no textuales | no apto para texto |
| `--on-dark` #F7F1E6 sobre `--green` | **10,72:1** | texto sobre banda verde | AAA |
| `--surface` #FFFDF8 sobre `--green` | **11,85:1** | botón primario | AAA |
| `--accent` sobre `--green` | **3,11:1** | filetes y marcas | ✅ gráfico |

Regla derivada: **la terracota nunca es color de cuerpo de texto**. Para texto pequeño se usa
`--accent-ink`; `--accent` se reserva para reglas, numeración, marcas y titulares grandes.

Los valores están comprobados en `docs/pruebas.md` §3 con los estilos computados del navegador.

---

## 3. Jerarquía y estructura

Una sola página, orden narrativo: **qué es → dónde y cuándo → qué se puede pedir → cómo es por fuera → dónde está y cómo contactar**.

| # | Sección | Fondo | Rol |
|---|---|---|---|
| — | Aviso de propuesta | crema oscuro | Contexto: no es la web oficial |
| A | Cabecera | crema | Marca tipográfica + nav + CTA |
| B | Portada | verde | El momento memorable: la fachada real, el nombre y las dos acciones |
| C | Datos de un vistazo | blanco cálido | Dirección, horario publicado y teléfono en una pasada |
| D | La carta | crema | Estado «pendiente», honesto, y tres fotografías de platos sin nombres |
| E | Friso ilustrado | verde | El edificio y el cruce, dibujados en SVG |
| F | Dónde estamos | crema | Dirección, fachada, mapa bajo demanda, horario, contacto y opiniones |
| G | Pie | verde | Marca, dirección, navegación y aviso de propuesta |

**Ritmo vertical variable:** portada y «dónde estamos» respiran (`--space-2xl`/`--space-3xl`), los
datos de un vistazo son una banda compacta y el friso es una pausa visual entre dos secciones de
texto. No hay dos secciones con el mismo ritmo.

### Romper la rejilla, una vez

El friso: una ilustración a sangre dentro del ancho de la página, sin tarjeta ni marco, que corta
la sucesión de bloques de texto. Es la única ruptura deliberada de la columna central y no repite
el mensaje de ninguna otra sección.

---

## 4. Tipografía

- **Titulares:** Palatino Linotype / Book Antiqua / Georgia. Humanista, cálida, con carácter; no
  es Inter ni una sans de sistema.
- **Texto e interfaz:** Segoe UI / system sans. Neutra, ya instalada, sin coste de red.
- **Cuerpo:** `--step-0`, `line-height: 1.65`, medida máxima `46–56ch`. Sin `letter-spacing`.
- **Titulares:** `line-height: 1.1` (hero `.92`), `letter-spacing: -0.01em`, `text-wrap: balance`.
- **Versalitas de sección:** sans, `--step--1`, mayúsculas, `letter-spacing: .16em`, `--ink-3`.
- **Pesos:** 400 y 600 en la sans, 400 en la serif.

**Sin fuentes web.** No hay `@font-face` ni enlaces a Google Fonts: cero peticiones, cero
parpadeo, sin dependencia de licencias de terceros. El coste asumido es que en Linux sin Palatino
el titular cae a Georgia, que mantiene el tono.

Medido en el navegador: **2 familias**, **7 tamaños visibles** (14 · 16 · 20 · 25 · 31,25 · 39,06 ·
76,29 px), **1 radio** (2 px, más círculos al 50 %) y **2 sombras**. El único 24 px que aparece en
el DOM es el `h2.sr-only`, que no se ve.

---

## 5. Comportamiento (UX)

Flujo principal: *llego desde Google o desde el móvil del propietario → entiendo qué es → decido
cómo llegar o qué pedir*.

| Elemento | Comportamiento |
|---|---|
| Nav de escritorio | Anclas internas, subrayado terracota en hover/focus |
| Menú móvil | `<details>/<summary>` nativo; cierra con Escape (y devuelve el foco), con clic fuera y al elegir destino |
| CTA cabecera | «Cómo llegar» → indicaciones de Google Maps |
| Hero | «Cómo llegar» (primario) + «Ver la carta» (secundario con filete) |
| Carta | Estado pendiente con categorías documentadas; sin platos ni precios |
| Fotos de platos | Tres, con pie de sección que aclara que nombres y precios llegarán con la carta confirmada. Sin pies individuales ni nombres inventados; el `alt` describe lo que se ve |
| Friso | SVG decorativo (`aria-hidden`), con pie que aclara que no es una fotografía. Por debajo de 48rem el dibujo se sustituye por el cruce escrito —«Calle Manzanedo × Calle Roble»—, porque a ese tamaño sus rótulos quedarían a 5–7 px |
| Opiniones | Enlace a búsqueda de Google Maps + aviso de ficha no verificada |
| Mapa | **No se carga al abrir**: botón «Cargar mapa» inyecta el iframe. Antes avisa de que Google recibirá la visita. Estados: reposo → cargando (`aria-busy`) → cargado / error. Al cargar, el foco pasa a la región `#map` (el botón que lo tenía desaparece con la fachada) |
| Pie | Navegación de cuatro enlaces: 2×2 en móvil, una columna desde 40rem, 44 px por enlace |
| Teléfono | Texto sin `tel:` mientras `status !== "verified"` |
| WhatsApp | Oculto mientras `whatsapp.status !== "verified"` |
| Formulario | No existe (no hay servicio de envío) |

### Estados definidos

Reposo, hover, active, focus-visible y disabled en todos los controles. Carga del mapa con
`aria-busy` y región viva. Aviso de propuesta permanente, no descartable. **Sin JS** la página
sigue siendo legible: el menú es `<details>` y el mapa es un enlace.

---

## 6. Accesibilidad por diseño

- Landmarks `header`/`nav`/`main`/`footer`; un solo `h1`; tres `nav` con `aria-label`.
- Enlace «Saltar al contenido» visible al foco.
- `:focus-visible` de 2 px, `outline-offset: 3px`: verde sobre claro, crema sobre oscuro.
- Objetivos táctiles de 44 px en botones, menú y enlaces del pie.
- `prefers-reduced-motion` anula transiciones y desplazamiento suave.
- Contraste medido, no estimado: 87 nodos de texto, 0 fallos, mínimo 4,70:1.
- Los elementos ocultos usan `hidden` y el CSS lo respeta con `[hidden]{display:none !important}`:
  una regla de componente con `display` no puede reabrir un bloque oculto.
- El foco nunca se pierde: al desaparecer un control, pasa a un destino con nombre (la región del
  mapa) en lugar de caer al `body`.

## 7. Rendimiento

Sin fuentes web, sin librerías de iconos, sin analítica y sin peticiones externas distintas del mapa. La
portada carga una única foto (109 KB, `fetchpriority="high"`); las otras cuatro (≈315 KB) van en
diferido y solo se descargan al acercarse. El iframe de Maps sigue cargándose solo al pulsar
«Cargar mapa».

Medido: **59,3 KB de código sin comprimir** (HTML 17,9 + CSS 23,8 + JS 15,8 + favicons 1,8 KB) y
**≈17,1 KB con gzip**; 423 KB de fotos en total. Presupuesto: código propio < 60 KB sin comprimir.

## 8. Lo que NO se hace (contención)

- No se imita un logotipo ajeno: el único símbolo de marca es el logotipo del rótulo del local
  (la flecha con zigzag y la n), vectorizado desde una fotografía. El resto de la identidad sigue
  siendo tipográfica y se declara provisional.
- No se usan fotos de Google Maps, redes o prensa.
- No se usan imágenes generadas por IA simulando el local.
- No hay valoraciones, estrellas, testimonios ni «los mejores».
- No hay horarios en datos estructurados ni promesas de posicionamiento.
- No hay redes sociales enlazadas porque ninguna está confirmada.
