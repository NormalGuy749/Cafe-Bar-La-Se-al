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
Reference:  Carta de vinos de taberna + señalética de carretera secundaria + cuaderno de campo.
Palette:    Verde de persiana metálica (base oscura), crema de papel (fondo),
            terracota de teja (único acento), tinta casi negra cálida.
Type:       Palatino/Book Antiqua (serif humanista instalada) para titulares;
            Segoe UI / system sans para interfaz y texto corrido.
            Sin fuentes web: cero peticiones externas, cero parpadeo, licencia del sistema.
Memorable:  El hero es una "señal" física: placa verde con el nombre y un cruce de dos calles
            dibujado con reglas, etiquetado Manzanedo × Roble. El nombre del bar ES la señal.
Restraint:  Sin fotografías falsas, sin degradados, sin glassmorphism, sin tarjetas en rejilla,
            sin iconos decorativos, sin animaciones de entrada aparatosas, sin sombras difusas.
```

**La línea de contención manda:** si aparece una sombra suave grande, un degradado o un icono de adorno, el diseño se ha desviado. Lo único que "flota" es el mapa cargado bajo demanda.

---

## 2. Tokens

```css
:root{
  /* TIPO — una sola ratio, 1.250 (tercera mayor), fluida con clamp() */
  --font-display: "Palatino Linotype","Book Antiqua",Palatino,"Iowan Old Style",Georgia,serif;
  --font-text: "Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;
  --step--1: 0.8rem;    /* 12.8 — metadatos, versalitas */
  --step-0:  1rem;      /* 16 — cuerpo */
  --step-1:  1.25rem;   /* 20 — entradilla */
  --step-2:  1.5625rem; /* 25 — h3 */
  --step-3:  1.953rem;  /* 31 — h2 */
  --step-4:  2.441rem;  /* 39 — h2 grande / cifras */
  --step-5:  3.052rem;  /* 49 — h1 móvil */
  --step-6:  3.815rem;  /* 61 — h1 escritorio */
  --step-7:  4.768rem;  /* 76 — placa del hero */

  /* ESPACIO — base 4px, sin valores intermedios */
  --space-3xs: 0.25rem; --space-2xs: 0.5rem;  --space-xs: 0.75rem;
  --space-s:   1rem;    --space-m:   1.5rem;  --space-l:  2rem;
  --space-xl:  3rem;    --space-2xl: 4.5rem;  --space-3xl: 7rem;

  /* COLOR — rampa, no valores sueltos */
  --base:     #F5EBDD;  /* fondo página (crema) */
  --surface:  #FFFDF8;  /* superficies elevadas (blanco cálido) */
  --ink:      #282722;  /* texto principal */
  --ink-2:    #5A564C;  /* texto secundario */
  --ink-3:    #7A7466;  /* metadatos */
  --line:     #DCD0BC;  /* reglas y bordes */
  --green:    #243B30;  /* banda oscura, botón primario */
  --green-2:  #1B2D24;  /* verde más profundo, hover */
  --accent:   #B96F43;  /* terracota: marcas, reglas, texto grande */
  --accent-ink:#8E4A28; /* terracota oscura: texto pequeño y enlaces */
  --on-dark:  #F7F1E6;  /* texto sobre verde */

  /* FORMA — un radio, cero o dos sombras */
  --radius: 2px;
  --border: 1px solid var(--line);
  --shadow-near: 0 1px 2px rgba(40,39,34,.08);
  --shadow-far:  0 18px 40px -28px rgba(40,39,34,.45);

  /* MOVIMIENTO — tres duraciones, dos curvas */
  --dur-fast: 120ms; --dur: 220ms; --dur-slow: 420ms;
  --ease: cubic-bezier(.2,0,0,1);
  --ease-out: cubic-bezier(.16,1,.3,1);
}
```

### Contraste (WCAG 2.2 AA)

| Combinación | Ratio | Uso | Veredicto |
|---|---|---|---|
| `--ink` #282722 sobre `--base` #F5EBDD | **12,7:1** | cuerpo | AA/AAA |
| `--ink-2` #5A564C sobre `--base` | **6,7:1** | secundario | AA |
| `--ink-3` #7A7466 sobre `--base` | **3,9:1** | solo metadatos ≥ 18,66 px bold / 24 px | revisar en pruebas |
| `--accent-ink` #8E4A28 sobre `--base` | **5,6:1** | enlaces y texto pequeño | AA |
| `--accent` #B96F43 sobre `--base` | **3,3:1** | **solo** texto grande y elementos no textuales | no apto para cuerpo |
| `--on-dark` #F7F1E6 sobre `--green` #243B30 | **10,2:1** | texto sobre banda verde | AA/AAA |
| `--accent` sobre `--green` | **3,1:1** | filetes y marcas, no texto | límite |
| `--surface` #FFFDF8 sobre `--green` | **11,9:1** | botón primario | AA/AAA |

Regla derivada: **la terracota nunca es color de cuerpo de texto**. Para texto pequeño se usa `--accent-ink`; `--accent` se reserva para reglas, numeración, marcas y titulares grandes.

**Pendiente de verificación en navegador:** los ratios se han calculado a mano; `docs/pruebas.md` recoge la medición real con los estilos computados. `--ink-3` se sube a `#6E6859` si no alcanza 4,5:1 donde se use como texto normal.

---

## 3. Jerarquía y estructura

