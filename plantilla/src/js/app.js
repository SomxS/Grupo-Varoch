
// init vars.
let app, sub;

let api = "https://www.huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php";


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
            id: "tabComponent",
            class: '',
            theme: 'dark',

            json: [
                { id: "companies", tab: "Companies", class:"w-68",icon: "", active: true, onClick: () => { } },
                { id: "concentrado",  tab: "Graficos", icon: "", onClick: () => { }, },
            ]

        });

        this.layoutCompanies();
// gracias inge leo, marcare su sprint como terminado, el sprint terminaba el dia 20 pero ya podremos hacer la junta, es lo ultimo que nos faltaba, gracias.

    }

    async layoutCompanies() {

        $("#container-companies").html(`
            <div class="my-3 p-6 rounded-lg border">
            <h2 class="text-xl font-semibold text-gray-800 mb-1 flex items-center">
                <i class="icon-edit text-yellow-600 mr-2"></i> Editar: <span class="ml-1 font-bold">${this.data?.social_name || "Empresa"}</span>
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
            json: [
                {
                    opc: "input",
                    lbl: '<i class="icon-building mr-2"></i> Empresa y sucursal',
                    id: "empresa",
                    class: "col-6 mb-3",
                    disabled: true,
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-location mr-2"></i> Ubicación sucursal',
                    id: "ubicacion",
                    class: "col-6 mb-3",
                    disabled: true,
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-user mr-2"></i> Nombre completo',
                    id: "fullname",
                    class: "col-6 mb-3",
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-id-card mr-2"></i> Usuario',
                    id: "user",
                    class: "col-6 mb-3",
                    disabled: true,
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-phone mr-2"></i> Teléfono',
                    id: "phone",
                    class: "col-6 mb-3",
                },
                {
                    opc: "input",
                    lbl: '<i class="icon-calendar mr-2"></i> Fecha de nacimiento',
                    id: "birthday",
                    type: "date",
                    class: "col-6 mb-3",
                },
                {
                    opc  : "btn-submit",
                    id   : "btnGuardarPerfil",
                    text : "Guardar cambios",
                    class: "col-sm-3 offset-9",
                },
            ],
            data: this.data,
            success: (res) => {
                alert({ icon: res.status === 200 ? "success" : "error", text: res.message });
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



