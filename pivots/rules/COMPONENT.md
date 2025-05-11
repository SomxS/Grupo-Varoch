# Prompt para construir un componente jQuery con Tailwind

**Compilar información**
- Se activa con el boton de componente.
- Reúne toda la documentación, diagramas, fotos o descripciones del componente.
- Abre un lienzo para mostrar el desarrollo del componente.


## 1. Contexto claro:

Quiero que generes un **componente jQuery personalizado** cuyo propósito sea crear interfaces reutilizables con lógica desacoplada. El componente debe estar basado en un patrón configurable por `options`, tener un contenedor root definido por un `id`, y usar exclusivamente **TailwindCSS** para estilos.


## 2. Reglas o condiciones:

- El componente debe declararse como una función con nombre PascalCase: `NombreComponente(options)`.
- Debe iniciarse con una constante `defaults` que contenga todas las opciones configurables por defecto.
- Las opciones deben poder sobrescribirse con `Object.assign(defaults, options)`.
- Debe incluir lógica modular en una sección separada del renderizado HTML.
- Toda la interfaz debe estar construida con **jQuery** y **TailwindCSS** exclusivamente.
-Todos los elementos visibles (etiquetas, IDs, estados) provengan de un objeto JSON (json: []).
-Todo lo que se envia al backend debe ser data.
 El componente debe inyectarse en el DOM bajo el `id` del contenedor padre definido por `opts.parent`.

## 🖼️ 3. Formato de salida esperado (ejemplo base):
```js
function NombreComponente(options) {
  // 📌 Configuración por defecto
  const defaults = {
    parent: "root",
    id: "nombreComponente",
    title: "Título",
    class: "bg-[#1F2A37] p-4 rounded-xl",
    data: {},
    json: [],
    onDelete: () => {},
    onAdd: () => {},
    onUpdate: () => {}
  };

  const opts = Object.assign({}, defaults, options);

  // 🔵 Lógica de la aplicación
    

  // 🧱 Construcción de la interfaz
  const container = $("<div>", {
    id: opts.id,
    class: `${opts.class}`
  });

  const header = $("<h2>", {
    class: "text-white text-lg font-bold mb-2",
    text: opts.title
  });

  // 🔵 Aplicar eventos



  container.append(header);
  

  // 📤 Inserción al DOM
  $(`#${opts.parent}`).html(container);
}
```
