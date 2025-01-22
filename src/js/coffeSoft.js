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

// add component
class Components extends Complements {

    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    swalQuestion(options = {}) {

        /*--  plantilla --*/
        let objSwal = {
            title: "",
            text: " ",
            icon: "warning",

            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            ...options.opts
        };


        var defaults = {

            data: { opc: "ls" },
            extends: false,
            fn: '',

            ...options,

            methods: ''

        };

        let opts = Object.assign(defaults, options);


        let extends_swal = Swal.fire(objSwal);



        if (options.extends) {

            return extends_swal;

        } else {

            extends_swal.then((result) => {

                if (result.isConfirmed) {


                    fn_ajax(opts.data, this._link, "").then((data) => {

                        if (opts.fn) {
                            window[opts.fn]();

                        } else if (opts.methods) {
                            // Obtener las llaves de los métodos
                            let methodKeys = Object.keys(opts.methods);
                            methodKeys.forEach((key) => {
                                const method = opts.methods[key];
                                method(data);
                            });

                        }


                    });
                }
            });



        }




    }

    createTable(options) {

        var defaults = {

            extends: false,
            parent: this.div_modulo,
            idFilterBar: '',

            parent: 'lsTable',

            conf: {
                datatable: true,
                fn_datatable: 'simple_data_table',
                beforeSend: true,
                pag: 15,
            },

            methods: {
                send: (data) => { }
            }


        };

        // configurations.
        const dataConfig = Object.assign(defaults.conf, options.conf);


        let opts = Object.assign(defaults, options);
        const idFilter = options.idFilterBar ? options.idFilterBar : '';



        if (idFilter) { // se activo la validacion por filtro 

            const sendData = { tipo: 'text', opc: 'ls', ...options.data };
            var extendsAjax = null; // extender la funcion ajax 


            $(`#${idFilter}`).validar_contenedor(sendData, (datos) => {

                // console.log('opts', dataConfig);

                let beforeSend = (dataConfig.beforeSend) ? '#' + options.parent : '';

                extendsAjax = fn_ajax(datos, this._link, beforeSend);


                if (!options.extends) { // si la variable extends no esta definida se ejectuta de forma normal


                    extendsAjax.then((data) => {

                        let attr_table_filter = {
                            data: data,
                            f_size: '14',
                            id: 'tbSearch'
                        };

                        attr_table_filter = Object.assign(attr_table_filter, opts.attr);

                        opts.methods.send(data);

                        if (opts.success)
                            opts.success(data);



                        $('#' + options.parent).rpt_json_table2(attr_table_filter);


                        if (dataConfig.datatable) {
                            window[dataConfig.fn_datatable]('#' + attr_table_filter.id, dataConfig.pag);
                        }

                    });


                }


            });

            if (opts.extends) {
                return extendsAjax;
            }







        } else {

            let sendData = {
                opc: 'ls',
                ...opts.data
            };



            extendsAjax = fn_ajax(sendData, this._link, '#' + opts.parent);


            if (!opts.extends) { // si la variable extends no esta definida se ejectuta de forma normal


                extendsAjax.then((data) => {

                    opts.methods.send(data);

                    this.processData(data, opts, dataConfig);


                });


            }



        }





    }

    createForm(options) {
        // Conf:
        let defaults = {

            parent: 'formsContent',
            id: 'idForm',
            plugin: 'content_json_form',
            plugin_validation: 'validation_form',
            extends: false,
            type: 'div',
            class: 'row',
            methods: {
                send: (data = '') => { }
            },
        };

        let formulario = [
            {
                opc: "input",
                lbl: "Producto",
                class: 'col-12'
            },

            {
                opc: "btn-submit",
                id: "btnEnviar",
                text: 'Guardar',
                class: 'col-12'
            },


        ];



        // Reemplazar formulario:
        const jsonForm = options.json || formulario;
        // Fusionar opciones con valores por defecto
        const opts = Object.assign(defaults, options);
        opts.methods = Object.assign({}, defaults.methods, options.methods);  // Asegurar que los métodos personalizados se fusionen correctamente

        $('#' + opts.parent)[opts.plugin]({ data: jsonForm, class: opts.class, type: 'default', id: opts.id, Element: opts.type });

        let dataForm = {
            tipo: 'text',
            opc: 'set',
            ...options.data
        };

        var extends_ajax;



        $("#" + opts.parent).validation_form(dataForm, (datos) => {

            if (options.beforeSend)
                options.beforeSend();



            extends_ajax = fn_ajax(datos, this._link, '');

            if (!opts.extends) {

                extends_ajax.then((data) => {

                    // $("#" + opts.parent)[0].reset();
                    if (opts.success)
                        opts.success(data);

                    opts.methods.send(data);

                });

            }


        });
        // return extends_ajax;
        // if(opts.extends){
        //     return extends_ajax;
        // }



    }

