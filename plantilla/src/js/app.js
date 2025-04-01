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
        this.accordingMenu({
            parent:'root'
        });
        // this.layout();
    }


    accordingMenu(options) {
    const defaults = {
        parent: "tab-sub-event",
        id: "accordionExample",
        data: [
            {
                title: "Desayuno Buffet y Networking",
                fecha: "19/'04/2024",
                localizacion: "Jardin la ceiba",
                tipo: "Privado",
                body: "",
            },
            {
                title: "Ceremonia de apertura",
                fecha: "19/01/2024",
                localizacion: "Salón Principal",
                tipo: "Ceremonia",
                body: "Contenido de ejemplo del sub-evento.",
            },
        ],
    };

    const opts = Object.assign(defaults, options);
    const container = $('<div>', { id: opts.id, class: "space-y-2" });

    opts.data.forEach((opt, index) => {
        const item = $('<div>', {
            class: "bg-[#1F2A37] rounded-lg overflow-hidden border border-gray-800",
        });

        const header = $(`
        <div class="grid grid-cols-12 gap-4 p-4 items-center cursor-pointer hover:bg-gray-800/50">
            <div class="col-span-4 font-medium text-white">${opt.title}</div>
            <div class="col-span-2 text-gray-400">${opt.fecha}</div>
            <div class="col-span-2 text-gray-400">${opt.localizacion}</div>
            <div class="col-span-2">
            <span class="px-2 py-1 bg-gray-800 text-gray-200 text-sm rounded-full">${opt.tipo}</span>
            </div>
            <div class="col-span-2 flex justify-end gap-2">
            <button class="text-white hover:text-blue-500">✏️</button>
            <button class="text-red-500 hover:text-red-600">🗑️</button>
            <span class="text-gray-400 toggle-arrow">▾</span>
            </div>
        </div>
    `);

        const bodyWrapper = $('<div class="bg-gray-800/30 px-4 py-2 hidden border-t border-gray-700 text-sm text-gray-300">')
            .html(opt.body);

        header.on("click", function () {
            const isVisible = bodyWrapper.is(":visible");
            $(".accordion-body").slideUp();
            $(".toggle-arrow").text("▾");

            if (!isVisible) {
                bodyWrapper.slideDown().addClass("accordion-body");
                $(this).find(".toggle-arrow").text("▴");
            }
        });

        item.append(header, bodyWrapper);
        container.append(item);
    });

    $(`#${opts.parent}`).html(container);
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
