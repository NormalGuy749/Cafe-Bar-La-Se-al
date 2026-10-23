
window.LA_SENAL = {

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

    mapsQuery:
      "Café-Bar La Señal, Calle Manzanedo esquina calle Roble, 06400 Don Benito, Badajoz"
  },

  phone: {
    display: "924 96 56 69",
    status: "pending",
    note: "Sin confirmar"
  },

  whatsapp: {
    number: "",
    status: "pending",
    message: "Hola, quería preguntar por el bar."
  },

  reviews: {
    status: "pending", 
    url: "",
    note: "La ficha de Google no está verificada: el botón abre una búsqueda con el nombre y la dirección."
  },

  hours: {
    status: "published",
    note: "Horario publicado en fichas públicas, pendiente de confirmar.",
    days: [
      { day: "Lunes", value: "Cerrado" },
      { day: "Martes a jueves", value: "6:30 – 24:00" },
      { day: "Viernes y sábado", value: "6:30 – 1:00" },
      { day: "Domingo", value: "6:30 – 17:00" }
    ]
  },

 
  menu: {
    status: "pending",
    note: "No hay carta publicada del establecimiento. No se han inventado platos ni precios.",
    source:
      "Categorías citadas por la guía del Camino Mozárabe (SEMTAYR) y por APYME Vegas Altas–La Serena.",
    documentedCategories: ["Desayunos y tostadas", "Raciones", "Café y bar"],
    categories: []
  },

  map: {
    enabled: true,
    embedBase: "https://maps.google.com/maps",
    zoom: 17
  },

  proposal: {
    active: true, 
    label: "Propuesta de diseño · web no oficial"
  }
};
