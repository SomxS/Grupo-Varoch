const link = "ctrl/app.php";


// init vars.
let app, calendarizacion;

let udn, udnForm,estados, typeFilter, temporadas, form_elements;

$(async () => {
    await fn_ajax({ opc: "init" }, link).then((data) => {
        // vars.
        udn        = data.udn;
        udnForm    = data.udnForm;
        estados    = data.estados;
        temporadas = data.temporada;
        typeFilter = data.type;

        calendarizacion = new Calendarizacion(link, "");
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
            class:'justify-content-end',
            data: [
                { opc: "input-calendar", class: "col-3 col-lg-3", id: "calendar", lbl: "Consultar fecha: " },
                { opc: "select", class: "col-3 col-lg-3", id: "udn", lbl: "Seleccionar UDN: ", data: udn },
                { opc: "select", class: "col-3 col-lg-2", id: "status", lbl: "Seleccionar estados: ", data: estados },
                ...(opts.type === "admin" ? [{ opc: "button", class: "col-3 col-lg-2", id: "btn", className: "col-12 ", text: "Nuevo evento", onClick: () => this.modalNewEvent() }] : []),
                ...(opts.type === "admin" ? [{ opc: "button", class: "col-3 col-lg-2", id: "btn", className: "col-12 btn-success", text: "<i class='icon-whatsapp'></i>Enviar recordatorios", onClick: () => this.reminderModal() }] : []),
            ],
        });

        $('#idFilterBar').addClass('justify-content-end');

        $("#udn, #status")
            .off("change")
            .on("change", () => this.ls());

        // initialized.

        dataPicker({
            parent: "calendar",
            rangepicker:{
                startDate: moment().subtract(1, 'months').startOf('month'),
                endDate: moment().add(1, 'months').endOf('month'),

                ranges: {
                    'Periodo 3 meses': [moment().subtract(3, 'months').startOf('month'), moment().add(1, 'months').endOf('month')],
                    'Mes Actual': [moment().startOf('month'), moment().endOf('month')],
                    'Mes Anterior': [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')],
                    'Mes Siguiente': [moment().add(1, 'months').startOf('month'), moment().add(1, 'months').endOf('month')],
                    'Semana Actual': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                },

            },
            onSelect: (start, end) => {
                this.ls();
            },
        });

        $('#status').val(1); // cambiar a en proceso
    }

    ls(options) {
        let rangePicker = getDataRangePicker("calendar");
        this._link = link;

        this.createTable({
            parent: "containerCalendarizacion",
            idFilterBar: "filterBarCalendarizacion",

            data: { opc: "lsEvents", date_init: rangePicker.fi, date_end: rangePicker.ff },
            conf: { datatable: true, pag: 15 },
            attr: {
                class_table: "table table-bordered table-sm table-striped text-uppercase",
                id: "lsTable",
                center: [1, 2, 3, 6, 7],
                extends: true,
            },
            extends: false,
        });
    }

    modalFormEvents(options) {

        let defaults = {
            id: "mdlEvent",

            bootbox: { title: "editar Evento ", id: "modalNuevoEvento", size: "large" },
            json: [
                { id: "id_UDN", opc: "select", lbl: "UDN:", data: udnForm, value: 8, class: "col-12", required: false, onchange: "calendarizacion.getListEmployed()" },
                { id: "title", opc: "input", lbl: "Titulo:", required: true, class: "col-12", required: true },
                { id: "id_Season", opc: "select", lbl: "Temporada", data: temporadas, class: "col-12" },
                { id: "id_Replay", opc: "select", lbl: "Repetir evento:", data: [{ id: 1, valor: "Anual" }], class: "col-12" },
                { id: "date_init", opc: "input-calendar", class: "col-6", lbl: "Fecha inicial:" },
                { id: "date_end", opc: "input-calendar", class: "col-6", lbl: "Fecha final:" },
                { id: "activities", opc: "textarea", class: "col-12", lbl: "Actividades", rows: 5, required: true },
                { id: "id_Employed", opc: "select", class: "col-12", lbl: "Responsable (s):", multiple: true },
            ],

            validation: true,

            dynamicValues: {
                id_Employed: "#id_Employed",
            },
            
            success: (data) => {

                if (data.success === true) {
                    alert();
                    temporadas = data.temporada;
                    this.ls();
                }
            }
        };


        let opts = this.ObjectMerge(defaults, options)


        this.createModalForm(opts);
        // initialized.
        this.getListEmployed();
        // datapicker
        dataPicker({ parent: "date_init", type: "simple" });
        dataPicker({ parent: "date_end", type: "simple" });
        // select2
        $("#id_Season").option_select({ select2: true, tags: true, father: true });

    }

    sendMessage(){
        this.createModalForm({
            id: 'modal',

            bootbox: { title: '' }, // agregar conf. bootbox
            json: [{ opc: 'input-group' }],
            autovalidation: true,
            data: { opc: 'set', id: 1 },

            success: (data) => { }
        });

    }
}
