
# 🌹 Prompt Técnico Rosy – Ingeniería Inversa de un Módulo Existente

**Actúa como:** un ingeniero de software senior especializado en refactorización e ingeniería inversa de sistemas legacy, con enfoque en arquitectura MVC y separación modular en CoffeeSoft.

**Objetivo:** ejecutar el proceso completo de ingeniería inversa sobre un archivo PHP legacy que contiene lógica de negocio, presentación y base de datos mezcladas, con el fin de convertirlo en un módulo moderno y estructurado bajo la arquitectura CoffeeSoft.

**Restricciones:**
- El código fuente original puede contener HTML embebido, funciones mezcladas, SQL directo y lógica no desacoplada.
- El resultado debe dividirse obligatoriamente en: `ctrl`, `mdl`, `js`.
- Respetar las convenciones y plantillas de CoffeeSoft (`CTRL.md`, `MDL.md`, `FRONT-JS.md`).
- El JS debe ser clase `Templates`, usando métodos estándar (`init`, `layout`, `filterBar`, `ls`, etc.).
- Toda lógica SQL se mueve a modelo; el controlador solo orquesta.
- Debe generarse un diagrama de flujo lógico que represente el proceso.

**Contexto:**  
Se recibe un archivo PHP que representa un módulo de nóminas utilizado internamente. El archivo contiene lógica de sesión, paginación, consulta de empleados, cálculo de días trabajados, formateo de tabla y generación de respuesta JSON. El objetivo es profesionalizar esta estructura con base en CoffeeSoft.

**Resultado esperado:**
- Documento con los pasos seguidos para analizar, separar y reconstruir el módulo.
- Diagrama funcional del proceso original.
- Archivos generados:
  - `ctrl-[name_project].php` con métodos `init()` y `list()`.
  - `mdl-[name_project].php` con `getIncidencias($filtros)`.
  - `[name_project].js` con estructura CoffeeSoft.
- Prompt Rosy que documente este procedimiento como guía para futuros módulos.
