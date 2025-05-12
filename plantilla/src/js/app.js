// let ctrl = "ctrl/app.php";
const link = 'https://erp-varoch.com/DEV/costsys/ctrl/ctrl-costo-potencial-soft.php';


const api_subEvent = 'https://huubie.com.mx/alpha/eventos/ctrl/ctrl-sub-eventos.php';

const api = 'https://huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php';
// init vars.
let app, sub;




$(async () => {

    // instancias.
    app = new App(api, 'root');
    app.init();

});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "";
    }

    init() {
        this.render();
    }

    render(options) {
        this.primaryLayout({
            parent: 'root',
        })

        this.filterBar()
        this.TabsComponent();
        // this.onShow()
        // this.layout();
    }

    layout() {
        this.tabsLayout({
            parent: "root",
            json: [
                {
                    tab: "Eventos",
                    id: "gestorEventos",
                    onClick: ()=> this.showSubEvent() ,
                    contenedor: [
                        { class: "lg:h-[10%] ", id: "filterBar" },
                        { class: "lg:h-[83%] flex-grow  mt-2", id: "container"},
                    ],
                    active: true,
                }
            ]
        });

        this.showSubEvent();
    }

    filterBar() {

        this.createfilterBar({
            parent: "filterBarprimaryLayout",
            data: [
                {
                    opc      : "button",
                    color_btn: 'danger',
                    class    : "col-2",
                    className: 'w-full',
                    id       : "btn",
                    text     : 'PDF',
                    onClick: () => {

                        this.onShow();
                    }
                },


            ],

        });


    }

    ls() {
        let rangePicker = getDataRangePicker("calendar");

        this.createTable({
            parent: "containerEventos",
            idFilterBar: "filterBarEventos",
            data: { opc: "lsEvents", date_init: rangePicker.fi, date_end: rangePicker.ff },
            conf: { datatable: false, pag: 15 },
            attr: {
                class_table: "table table-bordered table-sm table-striped text-uppercase",
                id: "tablaEventos",
                center: [1, 2, 3, 6, 7],
                extends: true,
            },
        });
    }

    async showSubEvent() {

        let subEvents = await useFetch({
            url: this._link,
            data: {
                opc: "getSubEvento",
                id: 115
            }
        });
        console.log(subEvents)

        this.accordingMenu({
            parent: 'container',
            data: subEvents.data,
        });

    }

    accordingMenu(options) {
        const defaults = {
            parent       : "tab-sub-event",
            id           : "accordionTable",
            title        : 'Titulo',
            color_primary: 'bg-[#1F2A37]',
            data         : [],
            center       : [1,2,5],
            right        : [3,4],
            onShow       : () => { },          // ✅ por si no lo pasan
        };

        const opts = Object.assign(defaults, options);
        const container = $('<div>', {
            id: opts.id,
            class: `${opts.color_primary} rounded-lg my-5 border border-gray-700 overflow-hidden`,
           
        });

        const titleRow = $(`
            <div class="flex justify-between items-center px-4 py-4 border-b border-gray-800">
            <h2 class="text-lg font-semibold text-white">${opts.title}</h2>
            <button id="btn-new-sub-event" class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded
            flex items-center gap-2">
            <span class="text-lg">＋</span> Nuevo Sub-evento
            </button>
            </div>
        `);

        titleRow.find("#btn-new-sub-event").on("click", () => {
            if (typeof opts.onAdd === "function") opts.onAdd();
        });

        container.append(titleRow);

        const firstItem = opts.data[0] || {};
        const keys = Object.keys(firstItem).filter(k => k !== 'body' && k !== 'id');

        const headerRow = $('<div>', {
            class: "flex justify-between items-center px-4 py-2 font-medium text-gray-400 border-b border-gray-700 text-sm"
        });

        keys.forEach(key => {
            headerRow.append(`<div class="flex-1 text-center truncate">${key.charAt(0).toUpperCase() + key.slice(1)}</div>`);
        });

        headerRow.append(`<div class="flex-none text-right">Acciones</div>`);
        container.append(headerRow);


        // 🔁 Render de cada fila
        opts.data.forEach((opt, index) => {
            console.log(opt)
            const row = $('<div>', { class: " border-gray-700" });

            const header = $(`<div class="flex justify-between items-center px-3 py-2 border-y border-gray-700 hover:bg-[#18212F] bg-[#313D4F] cursor-pointer"></div>`);
            keys.forEach((key, i) => {

                let align = "text-left";
                if (opts.center.includes(i)) align = "text-center";
                if (opts.right.includes(i)) align = "text-end";


                header.append(`<div class="flex-1 px-3  text-gray-300 truncate ${align}">${opt[key]}</div>`);
            });

            const actions = $(`
                <div class="flex-none flex gap-2 mx-2">
                    <button class="btn-edit bg-gray-700 text-white text-sm px-2 py-1 rounded" title="Editar">✏️</button>
                    <button class="btn-delete bg-gray-700 text-red-500 text-sm px-2 py-1 rounded" title="Eliminar">🗑️</button>
                </div>
            `);
            header.append(actions);

            // Container collapsed
            const bodyWrapper = $('<div>', {
                class: "bg-gray-500 hidden px-4 py-4 text-sm text-gray-300 accordion-body",
                id: 'containerInfo' + opt.id,

                html: `
                 ${opt.id}
                `
            });


            // Logic Components.

            // ✅ Evita colapsar si haces clic en botón
            header.on("click", function (e) {
                const target = $(e.target);
                if (target.closest(".btn-edit").length || target.closest(".btn-delete").length) return;

                $(".accordion-body").slideUp(); // Oculta los demás
                const isVisible = bodyWrapper.is(":visible");
                if (!isVisible) {
                    bodyWrapper.slideDown(200);
                    if (typeof opts.onShow === 'function') opts.onShow(opt.id);
                }
            });

            header.find(".btn-edit").on("click", e => {
                e.stopPropagation();
                if (typeof opts.onEdit === "function") opts.onEdit(opt, index);
            });

            header.find(".btn-delete").on("click", e => {
                e.stopPropagation();
                if (typeof opts.onDelete === "function") opts.onDelete(opt, index);
            });


            // add interfaces.
            row.append(header, bodyWrapper);
            container.append(row);

        });



        container.append(`
        <div class="flex justify-end items-center px-4 py-4 mt-3 border-b border-gray-800">
        <button type="button" class="btn bg-[#374151] hover:bg-[#4b5563] text-[#fff] px-4 py-2 text-sm" onclick="eventos.closeEvent()">Cerrar</button>
        </div>
        `);

        $(`#${opts.parent}`).html(container);
    }

    async onShow(){
        let subEvents = await useFetch({
            url: this._link,
            data: {
                opc: "getFormatedEvent",
                idEvent: 120
            },


        });


        this.createPDF({
            parent: 'containerprimaryLayout',
            dataEvent: subEvents.Event,
            dataSubEvent: subEvents.SubEvent
        })


    }

    createPDF(options) {
        // 📜 Configuración por defecto
        const defaults = {
            parent: 'containerprimaryLayout',
            dataPackage: [],
            dataMenu: [],
            dataPayment: [],
            dataSubEvent: [],
            dataEvent: {
                email: "[email]",
                phone: "[phone]",
                contact: "[contact]",
                idEvent: "[idEvent]",
                location: "[location]",
                date_creation: "[date_creation]",
                date_start: "[date_start]",
                date_start_hr: "[date_start_hr]",
                date_end: "[date_end]",
                date_end_hr: "[date_end_hr]",
                day: "[day]",
                quantity_people: "[quantity_people]",
                advance_pay: "[advance_pay]",
                total_pay: "[total_pay]",
                notes: "[notes]",
                type_event: "[type_event]"
            },
            clauses: ["", "", "", ""]
        };

        // 🔵 Fusión de opciones externas
        const opts = Object.assign({}, defaults, options);

        // 📏 Encabezado del documento
        const header = `
            <div class="flex justify-end mb-4">
                <p> Tapachula Chiapas, a ${opts.dataEvent.date_creation}</p>
            </div>
            <div class="event-header text-sm text-gray-800 mb-4">
                <p class="font-bold uppercase"> ${opts.dataEvent.name}</p>
                <p class="uppercase">TIPO: ${opts.dataEvent.type_event}</p>
                <p>${opts.dataEvent.date_start} ${opts.dataEvent.date_start_hr}</p>
                <p>${opts.dataEvent.location}</p>
            </div>
            <div class="mb-6 text-justify">
                <p>Agradecemos su preferencia por celebrar su evento con nosotros el día
                <strong>    ${opts.dataEvent.day} </strong>,
                <strong>    ${opts.dataEvent.date_start} ${  opts.dataEvent.date_start_hr   } </strong>
                 a <strong> ${opts.dataEvent.date_end} ${
                     opts.dataEvent.date_end_hr
            }</strong>, en el salón
                <strong>${opts.dataEvent.location}</strong>.</p>
                <p>Estamos encantados de recibir a <strong>${
                opts.dataEvent.quantity_people
                }</strong> invitados y nos aseguraremos de que cada detalle esté a la altura de sus expectativas.</p>
                <br>
                ${
                opts.dataEvent.notes
                    ? `<p><strong>NOTAS:</strong> ${opts.dataEvent.notes}</p>`
                    : ""
                }
            </div>`;

        // 📦 Sub-eventos (con platillos)
        let subEvents = '';

        opts.dataSubEvent?.forEach(sub => {
            const dishItems = sub.dishes?.map(d => `<li class="text-gray-700 text-[12px]"> - ${d.dish}</li>`).join("") || "";

            subEvents += `
            <div class="mb-6 text-sm leading-6">
                <p><strong>${sub.name_subevent} para ${sub.quantity_people} personas</strong> (${sub.time_start} a ${sub.time_end} horas)</p>
                <p>${sub.location}</p>
                ${dishItems ? `<ul class="list-none pl-8 mt-1">${dishItems}</ul>` : ''}
                <p class="mt-2"><strong>Costo:</strong> $${parseFloat(sub.total_pay).toLocaleString('es-MX')}</p>
            </div>`;
        });

        // 💰 Total del evento
        const totalEventCost = `
        <div class="mb-6 text-sm text-end">
            <p class="font-bold">Total del evento: $${parseFloat(opts.dataEvent.total_pay).toLocaleString('es-MX')}</p>
        </div>`;

        // 📜 Cláusulas
        let templateClauses = `
        <div class=" mb-4 text-xs">
            <p class="font-bold">Cláusulas</p>
            <ul class="list-decimal pl-5">`;

        opts.clauses.forEach((clause, index) => {
            
            templateClauses += `<li>${clause}</li>`;
            if ((index + 1) % 5 === 0 && index + 1 < opts.clauses.length) {
                templateClauses += `</ul><div style="page-break-after: always;"></div><ul class='list-decimal pl-5'>`;
            }
        });

        templateClauses += `</ul></div>`;

        const docs = `
        <div id="docEvent"
            class="flex flex-col justify-between px-12 py-10 bg-white text-gray-800 shadow-lg rounded-lg"
            style="
                width              : 816px;
                min-height         : 1056px;
                background-image   : url('src/img/background.png');
                background-repeat  : no-repeat;
                background-size    : 90% 100%;
                background-position: left top;
            ">

            <!-- 🧠 Contenido principal (header + subeventos) -->
            <div class="w-full pl-[120px] grow">
                ${header}
                ${subEvents}
            </div>

            <!-- ✅ Footer fijo al final -->
            <div class="w-full pl-[120px] mt-10">
                ${totalEventCost}
                ${templateClauses}
            </div>
        </div>`;

        // 🧩 Renderizamos en el contenedor definido
        $('#' + opts.parent).append(docs);
    }

    TabsComponent(options) {
        const defaults = {
            parent: "root",
            id: "TabsComponent",
            class: "flex w-50 gap-2 bg-[#1e293b] p-1 rounded-lg",
            json: [{ id: "dashboard", label: "Dashboard", icon: "icon-grid" },
                { id: "list", label: "Lista", icon: "icon-list" },
                { id: "calendar", label: "Calendario", icon: "icon-calendar" }],
            onClick: (id) => { }
        };

        const opts = Object.assign({}, defaults, options);

        const container = $("<div>", {
            id: opts.id,
            class: opts.class
        });

        opts.json.forEach((tab, index) => {
            const tabBtn = $("<button>", {
                class: `flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium ${index === 0
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`,
                html: `<i class="${tab.icon}"></i><span>${tab.label}</span>`,
                click: () => {
                    $(`#${opts.id} button`).removeClass("bg-blue-600 text-white").addClass("text-gray-400 hover:text-white hover:bg-gray-700");
                    tabBtn.removeClass("text-gray-400 hover:text-white hover:bg-gray-700").addClass("bg-blue-600 text-white");
                    opts.onClick(tab.id);
                }
            });

            container.append(tabBtn);
        });

        $(`#${opts.parent}`).html(container);
    }



}



