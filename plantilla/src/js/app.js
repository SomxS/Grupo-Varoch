// let ctrl = "ctrl/app.php";
const link = 'https://erp-varoch.com/DEV/costsys/ctrl/ctrl-costo-potencial-soft.php';

const api = 'https://erp-varoch.com/DEV/ch/ctrl/ctrl-encuesta.php';
// init vars.
let app;


$(async () => {
    // await fn_ajax({ opc: "init" }, api_alpha).then((data) => {
    // vars.
    // instancias.
    app = new App(api, 'root');
    app.init();
    // });
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Survey";
    }

    init() {
        this.render({
            evaluators: {
                id: 1,
                valor: [],
            },
            id: 41,
        });

    }

    render(options) {

        this.layout();

       

    }

    layout() {
        this.tabsLayout({
            parent: "root",
          
           
            json: [
                {
                    tab: "Creados",
                    id: "gestorCreados",
                   
                    contenedor: [
                        { class: " min-h-[10%] line", id: "filterBarGestorCreados" },
                        { class: "h-[83%] flex-grow line mt-2", id: "containerGestorCreados" },
                    ],
                    active: true,
                },
            ],
        });


        // this.primaryLayout({
        //     parent: 'root',
        //     class:'flex flex-col h-full',
        //     card: {
        //         class:'h-full',
        //         filterBar: {class:'h-[10%] line'},
        //         container: {class:'h-[88%] mt-2 line '}

        //     }
        // });

    }


    filterBar(options) {
        this.createfilterBar({
            parent: "filterBar",
            data: [
                { opc: "select", class: "col-3", id: "UDNs", lbl: "Seleccionar UDN: ", data: [{ id: 4, valor: 'BAOS' }] },
                { opc: "input-calendar", class: "col-3", id: "calendar", lbl: "Consultar fecha: " },
            ],
        });
        // initialized.
        dataPicker({
            parent: "calendar",
            onSelect: (start, end) => {
                // this.ls();
            },
        });
    }

    ls(options) {

        let rangePicker = getDataRangePicker("calendar");

        this.createTable({
            parent: "containerCalendarizacion",
            idFilterBar: "filterBarCalendarizacion",

            data: { opc: "lsEvents", date_init: rangePicker.fi, date_end: rangePicker.ff },
            conf: { datatable: false, pag: 15 },
            attr: {

                class_table: "table table-bordered table-sm table-striped text-uppercase",
                id: "lsTable",
                center: [1, 2, 3, 6, 7],
                extends: true,

            },
        });



    }



    async groupCard(options) {

        let group = await useFetch({ url: api, data: { opc: "getGroup" } });


        this.createGroups({
            parent: "groups",
            title: "Evaluados",

            data: [
                { id: 1, valor: "SERGIO OSORIO MENDEZ", items: 2, result: 5, },
                { id: 2, valor: "ROSA ANGELICA PEREZ VELASQUEZ", items: 2, result: 8, },
                { id: 3, valor: "LEONARDO D J. MARTINEZ DE LA CRUZ", items: 8, result: 8, }
            ],
            onclick: (id) => {
                this.initEvaluation(options, id);
            }
        });
        // this.initEvaluation();


    }

    // Evaluation


}
