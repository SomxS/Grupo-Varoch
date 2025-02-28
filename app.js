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

  

    // 
    // app = new App("", "");
    // app.init();

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
    this.createNavBar();
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
          { opc: 'button', class: 'col-3', id: 'btn', className: 'col-12', text: 'Nuevo evento', onClick: () => this.modalNewEvent() }//] : [])
      ]

    });

 
    dataPicker({ parent: "calendar" ,
      onSelect: (start, end) => { this.ls(); }
  });

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
      success: (data) => {



       }
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

  modalNewEvent() {
    this.createModalForm({
      id: "mdlNewEvent",
      bootbox: { title: "Nuevo Evento ", id: "modalNuevoEvento", size: "large" },
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
      data: { opc: "addEvent", idEmploy: ($("#id_Employed").val() || []).join(',') },
      success: (data) => {
       
       
        let idEmployed = ($("#id_Employed").val() || []).join(',');

        const form = document.getElementById('mdlNewEvent');
        let formData = new FormData(form);
        formData.append('idEmployed', idEmployed);

        useFetch(
          {
            url: link,
            data: formData
          }
        )
      
        
        

        // if (data.success === true) alert();
        // temporadas = data.temporada;
        // this.ls();
      },
    });

    // initialized.
    this.getListEmployed();
    // datapicker
    dataPicker({ parent: "date_init", type: "simple" });
    dataPicker({ parent: "date_end", type: "simple" });
    // select2
    $("#id_Season").option_select({ select2: true, tags: true, father: true });
  }
  async getListEmployed() {
    let data = await useFetch({
      url: link,
      data: { opc: "getListEmployed", udn: $("#id_UDN").val() },
    });

    $("#id_Employed").attr("multiple", true);
    $("#id_Employed").option_select({ select2: true, father: true, data: data.employeds, multiple: true });
  }
}
