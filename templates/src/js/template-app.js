
// Variables.
let udn;
let app;// instancia de la clase

// let api = "https://huubie.com.mx/alpha/eventos/ctrl/ctrl-eventos.php";
let api = "ctrl/template-ctrl.php";

$(async () => {
    // fn_ajax({ opc: "init" }, api).then((response) => {
        // udn = response.udn;
        app = new App(api, "root");
        app.init();
    // });
});


class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = ""; // Establecer el nombre del proyecto

    }

    init() {
        this.render();
    }

    render() {
        this.layout();
        this.filterBar();
        this.ls();
    }

    layout() {

        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'lg:h-[12%] line', id: "filterBar" + this.PROJECT_NAME },
                container: { class: 'lg:h-[88%] line', id: "container" + this.PROJECT_NAME },
            },
        });
    }

    filterBar(){
        this.createfilterBar({
            parent: "filterBar"+this.PROJECT_NAME,
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-3",
                    id: "calendar"+this.PROJECT_NAME,
                    lbl: "Buscar por fecha: ",
                },

                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "udn",
                    lbl: "Seleccionar udn: ",
                    data: udn,
                    onchange: "app.ls()",
                },

                {
                    opc: "button",
                    className: "w-100",
                    class: "col-sm-3",
                    color_btn: "primary",
                    id: "btnNew",
                    text: "Nuevo",
                    onClick: () => this.add()
                },

                
            ],
        });
        
        // initialized
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
        let rangePicker = getDataRangePicker("calendar"+this.PROJECT_NAME);
     
        this.createTable({
            parent: "container"+this.PROJECT_NAME,
            idFilterBar: "filterBar"+this.PROJECT_NAME,
            data: { opc: "ls", fi: rangePicker.fi, ff: rangePicker.ff,status:0 }, // se pueden agregar mas parametros
            
            conf: {
                datatable: true,
                pag: 10,
            },
            attr: {
                id     : "tb"+this.PROJECT_NAME,
                center : [1, 2, 7, 9, 10],
                right  : [5],
                extends: true,
            },
          
        });
    }


    // [CRUD]
    add() {

        this.createModalForm({
            id: 'frmModal'+this.PROJECT_NAME,
            data: { opc: 'add'},
            
            bootbox: {
                title: '<strong>Nuevo</strong>',
                size: 'large'
            },
            
            json: [
              
                { opc: 'input', lbl: 'Nombre', id: 'name', class: 'col-6 mb-3', tipo: 'texto', required: true },
                {
                    opc: 'select', lbl: 'Tipo', id: 'type', class: 'col-6 mb-3', data: [
                        { id: 'Abierto', valor: "Abierto" },
                        { id: 'Privado', valor: "Privado" },
                    ]
                },
                { opc: "input", value: 1, lbl: "Número de personas", id: "quantity_people", class: "col-6 mb-3 ", tipo: "cifra", required: true, placeholder: "0" },
                { opc: 'input', lbl: 'Localización', id: 'location', class: 'col-6', tipo: 'texto', required: true },
               
                { opc: 'textarea', lbl: 'Observaciones', id: 'notes', class: 'col-12' },

            ],
            success: (response) => {
                if (response.status == 200) {

                    alert({
                        icon: "success",
                        title: "Se ha creado con exito",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok",
                    });

                    this.ls();

                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok",
                    });

                }

            }
        });

    

    }
    
    
}
