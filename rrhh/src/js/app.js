
// init vars.
let app, sub;

let api = "https://huubie.com.mx/alpha/eventos/ctrl/ctrl-sub-eventos.php";



$(async () => {
    // instancias.
    app = new App(api, 'root');
    app.render();
});


class App extends Templates {
    constructor(link, divModulo) {
        super(link, divModulo);
        this.PROJECT_NAME = "Rotacion";
    }

     render() {
        this.period = $('#periodo').val() || "Junio 2025";
        this.udn = $('#udn').val() || "Corporativo";

        this.layout();
        // this.createFilterBar();
    }

    layout() {
        this.tabLayout({
            parent: "root" ,
            json: [
                { id: "rotacion", tab: "% de Rotación", icon: "", active: true, onClick: () => this.initRotacion() },
                { id: "plantilla", tab: "% de Plantilla", icon: "", onClick: () => this.initPlantilla() },
                { id: "bajas", tab: "Concentrado de Bajas", icon: "", onClick: () => this.initBajas() },
            ]
        });

        this.layoutPorcentRotation();
    }

    layoutPorcentRotation() {
        this.primaryLayout({
            parent: "container-rotacion",
            id: this.PROJECT_NAME,
            class: "mx-2 my-2",
            card: {
                filterBar: { class: "w-full line", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full line", id: "container" + this.PROJECT_NAME },
            },
        });

        this.createFilterBar();
        // this.layoutTabs();
    }

 
    createFilterBar() {
        this.createfilterBar({
            parent: "filterBar" + this.PROJECT_NAME,
            data: [
                {
                    opc: "select",
                    id: "periodo",
                    lbl: "Seleccionar periodo",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "Enero 2025", valor: "Enero 2025" },
                        { id: "Febrero 2025", valor: "Febrero 2025" },
                        { id: "Marzo 2025", valor: "Marzo 2025" },
                        { id: "Abril 2025", valor: "Abril 2025" },
                        { id: "Mayo 2025", valor: "Mayo 2025" },
                        { id: "Junio 2025", valor: "Junio 2025" },
                    ]
                },
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Seleccionar UDN",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "Corporativo", valor: "Corporativo" }
                    ]
                },
                {
                    opc: "select",
                    id: "concentrado",
                    lbl: "Concentrado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "General", valor: "General" },
                        { id: "Detallado", valor: "Detallado" }
                    ]
                },
                {
                    opc: "button",
                    id: "btnNuevaRotacion",
                    text: "+ Nueva rotación mensual",
                    class: "col-12 col-md-3",
                    className:'w-100',
                    onClick: () => this.addNewRotacion()
                }
            ]
        });

       
    }

    addNewRotacion() {
        const mes = moment().format('MMMM').toUpperCase();
        const anio = moment().format('YYYY');

        this.swalQuestion({
            opts: {
                title: "📅 NUEVA ROTACIÓN MENSUAL",
                html: `<p class='text-[18px] text-center font-bold'>¿Desea crear la rotación mensual correspondiente al mes de <span class='text-blue-600'>${mes} - ${anio}</span>?</p>
                       <p class='text-[14px] text-gray-400 mt-3'>Al confirmar se crearán los siguientes módulos:</p>
                       <ul class='text-gray-400 text-sm mt-1 text-left ml-4 list-disc'>
                          <li>porcentaje de rotación</li>
                          <li>porcentaje de plantilla</li>
                          <li>concentrado de bajas</li>
                       </ul>`,
                icon: "info"
            },
            data: {
                opc: 'addNewRotacion',
                month: mes,
                year: anio
            },
            methods: {
                request: (data) => {
                 
                }
            }
        });
    }

    // Módulo: Registro de Salidas
    initSalidas() {
        $("#tab-salidas").html(`<form id="formSalida" class="row p-3"></form>`);
        this.createForm({
            parent: "formSalida",
            id: "frmSalida",
            data: { opc: "addSalida" },
            json: [
                { opc: "input", id: "nombre_empleado", lbl: "Nombre", class: "col-12 col-md-6", required: true },
                { opc: "input", id: "fecha_salida", lbl: "Fecha de Salida", type: "date", class: "col-12 col-md-6", required: true },
                { opc: "btn-submit", id: "btnGuardarSalida", text: "Guardar Salida", class: "col-12 mt-3" },
            ],
        });
    }

    // Módulo: Control de Regresos
    initRegresos() {
        $("#tab-regresos").html(`<form id="formRegreso" class="row p-3"></form>`);
        this.createForm({
            parent: "formRegreso",
            id: "frmRegreso",
            data: { opc: "registrarRegreso" },
            json: [
                { opc: "input", id: "id_empleado", lbl: "ID Empleado", class: "col-12 col-md-6", required: true },
                { opc: "input", id: "fecha_regreso", lbl: "Fecha de Regreso", type: "date", class: "col-12 col-md-6", required: true },
                { opc: "btn-submit", id: "btnGuardarRegreso", text: "Registrar Regreso", class: "col-12 mt-3" },
            ],
        });
    }

    // Módulo: Listado de Rotaciones
    initListado() {
        $("#tab-listado").html(`<div id="tablaListado"></div>`);
        this.createTable({
            parent: "tablaListado",
            idFilterBar: "filterBarRotacion",
            data: { opc: "listarRotaciones" },
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbRotacion",
                center: [1, 2],
                right: [3],
                extends: true,
            },
        });
    }
}