    form(options) {
        var defaults = {
            json: [],

            class: "row",
            parent: "",
            Element: "div",

            id: "containerForm",
            prefijo: "",
            icon: "icon-dollar",

            color: "primary",
            color_btn: "outline-primary",
            color_default: "primary",
            text_btn: "Aceptar",
            fn: "EnviarDatos()",
            id_btn: "btnAceptar",
            required: true,
        };

        let opts = Object.assign(defaults, options);

        // Creamos el contenedor
        var div = $("<div>", { class: opts.class, id: opts.id });

        opts.json.map((item, index) => {

            const propierties = { ...item }; // Crear una copia del objeto para evitar modificar el original
            delete propierties.class;
            delete propierties.classElement;
            delete propierties.default;
            delete propierties.opc;

            var children = $("<div>", {
                class: item.class ? "my-2 " + item.class : "col-12 ",
            }).append(
                $("<label>", {
                    class: "fw-semibold ",
                    html: item.lbl,
                })
            );

            // config. attr
            var attr = {
                class: " form-control input-sm " + item.classElement,
                id: item.id,
                name: item.id ? item.id : item.name,
                ...propierties,
            };

            const htmlElements = item.opc ? item.opc : item.element;
            switch (htmlElements) {
                case "input":
                    // Agregar clase de alineación según el tipo de `item`
                    if (item.tipo === "cifra" || item.tipo === "numero") {
                        attr.class += " text-end";
                    }

                    var element = $("<input>", attr);
                    break;

                case "input-calendar":
                    // Crear contenedor del grupo de input
                    var element = $("<div>", {
                        class: "input-group date calendariopicker",
                    });

                    element.append($("<input>", attr));
                    element.append(
                        $("<span>", { class: "input-group-text" }).append(
                            $("<i>", { class: "icon-calendar-2" })
                        )
                    );
                    break;

                case "select":
                    attr.class = "form-select input-sm " + item.classElement;
                    var element = $("<select>", attr);

                    if (item.default) {
                        element.append($("<option>", { value: "0", text: item.default }));
                    }

                    $.each(item.data, function (_, option) {
                        const isSelected = option.id === item.value;

                        element.append(
                            $("<option>", {
                                value: option.id,
                                text: option.valor,
                                selected: isSelected,
                            })
                        );
                    });

                    break;

                case "textarea":
                    // Crear el elemento textarea
                    attr.class = "form-control resize" + item.classElement;
                    var element = $("<textarea>", attr);
                    break;

                case 'dropdown':

                    // data default.
                    let defaults = [
                        { icon: "icon-pencil", text: "Editar", onClick: () => alert() },
                        { icon: "icon-trash", text: "Eliminar", onClick: () => alert() },
                    ];

                    let opts = Object.assign(defaults, item.data);

                    var $button = $("<button>", {
                        class: "btn btn-outline-primary btn-sm ",
                        id: item.id || "dropdownMenu",
                        type: "button",
                        "data-bs-toggle": "dropdown",
                        "aria-expanded": "false",
                        html: `<i class="${item.iconClass || 'icon-dot-3 text-info'}"></i>`,
                    });


                    var $ul = $("<ul>", { class: "dropdown-menu" });

                    opts.forEach((dropdownItem) => {
                        const $li = $("<li>");

                        // Construir el contenido dinámico con íconos y texto
                        let html = dropdownItem.icon && dropdownItem.icon !== ""
                            ? `<i class="text-info ${dropdownItem.icon}"></i>`
                            : "<i class='icon-minus'></i>";
                        html += dropdownItem.text && dropdownItem.text !== ""
                            ? ` ${dropdownItem.text}`
                            : "";

                        const $a = $("<a>", {
                            class: "dropdown-item",
                            id: dropdownItem.id,
                            href: dropdownItem.href || "#",
                            html: html, // Usar el HTML construido con íconos y texto
                        });

                        if (dropdownItem.onClick) {
                            $a.on("click", dropdownItem.onClick);
                        }

                        $li.append($a);
                        $ul.append($li);
                    });
                    var element = $("<div>", { class: "dropdown" }).append($button, $ul);
                    break;


            }

            children.append(element);

            div.append(children);
        });

        $("#" + opts.parent).append(div);
    }


