// let ctrl = "ctrl/app.php";
const link = 'https://erp-varoch.com/DEV/costsys/ctrl/ctrl-costo-potencial-soft.php';

const api = 'https://erp-varoch.com/DEV/ch/ctrl/ctrl-encuesta.php';
// init vars.
let app;


$(async () => {
    // await fn_ajax({ opc: "init" }, api_alpha).then((data) => {
        // vars.
        // instancias.
        app = new App(api,'root');
        app.init();
    // });
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Survey";
    }

    init() {
        this.render();
        this.QuestionLayout();
    }

    render(){
        // this.layout();
        // this.createNavBar();
       
        // this.filterBar();
    }

    layout() {
        // this.primaryLayout({
        //     parent: "root",
        //     id: "Primary",
        // });
        // this.historyPay();
        

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
        // this.groupCard();
    }

    createEndEvaluationButtons() {
        let buttons = [
          
            {
                opc: 'button',
                color: "outline-secondary fw-bold",
                icon: "icon-logout",
                text: "Salir de la evaluación",
                onClick: () => {
                    this.backEvaluation();
                },
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

        let group = await useFetch({ url: api, data: { opc: "getGroup" } });
      

        this.createButtonGroup({
            parent: 'groups',
            cols: 'w-1/4 h-24 text-xs',
            size: 'lg',
            class: 'd-flex justify-content-start',
            onClick: () => { this.initEvaluation() },
            dataEl: {
                data: group
            }
        });

       
    }

    // Evaluation

    initEvaluation(){

        this.createQuestionnaire({
            parent: 'questions',
            data: [
                {
                    title: 'TRABAJO EN EQUIPO',
                    questions: [
                        { text: '¿Se involucra en las actividades de equipo?' },
                        { text: '¿Aporta ideas y soluciones para resolver desafíos en equipo?'},
                        { text: '¿Se comunica de manera clara con el equipo?'}
                    ]
                },
                {
                    title: 'PROFESIONALISMO',
                    questions: [
                        { text: '¿Es una persona capacitada para realizar su trabajo?'}
                    ]
                },
                {
                    title: 'TRABAJO EN EQUIPO',
                    questions: [
                        { text: '¿Se involucra en las actividades de equipo?' },
                        { text: '¿Aporta ideas y soluciones para resolver desafíos en equipo?' },
                        { text: '¿Se comunica de manera clara con el equipo?' }
                    ]
                },
            ]
        });

    }

    backEvaluation() {
        alert({
            icon: "question",
            title: "¿Desea salir de la evaluación?",
            text: "No se completaran los cambios almacenados",
        }).then((result) => {
            if (result.isConfirmed) {
                this.render();
                
            }
        });
    }


}
