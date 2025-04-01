
let status;

class Table extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "";

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
                filterBar: { class: 'w-full my-3 ', id: 'filterBar' + this.PROJECT_NAME },
                container: { class: 'w-full my-3 bg-[#1F2A37] rounded-lg  p-3', id: 'container' + this.PROJECT_NAME }
            }
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
              
                    onClick: () => this.newEvent()
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

    ls(options) {
        let rangePicker = getDataRangePicker("calendar" + this.PROJECT_NAME);
        this._link = link;

        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: { opc: "ls" + this.PROJECT_NAME, fi: rangePicker.fi, ff: rangePicker.ff },
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tb" + this.PROJECT_NAME,

                center: [1],
                right: [2],
                extends: true,
            },
           
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