    ModalForm(options){

        // Configuración para formularios.
        const idFormulario = options.id ? options.id : 'modalForm';
        const components = options.components
            ? options.components
            : $("<form>", { novalidate: true, id: idFormulario, class: "" }); // Componente form.


        let defaults = {
            id: idFormulario,
            autofill: false,
            bootbox: {
                title      : 'Modal example',
                closeButton: true,
                message    : components,
                id         : 'modal'
            },
            json: [
                {
                    opc: 'input-group',
                    class: 'col-12',
                    label: 'Nombre'
                },
                {
                    opc: 'btn-submit',
                    text: 'Guardar',
                    class: 'col-12'
                }
            ],
            plugin: 'content_json_form',
            autovalidation: true,
            data: { opc: 'setForm' }
        };

        const opts = this.ObjectMerge(defaults, options);
        let modal = bootbox.dialog(opts.bootbox); // Crear componente modal.

        // Proceso de construccion de un formulario
        $('#' + opts.id)[opts.plugin]({ data: opts.json, type: '' });


        let formData = new FormData($("#" + opts.id)[0]);



        // Proceso de autovalidacion
        if (opts.autovalidation) {
           

            let options_validation = {
                tipo: "text",
                opc: "save-frm",
            };

            let formData = new FormData($("#" + opts.id)[0]);

            console.log(formData);

            options_validation = Object.assign(options_validation, opts.data);


            $("#" + opts.id).validation_form(options_validation, (data) => {

                console.log("#" + opts.id)
                let formData = new FormData($("#" + opts.id)[0]);

                console.log(formData);


            });



        } 


        







    }


