// let ctrl = "ctrl/app.php";
const link = 'https://erp-varoch.com/DEV/costsys/ctrl/ctrl-costo-potencial-soft.php';


const api_subEvent = 'https://huubie.com.mx/dev/eventos/ctrl/ctrl-sub-eventos.php';
const api_payment  = 'https://huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php';
// init vars.
let app,sub;

let idEvent = 34;


$(async () => {
   
    // instancias.
    app = new App(api_subEvent, 'root');

    sub = new Payment(api_payment,'root');
    sub.render();

    
   
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Survey";
    }

    init() {

       this.render();
    

    }



    render(options) {
        this.layout();
    }



    layout() {
        this.tabsLayout({
            parent: "root",
          
           
            json: [
                {
                    tab: "Creados",
                    id: "gestorCreados",
                   
                    contenedor: [
                        { class: " min-h-[10%] line", id: "filterBarGestorCreados" },
                        { class: "h-[83%] flex-grow line mt-2", id: "containerGestorCreados" },
                    ],
                    active: true,
                },
            ],
        });

    }


    filterBar(options) {
        this.createfilterBar({
            parent: "filterBar",
            data: [
                { opc: "select", class: "col-3", id: "UDNs", lbl: "Seleccionar UDN: ", data: [{ id: 4, valor: 'BAOS' }] },
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
                id: "lsTable",
                center: [1, 2, 3, 6, 7],
                extends: true,

            },
        });



    }

    async groupCard(options) {

        let group = await useFetch({ url: api, data: { opc: "getGroup" } });


        this.createGroups({
            parent: "groups",
            title: "Evaluados",

            data: [
                { id: 1, valor: "SERGIO OSORIO MENDEZ", items: 2, result: 5, },
                { id: 2, valor: "ROSA ANGELICA PEREZ VELASQUEZ", items: 2, result: 8, },
                { id: 3, valor: "LEONARDO D J. MARTINEZ DE LA CRUZ", items: 8, result: 8, }
            ],
            onclick: (id) => {
                this.initEvaluation(options, id);
            }
        });
        // this.initEvaluation();


    }

    // Evaluation


}

