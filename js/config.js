/* ============================================================
   Café-Bar La Señal — configuración
   ------------------------------------------------------------
   Único sitio donde se cambian los datos variables y los estados.
   La estructura y los textos viven en index.html; aquí van las
   URL, los estados de verificación y el contenido sustituible.

   REGLA: si un dato no está confirmado por el propietario, su
   estado se queda en "pending" y la interfaz lo dice. No pongas
   "verified" sin tener la confirmación.
   ============================================================ */

window.LA_SENAL = {
  /* ---------- Negocio ---------- */
  business: {
    name: "Café-Bar La Señal",
    shortName: "La Señal",
    category: "Cafetería-bar",
    street: "Calle Manzanedo, esquina con calle Roble",
    postalCode: "06400",
    town: "Don Benito",
    province: "Badajoz",
    region: "Extremadura",
    country: "ES",

    /* La URL de mapas se construye con la dirección postal, no con
       coordenadas: no se han verificado coordenadas propias. */
    mapsQuery:
      "Café-Bar La Señal, Calle Manzanedo esquina calle Roble, 06400 Don Benito, Badajoz",
  },

  /* ---------- Teléfono ----------
     Hay tres números distintos publicados en directorios
     (924 96 56 69, 924 18 96 47, 673 42 15 52). Mientras no haya
     confirmación del propietario: status "pending" y SIN enlace tel:.
     Cambia a "verified" solo con confirmación directa. */
  phone: {
    display: "924 96 56 69",
    status: "pending", // "pending" | "verified"
    note: "Publicado en fichas de directorios. Pendiente de confirmar con el local.",
  },

  /* ---------- WhatsApp ----------
     No se ha confirmado ningún número de WhatsApp del negocio.
     El botón NO se muestra mientras status !== "verified".
     Cuando lo confirmen: number en formato internacional sin "+" ni
     espacios (ej. "34673421552") y status "verified". */
  whatsapp: {
    number: "",
    status: "pending", // "pending" | "verified"
    message: "Hola, quería preguntar por el bar.",
  },

  /* ---------- Reseñas ----------
     No se ha localizado la ficha de Google del negocio (ni URL ni
     Place ID). Mientras status sea "pending", el botón abre una
     BÚSQUEDA de Google Maps, no la ficha. */
  reviews: {
    status: "pending", // "pending" | "verified"
    url: "", // pegar aquí la URL directa de la ficha cuando se verifique
    note: "La ficha de Google no está verificada: el botón abre una búsqueda con el nombre y la dirección.",
  },

  /* ---------- Horario ----------
     Horario publicado por Turismo Badajoz (Diputación) y
     Restaurant Guru. Coinciden entre sí, pero no está confirmado por
     el propietario. No se incluye en datos estructurados. */
  hours: {
    status: "published", // "published" | "verified"
    note: "Horario publicado en fichas públicas. Pendiente de confirmar con el local antes de fiarse.",
    days: [
      { day: "Lunes", value: "Cerrado" },
      { day: "Martes a jueves", value: "6:30 – 24:00" },
      { day: "Viernes y sábado", value: "6:30 – 1:00" },
      { day: "Domingo", value: "6:30 – 17:00" },
    ],
  },

  /* ---------- Carta ----------
     No existe carta publicada. Con status "pending" se muestra el
     estado honesto con las categorías documentadas y ningún plato ni
     precio. Para publicar la carta real:
       1. status: "ready"
       2. rellena "categories" con { name, items:[{name, price, note}] }
     Uso interno de la web; se borra el bloque de "pendiente". */
  menu: {
    status: "pending", // "pending" | "ready"
    note: "No hay carta publicada del establecimiento. No se han inventado platos ni precios.",
    source:
      "Categorías citadas por la guía del Camino Mozárabe (SEMTAYR) y por APYME Vegas Altas–La Serena.",
    documentedCategories: ["Desayunos y tostadas", "Raciones", "Café y bar"],
    categories: [],
  },

  /* ---------- Galería ----------
     No hay ninguna fotografía con licencia de reutilización
     documentada. Con "src" vacío se pinta un marcador provisional
     neutro: nunca una foto de terceros ni una imagen generada.
     Para sustituir: pon la ruta del archivo en assets/images/ y su
     texto alternativo real. */
  gallery: {
    status: "placeholder", // "placeholder" | "ready"
    items: [
      { slot: "Fachada", alt: "", src: "", credit: "" },
      { slot: "Interior", alt: "", src: "", credit: "" },
      { slot: "La barra", alt: "", src: "", credit: "" },
      { slot: "Desayuno", alt: "", src: "", credit: "" },
      { slot: "Detalle", alt: "", src: "", credit: "" },
    ],
  },

  /* ---------- Mapa ----------
     El iframe NO se carga al abrir la página. Se inyecta solo si el
     visitante pulsa "Cargar mapa", para no enviar su IP a Google sin
     permiso. Se construye con búsqueda por dirección (sin API key). */
  map: {
    enabled: true,
    embedBase: "https://maps.google.com/maps",
    zoom: 17,
  },

  /* ---------- Aviso de propuesta ---------- */
  proposal: {
    active: true, // poner false solo cuando el propietario apruebe y la web sea oficial
    label: "Propuesta de diseño · web no oficial",
  },
};
