// let ctrl = "ctrl/app.php";
const link = 'https://erp-varoch.com/DEV/costsys/ctrl/ctrl-costo-potencial-soft.php';

const api_alpha = 'https://erp-varoch.com/DEV/ch/ctrl/ctrl-encuesta.php';
// init vars.
let app;


$(async () => {
    // await fn_ajax({ opc: "init" }, api_alpha).then((data) => {
        
        // vars.
       
        
        // instancias.

        app = new App(api_alpha,'root');
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
        this.createNavBar();
      
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
        $('#content-header-' + this.PROJECT_NAME).append(`
        <div class="flex flex-col line">
          <!-- Título principal -->
            <h3 class="font-bold text-blue-950 uppercase text-center mb-2 text-lg">
            Sistema de Evaluación de Resultados - Valores
            </h3>
            
            <!-- Descripción o subtítulo -->
            <p class="text-gray-700 text-sm mb-2">
                En grupo VAROCH buscamos mejorar nuestros procesos y desempeño.
                Por favor evalúa a las siguientes personas de acuerdo con la siguiente escala y coloca el número correspondiente:
            </p>

         <span class="text-gray-800 font-semibold  text-xs "> 5= Totalmente de acuerdo,  4= De acuerdo, 3= Ni de acuerdo ni en desacuerdo, 2= En desacuerdo, 1= Totalmente en desacuerdo</span>
        
        </div> `);


        // initials.
        this.createEndEvaluationButtons();
        this.groupCard();
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

    addSurvey() {
        let json = [
            {
                opc: "select",
                id: "id_Format",
                lbl: "¿Qué documento evaluará?",
                class: "mt-2",
                // data: tipoformatos,
            },
            {
                opc: "select",
                id: "camarista",
                lbl: "Camarista",
                class: "mt-2",
                // data: camarista,
            },
            {
                opc: "select",
                id: "lavandera",
                lbl: "Lavandera",
                class: "mt-2",
                // data: lavanderas,
            },
            {
                opc: "input",
                type: "date",
                id: "date_create",
                lbl: "Fecha de evaluación",
                class: "col-12 mt-2",
                value: new Date().toISOString().split("T")[0],
            },
            {
                opc: "input",
                id: "suite",
                lbl: "Suite",
                class: "col-12 mt-2",
            },
          
        ];

        this.createModalForm({
            bootbox: {
                idFormulario: "formStartEvaluation",
                title: "Iniciar evaluación",
            },
            json: json,
            autovalidation: true,
            data: {
                opc: "newEvaluation",
            },
            btnSuccess: {
                className: "w-100",
                text: "Iniciar evaluación ",
                class:'col-12'
            },
            btnCancel:{
                text: " adios",
                className: "w-full ",
                class:'d-none'
            },

            success: (data) => {
                $("#containerTable").empty();
                $("#containerBar").addClass("hide");
                $("#navEvaluation").addClass("hide");
                $("#navEvaluate").removeClass("hide");
                fn_ajax({ opc: "getFolio", idFolio: data }, this._link).then((data) => {
                    this.showEvaluation(data.group, data.folio);
                });
            },
        });
        $("#id_Format").addClass("text-uppercase");
    }

    async groupCard() {

        let group = await useFetch({ url: api_alpha, data: { opc: "init" } });

        this.createButtonGroup({
            parent: 'groups',
            cols: 'w-1/4 h-24 text-xs',
            size: 'lg',
            class: 'd-flex justify-content-start',
            onClick: () => { this.initEvaluation() },
            dataEl: {
                data: group.udn
            }
        });

        this.initEvaluation();

       
    }

    // Evaluation

    async initEvaluation(){

        let questions = await useFetch({ url: api_alpha, data: { opc: "getQuestionnaire" } });

    
        this.createEvaluation({
            parent: 'questions',
            data: questions,

            questions:{
                data: [],
                json: questions
            },

            info: {
                user: 'Sergio Osorio',
                puesto: 'Desarrollador'
            }
     
        });

    }

    backEvaluation() {
        alert({
            icon: "question",
            title: "¿Desea regresar?",
            // text: "Si regresa puede que algunos cambios no se guarden.",
        }).then((result) => {
            if (result.isConfirmed) {
                this.render();
                
            }
        });
    }


    createEvaluation(options) {
        let defaults = {
            parent: 'questionnaireContainer',
            questions: {
                data: [],
                json: []
            },
            info: {
                user: '',
                puesto: 'somx'
            },
            options: ['1', '2', '3', '4', '5']
        };

        let opts = Object.assign({}, defaults, options);

        let container = $('<div>', { class: 'questionnaire p-3 bg-gray-200 rounded-lg shadow-sm overflow-auto', id: opts.parent, style: 'max-height: 600px;' });

        let mainTitle = $('<div>', { class: 'p-3 text-sm rounded-lg' }).append(
            $('<span>', { class: '', html: `<strong>  Nombre:</strong> ${opts.info.user} | ` }),
            $('<span>', { class: 'mb-1', html: `<strong>Puesto:</strong> ${opts.info.puesto}` })
        );
        let titleElement = $('<h4>', { class: 'text-uppercase', html: mainTitle });
        container.append(titleElement);

        opts.questions.json.forEach(section => {
            let sectionContainer = $('<div>', { class: 'mb-4 p-3 bg-white rounded-md shadow-sm' });

            let header = $('<h6>', { class: 'fw-bold text-uppercase mb-2', text: section.title });
            sectionContainer.append(header);

            section.questions.forEach(question => {
                let questionContainer = $('<div>', { class: 'mb-3' });

                let questionText = $('<p>', { class: 'text-muted font-semibold mb-1', text: question.text });

                let buttonGroup = $('<div>', { class: 'relative flex grid grid-cols-5 gap-3' });

                opts.options.forEach(opt => {
                    let button = $('<button>', {
                        class: 'btn btn-outline-secondary rounded-2 px-2 py-2 shadow-sm',
                        text: opt,
                        click: function () {
                            $(this).siblings().removeClass('active btn-primary text-white').addClass('btn-outline-secondary');
                            $(this).addClass('active btn-primary text-white').removeClass('btn-outline-secondary');
                        }
                    });
                    buttonGroup.append(button);
                });

                questionContainer.append(questionText, buttonGroup);
                sectionContainer.append(questionContainer);
            });

            container.append(sectionContainer);
        });

        $('#' + opts.parent).html(container);
    }

}
