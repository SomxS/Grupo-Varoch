# 🧠 Prompt Base para Generar un Componente jQuery + Tailwind (CoffeeSoft Compatible)

### 🔧 Activador:

`new-component`

---

## 1. 🎯 Objetivo General

Quiero que generes un nuevo `<component>` llamado **[NOMBRE_COMPONENTE]**, que será un **componente jQuery reutilizable**, diseñado bajo los principios de desacoplamiento, modularidad y configurabilidad, con estilos en **TailwindCSS**.  
Debe integrarse al ecosistema **CoffeeSoft** (si se indica), con lógica desacoplada, eventos dinámicos y estructura MVC si aplica.

---

## 2. ✅ Funcionalidad esperada

- [Describe la lógica principal del componente].
- [Ej: Muestra cards de resumen, genera formularios dinámicos, lista datos paginados, etc.].
- [¿Es visual, de validación, de backend, de entrada/salida de datos, etc.?].

---

## 3. 🧩 Inputs esperados

- Atributos vía `options`:  
  `parent`, `id`, `class`, `json`, `data`.

- Eventos personalizados esperados (opcionales):  
  `onAdd`, `onUpdate`, `onDelete`, `onShow`, `onSubmit`.

- ¿Requiere datos del backend?:  
  Sí / No (si sí, usar `fetch()` con `opc: 'get'`).

---

## 4. 🖼️ Output esperado

- Interfaz generada con **jQuery + TailwindCSS**.
- Inyección dinámica dentro de `#${opts.parent}`.
- Toda estructura visual debe derivarse de `json` o `data`.

---

## 5. ⚙️ Reglas adicionales

- El componente debe declararse como función PascalCase:  
  `function NombreComponente(options) {}`

- Inicia con:
  ```js
  const defaults = { parent: 'root', ... };
  const opts = Object.assign({}, defaults, options);
  ```