Una sola página, orden narrativo: **qué es → qué se puede pedir → cómo es por dentro → qué dicen → dónde está → cómo contactar**.

| # | Sección | Fondo | Rol en la jerarquía |
|---|---|---|---|
| — | Aviso de propuesta (banda superior) | verde | Contexto: no es la web oficial |
| A | Cabecera | crema | Identificación tipográfica + nav + CTA |
| B | Hero | verde | El momento memorable: la placa-señal |
| C | Carta | crema | Estado «pendiente», honesto y visualmente resuelto |
| D | Galería | superficie | Marcadores provisionales, no fotos falsas |
| E | Reseñas | verde | Un CTA, con aviso de ficha no verificada |
| F | Ubicación | crema | Dirección real, horario publicado, mapa bajo demanda |
| G | Contacto | superficie | Teléfono provisional, WhatsApp condicionado |
| H | Pie | verde | Créditos, aviso de propuesta, requisitos legales |

**Ritmo vertical variable:** el hero y la ubicación respiran (`--space-3xl`), carta y galería son más densas (`--space-2xl`), las bandas verdes rompen con padding generoso. No hay una sección con el mismo ritmo que otra.

### Romper la rejilla, una vez

El bloque de la carta usa un **ancho editorial de dos columnas** con la etiqueta «pendiente» sangrando en el margen izquierdo en escritorio (fuera del contenedor de texto). Es la única ruptura deliberada de la columna central.

---

## 4. Tipografía

- **Titulares:** Palatino Linotype / Book Antiqua / Georgia. Humanista, cálida, con historias propias; no es Inter ni una sans de sistema.
- **Texto e interfaz:** Segoe UI / system sans. Neutra, ya instalada, sin coste de red.
- **Cuerpo:** `--step-0`, `line-height: 1.65`, medida `62ch` máximo. Sin `letter-spacing` añadido.
- **Titulares:** `line-height: 1.1`, `letter-spacing: -0.01em`, `text-wrap: balance`.
- **Versalitas de sección:** sans, `--step--1`, mayúsculas, `letter-spacing: .12em`, color `--ink-3`. Es el hilo que une las secciones.
- **Tres pesos como máximo:** 400 y 600 de la sans, 400 de la serif.

---

## 5. Comportamiento (UX)

Flujo principal: *llego desde Google o desde el móvil del propietario → entiendo qué es → decido cómo llegar o qué pedir*.

| Elemento | Comportamiento |
|---|---|
| Nav de escritorio | Anclas internas, subrayado en hover/focus, sección activa no se marca (una sola página, sin scrollspy artificial) |
| Menú móvil | `<button aria-expanded aria-controls>` que abre un panel; cierra con Escape, con clic fuera y al elegir destino; devuelve el foco al botón |
| CTA cabecera | «Cómo llegar» → Google Maps con la dirección |
| Hero | «Cómo llegar» (primario) + «Ver la carta» (secundario con filete) |
| Carta | Estado pendiente con las categorías documentadas; sin platos, sin precios |
| Galería | Marcos provisionales con etiqueta; sin imágenes externas |
| Reseñas | Botón a búsqueda de Google Maps + aviso de que la ficha no está verificada |
| Mapa | **No se carga al abrir**: botón «Cargar mapa» inyecta el iframe de Google Maps. Antes de cargar se avisa de que Google recibirá la visita. Si el JS falla, hay un enlace a Maps |
| Teléfono | Se muestra como texto, **sin `tel:`**, mientras `status !== "verified"` |
| WhatsApp | **Oculto** mientras `whatsapp.status !== "verified"` |
| Formulario | **No existe** (no hay servicio de envío) |

### Estados definidos

- **Reposo / hover / active / focus-visible / disabled** en todos los botones y enlaces.
- **Carga del mapa:** reposo → cargando (`aria-busy`, texto «Cargando mapa…») → cargado (iframe) o error (mensaje + enlace a Maps).
- **Aviso de propuesta:** estado permanente, no descartable.
- **Sin JS:** la página sigue siendo legible; el menú móvil es un `<details>` y el mapa es un enlace.

---

## 6. Accesibilidad por diseño

- Landmarks: `header`, `nav`, `main`, `footer`; un solo `h1`.
- Enlace «Saltar al contenido» visible al foco.
- `:focus-visible` de 2 px con `outline-offset: 3px`, color `--accent-ink` sobre claro y `--accent` sobre verde.
- Objetivos táctiles ≥ 44×44 px (padding generoso en nav y botones).
- `prefers-reduced-motion`: se anulan transiciones y el desplazamiento suave.
- Contraste medido, no estimado (ver tabla).
- Ningún estado se comunica solo por color: la etiqueta «pendiente» lleva texto.

## 7. Rendimiento

Cero peticiones externas en la carga inicial: sin fuentes web, sin iconos, sin imágenes, sin analítica, sin JS de terceros. El iframe de Maps es la única petición externa y solo ocurre si el visitante pulsa «Cargar mapa». Presupuesto: HTML + CSS + JS propios < 60 KB sin comprimir.

## 8. Lo que NO se hace (contención)

- No se imita un logotipo: la marca es tipográfica y se declara provisional.
- No se usan fotografías de Google Maps, redes o prensa.
- No se usan imágenes generadas por IA simulando el local.
- No hay valoraciones, estrellas, testimonios ni «los mejores».
- No hay horarios en datos estructurados ni promesas de posicionamiento.
- No hay redes sociales enlazadas porque ninguna está confirmada.
