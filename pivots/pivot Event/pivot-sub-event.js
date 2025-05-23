let idEvent;

class SubEvent extends App {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SubEvent";
    }

    layout() {

        $("#root").simple_json_tab({
            class: "p-4 bg-[#1F2A37] h-100",
            id: "tabsSubEvent",

            data: [
                { tab: "Eventos", id: "tab-new-event", active: true },
                { tab: "Sub Eventos", id: "tab-new-subevent" },
            ],

        });

        // initiliazed.
        this.addEvent();
        this.showSubEvent();
    }

    layoutEditSubEvent() {

        $("#root").simple_json_tab({
            class: "p-4 h-100 bg-[#1F2A37]",
            id: "tabsSubEvent",
            data: [
                { tab: "Eventos", id: "tab-new-event", active: true },
                { tab: "Sub Eventos", id: "tab-new-subevent", onClick: () => this.showSubEvent() },
            ],
        });

        $("#tab-new-event").html(`<form id="formEvent" novalidate></form></div>`);

    }

    // Evento.

    addEvent() {

        $("#tab-new-event").html(`<form id="formEvent" novalidate></form></div>`);

        this.createForm({
            parent: 'formEvent',
            id: 'frmEvento',

            data: { opc: 'addEvent' },
            json: this.jsonEvent(),


            success: (response) => {
                if (response.status == 200) {

                    idEvent = response.data.id;
                    alert({
                        icon: "success",
                        title: "Evento creado con éxito!",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });


                    $('#btnAddSubEvent').removeClass('d-none');
                    console.log($("#btnNewSubEvent"))

                    $("#formEvent button[type='submit']").removeAttr("disabled");
                    $("#formEvent input").attr("disabled", "disabled");
                    $("#formEvent select").attr("disabled", "disabled");
                    $("#formEvent textarea").attr("disabled", "disabled");
                    $("#tab-new-subevent-tab").tab("show");
                    $("#btnGuardar").addClass("d-none");
                    $("#btnCancelar").addClass("d-none");




                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                    $("#formEvent button[type='submit']").removeAttr("disabled");
                }
            }
        });

        // initialized.
        $("#date_start").val(new Date().toISOString().split("T")[0]);
        $("#date_end").val(new Date().toISOString().split("T")[0]);
        $('#lblCliente').addClass('border-b p-1');
        $('#lblEvento').addClass('border-b p-1');

    }

    async editSubevent(idEvents) {

        this.layoutEditSubEvent();
        idEvent = idEvents;
        let subEvents = await useFetch({ url: this._link, data: { opc: "getEvent", id: idEvents } });
        const jsonEvent = this.jsonEvent();


        this.createForm({
            parent: 'formEvent',
            id: 'editEvents',
            autofill: subEvents.data,
            data: { opc: 'editEvents', id: idEvent },
            json: jsonEvent,

            success: (response) => {

                if (response.status == 200) {

                    alert({
                        icon: "success",
                        title: "Evento actualizado con éxito",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok",
                    });


                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok",
                    });

                    $("#formEvent button[type='submit']").removeAttr("disabled");
                }


            }
        });


        // initialized.
        $('#lblCliente').addClass('border-b p-1');
        $('#lblEvento').addClass('border-b p-1');
        this.showSubEvent();
    }

    Descuento(id) {
        const defaults = {
            id: "modalDescuento",
            parent: "root",
            data: { opc: "applyDiscount", id: id },
            class: "",
            title: "Aplicar Descuento",
            subtitle: "Aplica descuentos al evento 'Torneo de tennis'",
            json: [

                {
                    opc: "input",
                    id: "discount",
                    lbl: "Monto de Descuento",
                    type: "cifra",
                    class: "col-12 mb-3",
                    placeholder: "$ 0.00",
                    required: true
                },
                {
                    opc: "input",
                    id: "info_discount",
                    lbl: "Motivo del Descuento",
                    class: "col-12",
                    placeholder: "Promoción especial, cliente frecuente, etc.",
                    required: true
                }
            ],
            bootbox: {
                title: `
                    <h2 class="text-base font-semibold"><i class="icon-tag"></i> Aplicar Descuento ${id}</h2>
                `,
            },
            success: (res) => {
                if (res.status === 200) {
                    alert({ icon: "success", text: res.message });
                } else {
                    alert({ icon: "error", text: res.message });
                }
            }
        };



        this.createModalForm(defaults);
    }

    jsonEvent() {
        return [
            // 📜 Datos del Cliente
            {
                opc: "label",
                id: 'lblCliente',
                text: "Datos del cliente",
                class: "col-12 fw-bold text-lg mb-2"
            },
            {
                opc: "input",
                lbl: "Contacto",
                id: "name_client",
                class: "col-12 col-sm-4 col-lg-3 mb-3",
                tipo: "texto",
                placeholder: "Nombre del contacto"
            },
            {
                opc: "input",
                lbl: "Teléfono",
                id: "phone",
                class: "col-12 col-sm-4 col-lg-3",
                tipo: "tel",
                placeholder: "999-999-9999"
            },
            {
                opc: "input",
                lbl: "Correo electrónico",
                id: "email",
                class: "col-12 col-sm-4 col-lg-3",
                tipo: "email",
                placeholder: "cliente@gmail.com"
            },

            // 📜 Datos del Evento
            {
                opc: "label",
                id: 'lblEvento',
                text: "Datos del evento",
                class: "col-12 fw-bold text-lg mt-2 mb-2"
            },
            {
                opc: "input",
                lbl: "Evento",
                id: "name_event",
                class: "col-12 col-sm-4 col-lg-3",
                tipo: "texto",
                placeholder: "Nombre del evento"
            },
            {
                opc: "input",
                lbl: "Locación",
                id: "location",
                class: "col-12 col-sm-4 col-lg-3 mb-3",
                tipo: "texto",
                placeholder: "Locación"
            },
            {
                opc: "input",
                lbl: "Fecha de inicio",
                id: "date_start",
                class: "col-12 col-sm-4 col-lg-3",
                type: "date",
            },
            {
                opc: 'input',
                lbl: 'Hora de inicio',
                id: 'time_start',
                tipo: 'hora',
                type: "time",
                class: 'col-12 col-sm-4 col-lg-3 mb-3',
                required: true
            },
            {
                opc: "input",
                lbl: "Fecha de cierre",
                id: "date_end",
                class: "col-12 col-sm-4 col-lg-3 mb-3",
                type: "date",
            },
            {
                opc: 'select',
                lbl: 'Tipo de evento',
                id: 'type_event',
                class: 'col-12 col-sm-4 col-lg-3 mb-3',
                data: [
                    { id: 'Abierto', valor: "Abierto" },
                    { id: 'Privado', valor: "Privado" }
                ]
            },
            {
                opc: 'input',
                placeholder: '0.00',
                lbl: 'Anticipo',
                id: 'advanced_pay',
                tipo: 'cifra',
                class: 'col-12 col-sm-4 col-lg-3 mb-3',
                required: false
            },


            {
                opc: 'input',
                placeholder: '0.00',
                lbl: 'Total',
                id: 'total_pay',
                tipo: 'cifra',
                class: 'col-12 col-sm-4 col-lg-3 mb-3',
                required: false
            },


            {
                opc: "textarea",
                lbl: "Observaciones",
                id: "notes",
                class: "col-12 col-sm-12 col-md-12 col-lg-12",
                rows: 3
            },

            // 📏 Botones
            {
                opc: "btn-submit",
                id: "btnGuardar",
                text: "Guardar",
                class: "col-5 col-sm-3 col-md-2 col-lg-2 offset-lg-8"
            },
            {
                opc: "button",
                id: "btnCancelar",
                text: "Cancelar",
                class: "col-6 col-sm-3 col-md-2 col-lg-2",
                color_btn: "danger",
                className: 'w-full',
                onClick: () => eventos.closeEvent()
            }
        ];
    }

    // Sub evento
    async showSubEvent() {

        let subEvents = await useFetch({
            url: this._link,
            data: {
                opc: "listSubEvents",
                id: idEvent
            }
        });


        if (subEvents.status == 200) {

            this.accordingMenu({
                parent: 'tab-new-subevent',
                title: 'Evento  : ' + subEvents.event.name_event,
                data: subEvents.data,

                center: [1, 2, 3, 6],
                right: [5],

                onAdd: () => { this.addSubEvent() },

                onEdit: (item, index) => {
                    this.editSubEvent(item)
                },
                onDelete: (item, index) => {
                    this.cancelSubEvent(item)
                },

                onPrint: (item) => {
                    payment.onShowDocument(idEvent)
                }
            });

        } else {


            const emptySubEvent = $(`
                    <div class="flex flex-col items-center justify-content-start py-12 text-center h-full  bg-[#1F2A37] rounded-lg">
                    <i class="icon-calendar-1 text-[52px] text-gray-100"></i>
                    <h3 class="text-xl font-medium text-gray-100 mb-2">No hay sub-eventos</h3>
                    <p class="text-gray-400 mb-4">Comienza agregando tu primer sub-evento</p>
                    <button  id="btnAddSubEvent" class=" bg-gray-600 hover:bg-gray-700  px-4 py-2 rounded text-white ">
                    <span class="icon-plus-1"></span>
                    Nuevo Sub-evento
                    </button>
                </div> `);

            emptySubEvent.find("#btnAddSubEvent").on("click", () => {
                this.addSubEvent();
            });


            // 📌 Render
            $(`#tab-new-subevent`).html(emptySubEvent);


        }

    }

    accordingMenu(options) {
        const defaults = {
            parent: "tab-sub-event",
            id: "accordionTable",
            title: 'Titulo',
            color_primary: 'bg-[#1F2A37]',
            data: [],
            center: [1, 2, 5],
            right: [3, 4],
            onShow: () => { },          // ✅ por si no lo pasan
        };

        const opts = Object.assign(defaults, options);
        const container = $('<div>', {
            id: opts.id,
            class: `${opts.color_primary} rounded-lg my-5 border border-gray-700 overflow-hidden`
        });

        const titleRow = $(`
            <div class="flex justify-between items-center px-4 py-4 border-b border-gray-800">
                <h2 class="text-lg font-semibold text-white">${opts.title}</h2>

                <div class="flex items-center gap-2">
                    <button id="btn-new-sub-event" class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded w-40 flex items-center justify-center gap-2">
                        <span class="text-lg">＋</span> Nuevo 
                    </button>
                    <button id="btn-print-sub-event" class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded w-40 flex items-center justify-center gap-2">
                        <span class="text-lg">🖨️</span> Imprimir
                    </button>
                </div>
            </div>
        `);

        titleRow.find("#btn-new-sub-event").on("click", () => {
            if (typeof opts.onAdd === "function") opts.onAdd();
        });

        titleRow.find("#btn-print-sub-event").on("click", () => {
            if (typeof opts.onAdd === "function") opts.onPrint();
        });


        container.append(titleRow);

        // 📜 Mostrar nota del evento si existe (gris claro)
        if (opts.data.length > 0 && opts.data[0].note) {
            const noteRow = $(`<div class="px-4 text-sm text-gray-400 mb-2">${opts.data[0].note}</div>`);
            container.append(noteRow);
        }

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
                </div>`);

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


        // 📌 Calcular total general
        let totalGral = opts.data.reduce((sum, el) => {
            let clean = (el.Total || '0')
                .toString()
                .replace(/[^0-9.-]+/g, ''); // Elimina $ , y cualquier otro símbolo

            return sum + (parseFloat(clean) || 0);
        }, 0);


        container.append(`
            <div class="flex justify-between items-center  px-4 py-4 space-y-2 mt-3 border-t border-gray-800 text-white text-sm">
                <div class="font-semibold text-green-400 text-lg">
                    TOTAL GRAL: <span>$${totalGral.toLocaleString(undefined, {
            minimumFractionDigits: 2,
        })}</span>
                </div>
                <button type="button" class="flex  bg-[#374151] hover:bg-[#4b5563] text-white items-center justify-center px-4 py-2 mt-3 text-sm w-40 rounded" onclick="eventos.closeEvent()">Cerrar</button>
            </div>
        `);

        $(`#${opts.parent}`).html(container);
    }

    cancelSubEvent(item) {
        console.log(item);
        this.swalQuestion({
            opts: {
                title: `¿Esta seguro?`,
                html: `¿Deseas eliminar  <strong> ${item.SubEvento} </strong> ?`,
            },
            data: { opc: "deleteSubEvent", id: item.id },
            methods: {
                request: (response) => {
                    if (response.status == 200) {

                        alert({
                            icon: "success", text: response.message,
                        });

                        this.showSubEvent();

                    } else {
                        alert({
                            icon: "error", text: response.message,
                        });

                    }
                },
            },
        });
    }

    addSubEvent() {

        this.createModalForm({

            id: 'frmModalSubEvent',
            title: 'Nuevo Usuario',
            data: { opc: 'addSubEvent', evt_events_id: idEvent },

            bootbox: {
                title: 'Crear nuevo sub-evento',
                size: 'large'
            },

            json: this.jsonSubEvent(),

            success: (response) => {

                if (response.status == 200) {

                    alert({
                        icon: "success",
                        title: "Sub Evento creado con éxito",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok",
                    });

                    this.showSubEvent();
                    $("#btnNewSubEvent").removeClass("d-none");

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
        $("#frmModalSubEvent #date_start").val(new Date().toISOString().split("T")[0]);
        $("#frmModalSubEvent #date_end").val(new Date().toISOString().split("T")[0]);

    }

    async editSubEvent(item) {

        let request = await useFetch({ url: this._link, data: { opc: "getSubEvent", id: item.id } });


        this.createModalForm({

            id: 'frmEdit',
            title: 'Editar Sub Evento',
            autofill: request.data[0],
            data: { opc: 'editSubEvent', id: item.id },

            bootbox: {
                title: 'Editar sub Evento',
                size: 'large'
            },
            json: this.jsonSubEvent(),
            success: (response) => {
                if (response.status == 200) {

                    alert({
                        icon: "success", text: response.message,
                    });

                    this.showSubEvent();


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

    jsonSubEvent() {
        return [
            // 📏 Información del evento
            { opc: 'input', lbl: 'Nombre del evento', id: 'name_subevent', class: 'col-6 mb-3', tipo: 'texto', required: true },
            {
                opc: 'select', lbl: 'Tipo de evento', id: 'type_event', class: 'col-6 mb-3', data: [
                    { id: 'Abierto', valor: "Abierto" },
                    { id: 'Privado', valor: "Privado" },
                ]
            },
            { opc: "input", value: 1, lbl: "Número de personas", id: "quantity_people", class: "col-6 mb-3 ", tipo: "cifra", required: true, placeholder: "0" },
            { opc: 'input', lbl: 'Localización', id: 'location', class: 'col-6', tipo: 'texto', required: true },
            { opc: "input", lbl: "Fecha de inicio", id: "date_start", class: "col-3 mb-3", type: "date", required: true },
            { opc: 'input', lbl: 'Hora de inicio', id: 'time_start', tipo: 'hora', type: "time", class: 'col-3 mb-3', required: true },
            { opc: 'input', lbl: 'Hora de cierre', id: 'time_end', tipo: 'hora', type: "time", class: 'col-3 mb-3', required: true },

            { opc: 'input', lbl: 'Monto', id: 'total_pay', tipo: 'cifra', class: 'col-3' },
            { opc: 'textarea', lbl: 'Observaciones', id: 'notes', class: 'col-12' },

        ];
    }



    // Menú

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
                    btn_color: 'primary',
                    text: 'Agregar',
                    class: 'col-12 col-sm-4 col-lg-3',

                },


            ],
            success: (result) => {


                // Botones ocultar
                $("#formMenu #btnMenuSave").addClass("d-none");

                // Poner disabled a los inputs
                $("#formMenu input").attr("disabled", "disabled");
                sub.newDish(1, idSubEvent);


            }
        });


        if (data.status == 200) {
            // Poner disabled a los inputs
            $("#formMenu #btnMenuSave").addClass("d-none");
            $("#formMenu input").attr("disabled", "disabled");
            sub.newDish(data.menu.id, idSubEvent);
        }




    }

    newDish(idMenu, idEvent) {

        console.log('new dish', idMenu, idEvent);


        $("containerDishes" + idEvent).html();
        // Formulario de platillos


        this.createTableForm({
            parent: "containerDishes" + idEvent,
            title: "Agregar platillos",

            table: {
                id: "tbMenu",
                center: [1, 2],
                attr: {
                    color_th: 'bg-[#374151] text-white py-2',

                },
                data: { opc: "lsDishes", id: idMenu, idSubEvent: idEvent },
                success: (data) => {

                },
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
                        id: "quantity",
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

    async editDish(id, idMenu, idSubEvent) {

        console.log('📜 edit dish', id, idSubEvent);

        let dish = await useFetch({
            url: this._link,
            data: { opc: "getByIdDish", id: id },
        });

        $("#contentFormtableForm").empty();
        $("#contentFormtableForm").off();

        this.createForm({
            parent: "contentFormtableForm",
            autofill: dish.data,
            autovalidation: false,
            data: { opc: "editDish", id: id },

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
                    id: "quantity",
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

                    opc: "btn-submit", id: "btnAgregar", text: "Actualizar", class: "col-6"
                },

                {
                    opc: "button",
                    className: "w-100",
                    color_btn: "danger",
                    id: "btnSalir",
                    text: "Cancelar",
                    class: "col-6",

                    onClick: () => {
                        // this.newUserLayout();
                    },
                },

            ],

            success: (response) => {
                $('#containerMenu' + idSubEvent).empty();
                $('#containerDishes' + idSubEvent).empty();

                this.newDish(idMenu, idSubEvent);
            },
        });


    }

    removeDish(id, idSubEvent) {
        let tr = $(event.target).closest("tr");
        let title = tr.find("td").eq(0).text();

        this.swalQuestion({
            opts: {

                title: `¿Esta seguro de eliminarlo?`,
                text: "Estas apunto de eliminar el platillo/bebida",
            },
            data: {
                opc: "removeDish",
                id: id,
            },
            methods: {
                request: (response) => {
                    if (response.status == 200) {
                        alert({ icon: "success", text: response.message });

                        this.lsDishes(id);
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });

    }

    lsDishes(idDishes) {

        $('#contentTabletableForm').empty();

        this.createTable({
            parent: "contentTabletableForm",
            idFilterBar: "filterBarSubEvent",
            data: { opc: "lsDishes", id: idDishes },
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbDishes",
                center: [1]
            },
        });
    }

}