    createModalForm(options) {

        const idFormulario = options.id ? options.id : 'frmModal';

        const components = options.components

            ? options.components
            : $("<form>", { novalidate: true, id: idFormulario, class: "" });



        let defaults = {
            id: idFormulario,
            autofill:false,
            bootbox: {
                title: 'Modal example',
                closeButton: true,
                message: components,
            },
            json: [ {opc: 'label', text: 'Agrega tu formulario',class:'col-12' } ],
            autovalidation: true,
            data: { opc: 'sendForm' }
        };

        const conf = this.ObjectMerge(defaults, options);


        // Operations.
        let SuccessForm = () => {

            if (conf.autovalidation) {
                let options_validation = {
                    tipo: "text",
                    opc: "save-frm",
                };
                
                $("#" + conf.id).validar_contenedor({tipo:'text'}, (ok) => {
                    let formData = new FormData($('#' + conf.id)[0]);
                    const datos = {};
                    formData.forEach((value, key) => (datos[key] = value));
                    // Agregar datos dinámicos
                    const dynamicData = {};
                    if (conf.dynamicValues)
                        Object.keys(conf.dynamicValues).forEach((key) => {
                            dynamicData[key] = $(conf.dynamicValues[key]).val();
                        });
                    const data = Object.assign(datos, conf.data, dynamicData);
                    useFetch({
                        url: this._link,
                        data: data,
                        success: (request) => {
                            if (conf.success) conf.success(request);
                            modal.modal('hide');
                        }
                    })
                });
            }

        }
        
        let CancelForm = () => { modal.modal('hide'); }
          
        conf.json.push(
            { opc: "button", id: 'btnExit', inert:true, className: "w-full", onClick: () => CancelForm(), text: "Cancelar", color_btn: "outline-danger", class: "col-6" },
            { opc: "button", id:'btnSuccess', className: "w-full", onClick: () => SuccessForm(), text: "Aceptar", class: "col-6" },
        );


        // Components.
        let modal = bootbox.dialog(conf.bootbox);
        $('#' + conf.id).content_json_form({ data: conf.json, type: '' });


      
        
        /* propiedades de autofill*/
   
        if (conf.autofill) {
            // Init process auto inputs
            for (const frm in conf.autofill) {
                // Buscar elementos en el DOM cuyo atributo name coincida con la clave
                const $element = $('#' + conf.id).find(`[name="${frm}"]`);

                if ($element.length > 0) {
                    // Establecer valor dependiendo del tipo de elemento
                    if ($element.is('select')) {
                        // Seleccionar la opción correcta en el select
                        $element.val(conf.autofill[frm]).trigger('change');
                    } else {
                        // Para otros elementos como input o textarea
                        $element.val(conf.autofill[frm]);
                    }

                    console.log('Elemento encontrado y valor asignado:', $element);
                } else {
                    console.log('No se encontró el elemento:', frm);
                }
            }
        }




        
















        // if (options.beforeSend)
        //     options.beforeSend();


        // if (conf.autovalidation) {

        //     let options_validation = {
        //         // tipo: "text",
        //         opc: "save-frm",
        //     };

        //     options_validation = Object.assign(options_validation, conf.data);


        //     $("#" + conf.id).validation_form(options_validation, (formData) => {

        //         const datos = {};
        //         formData.forEach((value, key) => datos[key] = value);

        //     console.log(2,conf.data);
        //         fn_ajax(datos, this._link, '').then((data) => {



        //             if (conf.success)
        //                 conf.success(data);


        //             modal.modal('hide');

        //         });

        //         // fetch(this._link, {
        //         //     method: 'POST', // Método HTTP
        //         //     body: datos, // FormData como cuerpo de la solicitud

        //         // }).then(response => { }).then(data => {

                     
        //         // })



        //     });


        // } else {
        //     return modal;
        // }


        // return modal;




    }

    createModal(options) {

        let components = $('<div>');


        let defaults = {
            id: '',
            bootbox: {
                title: 'Modal example',
                closeButton: true,
                message: ' ',
            },

            extends: false,

            data: { opc: 'lsModal' }
        };

        const opts = this.ObjectMerge(defaults, options);



        fn_ajax(opts.data, this._link, '').then((data) => {
            let modal = bootbox.dialog(opts.bootbox);


            if (opts.success)
                options.success(data);

            // modal.modal('hide');


        });

    }

    createfilterBar(options) {

        let defaults = {
            id: 'idFilterBar',
            parent: 'filterBar',
            json: [
                {
                    opc: "input-calendar",
                    id: "iptDate",
                    tipo: "text",
                    class: "col-6 col-sm-3",
                    lbl: "Fecha de movimiento",
                },
                {
                    opc: "btn",
                    fn: "Buscar()",
                    color: 'primary',
                    text: "Buscar",
                    class: "col-sm-2",
                },
            ]

        };

        //  Combinar objetos 
        let opts = Object.assign(defaults, options);
        $(`#${opts.parent}`).content_json_form({ data: opts.data, type: '', id: opts.id });



    }

