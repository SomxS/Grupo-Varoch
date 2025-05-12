
// init vars.
let app, sub;

let api = "https://erp-varoch.com/DEV/gestor-de-actividades/ctrl/ctrl-gestordeactividades-asignados.php";


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
     
     this.onShowActivity(114);
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
                    class    : "col-3",
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
            center : [1,2,5],
            right:[3,4],
            onShow     : () => { },          // ✅ por si no lo pasan
        };

        const opts = Object.assign(defaults, options);
        const container = $('<div>', {
            id: opts.id,
            class: `${opts.color_primary} rounded-lg my-5 border border-gray-700 overflow-hidden`
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

    async onShowActivity(id) {
        let tareas = await useFetch({
            url: this._link,
            data: { opc: 'getActivity', id: id }
        });
        // --
        let modal = bootbox.dialog({
            title: "",
            closeButton: true,
            size: "xl",
            message: `<div id="containerActivity"></div>`,
            id: "modal",
        }); // Crear componente modal.
        this.createTaskDetail({
            parent: 'containerActivity',
            data: tareas.data
        });
    }

    createTaskDetail(options) {
        const defaults = {
            parent: 'containerprimaryLayout',
            data: [],
            onEdit: (id) => {},
            onClose: () => {}
        };

        const opts = Object.assign({}, defaults, options);
        const list = opts.data;

        const $root = $('<div class="space-y-6"></div>');

        list.forEach(item => {
            const $card = $(`
                <div class="bg-white border rounded-lg p-6 space-y-5 text-sm text-gray-700">
                    
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-lg font-bold uppercase">${item.title || 'Sin título'}</h2>
                    </div>

                    <div>
                        <p class="text-xs font-semibold mb-1 uppercase">Actividad</p>
                        <div class="bg-gray-100 p-3 rounded text-gray-800">${item.activities || '-'}</div>
                    </div>

                    <div class="grid grid-cols-1 grid-cols-2 gap-4">
                        <div><strong>Responsable:</strong> ${item.NOMBRES}</div>
                        <div><strong>Estado:</strong> ${item.name_status}</div>
                        <div><strong>Prioridad:</strong> ${item.priority}</div>

                        <div><strong>Fecha Inicio:</strong> ${item.date_start}</div>
                        <div><strong>Fecha Fin:</strong> ${item.date_end}</div>
                        <div><strong>Fecha Seguimiento:</strong> ${item.date_follow}</div>

                        <div><strong>Fecha Creación:</strong> ${item.date_creation}</div>
                        <div><strong>UDN:</strong> ${item.UDN}</div>

                        <div><strong>ID Empleado:</strong> ${item.id_employed}</div>
                        <div><strong>ID Creador:</strong> ${item.id_user_creator}</div>
                        <div><strong>ID Estado:</strong> ${item.id_status}</div>
                        <div><strong>ID Prioridad:</strong> ${item.id_priority}</div>
                    </div>

                  
                </div>
            `);

            $root.append($card);
        });

        $(`#${opts.parent}`).html($root);
    }
  


}



