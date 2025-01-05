// Variables.
let app;
const link = 'https://erp-varoch.com/ERP24/produccion/control-fogaza/ctrl/ctrl-pedidos-list.php';
// Init components.
$(function () {
  app = new App("", "");
  app.init();
});

// Nuevo comentario

// The 'App' class organizes and manages all elements available to other application classes.
class App extends Templates {
  constructor(link, div_modulo) {
    super(link, div_modulo);
  }

  init() {
    this.render();
  }

  render() {
    this.layout();
    this.ls();
  }

  // Configures the main layout of the application.
  layout() {
    this.secondaryLayout({
      parent: "root",
      id: "Secondary",
    });

    this.form({
      parent: "containerFormSecondary",
      json: [
        {
          element: "input-calendar",
          id:'calendar',
          lbl: "Titulo:",
        },
        {
          element: "select",
          lbl: "Temporada:",
          id: "title",
          default: "-- selecciona un dato --",
          class: "col-12",
          placeholder: "0.00",
          data: [{ id: 1, valor: "Anual" }],
        },

        {
          element: "textarea",
          id: "observaciones",
          lbl: "Observaciones:",
        },
        {
          opc: "dropdown",
        },
      ],
    });

    
    dataPicker({ parent: "calendar" });

  }

  ls(options) {
    let rangePicker = getDataRangePicker('calendar'); 
    this._link = link;

  

    this.createTable({
        parent: 'listTable',
        idFilterBar: 'filterBarSecondary',
        url: link,
        data: { opc: 'lsPedidos', fi: rangePicker.fi, ff: rangePicker.ff },
        conf: { datatable: false, },
        attr: {
            color_th: 'bg-primary',
            class_table: 'table table-bordered ',
            f_size:12
           
        },
        extends: false
    });


}


  form(options) {
    var defaults = {
      json: [],

      class: "row",
      parent: "",
      Element: "div",

      id: "containerForm",
      prefijo: "",
      icon: "icon-dollar",

      color: "primary",
      color_btn: "outline-primary",
      color_default: "primary",
      text_btn: "Aceptar",
      fn: "EnviarDatos()",
      id_btn: "btnAceptar",
      required: true,
    };

    let opts = Object.assign(defaults, options);

    // Creamos el contenedor
    var div = $("<div>", { class: opts.class, id: opts.id });

    opts.json.map((item, index) => {
      const propierties = { ...item }; // Crear una copia del objeto para evitar modificar el original
      delete propierties.class;
      delete propierties.classElement;
      delete propierties.default;
      delete propierties.opc;

      var children = $("<div>", {
        class: item.class ? "my-2 " + item.class : "col-12 ",
      }).append(
        $("<label>", {
          class: "fw-semibold ",
          html: item.lbl,
        })
      );

      // config. attr
      var attr = {
        class: " form-control input-sm " + item.classElement,
        id: item.id,
        name: item.id ? item.id : item.name,
        ...propierties,
      };

      const htmlElements = item.opc ? item.opc : item.element;
      switch (htmlElements) {
        case "input":
          // Agregar clase de alineación según el tipo de `item`
          if (item.tipo === "cifra" || item.tipo === "numero") {
            attr.class += " text-end";
          }

          var element = $("<input>", attr);
          break;

        case "input-calendar":
          // Crear contenedor del grupo de input
          var element = $("<div>", {
            class: "input-group date calendariopicker",
          });

          element.append($("<input>", attr));
          element.append(
            $("<span>", { class: "input-group-text" }).append(
              $("<i>", { class: "icon-calendar-2" })
            )
          );
          break;

        case "select":
          attr.class = "form-select input-sm " + item.classElement;
          var element = $("<select>", attr);

          if (item.default) {
            element.append($("<option>", { value: "0", text: item.default }));
          }

          $.each(item.data, function (_, option) {
            const isSelected = option.id === item.value;

            element.append(
              $("<option>", {
                value: option.id,
                text: option.valor,
                selected: isSelected,
              })
            );
          });

          break;

        case "textarea":
          // Crear el elemento textarea
          attr.class = "form-control resize" + item.classElement;
          var element = $("<textarea>", attr);
        break;

        case 'dropdown':

            // data default.
            let defaults = [
              { icon: "icon-pencil", text: "Editar", onClick: ()=>alert() },
              { icon: "icon-trash", text: "Eliminar", onClick: ()=>alert() },
          ];
  
          let opts = Object.assign(defaults, item.data);

            var $button = $("<button>", {
                class: "btn btn-outline-primary btn-sm w-100",
                id: item.id || "dropdownMenu",
                type: "button",
                "data-bs-toggle": "dropdown",
                "aria-expanded": "false",
                html: `<i class="${item.iconClass || 'icon-dot-3 text-info'}">...</i>`,
            });

         
          var $ul = $("<ul>", { class: "dropdown-menu" });

         opts.forEach((dropdownItem) => {
            const $li = $("<li>");
            
            // Construir el contenido dinámico con íconos y texto
            let html = dropdownItem.icon && dropdownItem.icon !== "" 
                ? `<i class="text-info ${dropdownItem.icon}"></i>` 
                : "<i class='icon-minus'></i>";
            html += dropdownItem.text && dropdownItem.text !== "" 
                ? ` ${dropdownItem.text}` 
                : "";
        
            const $a = $("<a>", {
                class: "dropdown-item",
                id: dropdownItem.id,
                href: dropdownItem.href || "#",
                html: html, // Usar el HTML construido con íconos y texto
            });
        
            if (dropdownItem.onClick) {
                $a.on("click", dropdownItem.onClick);
            }
        
            $li.append($a);
            $ul.append($li);
         });
          var  element = $("<div>", { class: "dropdown" }).append($button, $ul);
        break;    


      }

      children.append(element);

      div.append(children);
    });

    $("#" + opts.parent).append(div);
  }

  // Creates the main grid with its respective layouts.
  showGrid() {
    this.createLayaout({
      parent: "root",

      data: {
        id: "singleLayout",
        class: "flex grid grid-cols-3 gap-2",

        contenedor: [
          { type: "div", id: "splitLayout", class: "h-52 w-100" },
          {
            type: "div",
            id: "verticalLinearLayout",
            class: "h-52 w-100 border",
          },
          { type: "div", id: "accordionLayout", class: "h-52 w-100 border" },
          { type: "div", id: "primaryLayout", class: "w-100 h-52 border" },
          { type: "div", id: "secondaryLayout", class: "w-100 border" },
          { type: "div", id: "tabsLayout", class: "w-100 h-52 border" },
        ],
      },
    });
  }
}
