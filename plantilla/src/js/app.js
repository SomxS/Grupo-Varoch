
// init vars.
let app, sub;

let api = "https://erp-varoch.com/ERP24/produccion/control-fogaza/ctrl/ctrl-destajo-formato.php";



$(async () => {
    // instancias.
    app = new App(api, 'root');
    app.init();
});

class App extends UI {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "";
    }

    init() {
        this.render();
    }

    render(options) {
      this.layout();
      this.filterBar();
      this.ls()
    }

    layout(){
        this.primaryLayout({
            parent: "root",
            id: this.PROJECT_NAME,
            card: {
                filterBar: {
                    class: "lg:h-[12%] line",
                    id: "filterBar" + this.PROJECT_NAME,
                },
                container: {
                    class: "lg:h-[88%] line",
                    id: "container" + this.PROJECT_NAME,
                },
            },
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            type: 'simple',
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-4",
                    id: "calendar" + this.PROJECT_NAME,
                    lbl: "Rango de fechas",
                },
                {
                    opc: "button",
                    class: "col-sm-3",
                    color_btn: "primary",
                    id: "btnNuevoDestajo",
                    text: "Agregar",
                    onClick: () => {
                        this.add();
                    },
                },
            ],
        });

        // Init del rango de fechas
        dataPicker({
            parent: "calendar" + this.PROJECT_NAME,
            type:'simple',
            rangepicker: {
                startDate: moment().startOf("month"),
                endDate: moment().endOf("month"),
                showDropdowns: true,
            },
            onSelect: (start, end) => {
                this.ls();
            },
        });
    }

    ls() {
        let range = getDataRangePicker("calendar" + this.PROJECT_NAME);

        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: {
                opc: "listDestajo",
                fi: range.fi,
                ff: range.ff,
            },
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tb" + this.PROJECT_NAME,
                extends: true,
            },
        });
    }

    





    async showSubEvent() {

        let subEvents = await useFetch({
            url: api,
            data: {
                opc: "listSubEvents",
                id: 123
            }
        });

    
        if (subEvents.status == 200) {
            this.accordingMenu({
                parent: "container-companies",
                title: "Evento  : " + subEvents.event.name_event,
                subtitle: subEvents.event.status,
                data: subEvents.data,

                center: [1, 2, 3, 6],
                right: [5],

                onAdd: () => {
                    this.addSubEvent();
                },

                onEdit: (item, index) => {
                    this.editSubEvent(item);
                },
                onDelete: (item, index) => {
                    this.cancelSubEvent(item);
                },

                onPrint: (item) => {
                    payment.onShowDocument(idEvent);
                },

                onShow: (id) => {


                    this.addMenu(id);
                },
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


    // Components.
    accordingMenu(options) {
        const defaults = {
            parent: "tab-sub-event",
            id: "accordionTable",
            title: 'Titulo',
            subtitle: 'Subtitulo',
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
            <div>
            <h2 class="text-lg font-semibold text-white">${opts.title}</h2>
            ${opts.subtitle ? `<span class="inline-block mt-1 text-xs font-medium text-gray-300 bg-gray-700 px-2 py-1 rounded-full">${opts.subtitle}</span>` : ''}
            </div>

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
            let bodyWrapper = $('<div>', {
                class: "bg-[#1F2A37] hidden px-4 py-4 text-sm text-gray-300 accordion-body",
                id: 'containerInfo' + opt.id,

                html: `

                `
            });


            // Logic Components.

            // ✅ Evita colapsar si haces clic en botón
            header.on("click", function (e) {
                let target = $(e.target);
                if (target.closest(".btn-edit").length || target.closest(".btn-delete").length) return;

                $(".accordion-body").slideUp(); // Oculta los demás
                let isVisible = bodyWrapper.is(":visible");
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

    async layoutCompanies() {

        let data = await useFetch({
            url: api,
            data: { opc: 'init' }
        });

        let companie = data.companies;

        console.log(data.companies);

        $("#container-companies").html(`

            <div class="my-3 p-6 rounded-lg border">
            <h2 class="text-xl font-semibold text-gray-800 mb-1 flex items-center">
                <i class="icon-edit text-yellow-600 mr-2"></i> Editar: <span class="ml-1 font-bold">${companie.social_name || "Empresa"}</span>
            </h2>
            <p class="text-sm text-gray-500 mb-3">Modifica la información de la compañía </p>
            </div>

            <div class="flex gap-3">
                <div class="w-25 rounded-lg border p-6"></div>
                <div class="w-75 rounded-lg border p-6" id="container-info-companies"></div>
            </div>
        `);


        this.createForm({
            parent: "container-info-companies",
            id: "formPerfilUsuario",
            autofill: companie,
            json: [
                {
                    opc: "input",
                    lbl: '<i class="icon-building mr-2"></i> Nombre de la compañía',
                    id: "social_name",
                    class: "col-6 mb-3",
                    disabled: true,
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-location mr-2"></i> Ubicación sucursal',
                    id: "rute",
                    class: "col-6 mb-3",
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-location mr-2"></i> Dirección compañia',
                    id: "address",
                    class: "col-6 mb-3",
                    disabled: true,
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-user mr-2"></i> RFC ',
                    id: "rfc",
                    class: "col-6 mb-3",
                },

                {
                    opc: "input",
                    lbl: '<i class="icon-phone mr-2"></i> Teléfono',
                    id: "phone",
                    class: "col-6 mb-3",
                },

                {
                    opc: "btn-submit",
                    id: "btnGuardarPerfil",
                    text: "Actualizar datos",
                    class: "col-sm-4 offset-8",
                },
            ],
            data: this.data,
            success: (res) => {
                alert({
                    icon: res.status === 200 ? "success" : "error",
                    text: res.message,
                });
            },
        });
    }

}



function formatSpanishDate(fecha = null, type = "normal") {
    let date;

    if (!fecha) {
        // Si no se pasa nada, usamos la fecha actual
        date = new Date();
    } else {
        // Dividimos fecha y hora si existe
        // ejemplo: "2025-03-08 09:14" => ["2025-03-08", "09:14"]
        const [fechaPart, horaPart] = fecha.split(" ");

        // Descomponer "YYYY-MM-DD"
        const [year, month, day] = fechaPart.split("-").map(Number);

        if (horaPart) {
            // Si hay hora, por ejemplo "09:14"
            const [hours, minutes] = horaPart.split(":").map(Number);
            // Crear Date con hora local
            date = new Date(year, month - 1, day, hours, minutes);
        } else {
            // Solo fecha
            date = new Date(year, month - 1, day);
        }
    }

    // Extraer partes de la fecha
    const dia = date.getDate();
    const anio = date.getFullYear();

    // Obtenemos el mes en español (México).
    // Nota: El mes corto en español a veces incluye punto (ej: "mar."). Lo eliminamos:
    const mesCorto = date
        .toLocaleString("es-MX", { month: "short" })
        .replace(".", "");
    const mesLargo = date.toLocaleString("es-MX", { month: "long" });

    // Asegurar que el día tenga 2 dígitos
    const diaPadded = String(dia).padStart(2, "0");

    // Formatos deseados
    const formatos = {
        short: `${diaPadded}/${mesCorto}/${anio}`, // p.ej. "08/mar/2025"
        normal: `${diaPadded} de ${mesLargo} del ${anio}`, // p.ej. "08 de marzo del 2025"
    };

    // Devolvemos el formato según type
    return formatos[type] || formatos.short;
}



