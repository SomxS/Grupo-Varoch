
// init vars.
let app, sub;

let api = "https://huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php";


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
        this.onShowDocument(114)
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

    // Print pdf
    async onShowDocument(id) {

        let modal = bootbox.dialog({

            title: "Imprimir nota de evento",
            closeButton: true,
            size: "xl",
            message:
                '<div class="flex justify-content-end  mt-3" id="containerButtons"></div><div class="flex justify-content-center  mt-3" id="containerPDF"></div> ',
            id: "modalDocument",
        }); // Crear componente modal.


        let data = await useFetch({
            url: this._link,
            data: {
                opc: 'getFormatedEvent', idEvent: id,

            }
        });


        this.createPDFComponent({
            parent: "containerPDF",

            dataEvent   : data.Event,
            dataSubEvent: data.SubEvent,
            dataPayment : data.Payment,


        });

        // // Función para imprimir y cerrar el modal correctamente
        let printDiv = () => {

            let divToPrint = document.getElementById("docEvent");
            let popupWin = window.open("", "_blank");

            popupWin.document.open();

            popupWin.document.write(`
                <html>
                <head>
                    <link href="https://15-92.com/ERP3/src/plugin/bootstrap-5/css/bootstrap.min.css" rel="stylesheet" type="text/css">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style type="text/css" media="print">
                        @page { margin: 5px; }
                        body { margin: 5px; padding: 10px; }
                    </style>
                </head>
                <body>
                    ${divToPrint.innerHTML}
                    <script>
                        window.onload = function() {
                            setTimeout(() => { 
                                window.print();
                                window.close();
                            }, 500);
                        };
                    <\/script>
                </body>
                </html>`);

            popupWin.document.close();

            // Cierra el modal inmediatamente después de lanzar la impresión
            modal.modal('hide');

        };

        $('#containerButtons').append(
            $('<button>', {

                class: 'btn btn-primary text-white',
                html:  '<i class="icon-print"></i> Imprimir ',
                
                click: function () {
                    printDiv();
                }
            }),

        );


    }

    // Components .

    createPDFComponent(options) {
        const defaults = {
            parent: 'containerprimaryLayout',
            dataPackage: [],
            dataMenu: [],
            dataPayment: [],
            dataSubEvent: [],
            dataEvent: {
                name: "[name]",
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

        const opts = Object.assign({}, defaults, options);

        const header = `

        <div class="flex justify-end mb-4">
            <p> Tapachula Chiapas, a ${opts.dataEvent.date_creation}</p>
        </div>

        <div class="event-header text-sm text-gray-800 mb-4">
            <p class="font-bold uppercase"> ${opts.dataEvent.name}</p>
            ${opts.dataEvent.status === 'Cotización' ? `<p class="font-bold uppercase text-red-500"> ${opts.dataEvent.status}</p>` : ''}
            <p>${opts.dataEvent.date_start} ${opts.dataEvent.date_start_hr}</p>
            <p>${opts.dataEvent.location}</p>
        </div>

        <div class="mb-6 text-justify">
            <p>Agradecemos su preferencia por celebrar su evento con nosotros el día
            <strong>${opts.dataEvent.day}</strong>,
            <strong>${opts.dataEvent.date_start} ${opts.dataEvent.date_start_hr}</strong>
            a <strong>${opts.dataEvent.date_end} ${opts.dataEvent.date_end_hr}</strong>, en el salón
            <strong>${opts.dataEvent.location}</strong>.</p>
            <p>Estamos encantados de recibir a <strong>${opts.dataEvent.quantity_people}</strong> invitados y nos aseguraremos de que cada detalle esté a la altura de sus expectativas.</p>
            <br>
            ${opts.dataEvent.notes ? `<p><strong>NOTAS:</strong> ${opts.dataEvent.notes}</p>` : ""}
        </div>`;

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

        const total    = parseFloat(opts.dataEvent.total_pay) || 0;
        const advance  = parseFloat(opts.dataEvent.advance_pay) || 0;
        const discount = parseFloat(opts.dataEvent.discount || 0);     // nuevo campo opcional

        let totalPagos = 0;
        let templatePayment = '';

        opts.dataPayment.forEach((item) => {
            const monto = parseFloat(item.valor) || 0;
            totalPagos += monto;
            templatePayment += `
            <div class="flex justify-between text-sm">
                <p class="font-semibold">${item.method_pay}</p>
                <p>${monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
            </div>`;
        });

        templatePayment += `

            <div class="flex justify-between text-sm border-t pt-2 mt-2">
                <p class="font-bold">Total Pagado</p>
                <p class="">${totalPagos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
            </div>

            <div class="flex justify-between text-sm mt-3 border-t">
                <p class="font-bold"> Restante</p>
                <p class="">${(total - advance - discount - totalPagos).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
            </div>`;

        const blockTotals = `
            <div class="mt-6 mb-2 text-sm  flex justify-end">
                <div class="w-1/3">
                    <div class="flex justify-between pt-2">
                        <p class="font-bold"> Total </p>
                        <p>${total.toLocaleString('es-MX',    { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold"> Anticipo </p>
                        <p>${advance.toLocaleString('es-MX',  { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold"> Descuento </p>
                        <p>${discount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                    <div class="flex justify-between">
                        <p class="font-bold"> Saldo </p>
                        <p>${(total - advance - discount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                    </div>
                </div>
            </div>

            <div class="flex text-sm justify-end mt-2">
                <div class="w-1/3">
                    <p class="font-bold border-t my-1">Forma de pago</p>
                    ${templatePayment}
                </div>
            </div>`;


        let templateClauses = `
            <div class="mb-4 mt-3 text-xs">
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
                width: 816px;
                min-height: 1056px;
                background-image: url('https://huubie.com.mx/alpha/eventos/src/img/background.png');
                background-repeat: no-repeat;
                background-size: 90% 100%;
                background-position: left top;
            ">

            <div class="w-full pl-[120px] grow">
                ${header}
                ${subEvents}
            </div>

            <div class="w-full pl-[120px] mt-10">
                ${blockTotals}
                ${templateClauses}
            </div>
        </div>`;

        $('#' + opts.parent).append(docs);
    }



}



