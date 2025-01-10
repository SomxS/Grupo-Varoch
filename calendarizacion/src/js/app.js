const link = "ctrl/app.php";

// const link = "https://erp-varoch.com/ERP24/produccion/control-fogaza/ctrl/ctrl-pedidos-list.php";

// init vars.
let app, calendarizacion;

let udn, estados, temporadas, form_elements;

$(async () => {
    await fn_ajax({ opc: "init" }, ctrl).then((data) => {
        // vars.
        udn = data.udn;
        estados = data.estados;
        temporadas = data.temporada;

        calendarizacion = new Calendarizacion(ctrl, "");
        calendarizacion.init();
    });
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    init() {
        this.render();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: "Calendarizacion",
        });
    }

    filterBar(options) {
        let defaults = {
            type: "",
        };

        let opts = Object.assign(defaults, options);

        this.createfilterBar({
            parent: "filterBarCalendarizacion",
            data: [
                { opc: "input-calendar", class: "col-3", id: "calendar", lbl: "Consultar fecha: " },
                { opc: "select", class: "col-3", id: "udn", lbl: "Seleccionar UDN: ", data: udn },
                { opc: "select", class: "col-3", id: "udn", lbl: "Seleccionar estados: ", data: estados },
                ...(opts.type === "admin" ? [{ opc: "button", class: "col-3", id: "btn", className: "col-12", text: "Nuevo evento", onClick: () => this.modalNewEvent() }] : []),
            ],
        });

        // initialized.

        dataPicker({
            parent: "calendar",
            onSelect: (start, end) => {
                this.ls();
            },
        });
    }

    ls(options) {
        let rangePicker = getDataRangePicker("calendar");
        this._link = link;

        this.createTable({
            parent: "containerCalendarizacion",
            idFilterBar: "filterBarCalendarizacion",

            data: { opc: "lsEvents", fi: rangePicker.fi, ff: rangePicker.ff },
            conf: { datatable: true, pag: 3 },
            attr: {
                class_table: "table table-bordered table-sm table-striped text-uppercase",
                id: "otroID",
                center: [1, 2, 3, 6, 7],
                extends: true,
            },
            extends: false,
        });
    }
}
