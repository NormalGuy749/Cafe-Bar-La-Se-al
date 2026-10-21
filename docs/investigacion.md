# Investigación — Café-Bar La Señal (Don Benito)

**Fecha de consulta:** 21 de octubre de 2026
**Método:** búsquedas web en español y lectura de fichas públicas (directorios institucionales, guías, agregadores). No se ha contactado con el establecimiento ni con ninguna persona.

> **Aviso de método.** No se ha podido acceder al perfil de Google Business de forma directa: no se localizó una URL de ficha ni un Place ID. Varias páginas devolvieron error 403/429 al abrirse (Tripadvisor, APYME, Infobel, Cybo), por lo que algunos datos proceden de resultados indexados y no de lectura directa. Cada caso se marca como tal.

## 1. Resumen

| Aspecto | Estado |
|---|---|
| Identidad del negocio | **Confirmada** por fuente institucional (Diputación de Badajoz) |
| Dirección (cruce Manzanedo / Roble) | **Confirmada** con matices (sin número de portal) |
| Tipo de establecimiento (cafetería-bar) | **Confirmado** |
| Teléfono | **NO confirmado** — tres números distintos publicados |
| Horarios | **Publicados y coherentes entre sí**, sin confirmación del propietario |
| Ficha de Google / URL de reseñas | **Existencia probable, identificador NO verificado** |
| Carta y precios | **NO existe carta publicada** |
| Logotipo | **NO localizado** |
| Fotografías con licencia reutilizable | **NINGUNA** |
| Redes sociales propias | **NO confirmadas** |

## 2. Datos y fuentes

### 2.1 Nombre

- **Dato:** «Café-Bar La Señal», también publicado como «Bar La Señal» y «Café bar la señal».
- **Fuentes:**
  - Turismo Badajoz (Diputación de Badajoz): https://turismoapps.dip-badajoz.es/empresa/bar-la-senal — *fuente institucional*
  - SEMTAYR: https://www.semtayr.es/es/cafe-bar-la-senal — *guía/directorio*
- **Confianza:** alta en la identificación del local; media en cuál es la denominación oficial exacta.
- **Estado:** pendiente de que el propietario confirme la forma correcta del nombre (con o sin «Café-»).

### 2.2 Dirección

- **Dato:** calle Manzanedo, esquina con calle Roble, 06400 Don Benito, Badajoz.
- **Fuentes:**
  - Turismo Badajoz: https://turismoapps.dip-badajoz.es/empresa/bar-la-senal (aporta además coordenadas 38.949029967799, -5.8554365400263)
  - Restaurant Guru: https://es.restaurantguru.com/Cafe-Bar-La-Senal-Don-Benito
  - APYME Vegas Altas–La Serena: https://www.instagram.com/p/DPQlbl-CQ-m/ (menciona Manzanedo esquina con Roble)
  - SEMTAYR: https://www.semtayr.es/es/cafe-bar-la-senal — escribe «Manzaneda s/n»
- **Confianza:** alta en el cruce y el municipio; baja en cualquier número de portal.
- **Discrepancia:** «Manzanedo» vs. «Manzaneda». Se usa **Manzanedo** por ser la forma presente en la fuente institucional y en la mayoría de fichas.
- **Coordenadas:** existen en una fuente institucional, pero **no se han verificado de forma independiente**. La web **no** las usa: los enlaces de mapa se construyen con la dirección postal.
- **Comprobación indirecta:** el mapa de Google cargado con la dirección resuelve al local correcto en el cruce de C. Manzanedo con C. Roble (ver §2.6).
- **Estado:** pendiente de confirmar número de portal y si el acceso principal es por Manzanedo o por Roble.

### 2.3 Teléfono — discrepancia importante

| Número | Dónde aparece | Tipo de fuente |
|---|---|---|
| 924 96 56 69 | Turismo Badajoz, Restaurant Guru, Kitking, Wanderlog | institucional + directorios |
| 924 18 96 47 | SEMTAYR, Los Ibéricos | directorios |
| 673 42 15 52 | APYME (resultado indexado), Sluurpy | asociación empresarial (acceso directo bloqueado, 403) |
| 619 972 503 | APYME (resultado indexado) | asociación empresarial (no verificado) |

