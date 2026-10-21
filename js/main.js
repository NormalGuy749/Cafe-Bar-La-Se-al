/* ============================================================
   Café-Bar La Señal — comportamiento
   ------------------------------------------------------------
   Sin dependencias. Todo se lee de js/config.js.
   Si algo falla, la página sigue siendo legible: los textos están
   en el HTML y los enlaces tienen un destino interno de reserva.
   ============================================================ */
(function () {
  "use strict";

  var CONFIG = window.LA_SENAL;
  if (!CONFIG) return;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ---------- Utilidades ---------- */

  // Deja el número en formato internacional sin signos, para tel: y wa.me
  function toDial(number) {
    var digits = String(number || "").replace(/[^\d+]/g, "");
    if (!digits) return "";
    if (digits.charAt(0) === "+") return digits.slice(1);
    if (digits.length === 9) return "34" + digits; // España
    return digits;
  }

  function mapsBase() {
    var q = encodeURIComponent(CONFIG.business.mapsQuery);
    return {
      search: "https://www.google.com/maps/search/?api=1&query=" + q,
      directions: "https://www.google.com/maps/dir/?api=1&destination=" + q
    };
  }

  function externalise(link) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  /* ---------- Enlaces a Google Maps ---------- */
  var maps = mapsBase();

  $$("[data-maps-link]").forEach(function (el) {
    el.href = maps.directions;
    externalise(el);
  });
  $$("[data-maps-search]").forEach(function (el) {
    el.href = maps.search;
    externalise(el);
  });

  /* ---------- Aviso de propuesta ---------- */
  var proposal = $(".proposal");
  if (proposal) {
    if (CONFIG.proposal && CONFIG.proposal.active === false) {
      proposal.remove();
    } else if (CONFIG.proposal && CONFIG.proposal.label) {
      proposal.lastChild.textContent = " " + CONFIG.proposal.label;
    }
  }

  /* ---------- Reseñas ---------- */
  var reviewsLink = $("#reviews-link");
  var reviewsNote = $("#reviews-note");
  if (reviewsLink) {
    var reviews = CONFIG.reviews || {};
    var verifiedReviews = reviews.status === "verified" && reviews.url;
    reviewsLink.href = verifiedReviews ? reviews.url : maps.search;
    externalise(reviewsLink);
    reviewsLink.setAttribute(
      "aria-label",
      "Buscar opiniones en Google. " + (verifiedReviews
        ? "Abre la ficha del negocio en una pestaña nueva."
        : "Abre una búsqueda de Google Maps en una pestaña nueva.")
    );
    if (reviewsNote) {
      reviewsNote.textContent = verifiedReviews
        ? " · abre la ficha del negocio en Google."
        : " · abre una búsqueda, no la ficha del negocio.";
    }
  }

  /* ---------- Teléfono (dos puntos: franja de datos y contacto) ---------- */
  var phone = CONFIG.phone || {};
  var phoneDial = toDial(phone.display);
  var phoneIsVerified = phone.status === "verified" && !!phoneDial;

  var phoneShort = $("#phone-display");
  var phoneShortNote = $("#phone-note");

  if (phoneShort) {
    if (phoneIsVerified) {
      var shortLink = document.createElement("a");
      shortLink.href = "tel:+" + phoneDial;
      shortLink.textContent = phone.display;
      shortLink.className = "fact__value";
      phoneShort.replaceWith(shortLink);
      if (phoneShortNote) phoneShortNote.textContent = "Confirmado por el establecimiento";
    } else if (phoneShortNote && phone.note) {
      phoneShortNote.textContent = phone.note;
    }
  }

  var phoneLong = $("#phone-contact");
  var phoneLongNote = $("#phone-contact-note");

  if (phoneLong) {
    if (phoneIsVerified) {
      var longLink = document.createElement("a");
      longLink.href = "tel:+" + phoneDial;
      longLink.textContent = phone.display;
      longLink.className = "contact__phone";
      phoneLong.replaceWith(longLink);
      if (phoneLongNote) {
        phoneLongNote.textContent = "Puedes llamar directamente desde el móvil.";
      }
    }
  }

  /* ---------- WhatsApp (solo si hay número confirmado) ---------- */
  var wa = CONFIG.whatsapp || {};
  var waSlot = $("#whatsapp-slot");
  var waDial = toDial(wa.number);
  if (waSlot && wa.status === "verified" && waDial) {
    var waLink = document.createElement("a");
    waLink.className = "btn btn--solid";
    waLink.href = "https://wa.me/" + waDial +
      (wa.message ? "?text=" + encodeURIComponent(wa.message) : "");
    waLink.textContent = "Escribir por WhatsApp";
    externalise(waLink);
    waSlot.appendChild(waLink);
  }

  /* ---------- Horario ---------- */
  var hours = CONFIG.hours || {};
  var hoursList = $("#hours-list");
  var hoursBadge = $("#hours-badge");

  if (hoursList && Array.isArray(hours.days) && hours.days.length) {
    hoursList.textContent = "";
    hours.days.forEach(function (row) {
      var wrap = document.createElement("div");
      wrap.className = "hours__row";
      var dt = document.createElement("dt");
      dt.textContent = row.day;
      var dd = document.createElement("dd");
      dd.textContent = row.value;
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      hoursList.appendChild(wrap);
    });
  }
  if (hoursBadge) {
    hoursBadge.textContent = hours.status === "verified"
      ? "Confirmado por el local"
      : "Publicado · sin confirmar";
  }

  /* ---------- Carta ---------- */
  var menu = CONFIG.menu || {};
  var menuPanel = $(".menu-panel");
  var menuReady = $("#menu-ready");
  var documented = $("#menu-documented");

  if (documented && Array.isArray(menu.documentedCategories)) {
    documented.textContent = "";
    menu.documentedCategories.forEach(function (name, index) {
      var li = document.createElement("li");
      li.className = "menu-row";

      var num = document.createElement("span");
      num.className = "menu-row__num";
      num.setAttribute("aria-hidden", "true");
      num.textContent = String(index + 1).padStart(2, "0");

      var label = document.createElement("span");
      label.className = "menu-row__name";
      label.textContent = name;

      li.appendChild(num);
      li.appendChild(label);
      documented.appendChild(li);
    });
  }

  if (menuReady && menu.status === "ready" && Array.isArray(menu.categories) &&
      menu.categories.length) {
    menuReady.textContent = "";
    menu.categories.forEach(function (cat) {
      var section = document.createElement("section");
      section.className = "menu-cat";

      var h3 = document.createElement("h3");
      h3.className = "menu-cat__title";
      h3.textContent = cat.name;
      section.appendChild(h3);

      var list = document.createElement("ul");
      (cat.items || []).forEach(function (item) {
        var li = document.createElement("li");
        li.className = "menu-item";

        var name = document.createElement("span");
        name.className = "menu-item__name";
        name.textContent = item.name;
        li.appendChild(name);

        if (item.price) {
          var dots = document.createElement("span");
          dots.className = "menu-item__dots";
          dots.setAttribute("aria-hidden", "true");
          li.appendChild(dots);

          var price = document.createElement("span");
          price.className = "menu-item__price";
          price.textContent = item.price;
          li.appendChild(price);
        }

        if (item.note) {
          var note = document.createElement("span");
          note.className = "note";
          note.textContent = item.note;
          li.appendChild(note);
        }
        list.appendChild(li);
      });

      section.appendChild(list);
      menuReady.appendChild(section);
    });
    menuReady.hidden = false;
    if (menuPanel) menuPanel.hidden = true;
  }

  /* ---------- Menú móvil ---------- */
  var mobileNav = $(".mobile-nav");
  if (mobileNav) {
    var summary = $("summary", mobileNav);
    var closeNav = function () { mobileNav.open = false; };

    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("click", function (event) {
      if (mobileNav.open && !mobileNav.contains(event.target)) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mobileNav.open) {
        closeNav();
        if (summary) summary.focus();
      }
    });

    var desktop = window.matchMedia("(min-width: 56rem)");
    var onBreakpoint = function (event) { if (event.matches) closeNav(); };
    if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);
  }

  /* ---------- Mapa bajo demanda ---------- */
  var map = $("[data-map]");
  var mapButton = $("#map-load");
  var mapStatus = $("#map-status");

  if (map && mapButton && CONFIG.map && CONFIG.map.enabled !== false) {
    mapButton.addEventListener("click", function () {
      var facade = $("[data-map-facade]", map);
      var src = CONFIG.map.embedBase +
        "?q=" + encodeURIComponent(CONFIG.business.mapsQuery) +
        "&z=" + (CONFIG.map.zoom || 17) +
        "&output=embed";

      map.classList.add("is-busy");
      map.setAttribute("aria-busy", "true");
      mapButton.disabled = true;
      mapButton.textContent = "Cargando mapa…";

      var frame = document.createElement("iframe");
      frame.src = src;
      frame.title = "Mapa de Google con la ubicación de " + CONFIG.business.name;
      frame.loading = "eager";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.setAttribute("allowfullscreen", "");

      frame.addEventListener("load", function () {
        map.classList.remove("is-busy");
        map.removeAttribute("aria-busy");
        if (facade) facade.remove();
        if (mapStatus) mapStatus.textContent = "Mapa de Google cargado.";

        // El botón que tenía el foco desaparece con la fachada: sin esto el
        // foco cae al body y quien navega con teclado pierde el sitio.
        map.setAttribute("tabindex", "-1");
        map.focus({ preventScroll: true });
      });

      frame.addEventListener("error", function () {
        map.classList.remove("is-busy");
        map.removeAttribute("aria-busy");
        // El marco roto no se deja en la página: queda el aviso y el enlace
        // para abrir el mapa en Google Maps.
        frame.remove();
        mapButton.disabled = false;
        mapButton.textContent = "Reintentar";
        if (mapStatus) {
          mapStatus.textContent =
            "No se ha podido cargar el mapa. Usa el enlace para abrirlo en Google Maps.";
        }
      });

      map.appendChild(frame);
    });
  }

  /* ---------- Año del pie ---------- */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
