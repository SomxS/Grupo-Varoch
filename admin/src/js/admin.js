let ctrl = "ctrl/app.php";


// init vars.
let app, calendarizacion;

let udn, udnForm, estados, temporadas, form_elements;
const link = 'https://erp-varoch.com/DEV/calendarizacion/ctrl/app.php';


$(async () => {
    await fn_ajax({ opc: "init" }, link).then((data) => {
        
        // vars.
        udn        = data.udn;
        udnForm    = data.udnForm;
        estados    = data.estados;
        temporadas = data.temporada;
        
        // 
        calendarizacion = new Calendarizacion(link, "");
        calendarizacion.init();
    
    });

});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    init() {
        this.createNavBar();
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
                { opc: "select", class: "col-3", id: "status", lbl: "Seleccionar estados: ", data: estados },
                ...(opts.type === "admin" ? [{ opc: "button", class: "col-3", id: "btn", className: "col-12", text: "Nuevo evento", onClick: () => this.modalNewEvent() }] : []),
            ],
        });

        $("#udn, #status")
            .off("change")
            .on("change", () => this.ls());

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
     
        this.createTable({
            parent: "containerCalendarizacion",
            idFilterBar: "filterBarCalendarizacion",

            data: { opc: "lsEvents", date_init: rangePicker.fi, date_end: rangePicker.ff },
            conf: { datatable: false, pag: 15 },
            attr: {
               
                class_table: "table table-bordered table-sm table-striped text-uppercase",
                id         : "lsTable",
                center     : [1, 2, 3, 6, 7],
                extends    : true,
                
            },
        });

        
       
    }
}
