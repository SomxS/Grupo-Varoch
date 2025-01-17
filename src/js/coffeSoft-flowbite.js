class Complements {

    constructor(link, div_modulo) {
        this._link = link;
        this._div_modulo = div_modulo;
    }

    ObjectMerge(target, source) {
        // Iterar sobre todas las claves del objeto fuente
        for (const key in source) {
            // Verificar si la propiedad es propia del objeto fuente
            if (source.hasOwnProperty(key)) {
                // Verificar si el valor es un objeto y si el target tiene la misma propiedad
                if (typeof source[key] === 'object' && source[key] !== null) {
                    // Si el target no tiene la propiedad o no es un objeto, inicializarla como un objeto vacío
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = {};
                    }
                    // Llamada recursiva para combinar sub-objetos
                    this.ObjectMerge(target[key], source[key]);
                } else {
                    // Si no es un objeto, asignar el valor directamente
                    target[key] = source[key];
                }
            }
        }
        return target;
    }

    closedModal(data) {
        if (data === true || data.success === true) {
            alert();
            $('.bootbox-close-button').click();
        } else console.error(data);
    }

    dropdown(options) {
        let defaults = [
            { icon: "icon-pencil", text: "Editar", onClick: "alert('Editar')" },
            { icon: "icon-trash", text: "Eliminar", onClick: "alert('Eliminar')" },
        ];

        let opts = options != undefined ? options : defaults;

        const $ul = $("<ul>", { class: "dropdown-menu", "aria-labelledby": "dropdownMenu" });
        //Hago una iteración sobre el array de etiquetas li
        opts.forEach((m) => {
            let html = m.icon != "" ? `<i class="text-info ${m.icon}"></i>` : "<i class='icon-minus'></i>";
            html += m.text != "" ? m.text : "";

            const $a = $("<a>", { ...m, class: "pt-1 pb-1 pointer dropdown-item", onclick: m.onClick, html });
            const $li = $("<li>").append($a);
            $ul.append($li);
        });


        //Creo el boton principal ...
        const $button = $("<button>", {
            class: "btn btn-aliceblue btn-sm",
            id: "dropdownMenu",
            type: "button",
            "data-bs-toggle": "dropdown",
            "aria-expanded": "false",
            html: '<i class="icon-dot-3 text-info"></i>',
        });

        //Se puede hacer un return aquí y retorna el objeto jQuery
        const $container = $("<div>", { class: "dropdown" });
        $container.append($button, $ul);
        //Yo hago el return aquí porque convierto el objeto a un string.
        return $container.prop("outerHTML");
    }

    useFetch(options) {

        // Valores predeterminados
        let defaults = {
            method: 'POST',
            data: { opc: 'ls' },
            url: this._link, // La URL debe ser especificada en las opciones
            success: () => { } // Función vacía por defecto
        };

        // Mezclar los valores predeterminados con las opciones proporcionadas
        let opts = Object.assign({}, defaults, options);

        // Validar que la URL esté definida
        if (!opts.url) {
            console.error('URL es obligatoria.');
            return;
        }

        // Realizar la petición fetch
        fetch(opts.url, {
            method: opts.method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(opts.data),
        })
            .then((response) => response.json())
            .then((data) => {
                // Llamar a la función success si se proporciona
                if (typeof opts.success === 'function') {
                    opts.success(data);
                }
            })
            .catch((error) => {
                console.error('Error en la petición:', error);
            });
    }

}

class Components extends Complements {

    constructor(link, div_modulo) {
        super(link, div_modulo);
    }
}

class Templates extends Components {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    createLayaout(options = {}) {
        const defaults = {
            design: true,
            content: this._div_modulo,
            parent: '',
            clean: false,
            data: { id: "rptFormat", class: "col-12" },
        };

        const opts = Object.assign({}, defaults, options);
        const lineClass = opts.design ? ' block ' : '';

        const div = $("<div>", {
            class: opts.data.class,
            id: opts.data.id,
        });

        const row = opts.data.contenedor ? opts.data.contenedor : opts.data.elements;

        row.forEach(item => {
            let div_cont;

            switch (item.type) {

                case 'div':

                    div_cont = $("<div>", {
                        class: (item.class ? item.class : 'row') + ' ' + lineClass,
                        id: item.id,
                    });

                    if (item.children) {
                        item.children.forEach(child => {
                            child.class = (child.class ? child.class + ' ' : '') + lineClass;

                            if (child.type) {

                                div_cont.append($(`<${child.type}>`, child));

                            } else {

                                div_cont.append($("<div>", child));
                            }

                        });
                    }

                    div.append(div_cont);

                    break;

                default:

                    const { type, ...attr } = item;


                    div_cont = $("<" + item.type + ">", attr);

                    div.append(div_cont);
                    break;
            }
        });


        // aplicar limpieza al contenedor

        if (opts.clean)
            $("#" + opts.content ? opts.content : opts.parent).empty();


        if (!opts.parent) {
            $("#" + opts.content).html(div);
        } else {
            $("#" + opts.parent).html(div);
        }

    }

    createPlantilla(options) {

        let json_components = {
            id: "mdlGastos",
            class: "card-body row m-2",

            contenedor: [
                {
                    type: "form",
                    id: "formGastos",
                    class: " col-lg-4  block pt-2",
                    novalidate: true,
                },

                {
                    type: "div",
                    id: "contentGast",
                    class: "col-lg-8 ",
                    children: [
                        { class: 'col-12', id: 'filterGastos' },
                        { class: 'col-12', id: 'tableGastos' }
                    ]
                },
            ]
        };


        var defaults = { data: json_components, design: true };
        let opts = Object.assign(defaults, options);
        this.createLayaout(opts);

    }

