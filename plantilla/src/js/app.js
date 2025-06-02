
// init vars.
let app, sub;

let api = "https://erp-varoch.com/DEV/ch/ctrl/ctrl-tabulacion-calificaciones.php";


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

        this.tabLayout({
            parent: "root",
            id    : "tabComponent",
            class : '',
            json: [
                { id: "recorder", tab: "EnviarRegistros", icon: "", active: true, onClick: () => { } },
                { id: "concentrado", tab: "Graficos", icon: "", onClick: () => { } },
              ]
        });

        this.ls();

    }

    async showEvent(id, category) {
        
        // 📡 Petición al backend
        const response = await useFetch({
            url: api,
            data: { opc: "getByIdCalendario", id: id, category: category },
        });

        const event = response.data.event || {};
        const menuList = response.data.menu || [];
        const dishList = response.data.dishes || [];

        // 📦 Datos del evento
        const titulo = event.name_event || "N/A";
        const locacion = event.location || "N/A";
        const status = this.eventStatus(event.status);
        const fechaCreacion = event.date_creation ? formatSpanishDate(event.date_creation) : "N/A";
        const fechaInicio = event.date_start ? formatSpanishDate(event.date_start) : "N/A";
        const horaInicio = event.time_start || "";
        const fechaFin = event.date_end ? formatSpanishDate(event.date_end) : "N/A";
        const horaFin = event.time_end || "";
        const cliente = event.name_client || "N/A";
        const telefono = event.phone || "N/A";
        const correo = event.email || "N/A";
        const tipoEvento = event.type_event || "N/A";
        const cantidadPersonas = event.quantity_people || "N/A";
        const metodoPago = event.method_pay || "N/A";
        const notes = event.notes || "";

        // 🎯 Ícono por categoría
        let icon = "📆";
        if (category === "Reservación") icon = "🕒";
        else if (category === "Pedido") icon = "🎂";

        // 🍽️ Agrupar menú y dishes por paquete
        const menuGrouped = {};
        menuList.forEach(item => {
            const id = item.package_id;
            if (!menuGrouped[id]) {
                menuGrouped[id] = {
                    name: item.name,
                    quantity: 0,
                    total: 0,
                    dishes: []
                };
            }
            menuGrouped[id].quantity += parseInt(item.quantity || 0);
            menuGrouped[id].total += parseFloat(item.price || 0);
        });

        dishList.forEach(dish => {
            if (menuGrouped[dish.package_id]) {
                menuGrouped[dish.package_id].dishes.push(dish);
            }
        });

        // 🎨 Diseño de Menú como imagen
        const menuVisual = `
        <div class="  text-sm mt-4">
            <p class="font-semibold mb-2">Menú</p>
            <div class="flex space-x-12  text-center mb-1">
                <div class="w-1/3"><i class="icon-dropbox"></i> <strong>Paquete:</strong></div>
                <div class="w-1/3"><i class="icon-basket-alt"></i> <strong>Cantidad:</strong></div>
                <div class="w-1/3"><i class="icon-dollar"></i> <strong>Precio:</strong></div>
            </div>
            ${Object.entries(menuGrouped).map(([id, pkg]) => `
                <div class="flex space-x-12 mb-2 font-semibold text-center">
                    <div class="w-1/3">${pkg.name}</div>
                    <div class="w-1/3">${pkg.quantity}</div>
                    <div class="w-1/3">$${pkg.total}</div>
                </div>
                ${pkg.dishes.length > 0 ? `
                    <ul class="list-disc list-inside text-[12px]  pl-4 mt-1 mb-4">
                        ${pkg.dishes.map(d => `<li>- ${d.name} (${d.quantity})</li>`).join("")}
                    </ul>
                ` : ""}
            `).join("")}
        </div>
    `;

        // 📋 Render modal
        bootbox.dialog({
            title: `
            <div>
                <h5>${icon} ${titulo}</h5>
                <p class="font-11 text-muted mb-0 pb-0 mt-1"><i class="icon-location"></i>${locacion}</p>
            </div>`,
            closeButton: true,
            message: `
            <div class="mb-3"><strong><i class="icon-spinner"></i> Estado:</strong> ${status}</div>
            <div class="mb-3"><strong><i class="icon-clock"></i> Fecha creación:</strong> <small>${fechaCreacion}</small></div>
            <div class="mb-3"><strong><i class="icon-calendar"></i> Fecha:</strong> <small>${fechaInicio} ${horaInicio} al ${fechaFin} ${horaFin}</small></div>
            <div class="mb-3"><strong><i class="icon-user-5"></i> Cliente:</strong> <small>${cliente}</small></div>
            <div class="mb-3"><strong><i class="icon-phone"></i> Teléfono:</strong> <small>${telefono}</small></div>
            <div class="mb-3"><strong><i class="icon-mail"></i> Correo:</strong> <small>${correo}</small></div>
            <div class="mb-3"><strong><i class="icon-tags-2"></i> Tipo de evento:</strong> <small>${tipoEvento}</small></div>
            <div class="mb-3"><strong><i class="icon-users-2"></i> Total de personas:</strong> <small>${cantidadPersonas}</small></div>
            <div class="mb-3"><strong><i class="icon-money"></i> Forma de pago:</strong> <small>${metodoPago}</small></div>
            <hr class="mb-3">
            <div class="mb-3"><strong>Notas:</strong><br><small>${notes}</small></div>
            <hr class="mb-3">
            ${menuVisual}
        `
        }).on("shown.bs.modal", function () { });
    }


    eventStatus(statusEvent) {
        console.log("statusEvent", statusEvent);
        let status = "";
        switch (statusEvent) {
            case "Cotización":
                status = `<div class="bg-[#9EBBDB] rounded-xl text-center d-inline-block pe-2 ps-2">
                            <div style="margin-right: 1px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color:rgb(36, 110, 214); display: inline-flex; flex-shrink: 0;"></div>
                            <small><span class="text-gray-900">${statusEvent}</span></small>
                        </div>`;
                break;
            case "Pendiente":
                status = `<div class="bg-[#936F38] rounded-xl text-center d-inline-block pe-2 ps-2">
                            <div style="margin-right: 1px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color: #D69624; display: inline-flex; flex-shrink: 0;"></div>
                            <small><span class="text-[#E4EBE7]">${statusEvent}</span></small>
                        </div>`;
                break;
            case "Pagado":
                status = `<div class="bg-[#32684D] rounded-xl text-center d-inline-block pe-2 ps-2">
                            <div style="margin-right: 1px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color: #2DA167; display: inline-flex; flex-shrink: 0;"></div>
                            <small><span class="text-[#E4EBE7]">${statusEvent}</span></small>
                        </div>`;
                break;
            case "Cancelado":
                status = `<div class="bg-[#7D3F3E] rounded-xl text-center d-inline-block pe-2 ps-2">
                            <div style="margin-right: 1px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color: #D5534E; display: inline-flex; flex-shrink: 0;"></div>
                            <small><span class="text-[#E4EBE7]">${statusEvent}</span></small>
                        </div>`;
                break;
        }
        return status;
    }

    async viewTable(options) {
        let data = await useConexion({
            url: this._link,
            data: { opc: 'lsVentas', fi: '2025-05-01', ff: '2025-05-31', status:0 }
        });

     
        this.createTableComponent({
            parent: "container-recorder",
            data: data,
            theme:'corporativo',
            id:'tbTable'
        });

        simple_data_table('#tbTable');

       
    }

    layout() {
        this.tabsLayout({
            parent: "root",
            
            json: [
                {
                    tab: "Eventos",
                    id: "gestorEventos",
                    class:'bg-gray-800',
                    onClick: () => this.showSubEvent(),
                    contenedor: [
                        { class: "lg:h-[10%] ", id: "filterBar" },
                        { class: "lg:h-[83%] flex-grow  mt-2", id: "container" },
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
                    opc: "button",
                    color_btn: 'danger',
                    class: "col-3",
                    className: 'w-full',
                    id: "btn",
                    text: 'PDF',

                    onClick: () => {

                        this.onShow();
                    }
                },
            ],

        });


    }

    ls() {

        this.createTable({
            parent: "container-recorder",
            idFilterBar: "filterBarEventos",
            data: { opc: 'list', id:11},
            conf: { datatable: false, pag: 15 },
            coffeesoft:true, // activar new style
            attr: {
                id: "tableComponent",
                center: [1, 2, 3, 6, 7],
                extends: true,
                theme:'light'
            },
        });
    }


    // JSON
     jsonExample(){
         return {
             thead: ["Fecha", "Actividad", "Encargado", "Estado",""],
             row: [
                 {
                     id: 1,
                     Fecha: {
                         html: "08-abr-2025<br>18-abr-2025",
                         class: "bg-red-400 text-white text-center rounded-l px-2 py-1"
                     },
                     Actividad: "Enviar comprobantes",
                     Encargado: "Ana",
                     Estado: {
                         html: `<span class="flex w-32 justify-content-center text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⏳ EN PROCESO
                 </span>`,
                         class: "text-center"
                     },

                     dropdown: [
                         {
                             text: "Ver",
                             icon: "icon-eye",
                             onclick: "console.log('Ver ID 1')"
                         },
                         {
                             text: "Editar",
                             icon: "icon-pencil",
                             onclick: "console.log('Editar ID 1')"
                         }
                     ]
                 },
                 {
                     id: 1,
                     Fecha: {
                         html: "08-abr-2025<br>18-abr-2025",
                         class: "bg-red-400 text-white text-center rounded-l px-2 py-1"
                     },
                     Actividad: "colchas o waffles pagar la cotización que se envió en la requisición",
                     Encargado: "Hernesto",
                     Estado: {
                         html: `<span class="flex w-32 justify-content-center text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⏳ EN PROCESO
                 </span>`,
                         class: "text-center"
                     },

                     dropdown: [
                         {
                             text: "Ver",
                             icon: "icon-eye",
                             onclick: "console.log('Ver ID 1')"
                         },
                         {
                             text: "Editar",
                             icon: "icon-pencil",
                             onclick: "console.log('Editar ID 1')"
                         }
                     ]
                 },
                 {
                     id: 1,
                     Fecha: {
                         html: "08-abr-2025<br>18-abr-2025",
                         class: "bg-red-400 text-white text-center rounded-l px-2 py-1"
                     },
                     Actividad: "colchas o waffles pagar la cotización que se envió en la requisición",
                     Encargado: "Sofia",
                     Estado: {
                         html: `<span class="flex w-32 justify-content-center text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    ⏳ EN PROCESO
                 </span>`,
                         class: "text-center"
                     },

                     dropdown: [
                         {
                             text: "Ver",
                             icon: "icon-eye",
                             onclick: "console.log('Ver ID 1')"
                         },
                         {
                             text: "Editar",
                             icon: "icon-pencil",
                             onclick: "console.log('Editar ID 1')"
                         }
                     ]
                 }
             ]
         }

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



