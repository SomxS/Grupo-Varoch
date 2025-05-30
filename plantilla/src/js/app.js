
// init vars.
let app, sub;

let api = "https://huubie.com.mx/alpha/eventos/ctrl/ctrl-eventos.php";


$(async () => {

    // instancias.
    app = new App(api, 'root');
    app.init();

});

class App extends UI {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "";
    }

    init() {
        this.render();
    }

    render(options) {


        this.tabLayout({
            parent: "root",
            id: "tabComponent",
            json: [
                { id: "recorder", tab: "EnviarRegistros", icon: "", active: true, onClick: () => { } },
                { id: "concentrado", tab: "Graficos", icon: "", onClick: () => { } },
              ]
        });

        this.viewTable();

    }

    async viewTable(options) {
        let data = await useConexion({
            url: this._link,
            data: { opc: 'lsVentas', fi: '2025-05-01', ff: '2025-05-31', status:0 }
        });

     
        this.createTableComponent({
            parent: "container-recorder",
            data: data,
            theme:'corporativo',
            id:'tbTable'
        });

        simple_data_table('#tbTable');

       
    }

    layout() {
        this.tabsLayout({
            parent: "root",
            
            json: [
                {
                    tab: "Eventos",
                    id: "gestorEventos",
                    class:'bg-gray-800',
                    onClick: () => this.showSubEvent(),
                    contenedor: [
                        { class: "lg:h-[10%] ", id: "filterBar" },
                        { class: "lg:h-[83%] flex-grow  mt-2", id: "container" },
                    ],
                    active: true,
                }
            ]
        });

        this.showSubEvent();
    }

    filterBar() {

        this.createfilterBar({
            parent: "filterBarprimaryLayout",
            data: [
                {
                    opc: "button",
                    color_btn: 'danger',
                    class: "col-3",
                    className: 'w-full',
                    id: "btn",
                    text: 'PDF',

                    onClick: () => {

                        this.onShow();
                    }
                },
            ],

        });


    }

    ls() {

        this.createTable({
            parent: "container-recorder",
            idFilterBar: "filterBarEventos",
            data: { opc: 'list', filtroUDN: 'all', filtroPeriodo: 'mes' },
            conf: { datatable: false, pag: 15 },
            coffeesoft:true,
            attr: {
                id: "tablaEventos",
                center: [1, 2, 3, 6, 7],
                extends: true,
            },
        });
    }


    // JSON
     jsonExample(){
         return {
             thead: ["Fecha", "Actividad", "Encargado", "Estado",""],
             row: [
                 {
                     id: 1,
                     Fecha: {
                         html: "08-abr-2025<br>18-abr-2025",
                         class: "bg-red-400 text-white text-center rounded-l px-2 py-1"
                     },
                     Actividad: "Enviar comprobantes",
                     Encargado: "Ana",
                     Estado: {
                         html: `<span class="flex w-32 justify-content-center text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⏳ EN PROCESO
                 </span>`,
                         class: "text-center"
                     },

                     dropdown: [
                         {
                             text: "Ver",
                             icon: "icon-eye",
                             onclick: "console.log('Ver ID 1')"
                         },
                         {
                             text: "Editar",
                             icon: "icon-pencil",
                             onclick: "console.log('Editar ID 1')"
                         }
                     ]
                 },
                 {
                     id: 1,
                     Fecha: {
                         html: "08-abr-2025<br>18-abr-2025",
                         class: "bg-red-400 text-white text-center rounded-l px-2 py-1"
                     },
                     Actividad: "colchas o waffles pagar la cotización que se envió en la requisición",
                     Encargado: "Hernesto",
                     Estado: {
                         html: `<span class="flex w-32 justify-content-center text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⏳ EN PROCESO
                 </span>`,
                         class: "text-center"
                     },

                     dropdown: [
                         {
                             text: "Ver",
                             icon: "icon-eye",
                             onclick: "console.log('Ver ID 1')"
                         },
                         {
                             text: "Editar",
                             icon: "icon-pencil",
                             onclick: "console.log('Editar ID 1')"
                         }
                     ]
                 },
                 {
                     id: 1,
                     Fecha: {
                         html: "08-abr-2025<br>18-abr-2025",
                         class: "bg-red-400 text-white text-center rounded-l px-2 py-1"
                     },
                     Actividad: "colchas o waffles pagar la cotización que se envió en la requisición",
                     Encargado: "Sofia",
                     Estado: {
                         html: `<span class="flex w-32 justify-content-center text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⏳ EN PROCESO
                 </span>`,
                         class: "text-center"
                     },

                     dropdown: [
                         {
                             text: "Ver",
                             icon: "icon-eye",
                             onclick: "console.log('Ver ID 1')"
                         },
                         {
                             text: "Editar",
                             icon: "icon-pencil",
                             onclick: "console.log('Editar ID 1')"
                         }
                     ]
                 }
             ]
         }

    }
}



