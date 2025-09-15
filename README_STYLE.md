# Reorganización CSS — FINAL
- css/components.css contiene TODO el CSS original (para no romper el sitio).
- css/tokens.css: variables (si habían en :root).
- css/base.css: base mínima.
- css/pages/*: archivos por página (listos para trabajar con `body.page-*`).
- css/overrides.css: parches puntuales.
- css/style.legacy.css: respaldo del `style.css` antiguo. NO se carga.

Cada HTML carga:
  tokens.css → base.css → components.css → pages/<pagina>.css → overrides.css