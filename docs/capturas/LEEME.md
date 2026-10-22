# Capturas

- **`2026-10-22/` es la versión actual.** Nueve capturas tomadas con `node pruebas/capturas.mjs`
  sobre los archivos servidos en `http://127.0.0.1:8099/`, con el viewport fijado por CDP
  (320, 390, 768, 1024 y 1440 px). Son las que representan la propuesta con las fotografías
  integradas.
- **`2026-10-22/favicon-tamanos.png`** es la hoja de comprobación del favicon: 256 px, tamaños
  reales de 48/32/16 y ampliaciones con píxeles reales.
- **`2026-10-21/` es la versión anterior** (sin fotografías), conservada como histórico.
- **El resto de archivos sueltos de esta carpeta son histórico** de iteraciones anteriores
  (`v3`, `v4`, `v5`…). Algunas muestran secciones que ya no existen (galería y reseñas). No se han
  borrado para conservar el rastro del proceso, pero **no deben usarse para enseñar la demo**.

Si cambias la web, regenera la carpeta actual:

```bash
node pruebas/serve.mjs &        # o en otra terminal
node pruebas/capturas.mjs http://127.0.0.1:8099/ docs/capturas/2026-10-22
```
