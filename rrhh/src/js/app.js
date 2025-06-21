
// init vars.
let app, template,baja,rotation;

let udn,periodo;

let api = "https://erp-varoch.com/DEV/capital-humano/ctrl/ctrl-rotacion-de-personal.php";



$(async () => {

    const init = await useFetch({ url: api, data: { opc: "init" } });
    udn = init.udn || [];
    periodo = init.periodo || [];

    // instancias.
    app      = new App(api, 'root');
    rotation = new Rotacion(api, 'root');
    template = new Plantilla(api, 'root');
    baja     = new Bajas(api, 'root');

    app.init();
    template.init();
    baja.init();
   
});


class App extends Templates {
    constructor(link, divModulo) {
        super(link, divModulo);
        this.PROJECT_NAME = "Rotacion";
    }

     init() {
     
        this.render();
    }

    render() {

        // this.layout();
        this.layoutNewRotation()
       
    }

    layout() {
        this.tabLayout({
            parent: "root",
            json: [
                { id: "rotacion", tab: "Porcentaje de Rotación", icon: "", active: true , onClick: () => this.initRotacion() },
                { id: "plantilla", tab: "Porcentaje de Plantilla", icon: "",},
                { id: "bajas", tab: "Concentrado de Bajas", icon: "" },
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
                container: { class: "w-full ", id: "container" + this.PROJECT_NAME },
            },
        });

        this.createFilterBar();
        rotation.ls();
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
                    data: udn,
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
                    this.layoutNewRotation();
                }
            }
        });
    }

    layoutNewRotation() {

        $("#root").html(`
            <div class="flex justify-between items-center mb-4">
                <button id="btnRegresar" class="btn btn-outline-primary" >
                    <i class="icon-left"></i> Regresar
                </button>
                <div class="text-xl font-semibold">NUEVA ROTACIÓN</div>
                <div class="text-base font-medium"></div>
            </div>
            <div id="rotacionModulo" class="mb-2 p-3 border rounded-lg"></div>
            <div id="plantillaRotacion" class="mb-2 p-3 border rounded-lg "></div>
            <div id="plantillaBaja" class=" p-3 border rounded-lg "></div>
        `);

        // Evento click para el botón regresar
        $("#btnRegresar").on("click", function () {
            app.layout(); 
        });

        this.newRotation();
      
        
    }

    async newRotation() {

        const request = await useFetch({
            url: api,
            data: {
                opc: "addNewRotacion",
            }
        });

        console.log(request.data.editRotation)

        // Crea la tabla de rotación
        this.createCoffeTable({
            parent: "rotacionModulo",
            title: "Rotación Mensual",
            data: request.data.editRotation,
            conf: {
                datatable: false,
                pag: 10
            },
            attr: {
                class: "table-auto w-full",
                id: "tabla-rotacion-mensual",
                extends: true
            }
        })

        // Crea la tabla de rotación
        this.createCoffeTable({
            parent: "plantillaRotacion",
            title: "Plantilla Rotación",
            data: request.data.editRotation,
            conf: {
                datatable: false,
                pag: 10
            },
            attr: {
                class: "table-auto w-full",
                id: "tabla-rotacion-mensual",
                extends: true
            }
        })

    
    }

  
}



class Rotacion extends App {

    constructor(link, divModulo) {
        super(link, divModulo);
        this.PROJECT_NAME = "Rotacion";
    }

    ls() {

        // Llama a la API, recibe el tipo correcto de tabla
        this.createTable({
            parent: "container" + this.PROJECT_NAME,
            idFilterBar: "filterBar" + this.PROJECT_NAME,
            data: {
                opc: "list",

            },
            coffeesoft: true,
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
        this.PROJECT_NAME = "Templates";
    }

    init(){
        this.layoutPlantilla();
    }

    layoutPlantilla() {

        this.primaryLayout({
            parent: "container-plantilla",
            id: '_'+this.PROJECT_NAME,
            class: "mx-2 my-2",
            card: {
                filterBar: { class: "w-full line", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full ", id: "container" + this.PROJECT_NAME },
            },
        });

        this.createFilterBar();
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
                    data: udn,
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
        this.layoutBajas();
    }

    layoutBajas() {
        this.primaryLayout({
            parent: "container-bajas",
            id: this.PROJECT_NAME,
            class: "mx-2 my-2",
            card: {
                filterBar: { class: "w-full line", id: "filterBar" + this.PROJECT_NAME },
                container: { class: "w-full line", id: "container" + this.PROJECT_NAME },
            },
        });

        this.createFilterBar();
        
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
                    data: udn,
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