class Payment extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Payment";
    }

    render() {
        this.layout();
    }

    layout() {
        this.tabsLayout({
            parent: "root",
            json: [
                {
                    tab: "Creados",
                    id: "gestorCreados",
                    contenedor: [
                        { class: " min-h-[10%] line", id: "filterBarGestorCreados" },
                        { class: "h-[83%] flex-grow line mt-2", id: "containerPayment" },
                    ],
                    active: true,
                },
            ],
        });

        this.createNote();
       
    }

    async createNote(){
        let data = await useFetch({ url: this._link, data: { opc: 'getEvent', idEvent: 104 }  });

        this.createPDF({ 
            parent: 'containerPayment',
            data_header: data.Event,
            dataMenu: data.Menu,
            dataPayment: data.Payment
        
        });
      
    }


   
    // Components. 
    createPDF(options) {

        const defaults = {
            parent: 'containerNote',
            dataPackage: [],
            dataMenu   : [],
            dataPayment: [],
            data_header: {
                email          : "[email]",
                phone          : "[phone]",
                contact        : "[contact]",
                idEvent        : "[idEvent]",
                location       : "[location]",
                date_creation  : "[date_creation]",
                date_start     : "[date_start]",
                date_start_hr  : "[date_start_hr]",
                date_end       : "[date_end]",
                date_end_hr    : "[date_end_hr]",
                day            : "[day]",
                quantity_people: "[quantity_people]",
                advance_pay    : "[advance_pay]",
                total_pay      : "[total_pay]",
                notes          : "[notes]",
                type_event     : "[type_event]"
            },
            clauses: ["", "", "", "", "", "", "", "", "", ""] // 📌 Cláusulas configurables
        };

        const opts = Object.assign({}, defaults, options);

        // 📜 Construcción del encabezado del PDF con logo
        const header = `
        <div class="flex justify-end mb-4">
            <img src="https://huubie.com.mx/alpha/src/img/logo/logo.ico" alt="Logo" class="h-16 p-1">
        </div>
        <div class="event-header text-sm text-gray-800">
            <p><strong>CLIENTE:</strong> ${opts.data_header.contact}</p>
            <p><strong>TELÉFONO:</strong> ${opts.data_header.phone}</p>
            <p><strong>CORREO:</strong> ${opts.data_header.email}</p>
            <p><strong>TIPO :</strong> ${opts.data_header.type_event}</p>
        </div>`;

        // 📜 Construcción del cuerpo del PDF
        const template = `
        <div class="event-details mt-6 text-sm text-gray-800">
            <p>Agradecemos su preferencia por celebrar su evento con nosotros el día 
            <strong>${opts.data_header.day}</strong>,
            <strong>${opts.data_header.date_start} ${opts.data_header.date_start_hr}</strong> a 
            <strong>${opts.data_header.date_end} ${opts.data_header.date_end_hr}</strong>, en el salón 
            <strong>${opts.data_header.location}</strong>.</p>
            <p>Estamos encantados de recibir a <strong>${opts.data_header.quantity_people}</strong> invitados y nos aseguraremos de que cada detalle esté a la altura de sus expectativas.</p>
            <br>
            ${opts.data_header.notes ? `<p><strong>NOTAS:</strong> ${opts.data_header.notes}</p>` : ""}
        </div>`;


        // 📜 Desgloze de Menu
        let menu = opts.dataMenu.data;

        const template_menu = `
         <div class="text-gray-800 mt-4" id="containerMenu">
            <div class=" text-sm font-bold mb-2">Menú</div>
            <div class = "d-inline-flex gap-3">
            <div>
                <strong>Paquete:</strong>
                <small>${menu.package_type}</small>
            </div>
            <div>
            <strong> Cantidad:</strong>
            <small>${menu.quantity}</small>
            </div>
            <div>
            <strong> Precio:</strong>
            <small>${formatPrice(menu.price)}</small>
            </div>
            
            </div>
        </div>
        `;

        console.log(opts.dataPayment)

        let templatePayment = '';

        opts.dataPayment.forEach((item) => {
            templatePayment += `
            <div class="flex justify-between ">
                <p class="font-bold">${item.method_pay}</p>
                <p> ${formatPrice(item.valor)}</p>
            </div>
            `;
        });


        // 📜 Estructura principal del documento
        const docs = `
        <div id="docEvent" class=" px-6 py-6 bg-white shadow-lg text-gray-800 rounded-lg">
            ${header}
            ${template}
            ${template_menu}
            <div class="text-gray-800 mt-4" id="containerEndFormat"></div>
            
            <!-- 📜 Sección de Totales (Subtotal, Total y Saldo) -->
            <div class="mt-6 mb-2  text-sm text-gray-800 flex justify-end">
                <div class="w-1/3">
                    <div class="flex justify-between  pt-2">
                        <p class="font-bold">Total</p>
                        <p>${formatPrice(opts.data_header.total_pay)}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold">Anticipo</p>
                        <p>${formatPrice(opts.data_header.advance_pay)}</p>
                    </div>
                    <div class="flex justify-between ">
                        <p class="font-bold"> Saldo</p>
                        <p>${formatPrice(opts.data_header.total_pay - opts.data_header.advance_pay)}</p>
                    </div>

                    
                </div>
            </div>

            <div class="flex text-sm justify-end">
            <div class="w-1/3">
                <p class="font-bold  border-t my-1"> Forma de pago </p>
                ${templatePayment}
            </div>
            </div>

            <!-- 📜 Cláusulas configurables -->

            <div class="mt-8 mb-4 text-xs">
                <p class="font-bold"> Cláusulas </p>
                <ul class="list-decimal pl-5">
                    ${opts.clauses.map(clause => `<li>${clause}</li>`).join('')}
                </ul>
            </div>
        </div>`;

        $('#' + opts.parent).append(docs);

        // 📜 Aplicación del plugin rpt_json_table2 a la tabla del menú
        $('#containerEndFormat').rpt_json_table2({
            data: opts.dataMenu,
            color_th: 'bg-gray-200 p-1 text-center uppercase text-xs',
            class: 'w-full border-collapse  bg-white rounded-lg',
            center: [1],
            extends: true
        });
    }

}