    createTab(options) {
        let txt = "";

        var defaults = {
            data: [],
            id: "myTab",
            parent: "tabs",
        };

        // Carga opciones por defecto
        var opts = Object.assign({}, defaults, options);

        // Creamos el contenedor
        var div = $("<div>", {
            class: " ",
        });

        var ul = $("<ul>", {
            class: "nav nav-tabs",
            id: opts.id,
        });

        var div_content = $("<div>", {
            class: "tab-content ",
        });

        for (const x of opts.data) {
            let active = "";
            let tab_active = "";
            if (x.active) {
                active = "active";
                tab_active = "show active";
            }

            var li = $("<li>", {
                class: "nav-item",
            });

            // if(x.fn) 



            // li.html(`<a class="nav-link ${active}" 
            //     id="${x.id}-tab"  data-bs-toggle="tab" href="#${x.id}"  onclick="${x.fn}"> ${x.tab}</a>  `);
            li.append(
                $('<a>', {
                    class: "nav-link " + active,
                    id: x.id + "-tab",
                    "data-bs-toggle": "tab",
                    href: "#" + x.id,
                    onclick: x.fn,
                    text: x.tab
                })
            );
            var div_tab = $("<div>", {
                class: "tab-pane fade  mt-2 " + tab_active,
                id: x.id,
            });

            if (x.contenedor) {
                // let div_contenedor = $("<div>", {
                //     class: "row",
                // });

                for (const y of x.contenedor) {
                    var div_cont = $("<div>", {
                        class: y.class,
                        id: y.id,
                    });

                    div_tab.append(div_cont);
                }

                // div_tab.append(div_contenedor);
            }

            ul.append(li);
            div_content.append(div_tab);
        }

        div.append(ul);
        div.append(div_content);
        $(`#${opts.parent}`).html(div);
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

    createNavBar(options){
 
        let defaults = {
            logoSrc: 'https://erp-varoch.com/ERP2/src/img/logos/logo_icon_wh.png',
            logoAlt: 'Grupo Varoch',
            onLogoClick: 'location.reload()',
            onMenuClick: '#',
            themeClass: 'bg-dia',
            menuItems: [
                { icon: 'icon-sun-inv-1', visible: false },
                { icon: 'icon-bell', visible: false },
                {
                    icon: 'icon-mail',
                    visible: false,
                    submenu: '<div id="mensage"><li>Hola</li></div>'
                },
                {
                    id: 'li_user',
                    visible: true,
                    submenu: '<li onClick="redireccion(\'perfil/perfil.php\');"></li>'
                }
            ]
        };

        let opts = $.extend({}, defaults, options);





        // Create header element
        let $header = $('<header>', { class: opts.themeClass });


        // Create section for logo and menu button
        let $section = $('<section>')
            .append(
                $('<span>', {
                    type: 'button',
                    id: 'btnSidebar',
                    html: $('<i>', { class: 'icon-menu' }),
                    click: function () {
                        if (opts.onMenuClick && typeof opts.onMenuClick === 'function') {
                            opts.onMenuClick();
                        }
                    }
                })
            )
            .append(
                $('<img>', {
                    class: 'd-block d-sm-none',
                    src: opts.logoSrc,
                    alt: opts.logoAlt,
                    click: function () {
                        if (opts.onLogoClick) {
                            eval(opts.onLogoClick);
                        }
                    }
                })
            );

        $header.append($section);

        // Create nav element
        let $nav = $('<nav>');
        let $ul = $('<ul>', { class: 'theme', id: 'navbar' });

        // Create menu items
        opts.menuItems.forEach((item, index) => {
            if (!item.visible) return; // Skip hidden items

            let $li = $('<li>', { id: item.id || null })
                .append($('<i>', { class: item.icon }));

            if (item.submenu) {
                let $submenu = $('<ul>').append(item.submenu);
                $li.append($submenu);
            }

            $ul.append($li);
        });

        $nav.append($ul);
        $header.append($nav);

        // Append to body or specific parent
        $(opts.parent || 'body').prepend($header);

        

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
                id: 'containerTable'+name,
                filterBar: { id: 'filterTable', className: 'col-12 mb-2 line' },
                container: { id: 'listTable', className: 'col-12 line' },
            },
            cardform: {
                className: 'col-5 line',
                id: 'containerForm'+name,
               
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


async function useFetch(options = {}) {

    // Valores predeterminados
    let defaults = {

        method: 'POST',
        data: { opc: 'ls' },
        url: '',
        success: null

    };

    // Mezclar los valores predeterminados con las opciones proporcionadas
    let opts = Object.assign({}, defaults, options);

    // Validar que la URL esté definida
    if (!opts.url) {
        console.error('URL es obligatoria.');
        return null;
    }

    try {
        // Realizar la petición fetch
        let response = await fetch(opts.url, {
            method: opts.method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(opts.data),
        });

        // Procesar la respuesta como JSON
        let data = await response.json();

        // Si se proporciona el método success, lo ejecutamos con los datos obtenidos
        if (typeof opts.success === 'function') {
            opts.success(data);
        }

        // Retornar los datos por si se quieren usar fuera de la función success
        return data;
    } catch (error) {
        console.error('Error en la petición:', error);
        return null;
    }
}

