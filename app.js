// Variables.
let app;
let udn, estados, temporadas, form_elements;
const link = 'https://erp-varoch.com/DEV/calendarizacion/ctrl/app.php';

// Init components.
$(function () {

  fn_ajax({ opc: "init" }, link).then((data) => {
    // vars.
    udn = data.udn;
    estados = data.estados;
    temporadas = data.temporada;

    console.warn(data);

    // 
    app = new App("", "");
    app.init();

  });

});



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
    this.filterBar();
    this.ls();
  }

  layout(){

      this.primaryLayout({ parent: "root", id: "Primary" });
  }

  // Configures the main layout of the application.
  // layout() {

  //   this.secondaryLayout({
  //     parent: "root",
  //     id: "Secondary",
  //   });

  //   this.form({
  //     parent: "containerFormSecondary",
  //     json: [
  //       {
  //         element: "input-calendar",
  //         id:'calendar',
  //         lbl: "Titulo:",
  //       },
  //       {
          
  //         element: "select",
  //         lbl: "Temporada:",
  //         id: "title",
  //         default: "-- selecciona un dato --",
  //         class: "col-12",
  //         placeholder: "0.00",
  //         data: [
          
  //           { id: 1, valor: "Anual" }
          
  //         ],

  //       },

  //       {
  //         element: "textarea",
  //         id: "observaciones",
  //         lbl: "Observaciones:",
  //       },
  //       // {
  //       //   opc: "dropdown",
  //       // },
  //     ],
  //   });

    
  //   dataPicker({ parent: "calendar" });
  // }

  ls(options) {
    let rangePicker = getDataRangePicker('calendar');
   
    this._link = link;
    this.createTable({
      parent: 'containerPrimary',
      idFilterBar: 'filterBarPrimary',

      data: { opc: 'lsEvents', fi: rangePicker.fi, ff: rangePicker.ff },
      conf: { datatable: false, },
      attr: {
        class: 'table table-bordered table-sm text-uppercase',
        center: [1, 2, 3, 4, 5, 6],
        extends: true
      },
    });

  }



  filterBar(options) {

    let defaults = { type: '' };

    let opts = Object.assign(defaults, options);

    this.createfilterBar({
      parent: 'filterBarPrimary',
      
      data: [
        { opc: 'input-calendar',  class: 'col-3', id: 'calendar', lbl: 'Consultar fecha: ' },
        // { opc: 'select', class: 'col-3', id: 'udn', lbl: 'Seleccionar UDN: ', data: udn },
        // { opc: 'select', class: 'col-3', id: 'udn', lbl: 'Seleccionar estados: ', data: estados },
        // ...(opts.type === 'admin' ? [
        //   { opc: 'button', class: 'col-3', id: 'btn', className: 'col-12', text: 'Nuevo evento', onClick: () => this.modalNewEvent() }] : [])
      ]

    });

 
    dataPicker({ parent: "calendar" ,
      onSelect: (start, end) => { this.ls(); }
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
                class: "btn btn-outline-primary btn-sm ",
                id: item.id || "dropdownMenu",
                type: "button",
                "data-bs-toggle": "dropdown",
                "aria-expanded": "false",
                html: `<i class="${item.iconClass || 'icon-dot-3 text-info'}"></i>`,
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


  async editModal(idEvent){

    let data = await useFetch({
      url: link,
      data : {opc:'editEvent',id: idEvent}
    });

    console.log('data',data);




    this.createModalForm({
      id: 'modal',
      autofill: data,

      bootbox: { title: 'Editar evento ' }, // agregar conf. bootbox
      json: [
        { id: "title", opc: "input", lbl: "Titulo:", required: true, class: "col-12", required: true },
        { id: "id_Season", opc: "select", lbl: "Temporada", data: temporadas, class: "col-12" },
        { id: "id_Replay", opc: "select", lbl: "Repetir evento:", data: [{ id: 1, valor: "Anual" }], class: "col-12" },
        
        { id: "date_init", opc: "input-calendar", class: "col-6", lbl: "Fecha inicial:" },
        { id: "date_end", opc: "input-calendar", class: "col-6", lbl: "Fecha final:" },

        { id: "id_UDN", opc: "select", lbl: "UDN:", data: udn, value: 8, class: "col-6", required: false, onchange: "calendarizacion.getListEmployed()" },
        { id: "id_Employed", opc: "select", class: "col-6", lbl: "Responsable (s):", multiple: true },
        { id: "activities", opc: "textarea", class: "col-12", lbl: "Actividades", rows: 5, required: true },
        { opc: "btn-submit", text: "Enviar", class: "col-12" },
      ],

      autovalidation: true,
      data: {  opc: 'set', id: 1 },
      beforeSend:()=>{},
      initialized:()=>{

      },
      success: (data) => { }
    });


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
