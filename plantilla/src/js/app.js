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
        this.createTableForm({
            parent: "root",
        
          
        });
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

    // add components

    createTableForm(options) {

        // 📜 **Definición de configuración por defecto**
        
        let defaults = {
            id: options.id || 'root', // Identificador de referencia
            
            table: {
                id:'contentTable',
                parent: 'contentTable' + (options.id || 'root'),
                idFilterBar:'filterBar',
                data: { opc: "lsInventory" },
                conf: {
                    datatable: false,
                    fn_datatable: 'simple_data_table',
                    beforeSend: true,
                    pag: 10,
                },
                methods: {
                    send: (data) => { console.log("Table Data:", data); }
                }
            },

            form: {
                parent:  'recetasTableForm',
                id: 'formRecetas',
                autovalidation:true,
                plugin: 'content_json_form',
                json: [
                    { opc: "input", lbl: "Nombre", id: "nombre", class: "col-12", tipo: "texto" , required:true},
                    {
                        opc: "select", lbl: "Categoría", id: "categoria", class: "col-12", data: [
                          
                            { id: "1", valor: "Platillo" },
                            { id: "2", valor: "Bebida" },
                            { id: "3", valor: "Extras" }
                        ]
                    },
                    { opc: "input", lbl: "Cantidad", id: "cantidad", class: "col-12", tipo: "numero" },
                    { opc: "btn-submit", id: "btnAgregar", text: "Agregar", class: "col-12" }
                ],
                methods: {
                    send: (data) => { console.log("Form Data Sent:", data); }
                }
            }
        };

        let opts = Object.assign({}, defaults, options);

       
        console.log(opts.form);

        // 🔵 **Generación del Layout sin usar primaryLayout**
        let layout = `
        <div class="row p-2">
            <div class="col-12 col-md-4 p-0 m-0">
                <div class="col-12 border rounded-3 p-3" id="${opts.form.id}" novalidate>
                    <div class="col-12 mb-2 d-flex justify-content-between">
                        <span class="fw-bold fs-5">Primer tiempo</span>
                        <button type="button" class="btn-close" aria-label="Close" id="btnClose" onclick="
                        app.closeForm('#${opts.form.id}', '#layoutTable', '#addRecetasSub')"></button>
                        </div>
                        <div id="recetasTableForm"></div>
                </div>
            </div>
            
            <div class="col-12 col-md-8" id="layoutTable">
            <div class="">
                <button type="button" class="btn btn-primary btn-sm d-none" id="addRecetasSub" onclick="app.openForm('#${opts.form.id}', '#layoutTable', '#addRecetasSub')"><i class="icon-plus"></i></button>
            </div>

            <div class="m-0 p-0" id="${opts.table.parent}">
                <table class="table table-bordered table-hover table-sm">
                    <thead class="text-white">
                        <tr>
                            <th>Subreceta</th>
                            <th>Cantidad</th>
                            <th><i class="icon-cog"></i></th>
                        </tr>
                    </thead>
                    <tbody id="tbRecetasSub"></tbody>
                </table>
            </div>
            </div>
        </div>`;

        $("#" + opts.id).append(layout);

        // Renderizar el formulario y la tabla
        this.createForm(opts.form);
        this.createTable(opts.table);
    }

    openForm(form, tb, btn) {
        $(tb).removeClass("col-md-12");
        $(tb).addClass("col-md-8");
        $(form).parent().removeClass("d-none");
        $(btn).addClass("d-none");
    }

    closeForm(form, tb, btn) {
        $(form).parent().addClass("d-none");
        
        $(tb).removeClass("col-md-8");
        $(tb).addClass("col-md-12");
        
        $(btn).removeClass("d-none");
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
            title: "¿Desea regresar?",
            // text: "Si regresa puede que algunos cambios no se guarden.",
        }).then((result) => {
            if (result.isConfirmed) {
                this.render();
                
            }
        });
    }


}
