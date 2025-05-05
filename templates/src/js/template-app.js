
// Variables.
let udn;
let app;// instancia de la clase

// let api = "https://huubie.com.mx/alpha/eventos/ctrl/ctrl-eventos.php";
let api = "https://huubie.com.mx/alpha/eventos/ctrl/ctrl-sub-eventos.php";

$(async () => {
    // fn_ajax({ opc: "init" }, api).then((response) => {
        // udn = response.udn;
        

        app = new App(api, "root");
        app.init();

    // });

});


class App extends Templates {

    constructor(link, div_modulo) {

        super(link, div_modulo);
        this.PROJECT_NAME = ""; // Establecer el nombre del proyecto

    }

    init() {

        this.render();
    }

    render() {

        // this.layout();
        // this.filterBar();
        // this.ls();

        this.getSub();
       
    }

    async getSub(){
        let data = await fn_ajax({ opc: "getSubEvento" , id: 114 }, api);
        console.log(data)
        
        this.accordingMenu({
            parent: 'root',
            // data : data[0]
        });
    }

    layout() {

        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            card: {
                filterBar: { class: 'lg:h-[12%] line', id: "filterBar" + this.PROJECT_NAME },
                container: { class: 'lg:h-[88%] line', id: "container" + this.PROJECT_NAME },
            },
        });
    }

    filterBar(){
        this.createfilterBar({
            parent: "filterBar"+this.PROJECT_NAME,
            data: [
                {
                    opc: "input-calendar",
                    class: "col-sm-3",
                    id: "calendar"+this.PROJECT_NAME,
                    lbl: "Buscar por fecha: ",
                },

                {
                    opc: "select",
                    class: "col-sm-3",
                    id: "udn",
                    lbl: "Seleccionar udn: ",
                    data: udn,
                    onchange: "app.ls()",
                },

                {
                    opc: "button",
                    className: "w-100",
                    class: "col-sm-3",
                    color_btn: "primary",
                    id: "btnNew",
                    text: "Nuevo",
                    onClick: () => this.add()
                },

                
            ],
        });
        
        // initialized
        dataPicker({
            parent: "calendar" + this.PROJECT_NAME,
            rangepicker: {
                startDate: moment().startOf("month"),
                endDate: moment().endOf("month"),
                showDropdowns: true,
                ranges: {
                    "Mes actual": [moment().startOf("month"), moment().endOf("month")],
                    "Semana actual": [moment().startOf("week"), moment().endOf("week")],
                    "Proxima semana": [moment().add(1, "week").startOf("week"), moment().add(1, "week").endOf("week")],
                    "Proximo mes": [moment().add(1, "month").startOf("month"), moment().add(1, "month").endOf("month")],
                    "Mes anterior": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
                },
            },
            onSelect: (start, end) => {
                this.ls();
            },
        });

    }

    // Componente accordingMenu con header dinámico (opción 1)
    accordingMenu(options) {
        const defaults = {
            parent       : "tab-sub-event",
            id           : "accordionTable",
            title        : 'SubEventos',
            color_primary: 'bg-[#1F2A37]',
            data         : [],
            onExpand: () => { },  // ✅ por si no lo pasan
        };

        const opts = Object.assign(defaults, options);
        const container = $('<div>', {
            id: opts.id,
            class: `${opts.color_primary} rounded-lg my-5 border border-gray-700 overflow-hidden`
        });

        const titleRow = $(`
        <div class="flex justify-between items-center px-4 py-4 border-b border-gray-800">
        <h2 class="text-lg font-semibold text-white">${opts.title}</h2>
        <button id="btn-new-sub-event" class="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded flex items-center gap-2">
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

        const colSize = Math.floor(12 / (keys.length + 1));
        const headerRow = $('<div>', {
            class: "grid grid-cols-12 gap-4 px-4 py-2 font-medium text-gray-400 border-b border-gray-700 text-sm"
        });
        keys.forEach(key => {
            headerRow.append(`<div class="col-span-${colSize}">${key.charAt(0).toUpperCase() + key.slice(1)}</div>`);
        });
        headerRow.append(`<div class="col-span-${colSize} text-right">Acciones</div>`);
        container.append(headerRow);

        opts.data.forEach((opt, index) => {
            const row = $('<div>', { class: "border-b border-gray-700" });

            const header = $(`<div class="grid grid-cols-12 gap-4 px-3 py-2 items-center hover:bg-[#18212F] bg-[#313D4F] cursor-pointer"></div>`);
            keys.forEach(key => {
                header.append(`<div class="col-span-${colSize} text-gray-300">${opt[key]}</div>`);
            });

            const actions = $(`
        <div class="col-span-${colSize} flex justify-end gap-2">
        <button class="btn-edit bg-gray-700 text-white text-sm px-2 py-1 rounded" title="Editar">✏️</button>
        <button class="btn-delete bg-gray-700 text-red-500 text-sm px-2 py-1 rounded" title="Eliminar">🗑️</button>
        </div>
        `);
            header.append(actions);

            const bodyWrapper = $('<div>', {
                class: "bg-gray-800/30 px-4 py-4 hidden text-sm text-gray-300 accordion-body",
                id: 'containerSubMenu' + opt.id,
                html: `
                <form novalidate class="border-b py-3 border-gray-700" id="containerMenu${opt.id}"></form>
                <div class="mt-3" id="containerDishes${opt.id}"></div>
                `
            });

            // ✅ Evita colapsar si haces clic en botón
            header.on("click", function (e) {
                const target = $(e.target);
                if (target.closest(".btn-edit").length || target.closest(".btn-delete").length) return;

                $(".accordion-body").slideUp(); // Oculta los demás
                const isVisible = bodyWrapper.is(":visible");
                if (!isVisible) {
                    bodyWrapper.slideDown(200);
                    if (typeof opts.onExpand === 'function') opts.onExpand(opt.id);
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

    ls() {
        let rangePicker = getDataRangePicker("calendar"+this.PROJECT_NAME);
     
        this.createTable({
            parent: "container"+this.PROJECT_NAME,
            idFilterBar: "filterBar"+this.PROJECT_NAME,
            data: { opc: "ls", fi: rangePicker.fi, ff: rangePicker.ff,status:0 }, // se pueden agregar mas parametros
            
            conf: {
                datatable: true,
                pag: 10,
            },
            attr: {
                id     : "tb"+this.PROJECT_NAME,
                center : [1, 2, 7, 9, 10],
                right  : [5],
                extends: true,
            },
          
        });
    }


    // [CRUD]
    add() {

        this.createModalForm({
            id: 'frmModal'+this.PROJECT_NAME,
            data: { opc: 'add'},
            
            bootbox: {
                title: '<strong>Nuevo</strong>',
                size: 'large'
            },
            
            json: [
              
                { opc: 'input', lbl: 'Nombre', id: 'name', class: 'col-6 mb-3', tipo: 'texto', required: true },
                {
                    opc: 'select', lbl: 'Tipo', id: 'type', class: 'col-6 mb-3', data: [
                        { id: 'Abierto', valor: "Abierto" },
                        { id: 'Privado', valor: "Privado" },
                    ]
                },
                { opc: "input", value: 1, lbl: "Número de personas", id: "quantity_people", class: "col-6 mb-3 ", tipo: "cifra", required: true, placeholder: "0" },
                { opc: 'input', lbl: 'Localización', id: 'location', class: 'col-6', tipo: 'texto', required: true },
               
                { opc: 'textarea', lbl: 'Observaciones', id: 'notes', class: 'col-12' },

            ],
            success: (response) => {
                if (response.status == 200) {

                    alert({
                        icon: "success",
                        title: "Se ha creado con exito",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok",
                    });

                    this.ls();

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
    
    
}