    splitLayout(options) {
        let name = options.id ? options.id : 'splitLayout';
        // Configuración por defecto
        let defaults = {
            id: name,
            parent: this._div_modulo,
            className: "flex flex-col w-full h-full p-1",

            filterBar: {
                id: 'filterBar' + name,
                class: 'w-full h-1/4  line',
                text: 'filterBar'
            },

            container: {

                id: 'container' + name,
                class: 'flex h-2/4 w-full flex-grow ',

                children: [
                    { class: 'w-1/2 line', id: 'left' + name, text: 'splitlayout' },
                    { class: 'w-1/2 line', id: 'right' + name }
                ],

            },

            footer: {
                id: 'footer' + name,
                class: 'w-full h-1/4  line',
            },
        };



        // Combina los valores predeterminados con las opciones proporcionadas
        const opts = this.ObjectMerge(defaults, options);

        // Construye el objeto JSON de componentes
        let jsonComponents = {
            id: opts.id,
            class: opts.className,
            contenedor: [
                {
                    type: 'div',
                    ...opts.filterBar, // Barra de filtros
                },
                {
                    type: 'div',
                    ...opts.container, // Contenedor central
                    children: opts.container.children.map((child) => ({
                        type: 'div',
                        ...child, // Mapea cada hijo del contenedor
                    })),
                },
                {
                    type: 'div',
                    ...opts.footer, // Pie de página
                },
            ],
        };

        // Crea la plantilla con los datos generados
        this.createPlantilla({
            data: jsonComponents,
            parent: opts.parent,
            design: false,
        });
    }

    primaryLayout(options) {
        const name = options.id ? options.id : 'primaryLayout';

        let defaults = {
            id: name,
            parent: this._div_modulo,
            class: "d-flex mx-2 my-2 h-100",
            card: {
                name: "singleLayout",
                class: "col-12",
                filterBar: { class: 'w-full line', id: 'filterBar' + name },
                container: { class: 'w-full my-2 line', id: 'container' + name }
            }
        };


        // Mezclar opciones con valores predeterminados
        const opts = this.ObjectMerge(defaults, options);


        this.createPlantilla({
            data: {
                id: opts.id,
                class: opts.class,
                contenedor: [
                    {
                        type: "div",
                        id: opts.card.name,
                        class: opts.card.class,
                        children: [
                            { type: "div", class: opts.card.filterBar.class, id: opts.card.filterBar.id },
                            { type: "div", class: opts.card.container.class, id: opts.card.container.id }
                        ]
                    }
                ]
            }, parent: opts.parent, design: false
        });

    }

    verticalLinearLayout(options) {

        let defaults = {
            id: '',
            parent: this._div_modulo,
            className: "flex m-2 ",


            card: {
                id: "singleLayout",
                className: "w-full",
                filterBar: { className: 'w-full  line', id: 'filterBar' },
                container: { className: 'w-full my-2 line', id: 'container' },
                footer: { className: 'w-full my-2 line', id: 'footer' },
            }


        };


        const opts = this.ObjectMerge(defaults, options);
        let jsonComponents = {
            id: opts.id,
            class: opts.className,
            contenedor: [
                {
                    type: "div",
                    id: opts.card.id,
                    class: opts.card.className,
                    children: [
                        { class: opts.card.filterBar.className, id: opts.card.filterBar.id },
                        { class: opts.card.container.className, id: opts.card.container.id },
                        { class: opts.card.footer.className, id: opts.card.footer.id },
                    ],
                },
            ],
        };
        this.createPlantilla({ data: jsonComponents, parent: opts.parent, design: false });
    }

    secondaryLayout(components) {
        let name = components.id ? components.id : 'secondaryLayout';


        let nameComponent = {
            name: name,
            parent: this._div_modulo,
            className: 'flex p-2 ',
            cardtable: {
                className: 'col-7 line',
                id: 'containerTable' + name,
                filterBar: { id: 'filterTable', className: 'col-12 mb-2 line' },
                container: { id: 'listTable', className: 'col-12 line' },
            },
            cardform: {
                className: 'col-5 line',
                id: 'containerForm' + name,

            },
        };

        let ui = this.ObjectMerge(nameComponent, components);

        let jsonComponents = {
            id: ui.name,
            class: ui.className,

            contenedor: [

                {
                    type: 'div',
                    id: ui.cardform.id,
                    class: ui.cardform.className,

                },

                {
                    type: "div",
                    id: ui.cardtable.id,
                    class: ui.cardtable.className,
                    children: [
                        { class: ui.cardtable.filterBar.className, id: ui.cardtable.filterBar.id },
                        { class: ui.cardtable.container.className, id: ui.cardtable.container.id },
                    ]
                },


            ],
        };

        this.createPlantilla({
            data: jsonComponents,
            parent: ui.parent,
            design: false
        });
    }

    tabsLayout(components) {
        let jsonTabs = [
            { tab: "tab-1", id: "tab-1", active: true },
            { tab: "tab-2", id: "tab-2" },
        ];
        let defaults = {
            parent: 'tabsLayout',
            id: 'tabs',
            json: jsonTabs
        };

        let opts = Object.assign(defaults, components);
        $(`#${opts.parent}`).simple_json_tab({ data: opts.json });
    }
}
