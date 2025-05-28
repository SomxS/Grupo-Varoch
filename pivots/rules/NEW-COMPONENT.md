# Prompt para construir un componente jQuery con Tailwind

**Compilar información**
- Se activa con la frase para iniciar una conversación 'new-component'.
- Reúne toda la documentación, diagramas, fotos o descripciones del componente.
- Abre en formato markdown para mostrar el desarrollo del componente.


## 1. Contexto claro:

Quiero que generes un **componente jQuery personalizado** cuyo propósito sea crear interfaces reutilizables con lógica desacoplada. El componente debe estar basado en un patrón configurable por `options`, tener un contenedor root definido por un `id`, y usar exclusivamente **TailwindCSS** para estilos.


## 2. Reglas o condiciones:
- Los componentes se crean con el formato markdown 
- Si el componente se toma de un codigo ya creado preguntar al usuario que desea hacer.
- El componente debe declararse como una función con nombre PascalCase: `NombreComponente(options)`.
- Debe iniciarse con una constante `defaults` que contenga todas las opciones configurables por defecto.
- Las opciones deben poder sobrescribirse con `Object.assign(defaults, options)`.
- Debe incluir lógica modular en una sección separada del renderizado HTML.
- Toda la interfaz debe estar construida con **jQuery** y **TailwindCSS** exclusivamente.
-Todos los elementos visibles (etiquetas, IDs, estados) provengan de un objeto JSON (json: []).
-Todo lo que se envia al backend debe ser data.
 El componente debe inyectarse en el DOM bajo el `id` del contenedor padre definido por `opts.parent`.


1. **Consulta de Datos (GET)**:

   - Si un componente requiere `json`, **debe hacer una consulta al Backend** obligatoriamente.
   - La llamada debe realizarse mediante `fetch()` siguiendo el estándar del método `get`.

2. **Eventos por Tipo de Acción**:

   - **Eliminar (Delete)**: Se debe implementar un evento `onDelete` que realice la acción correspondiente en el backend.
   - **Agregar (Add)**: Se debe implementar un evento `onAdd` conectado al backend.
   - **Modificar (Update)**: También se usará el evento `onAdd` para modificaciones, conectándose al backend (📌 considerar renombrar a `onSave` si hay ambigüedad entre agregar/modificar).

3. **Estructura de Soporte (MVC)**:
   - Cualquier evento definido (`onAdd`, `onDelete`, etc.) **debe crear automáticamente**:
     - Un **Controlador (ctrl)**.
     - Un **Modelo (mdl)**.
   - Estos deben adherirse a las **reglas de pivotes y templates estándar del proyecto**.

```js
// Consulta al backend
  async onShow() {
      let request = await useFetch({
        url: this._link,
        data: {
          opc: "get",
          id: 1
        },
      });

      this.NombreComponente({
        parent:'root',
        json: request.data
      });

```



## 🖼️ 4. Formato de salida esperado (ejemplo base):
- Se usa de referencia el pivot-component.js
- Se debe agregar onShow para mandarlo a llamar.
- el formato de salida es markdown
- No se usan funciones son metodos

```js
NombreComponente(options) {
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

trigger:
  when_input_type: "code"
  and_detects:
    - "fetch("
    - "useFetch"
    - "fn_ajax"
    - "this.createModalForm"
    - "opc:"
  then:
    - activar: new-component
    - analizar: estructura JSON, eventos (add, edit, delete)
    - verificar: si requiere ctrl y mdl
    - aplicar: reglas de new-components.md
    - preguntar: ¿Deseas generar el backend (ctrl y mdl)?
