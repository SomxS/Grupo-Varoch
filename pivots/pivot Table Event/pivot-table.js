
let status;
let app;

const api = "ctrl/ctrl.php";

$(() => {
    app = new App(api, "root");
    app.init();
});

class App extends Templates {
    
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "";
    }

    init(){
        this.render();
    }

    render() {
        this.layout();
        this.filterBar();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            class: 'd-flex mx-2 my-2 h-100 mt-5 p-2',
            card: {
                filterBar: { class: 'lg:h-[12%] line', id: "filterBar" + this.PROJECT_NAME },
                container: { class: 'lg:h-[88%] line', id: "container" + this.PROJECT_NAME },
            },
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterBarEventos",
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-2",
                    id: "calendar" + this.PROJECT_NAME,
                    lbl: "Consultar fecha: ",
                },
                {
                    opc: "select",
                    class: "col-sm-2",
                    id: "status",
                    lbl: "Seleccionar estados: ",
                    data: status,
                    onchange: "app.ls()",
                },
                
                {
                    opc      : "button",
                    className: "w-100",
                    class    : "col-sm-2",
                    color_btn: "primary",
                    id       : "btnNuevoEvento",
                    text     : "Nuevo evento",
              
                    onClick: () => this.add()
                },
            
            ],
        });

        // initialized.

        dataPicker({
            parent: "calendar" + this.PROJECT_NAME,
            rangepicker: {
                startDate: moment().startOf("month"), 
                endDate: moment().endOf("month"), 
                showDropdowns: true,
                ranges: {
                    "Mes actual": [moment().startOf("month"), moment().endOf("month")],
                    "Semana actual": [moment().startOf("week"), moment().endOf("week")],
                    "Proxima semana": [moment().add(1, "week").startOf("week"), moment().add(1, "week").endOf("week")],
                    "Proximo mes": [moment().add(1, "month").startOf("month"), moment().add(1, "month").endOf("month")],
                    "Mes anterior": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
                },
            },
            onSelect: (start, end) => {
                this.ls();
            },
        });
    }

    ls() {
        let rangePicker = getDataRangePicker("calendar" + this.PROJECT_NAME);
     
        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "list" + this.PROJECT_NAME, fi: rangePicker.fi, ff: rangePicker.ff },
            conf: { datatable: true, pag: 10 },
            attr: {
                id     : "tb" + this.PROJECT_NAME,
                center : [1],
                right  : [2],
                extends: true,
            },
           
        });
    }

    // Crud 

    add() {
        this.createModalForm({
            id: 'formModal',
            data: { opc: 'addPeriod' },
            bootbox: {
                title: '<strong>Nuevo Periodo</strong>',
                // size: 'large'
            },
            json: [
                { opc: 'input', lbl: 'Descripción', id: 'nombre', class: 'col-12', tipo: 'texto', required: true },
                { opc: 'input', lbl: 'Fecha de inicio', id: 'fecha_inicio', type: 'date', class: 'col-6', required: true },
                { opc: 'input', lbl: 'Fecha de fin', id: 'fecha_fin', type: 'date', class: 'col-6', required: true },
                { opc: 'textarea', lbl: 'Observaciones', id: 'observaciones', class: 'col-12' },
            ],
            success: (response) => {
                if (response.status == 200) {
                    alert({ icon: "success", text: response.message });
                    this.ls();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
    }

    async edit(id) {

        let request = useFetch({
            url: this._link,
            data: { opc: 'getPeriod', id: id }
        });

        this.createModalForm({
            id: 'formModalEdit',
            data: { opc: 'editPeriodo', id: id },
            bootbox: {
                title: '<strong>Editar </strong>'
            },
            
            autofill: request.data,
            
            json: [
                { opc: 'input', lbl: 'Descripción', id: 'nombre', class: 'col-12', tipo: 'texto', required: true },
                { opc: 'input', lbl: 'Fecha de inicio', id: 'fecha_inicio', type: 'date', class: 'col-6', required: true },
                { opc: 'input', lbl: 'Fecha de fin', id: 'fecha_fin', type: 'date', class: 'col-6', required: true },
                { opc: 'textarea', lbl: 'Observaciones', id: 'observaciones', class: 'col-12' },
            ],

            success: (response) => {
                if (response.status == 200) {
                    alert({ icon: "success", text: response.message });
                    this.ls();
                } else {
                    alert({ icon: "error", text: response.message });
                }
            }
        });
      
    }






    async show(id) {

        let data = await useFetch({ url: link, data: { opc: "get", id: id } });
        let tr = $(event.target).closest("tr");
        let title = tr.find("td").eq(1).text();

        bootbox.dialog({
            title: `
                    <div>
                        <h5>${title}</h5>
                        <p class="font-11 text-muted mb-0 pb-0 mt-1"><i class="icon-location"></i>${locacion}</p>
                    </div>`,
            closeButton: true,

        });


    }

    cancel(id) {
        let tr = $(event.target).closest("tr");
        let title = tr.find("td").eq(1).text();
        
        this.swalQuestion({
            opts: {
                title: `¿Esta seguro?`,
                text: "Esta apunto de cancelar el registro ",
            },
            data: { opc: "cancel"+this.PROJECT_NAME, status: 3, id: id },
            methods: {
                request: (response) => {
                    if (response.status == 200) {
                       
                        alert({
                            icon: "success", text: response.message,
                        });

                        this.ls();
                    } else{
                        alert({
                            icon: "error", text: response.message,
                        });

                    }
                },
            },
        });
    }

}
