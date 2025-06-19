
// init vars.
let app, sub;

let api = "https://erp-varoch.com/DEV/capital-humano/ctrl/ctrl-rotacion-de-personal.php";



$(async () => {
    // instancias.
    app = new App(api, 'root');
    app.init();
});


class App extends Templates {
    constructor(link, divModulo) {
        super(link, divModulo);
        this.PROJECT_NAME = "Rotacion";
    }

    async init() {
        const initData = await useFetch({ url: api, data: { opc: "init" } });
        this.UDNs = initData.udn || [];
        this.PERIODOS = initData.periodo || [];
        this.render();
    }

    render() {
        this.layout();
    }

    layout() {
        this.tabLayout({
            parent: "root",
            json: [
                { id: "rotacion", tab: "Porcentaje de Rotación", icon: "", active: true, onClick: () => this.initRotacion() },
                { id: "plantilla", tab: "Porcentaje de Plantilla", icon: "", onClick: () => this.initPlantilla() },
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
        this.ls();
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
                    ],
                },
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Seleccionar UDN",
                    class: "col-12 col-md-3",
                    data: this.UDNs,
                },
                {
                    opc: "select",
                    id: "concentrado",
                    lbl: "Concentrado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "General", valor: "General" },
                        { id: "Detallado", valor: "Detallado" },
                    ],
                    onchange:'app.ls()'
                },
                {
                    opc: "button",
                    id: "btnNuevaRotacion",
                    text: "+ Nueva rotación mensual",
                    class: "col-12 col-md-3",
                    className: "w-100",
                    onClick: () => this.addNewRotacion(),
                },
            ],
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

    ls() {

        // Llama a la API, recibe el tipo correcto de tabla
        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: {
                opc: "list",

            },
            coffesoft:true,
            conf: {
                datatable: false,
                pag: 10,
            },
            attr: {
                id: "tb" + this.PROJECT_NAME,
                extends: true,
            },

        });
    }





}


class Plantilla extends Templates {
    constructor(link, divModulo) {
        super(link, divModulo);
        this.PROJECT_NAME = "Plantilla";
    }

    init(){
        this.layoutPlantilla();
    }

    layoutPlantilla() {
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
        this.ls();
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
                    ],
                },
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Seleccionar UDN",
                    class: "col-12 col-md-3",
                    data: this.UDNs,
                },
                {
                    opc: "select",
                    id: "concentrado",
                    lbl: "Concentrado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "General", valor: "General" },
                        { id: "Detallado", valor: "Detallado" },
                    ],
                    onchange: 'app.ls()'
                },

            ],
        });


    }


}

class Bajas extends Templates {
    constructor(link, divModulo) {
        super(link, divModulo);
        this.PROJECT_NAME = "Bajas";
    }

    init() {
        this.layoutPlantilla();
    }

    layoutPlantilla() {
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
        this.ls();
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
                    ],
                },
                {
                    opc: "select",
                    id: "udn",
                    lbl: "Seleccionar UDN",
                    class: "col-12 col-md-3",
                    data: this.UDNs,
                },
                {
                    opc: "select",
                    id: "concentrado",
                    lbl: "Concentrado",
                    class: "col-12 col-md-3",
                    data: [
                        { id: "General", valor: "General" },
                        { id: "Detallado", valor: "Detallado" },
                    ],
                    onchange: 'app.ls()'
                },

            ],
        });


    }
}