class SubEvent extends App{

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SubEvent";
    }


    render(){
        this.layout({
            parent:'root'
        });

    }


    // Sub evento

    async layout(options) {
     

        let subEvents = await useFetch({ url: this._link, data: { opc: "getSubEvento", id: idEvent } });

        if(subEvents.status == 200) {

            this.accordingMenu({
                parent: 'root',
                title: 'Evento  : ' + subEvents.data[0].event,
                data: subEvents.data,
                onEdit: (item, index) => {
                    this.editSubEvent(item)
                },
                onDelete: (item, index) => {
                    this.cancelSubEvent(item)
                },
            });

        }else{

            let defaults = {
                parent: "root",
            };

            let opts = Object.assign(defaults, options);
         

            const emptySubEvent = $(`
                <div class="flex flex-col items-center justify-content-start py-12 text-center h-full  bg-[#1F2A37] rounded-lg">
                    <i class="icon-calendar-1 text-[52px] text-gray-100"></i>
                    <h3 class="text-xl font-medium text-gray-100 mb-2">No hay sub-eventos</h3>
                    <p class="text-gray-400 mb-4">Comienza agregando tu primer sub-evento</p>
                    <button id="btnNewSubEvent" class="bg-gray-600 hover:bg-gray-700  px-4 py-2 rounded text-white">
                        <span class="icon-plus-1"></span>
                        Nuevo Sub-evento
                    </button>
                </div>
            `);

            emptySubEvent.find("#btnNewSubEvent").on("click", () => {
                this.newSubEvent();
            });


            // 📌 Render
            $(`#${opts.parent}`).html(emptySubEvent);


        }


        // this.accordingMenu({
        //     parent:'root',
        //     onDelete: (item, index) => {
        //         this.cancelSubEvent(item)
        //     },

        // });


    }

    accordingMenu(options) {
        const defaults = {
            parent: "tab-sub-event",
            id: "accordionTable",
            title:'SubEventos',
            data: [
                {
                    id: 1,
                    title: "Ceremonia de apertura",
                    date: "19/1/2024",
                    location: "Salón Principal",
                    type: "Privado",
                    body: "Contenido de ceremonia",
                },
                {
                    id: 2,
                    title: "CoffeBreak",
                    fecha: "31/3/2025",
                    localizacion: "Jardin",
                    tipo: "Abierto",
                    body: "Contenido de coffe break",
                },
            ],
        };

        //  📌 Interfaz

        const opts = Object.assign(defaults, options);
        const container = $('<div>', { id: opts.id, class: "bg-[#111827] rounded-lg overflow-hidden" });

        // ✅ Título y botón
        const titleRow = $(`
            <div class="flex  justify-between items-center px-4 py-4 border-b border-gray-800">
                <h2 class="text-lg font-semibold text-white">${opts.title}</h2>
                <button id="btn-new-sub-event" class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded flex items-center gap-2">
                <span class="text-lg">＋</span> Nuevo Sub-evento
                </button>
            </div>
        `);

        titleRow.find("#btn-new-sub-event").on("click", () => {
            this.newSubEvent();
        });
        container.append(titleRow);

        const headerRow = $(`
            <div class="grid grid-cols-12 gap-4 p-4 font-medium text-gray-400 border-b border-gray-700 text-sm">
            <div class="col-span-4">Descripción</div>
            <div class="col-span-2">Fecha</div>
            <div class="col-span-2">Localización</div>
            <div class="col-span-2">Tipo</div>
            <div class="col-span-2 text-right">Acciones</div>
            </div>
        `);
        container.append(headerRow);

        opts.data.forEach((opt, index) => {
            const row = $('<div>', { class: "border-b border-gray-700" });

            const header = $(`
                <div class="grid grid-cols-12 gap-4 p-3 items-center hover:bg-[#18212F] cursor-pointer">
                    <div class="col-span-4 font-medium text-white flex items-center gap-2">
                    <span class="text-gray-400 toggle-arrow select-none transition-transform duration-300">▾</span>
                    ${opt.title}
                    </div>
                    <div class="col-span-2 text-gray-400">${opt.date}</div>
                    <div class="col-span-2 text-gray-400">${opt.location}</div>
                    <div class="col-span-2">
                    <span class="px-4 py-1 bg-gray-800 text-gray-200 text-xs border rounded-full ">${opt.type}</span>
                    </div>
                    <div class="col-span-2 flex justify-end gap-2">
                    <button class="btn-edit bg-gray-700 text-white text-sm px-2 py-1 rounded" title="Editar">✏️</button>
                    <button class="btn-delete bg-gray-700 text-red-500 text-sm px-2 py-1 rounded" title="Eliminar">🗑️</button>
                    </div>
                </div>
            `);

            const bodyWrapper = $('<div>', {
                class: "bg-gray-800/30 px-4 py-4 hidden text-sm text-gray-300 accordion-body",
                id   : 'containerSubMenu' + opt.id,
                html : `
                    <form novalidate class="" id="containerMenu${opt.id}" ></form>
                    <div class=" mt-2 " id="containerDishes${opt.id}"></div>
                 `,
            });

            // 🧠 Evento toggle en el row completo (excluyendo botones)
            header.on("click", function (e) {
                const target = $(e.target);

                // Si el clic fue en los botones de editar/eliminar, no hacer toggle
                if (target.closest(".btn-edit").length || target.closest(".btn-delete").length) return;

                const isVisible = bodyWrapper.is(":visible");

                $(".accordion-body").not(bodyWrapper).slideUp();
                $(".toggle-arrow").not($(this).find(".toggle-arrow")).text("▾");

                if (!isVisible) {
                    bodyWrapper.stop(true, true).slideDown(200);
                    $(this).find(".toggle-arrow").text("▴");

                    sub.layoutMenu(opt.id);

                } else {
                    bodyWrapper.stop(true, true).slideUp(200);
                    $(this).find(".toggle-arrow").text("▾");
                    $('#containerMenu' + opt.id).empty();
                }
            });

            // Agregar eventos clic a los botones.

            // 🟦 Evento Editar
            header.find(".btn-edit").on("click", function (e) {
                e.stopPropagation(); // evita colapsar
                if (typeof opts.onEdit === "function") {
                    opts.onEdit(opt, index);
                } else {
                 
                }
            });

            // 🟥 Evento Eliminar
            header.find(".btn-delete").on("click", function (e) {
                e.stopPropagation(); // evita colapsar
                if (typeof opts.onDelete === "function") {
                    opts.onDelete(opt, index);
                } else {
                    
                }
            });



            row.append(header, bodyWrapper);
            container.append(row);
        });

        $(`#${opts.parent}`).html(container);


    }

    cancelSubEvent(item) {

        this.swalQuestion({
            opts: {
                title: `¿Esta seguro?`,
                html: `¿Deseas eliminar  <strong> ${item.title} </strong> ?`,
            },
            data: { opc: "deleteSubEvent", id: item.id },
            methods: {
                request: (response) => {
                    if (response.status == 200) {

                        alert({
                            icon: "success", text: response.message,
                        });

                        this.layout();
                    } else {
                        alert({
                            icon: "error", text: response.message,
                        });

                    }
                },
            },
        });
    }

    newSubEvent() {

        this.createModalForm({
            id: 'frmModalUser',
            title: 'Nuevo Usuario',
            data: { opc: 'addSubEvent', evt_events_id: idEvent },
            bootbox: {
                title: 'Crear nuevo sub-evento',
                size: 'large'
            },
            json: [
                // 📏 Información del evento
                { opc: 'input', lbl: 'Nombre del evento', id: 'name_subevent', class: 'col-6', tipo: 'texto', required: true },
                {
                    opc: 'select', lbl: 'Tipo de evento', id: 'type_event', class: 'col-6', data: [
                        { id: 'Abierto', valor: "Abierto" },
                        { id: 'Privado', valor: "Privado" },
                    ]
                },

                { opc: 'input', lbl: 'Localización', id: 'location', class: 'col-6', tipo: 'texto', required: true },
                { opc: "input", lbl: "Fecha de inicio", id: "date_start", class: "col-12 col-sm-4 col-lg-3", type: "date", required: true },
                { opc: "input", lbl: "Fecha de cierre", id: "date_end", class: "col-12 col-sm-4 col-lg-3 mb-3", type: "date", required: true },

              
                // { opc: 'input-calendar', lbl: 'Fecha de inicio', id: 'date_start', class: 'col-4', required: true },
                // { opc: 'input', lbl: 'Hora de inicio', id: 'horaInicio', tipo: 'hora', class: 'col-4', required: true },

                { opc: 'input', lbl: 'Pago total', id: 'total_pay', tipo: 'cifra', class: 'col-6' },
                // { opc: 'input-calendar', lbl: 'Fecha de cierre', id: 'date_end', class: 'col-4', required: true },
                // { opc: 'input', lbl: 'Hora de cierre', id: 'horaCierre', tipo: 'hora', class: 'col-4', required: true },



                { opc: 'textarea', lbl: 'Observaciones', id: 'notes', class: 'col-6' },

            ],
            success: (response) => {
                if (response.status == 200) {
                   
                    alert({
                        icon: "success",
                        title: "Sub Evento creado con éxito",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok",
                    });

                    this.layout();

                  
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

        // initialized.
        $("#date_start").val(new Date().toISOString().split("T")[0]);
        $("#date_end").val(new Date().toISOString().split("T")[0]);



    }

    async editSubEvent(item){

        // let subEvents = await useFetch({ url: this._link, data: { opc: "getSubEvento", id: idEvent } });


        this.createModalForm({
            id: 'frmEdit',
            title: 'Editar Sub Evento',
            autofill:item,
            data: { opc: 'editSubEvent', id: item.id },
            bootbox: {
                title: 'Editar sub Evento',
                size: 'large'
            },
            json: [
                // 📏 Información del evento
                { opc: 'input', lbl: 'Nombre del evento', id: 'name_subevent', class: 'col-6', tipo: 'texto', required: true },
                {
                    opc: 'select', lbl: 'Tipo de evento', id: 'type_event', class: 'col-6', data: [
                        { id: 'Abierto', valor: "Abierto" },
                        { id: 'Privado', valor: "Privado" },
                    ]
                },

                { opc: 'input', lbl: 'Localización', id: 'location', class: 'col-6', tipo: 'texto', required: true },
                { opc: "input", lbl: "Fecha de inicio", id: "date_start", class: "col-12 col-sm-4 col-lg-3", type: "date", required: true },
                { opc: "input", lbl: "Fecha de cierre", id: "date_end", class: "col-12 col-sm-4 col-lg-3 mb-3", type: "date", required: true },


                // { opc: 'input-calendar', lbl: 'Fecha de inicio', id: 'date_start', class: 'col-4', required: true },
                // { opc: 'input', lbl: 'Hora de inicio', id: 'horaInicio', tipo: 'hora', class: 'col-4', required: true },

                { opc: 'input', lbl: 'Pago total', id: 'total_pay', tipo: 'cifra', class: 'col-6' },
                // { opc: 'input-calendar', lbl: 'Fecha de cierre', id: 'date_end', class: 'col-4', required: true },
                // { opc: 'input', lbl: 'Hora de cierre', id: 'horaCierre', tipo: 'hora', class: 'col-4', required: true },



                { opc: 'textarea', lbl: 'Observaciones', id: 'notes', class: 'col-6' },

            ],
            success: (response) => {
                if (response.status == 200) {

                    alert({
                        icon: "success",
                        title: "Sub Evento creado con éxito",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok",
                    });

                    this.layout();


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

    // Menu

    async layoutMenu(idSubEvent){

        $('#containerMenu' + idSubEvent).empty();

        let data = await useFetch({ url: this._link, data: { opc: "getMenu", id_sub_event: idSubEvent } });

     

        this.createForm({
            parent: 'containerMenu'+idSubEvent,
            id: 'formMenu',
            class: 'row',
            autofill:data.menu,
            autovalidation: true,
            data: { opc: 'addMenu', id_sub_event: idSubEvent }, 
            json: [
                {
                    opc: 'input',
                    lbl: 'Cantidad',
                    id: 'quantity',
                    tipo: 'cifra',
                    placeholder: '0',
                    class: 'col-12  col-sm-4 col-lg-3',
                 
                   
                },
                {
                    opc: 'input',
                    lbl: 'Tipo paquete',
                    id: 'package_type',
                    placeholder: 'individual,familiar, etc',
                    class: 'col-12 col-sm-4 col-lg-3',
                  
                },

                {
                    opc: 'input',
                    lbl: 'Precio por persona',
                    id: 'price',
                    tipo: 'cifra',
                    placeholder: '0.00',
                    class: 'col-12 col-sm-4 col-lg-3',
                  
                },

                {
                    opc: 'btn-submit',
                    id: 'btnMenuSave',
                    tipo: 'cifra',
                    btn_color:'primary',
                    text:'Agregar',
                    class: 'col-12 col-sm-4 col-lg-3',

                },


             
           
            
               
            ],
            success: (result) => {

                $("#formMenu #btnMenuSave").attr("disabled", "disabled");

            

                sub.newDish(1, idSubEvent);

                
            }
        });


        if (data.status == 200) {
            $("#formMenu #btnMenuSave").attr("disabled", "disabled");
            sub.newDish(data.menu.id, idSubEvent);
        }


     

    }


    newDish(idMenu, idEvent) {

        $( "containerDishes" + idEvent).html();
        // Formulario de platillos


        this.createTableForm({
            parent: "containerDishes" + idEvent,
            title: "Agregar platillos",

            table: {
                id: "tbMenu",
                center: [1, 2],
                attr: {
                    color_th: 'bg-[#374151] text-white',

                },
                data: { opc: "lsDishes", id: idMenu },
                success: (data) => { },
            },

            form: {
                id: "formDish",
                data: { opc: "addDish", id_sub_event: idEvent, id_menu: idMenu },
                json: [
                    {
                        opc: "input",
                        lbl: "Nombre",
                        id: "dish",
                        class: "col-12 mb-3",
                        tipo: "texto",
                        required: true
                    },

                    {
                        opc: "input",
                        lbl: "Cantidad",
                        id: "quantityDish",
                        class: "col-12 mb-3",
                        tipo: "numero",
                    },

                    {
                        opc: "select",
                        lbl: "Categoría",
                        id: "id_clasificacion",
                        class: "col-12 mb-3",
                        data: [
                            { id: "1", valor: "Platillo" },
                            { id: "2", valor: "Bebida" },
                            { id: "3", valor: "Extras" },
                        ],
                    },

                    {
                        opc: "select",
                        lbl: "Tiempo",
                        id: "tiempo",
                        class: "col-12 mb-3",
                        data: [
                            { id: "1", valor: "Primer tiempo" },
                            { id: "2", valor: "Segundo tiempo" },
                            { id: "3", valor: "Tercer tiempo" },
                        ],
                    },
                    {
                        opc: "btn-submit",
                        id: "btnAgregar",
                        text: "Agregar",
                        class: "col-12",
                    },
                ],

                success: (response) => {

                    if (response.status == 200) {

                        alert({ icon: "success", text: response.message, timer: 1500 });
                        this.newDish(id, idEvent);

                    } else {
                        alert({
                            icon: "error",
                            text: response.message,
                            btn1: true,
                            btn1Text: "Ok",
                        });
                    }
                },
            },
        });

   

        $("#tableForm").addClass("mb-3");
    }


    


}

