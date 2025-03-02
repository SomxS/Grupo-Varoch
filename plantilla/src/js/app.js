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
        this.PROJECT_NAME = "Survey";
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
        // this.primaryLayout({
        //     parent: "root",
        //     id: "Primary",
        // });
        // this.historyPay();
        this.QuestionLayout();

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


    // Components. valores
    QuestionLayout(options) {
        let jsonComponents = {
            id: `content-${this.PROJECT_NAME}`,
            parent:'root',
            class: "row px-3 py-2",
            contenedor: [
                {
                    type: "div",
                    class: "col-12 line",
                    id: `content-header-${this.PROJECT_NAME}`,
                },
                {
                    type: "div",
                    class: "col  line",
                    id: `content-questions-${this.PROJECT_NAME}`,
                    children: [
                        { class: "col-12 ", id: "groups" },
                        { class: "col-12 p-2 ", id: "questions" },
                    ],
                },
                {
                    type: "div",
                    class: "col-12 text-end py-4 line",
                    id: `content-footer-${this.PROJECT_NAME}`,
                },
            ],
        };

        let opts = Object.assign(jsonComponents, options);

        this.createPlantilla({
            data: jsonComponents,
            parent: opts.parent,
            design: false,
        });


        // initials.
        this.createEndEvaluationButtons();
        this.groupCard();
    }

    createEndEvaluationButtons() {
        let buttons = [
            {
                opc: 'btn',
                icon: "icon-logout",
                color: "outline-secondary fw-bold",
                text: "Salir de la evaluación",
                fn: this.instancia + '.backEvaluation()'
            },
            {
                opc: 'button',
                color: "primary fw-bold",
                icon: "icon-check",
                text: "Terminar evaluación",
                onClick: () => {
                    this.init();
                },
            },
        ];

        this.createButtonGroup({
            data: buttons,
            class: "justify-content-end gap-2 pt-2",
            parent: "content-footer-" + this.PROJECT_NAME,
            size: "sm",
            cols: "w-25 p-2",
        });
    }

    async groupCard() {

        this.createButtonGroup({
            parent: 'groups',
            cols: 'w-25 p-3',
            size: 'sm',
            class: 'd-flex justify-content-start',
            onClick: () => { this.initEvaluation() },
            dataEl: {
                data: [
                    { id:1,valor: 'LEONARDO DE JESUS MARTINEZ DE LA CRUZ' },
                    { id:2,valor: 'SERGIO OSORIO MENDEZ'},
                    { id:3,valor: 'ROSA ANGELICA PEREZ VELAZQUEZ'},
                 
                ]
            }
        });

       
    }


    initEvaluation(){

        this.createQuestionnaire({
            parent: 'questions',
            data: [
                {
                    title: 'TRABAJO EN EQUIPO',
                    questions: [
                        { text: '¿Se involucra en las actividades de equipo?', options: [1, 2, 3, 4, 5] },
                        { text: '¿Aporta ideas y soluciones para resolver desafíos en equipo?', options: [1, 2, 3, 4, 5] },
                        { text: '¿Se comunica de manera clara con el equipo?', options: [1, 2, 3, 4, 5] }
                    ]
                },
                {
                    title: 'PROFESIONALISMO',
                    questions: [
                        { text: '¿Es una persona capacitada para realizar su trabajo?', options: [1, 2, 3, 4, 5] }
                    ]
                },
                {
                    title: 'TRABAJO EN EQUIPO',
                    questions: [
                        { text: '¿Se involucra en las actividades de equipo?', options: [1, 2, 3, 4, 5] },
                        { text: '¿Aporta ideas y soluciones para resolver desafíos en equipo?', options: [1, 2, 3, 4, 5] },
                        { text: '¿Se comunica de manera clara con el equipo?', options: [1, 2, 3, 4, 5] }
                    ]
                },
            ]
        });

    }

    










}
