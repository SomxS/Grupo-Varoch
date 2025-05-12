
let app;

const api = "ctrl/ctrl.php";

$(() => {
    app = new App(api, "root");
    app.init();
});

class App extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "";
    }

    init() {
        this.onShow();
    }

    async onShow() {
        
        let subEvents = await useFetch({
            url: this._link,
            data: {
                opc: "getDataComponent",
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
            dataPackage : [],
            dataMenu    : [],
            dataPayment : [],
            dataSubEvent: [],
            dataEvent: {
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
                <strong>    ${opts.dataEvent.date_start} ${opts.dataEvent.date_start_hr} </strong>
                 a <strong> ${opts.dataEvent.date_end} ${opts.dataEvent.date_end_hr
            }</strong>, en el salón
                <strong>${opts.dataEvent.location}</strong>.</p>
                <p>Estamos encantados de recibir a <strong>${opts.dataEvent.quantity_people
            }</strong> invitados y nos aseguraremos de que cada detalle esté a la altura de sus expectativas.</p>
                <br>
                ${opts.dataEvent.notes
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



}