- **Confianza:** media en que esos números estén publicados; **baja** en cuál está activo.
- **Decisión de diseño:** el teléfono **no se publica como enlace `tel:`**. Se muestra como dato provisional, sin acción de llamada, con aviso de que está pendiente de confirmación. Ver `js/config.js` → `phone.status = "pending"`.
- **Estado:** pendiente. Pregunta al propietario incluida en `pendientes-propietario.md`.

### 2.4 Tipo de establecimiento

- **Dato:** cafetería-bar.
- **Fuentes:** SEMTAYR (categoría explícita «Cafetería - Bar»); Turismo Badajoz lo clasifica en «Bares»; APYME lo describe como local de restauración con desayunos y raciones.
- **Confianza:** alta.
- **Estado:** confirmado por fuentes; el propietario puede matizar el descriptor.

### 2.5 Horarios publicados

| Día | Horario publicado |
|---|---|
| Lunes | Cerrado |
| Martes a jueves | 6:30 – 24:00 |
| Viernes y sábado | 6:30 – 1:00 |
| Domingo | 6:30 – 17:00 |

- **Fuentes:** Turismo Badajoz (https://turismoapps.dip-badajoz.es/empresa/bar-la-senal) y Restaurant Guru (https://es.restaurantguru.com/Cafe-Bar-La-Senal-Don-Benito). SEMTAYR solo confirma el cierre de lunes.
- **Confianza:** media-alta en que es el horario publicado; media en su vigencia.
- **Discrepancia:** ninguna real entre las dos fichas completas. Wanderlog separa los tramos de madrugada del día natural, lo que puede leerse como discrepancia pero no lo es.
- **Estado:** se muestra en la web **con la etiqueta «horario publicado, pendiente de confirmar»**. No se incluye en datos estructurados.

### 2.6 Ficha de Google y reseñas

- **Dato:** existen indicios sólidos de una ficha de Google (Restaurant Guru y Wanderlog reproducen reseñas atribuidas a Google con dirección y teléfono del local), pero **no se ha localizado ni la URL de la ficha ni el Place ID**.
- **Fuentes:** https://es.restaurantguru.com/Cafe-Bar-La-Senal-Don-Benito · https://wanderlog.com/place/details/12399775/caf%C3%A9-bar-la-se%C3%B1al
- **Confianza:** media-alta en la existencia de ficha; baja en su identificador.
- **Comprobación posterior (21/10/2026):** al cargar en la web el mapa incrustado de Google construido con la dirección, este resuelve a una ficha titulada **«Café-Bar La Señal»** en «C. Manzanedo & C. Roble, 06400 Don Benito». Es decir: **la ficha parece existir y estar activa**, y la dirección es la correcta. Lo que sigue sin obtenerse es su **URL directa o Place ID**, que es lo que haría falta para enlazar las reseñas sin pasar por una búsqueda.
- **Decisión de diseño:** el botón de reseñas **abre una búsqueda de Google Maps construida con el nombre y la dirección**, no una ficha. Se acompaña de un aviso visible de que la ficha aún no está verificada. No se muestran valoraciones ni número de reseñas: la valoración que Google pinta dentro del mapa es contenido de Google, no de esta web.
- **Estado:** pendiente de que el propietario facilite el enlace de su ficha.

### 2.7 Redes sociales

- **Dato:** no se ha localizado ningún perfil propio atribuible con seguridad a Instagram, Facebook, TikTok o WhatsApp.
- **Menciones de terceros (no son perfiles del bar):**
  - APYME Vegas Altas–La Serena: https://www.instagram.com/p/DPQlbl-CQ-m/ y https://www.facebook.com/apymevegasaltaslaserena/posts/902771041955534/
  - C.D. Don Benito: https://www.facebook.com/cddonbenito/posts/1019254040206062/
  - Ayuntamiento de Don Benito: https://www.facebook.com/ayuntamientodonbenito/posts/1287350633427442/
- **Confianza:** media-alta en que no hay perfil público localizado; la ausencia no demuestra que no exista.
- **Estado:** pendiente. La web no enlaza a ninguna red social ni muestra iconos sociales.

### 2.8 Carta, platos y precios

- **Dato:** **no existe carta publicada**. Ni listado, ni PDF, ni foto verificable de carta o pizarra.
- **Categorías documentadas para este local (sin platos concretos):**
  - Desayunos con variedad de tostadas — SEMTAYR: https://www.semtayr.es/es/cafe-bar-la-senal · APYME (Instagram)
  - Carta de raciones — SEMTAYR
  - Cafetería / café — categoría del propio establecimiento
- **Menciones de platos en reseñas** (experiencias de clientes, **no** carta): café con leche y tostada de jamón con tomate (3,40 €, reseña de 29/08/2025); cachopo; croquetas de jamón; nachos; patatas; ración de rejos. Fuente: https://wanderlog.com/place/details/12399775/caf%C3%A9-bar-la-se%C3%B1al
- **Precios:** ninguno utilizable como precio de carta vigente. El rango 10–20 €/persona de Restaurant Guru es una estimación agregada sin fecha.
- **Decisión de diseño:** la sección Carta es un **estado «pendiente» honesto**: explica que la carta aún no está confirmada, muestra las tres categorías documentadas como referencia —etiquetadas como tales— y deja el componente preparado para sustituirse por la carta real.
- **Estado:** pendiente. **No se ha inventado ni un solo plato, ingrediente, alérgeno, ración ni precio.**

### 2.9 Instalaciones y servicios mencionados

- **Terraza:** mencionada en una reseña de cliente (Wanderlog). No confirmada por el negocio.
- **Acceso para movilidad reducida:** afirmado por la ficha de SEMTAYR. No verificado.
- **Catering:** una reseña menciona un servicio de catering puntual. No se interpreta como servicio ofertado.
- **Decisión de diseño:** **ninguno de estos datos se publica en la web.** No hay sección de servicios ni iconos de «terraza» o «accesible».

## 3. Identidad visual

- **Logotipo:** no localizado ningún archivo de marca atribuible. Las publicaciones de APYME muestran el nombre del negocio, pero eso no acredita un logotipo oficial.
- **Decisión:** la web usa una **identificación tipográfica provisional** (el nombre compuesto en la serif de titulares + un rótulo de propuesta). No imita ningún logotipo.
- **Colores:** la paleta es una propuesta de diseño, no colores oficiales. Ver `docs/diseno.md`.

## 4. Riesgos de confusión con homónimos

Se descartaron fichas de otras localidades. Todas las fuentes usadas se refieren a Don Benito (06400, Badajoz) por título, dirección o contenido. Nota: la ficha de Wanderlog aparece bajo un título que menciona «Merida», pero la dirección y las reseñas del contenido son de Don Benito; se ha usado solo como indicio, nunca como confirmación de un dato crítico.

## 5. Fuentes consultadas (índice)

1. Turismo Badajoz — Diputación de Badajoz: https://turismoapps.dip-badajoz.es/empresa/bar-la-senal
2. SEMTAYR (Camino Mozárabe): https://www.semtayr.es/es/cafe-bar-la-senal
3. Restaurant Guru: https://es.restaurantguru.com/Cafe-Bar-La-Senal-Don-Benito
4. Wanderlog: https://wanderlog.com/place/details/12399775/caf%C3%A9-bar-la-se%C3%B1al
5. Kitking: https://kitking.es/reservar/cafe-bar-la-senal/
6. Los Ibéricos: https://losibericos.es/cafebar-la-senal/
7. MapQuest: https://www.mapquest.com/es/extremadura/cafe-bar-la-senal-811336316
8. Tripadvisor (403): https://www.tripadvisor.es/Restaurant_Review-g1064382-d26857501-Reviews-Cafe_bar_la_senal-Don_Benito_Province_of_Badajoz_Extremadura.html
9. APYME Vegas Altas–La Serena (Instagram): https://www.instagram.com/p/DPQlbl-CQ-m/
10. APYME Vegas Altas–La Serena (Facebook): https://www.facebook.com/apymevegasaltaslaserena/posts/902771041955534/
11. C.D. Don Benito (Facebook): https://www.facebook.com/cddonbenito/posts/1019254040206062/
12. Ayuntamiento de Don Benito (Facebook): https://www.facebook.com/ayuntamientodonbenito/posts/1287350633427442/
13. Sluurpy: https://www.sluurpy.com/fr/don-benito/restaurant/8977491/caf%C3%A9-bar-la-se%C3%B1al

## 6. Qué NO se ha hecho

- No se ha contactado con el propietario ni con terceros.
- No se ha creado ninguna cuenta ni se ha reclamado ninguna ficha.
- No se ha descargado ni reutilizado ninguna imagen.
- No se ha publicado ni desplegado nada.
