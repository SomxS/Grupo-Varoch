// let ctrl = "ctrl/app.php";
const link = 'https://erp-varoch.com/DEV/costsys/ctrl/ctrl-costo-potencial-soft.php';

const api_alpha = 'https://huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php';
// init vars.
let app;


$(async () => {
    await fn_ajax({ opc: "init" }, link).then((data) => {
        
        // vars.
       
        
        // instancias.

        app = new App(link,'root');
        app.init();
   
    
    });

});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    init() {
        this.render();
        
    }

    render(){
        this.createNavBar();
        this.layout();
        // this.filterBar();
    }

    layout() {
        this.primaryLayout({
            parent: "root",
            id: "Primary",
        });
        this.historyPay();

    }


    filterBar(options) {

  

        this.createfilterBar({
            parent: "filterBar",
            data: [
                { opc: "select", class: "col-3", id: "UDNs", lbl: "Seleccionar UDN: ", data: [{id: 4, valor:'BAOS'}] },
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
                id         : "lsTable",
                center     : [1, 2, 3, 6, 7],
                extends    : true,
                
            },
        });

        
       
    }

    // add component.

    async historyPay() {
        
        const data = await this.useFetch({ url: api_alpha, data: { opc: "getHistory" } });


        console.log(data);

        this.createTimeLine({
            parent: "containerPrimary",
            data: [
                { valor: "Se agregó un pago", date: "Hoy 15:07", message: "En efectivo por $5,000.00", type: "payment" },
                { valor: "Se agregó un comentario", date: "Hoy 15:07", message: "Este pago se realizó con efectivo.", type: "comment" },
                { valor: "Nuevo evento programado", date: "Ayer 12:00", message: "Evento de conferencia en el auditorio", type: "event" },
                { valor: "Acción desconocida", date: "Ayer 10:30", message: "Este evento no tiene un tipo definido", type: "otroTipo" }

               
            ]
        });
    }







}
