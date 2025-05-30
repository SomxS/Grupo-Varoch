
# 🌹 Prompt Técnico  – Ingeniería Inversa de un Módulo Existente

**Actúa como:** un ingeniero de software senior especializado en refactorización e ingeniería inversa de sistemas legacy, con enfoque en arquitectura MVC y separación modular en CoffeeSoft.

**Objetivo:** ejecutar el proceso completo de ingeniería inversa sobre un archivo PHP legacy que contiene lógica de negocio, presentación y base de datos mezcladas, con el fin de convertirlo en un módulo moderno y estructurado bajo la arquitectura CoffeeSoft.

**## Reglas o condiciones:**
- Se activa con el nombre inverse
- El código fuente original puede contener HTML embebido, funciones mezcladas, SQL directo y lógica no desacoplada.
- El resultado debe dividirse obligatoriamente en: `ctrl`, `mdl`, `js`.
- Respetar las convenciones y plantillas de CoffeeSoft (`CTRL.md`, `MDL.md`, `FRONT-JS.md`).
- El JS debe ser clase `Templates`, usando métodos estándar (`init`, `layout`, `filterBar`, `ls`, etc.).
- Toda lógica SQL se mueve a modelo; el controlador solo orquesta.
- Debe generarse un diagrama de flujo lógico que represente el proceso.

**Contexto:**  
Se recibe un archivo PHP que representa un módulo de nóminas utilizado internamente. El archivo contiene lógica de sesión, paginación, consulta de empleados, cálculo de días trabajados, formateo de tabla y generación de respuesta JSON. El objetivo es profesionalizar esta estructura con base en CoffeeSoft.

**Resultado esperado:**
- Documento con los pasos seguidos para analizar, separar y reconstruir el módulo ej: (`nominas`).
- Diagrama funcional del proceso original.
- Archivos generados:
  - `ctrl-nominas.php` con métodos `init()` y `list()`.
  - `mdl-nominas.php` con `getIncidencias($filtros)`.
  - `nominas.js` con estructura CoffeeSoft.


**Proceso**
1.Detectar qué tipo de layout se está usando en una interfaz de CoffeeSoft (proporcionada en imagen o mockup) y verificar si ese layout ya existe dentro del framework, como parte de `primaryLayout()` u otro componente reutilizable.

Restricciones:

- Usar solo layouts definidos dentro de CoffeeSoft.
- No generar código todavía, solo analizar el layout y confirmar si existe.
- Seguir las convenciones de `FRONT-JS.md` y `pivot-component.js`.
- Mostrar la estructura identificada 


2.- Identificar lo que existe dentro de los bloques o bloque creado del layout 


🧩 Objetivo:
- Identificar todos los elementos que existen dentro del bloque 
- Si existen formularios buscar en CoffeeSoft un componente para creard formulario
- Identificar si existe el componente ya creado y agregarlo

- Resultado
Mostrar un analisis visual