class SubEvent extends App {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SubEvent";
    }

    render() {
        this.layout({
            parent: 'root'
        });
    }

    async layout(options) {
        let subEvents = await useFetch({ url: this._link, data: { opc: "getSubEvento", id: idEvent } });

        if (subEvents.status == 200) {
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
        } else {
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

            $(`#${opts.parent}`).html(emptySubEvent);
        }
    }

    accordingMenu(options) {
        const defaults = {
            parent: "tab-sub-event",
            id: "accordionTable",
            title: 'SubEventos',
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

        const opts = Object.assign(defaults, options);
        const container = $('<div>', { id: opts.id, class: "bg-[#111827] rounded-lg overflow-hidden" });

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
                id: 'containerSubMenu' + opt.id,
                html: `
                    <form novalidate class="" id="containerMenu${opt.id}" ></form>
                    <div class=" mt-2 " id="containerDishes${opt.id}"></div>
                 `,
            });

            header.on("click", function (e) {
                const target = $(e.target);

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

            header.find(".btn-edit").on("click", function (e) {
                e.stopPropagation();
                if (typeof opts.onEdit === "function") {
                    opts.onEdit(opt, index);
                } else {

                }
            });

            header.find(".btn-delete").on("click", function (e) {
                e.stopPropagation();
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
                            icon: "success",
                            text: response.message,
                        });
                        this.layout();
                    } else {
                        alert({
                            icon: "error",
                            text: response.message,
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
                { opc: 'input', lbl: 'Pago total', id: 'total_pay', tipo: 'cifra', class: 'col-6' },
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

        $("#date_start").val(new Date().toISOString().split("T")[0]);
        $("#date_end").val(new Date().toISOString().split("T")[0]);
    }

    async editSubEvent(item) {
        this.createModalForm({
            id: 'frmEdit',
            title: 'Editar Sub Evento',
            autofill: item,
            data: { opc: 'editSubEvent', id: item.id },
            bootbox: {
                title: 'Editar sub Evento',
                size: 'large'
            },
            json: [
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
                { opc: 'input', lbl: 'Pago total', id: 'total_pay', tipo: 'cifra', class: 'col-6' },
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

    async layoutMenu(idSubEvent) {
        $('#containerMenu' + idSubEvent).empty();

        let data = await useFetch({ url: this._link, data: { opc: "getMenu", id_sub_event: idSubEvent } });



        this.createForm({
            parent: 'containerMenu' + idSubEvent,
            id: 'formMenu',
            class: 'row',
            autofill: data.menu,
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
                    btn_color: 'primary',
                    text: 'Agregar',
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

        $("containerDishes" + idEvent).html();
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

class Evento extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Eventos";
    }

    init() {
        this.render();
    }

    render() {
        this.layout();
    }

    layout() {
        this.tabsLayout({
            parent: "root",
            json: [
                {
                    tab: "Eventos",
                    id: "gestorEventos",
                    contenedor: [
                        { class: "min-h-[10%] line", id: "filterBarEventos" },
                        { class: "h-[83%] flex-grow line mt-2", id: "containerEventos" },
                    ],
                    active: true,
                }
            ]
        });
    }

    ls() {
        this.createTable({
            parent: "containerEventos",
            idFilterBar: "filterBarEventos",
            data: { opc: "lsEvents" },
            conf: {
                datatable: true,
                pag: 15
            },
            attr: {
                class_table: "table table-bordered table-sm table-striped text-uppercase",
                id: "tablaEventos",
                center: [1, 2, 3, 4],
                extends: true
            }
        });
    }

    add() {
        this.createModalForm({
            id: 'frmEvento',
            title: 'Nuevo Evento',
            data: { opc: 'addEvent' },
            bootbox: {
                title: 'Crear nuevo evento',
                size: 'large'
            },
            json: [
                { opc: 'input', lbl: 'Nombre del evento', id: 'name_event', class: 'col-6', tipo: 'texto', required: true },
                { opc: 'input', lbl: 'Organizador', id: 'organizer', class: 'col-6', tipo: 'texto', required: true },
                { opc: "input", lbl: "Fecha de inicio", id: "date_start", class: "col-12 col-sm-4 col-lg-3", type: "date", required: true },
                { opc: "input", lbl: "Fecha de cierre", id: "date_end", class: "col-12 col-sm-4 col-lg-3", type: "date", required: true },
                { opc: 'input', lbl: 'Capacidad', id: 'capacity', tipo: 'numero', class: 'col-4' },
                { opc: 'textarea', lbl: 'Descripción', id: 'description', class: 'col-12' }
            ],
            success: (response) => {
                if (response.status == 200) {
                    alert({
                        icon: "success",
                        title: "Evento creado con éxito",
                        text: response.message
                    });
                    this.ls();
                } else {
                    alert({
                        icon: "error",
                        text: response.message
                    });
                }
            }
        });
    }

    edit(evento) {
        this.createModalForm({
            id: 'frmEditEvento',
            title: 'Editar Evento',
            autofill: evento,
            data: { opc: 'editEvent', id: evento.id },
            bootbox: {
                title: 'Editar evento',
                size: 'large'
            },
            json: [
                { opc: 'input', lbl: 'Nombre del evento', id: 'name_event', class: 'col-6', tipo: 'texto', required: true },
                { opc: 'input', lbl: 'Organizador', id: 'organizer', class: 'col-6', tipo: 'texto', required: true },
                { opc: "input", lbl: "Fecha de inicio", id: "date_start", class: "col-12 col-sm-4 col-lg-3", type: "date", required: true },
                { opc: "input", lbl: "Fecha de cierre", id: "date_end", class: "col-12 col-sm-4 col-lg-3", type: "date", required: true },
                { opc: 'input', lbl: 'Capacidad', id: 'capacity', tipo: 'numero', class: 'col-4' },
                { opc: 'textarea', lbl: 'Descripción', id: 'description', class: 'col-12' }
            ],
            success: (response) => {
                if (response.status == 200) {
                    alert({
                        icon: "success",
                        text: response.message
                    });
                    this.ls();
                } else {
                    alert({
                        icon: "error",
                        text: response.message
                    });
                }
            }
        });
    }

    delete(idEvento) {
        this.swalQuestion({
            opts: {
                title: "¿Está seguro?",
                html: "¿Desea eliminar este evento?",
            },
            data: { opc: "deleteEvent", id: idEvento },
            methods: {
                request: (response) => {
                    if (response.status == 200) {
                        alert({
                            icon: "success",
                            text: response.message
                        });
                        this.ls();
                    } else {
                        alert({
                            icon: "error",
                            text: response.message
                        });
                    }
                }
            }
        });
    }
}

