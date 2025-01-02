$.fn.simple_json_tab = function (options) {
    txt = "";
  
    var defaults = {
      data: [],
      id: "myTab",
    };
  
    // Carga opciones por defecto
    var opts = $.fn.extend(defaults, options);
  
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
      active = "";
      tab_active = "";
      if (x.active) {
        active     = "active";
        tab_active = "show active";
      }
  
      var li = $("<li>", {
        class: "nav-item",
      });
  
   
    const navLink = $('<a>', {
        class           : "nav-link " + active,
        id              : x.id + "-tab",
        "data-bs-toggle": "tab",
        href            : "#" + x.id,
        text            : x.tab
    });
    
    // Solo asignar el evento si x.onClick está definido
    if (typeof x.onClick === 'function') {
        navLink.on('click', x.onClick);
    }
    
    li.append(navLink);

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
  
    $(this).html(div);
  };

$.fn.content_json_form = function (options) {

    var defaults = {
        data: [],

        class  : "row ",
        type   : "btn",
        
        icon   : "icon-dollar",
        id     : 'jsonForm',
        prefijo: '',

        Element :'div',
        
        color        : "primary",
        color_btn    : "outline-primary",
        color_default: 'primary',
        text_btn     : "Aceptar",
        fn           : "EnviarDatos()",
        id_btn       : "btnAceptar",
        required     : true,
    };

    var opts = $.fn.extend(defaults, options);

    // Creamos el contenedor
    var div = $("<div>", {
        class     : opts.class,
        id        : opts.id
    });


    for (const x of opts.data) {
        let div_col = "col-sm-4 mt-1";

        if (x.class) 
            div_col = x.class;
        

        var div_hijo = $("<div>", {
            class: div_col,
        });

        // Etiqueta del componente
            div_hijo.append(
                $('<label>', {
                    class: "fw-bold ",
                    html: x.lbl,
                })
            );
       
        /*-- Crear elementos para los formularios --*/

        var required = x.required === false ? false : true;
        let aux_name = x.name ? x.name : x.id;
        let className = '';


        var attr_default = {
            id   : opts.prefijo + x.id,
            tipo : x.tipo,
            name : aux_name,
            value: x.value,
            
            required   :required,
            placeholder: x.placeholder,
            disabled   : x.disabled,
        };
        
        switch (x.opc) {

            case 'code':
                div_hijo.empty();

                let code = JSON.stringify(x.json, null, 2);

                div_hijo.addClass('code-viewer ');
                let pre = $('<pre>').text(code);

                div_hijo.append(pre);
            break;

            case 'radio':

                // div_hijo.empty();

                let idx = x.id;
                className = x.className ? x.className :'form-check-input ';

                let rd = $('<input>', {
                    type: 'radio',
                    class: className,
                    name: x.name ? x.name : id,
                    value: x.value,
                    onChange: x.onchange ,

                    checked: x.checked || false,
                    id: idx,
                });

                var lbl = $('<label>', {
                    class: 'px-2 form-check-label fw-bold',
                    text: x.text ? x.text : x.valor,
                    for: idx,
                });

             
                div_hijo.append(rd,lbl);

            break;    

            case 'checkbox':
                div_hijo.empty();
                let id = x.id;

                div_hijo.attr('for',id);
                

                    className  = x.className ? x.className :'form-check-input ';
                let classLabel = x.classLabel ? x.classLabel : 'form-check-label fw-semibold';
            

                let radio = $('<input>', {
                    type    : 'checkbox',
                    class   : className,
                    onChange: x.onchange+'()',
                    name    : x.name ? x.name: id,
                    value   : true,
                    id      : id
                });

                let label = $('<label>', { 
                    class: classLabel,
                    text: x.text ? x.text : x.valor,
                    for: id,
                });


                div_hijo.append(radio, label);




                // div_hijo.append(check_group);
            break;


            case "list-group": 
                let divGroup = $('<div>',{ class: 'list-group ' });

                x.data.forEach((item) => {

                    let a     = $('<a>', { class: 'list-item pointer' });
                    let icons = $('<span>', { class: 'text-muted icon ' + item.ico });
                    icons.prepend(item.text);

                    
                    let spans = $('<span>',{class:'badge badge-bordered badge-primary'});
                    spans.prepend(item.notifications);
                    
                    a.append(icons,spans);

                    divGroup.append(a);
                });


                div_hijo.append(divGroup);
            
            
            break;

            case "input":
                var align = "";
                if (x.tipo == "cifra" || x.tipo == "numero") {
                    align = "text-end";
                }

                // asignar atributos al input:
                let attr_ipt = {
                    class: `form-control input-sm ${align}   `,
                    type: x.type,
                    
                    onkeyup: x.onkeyup ? x.onkeyup : '',
                };

                attr_ipt = Object.assign(attr_default, attr_ipt);

                div_hijo.append($('<input>', attr_ipt));

            break;

            case "input-group":
                var align = "";
                var inputGroup = $("<div>", {
                    class: "input-group",
                });

                // El valor es de tipo numero o cifra

                let val_type = "text";
                if(x.type)
                val_type = x.type;    

                if (x.tipo == "cifra" || x.tipo == "numero") {
                    align = "text-end";
                    // Se modifico por detalle de text que usaba rosa
                    // val_type = "text";

                    var iconSpan = $("<span>", {
                        class: "input-group-text",
                    }).append(
                        $("<i>", {
                            class: x.icon,
                        })
                    );

                    inputGroup.append(iconSpan);
                }
                //   console.log(">> " + x.attr);

                let atributos_ipt = {
                    class   : `form-control input-sm ${align}`,
                    cat     : x.cat,
                    readonly: x.readonly,
                    type    : val_type,
                    onKeyUp : x.onkeyup,

                };

                atributos_ipt = Object.assign(attr_default, atributos_ipt);

                inputGroup.append($('<input >', atributos_ipt));

      
                if (x.tipo != "cifra") {
                    var iconSpan = $("<span>", {
                        class: "input-group-text",
                    }).append(
                        $("<i>", {
                            class: x.icon,
                        })
                    );

                    inputGroup.append(iconSpan);
                }

                div_hijo.append(inputGroup);

                break;

            case "textarea":
                div_hijo.append(
                    $("<textarea>", {
                        class: `form-control resize`,
                        id: x.id,
                        tipo: x.tipo,
                        name: x.id,
                        text: x.value,
                        placeholder: x.placeholder,
                        cols: x.cols,
                        rows: x.rows,
                        required: x.required || false
                    })
                );

            break;


            case "input-file-btn":
                div_hijo.append(
                    $("<input>", {
                        class: " input-sm",
                        id: x.id,
                        tipo: x.tipo,
                        name: x.id,
                        //  required: required,
                        type: "file",
                    })
                );
                break;

            case "input-file":
                if (x.color_btn) {
                    color = x.color_btn;
                } else {
                    color = opts.color_default;
                }

                let ipt_file = $("<input>", {
                    class: `hide`,
                    type: "file",
                    accept:'.xlsx, .xls',
                    id: x.id,
                    onchange: x.fn,
                });

                // let icons = (x.icon) ? `<i class="${x.icon}"></i>` : '';
                // console.warn(icons);

                let lbl_btn = $("<label>", {
                    class: `btn btn-outline-${color} col-12 mt-4`,
                    html: `  ${x.text} `,
                    for: x.id,

                    // onclick:x.fn,
                });

                div_hijo.append(ipt_file);
                div_hijo.append(lbl_btn);
                break;

            case "btn":
                if (x.color_btn) {
                    color = x.color_btn;
                } else {
                    color = opts.color_default;
                }

                let icon = (x.icon) ? `<i class="${x.icon}"></i>`   : '';
                var text = x.text ? x.text : '';



                var _btn = $("<button>", {
                    class: `btn btn-${color} w-100 mt-4`,
                    html: `${icon}  ${text} ` ,
                    type: "button",
                    id: x.id,
                    onclick: x.fn,
                });
                div_hijo.append(_btn);

            break;
            
            case "btn-submit":
                if (x.color_btn) {
                    color = x.color_btn;
                } else {
                    color = opts.color_default;
                }

                var _btn = $("<button>", {
                    class: `btn btn-${color} col-12 mt-4`,
                    text: x.text,
                    type: "submit",
                    id: x.id,
                    onclick: x.fn,
                });
                div_hijo.append(_btn);

                break;
            case 'button':

                if (x.color_btn) {
                    color = x.color_btn;
                } else {
                    color = opts.color_default;
                }

                var i = (x.icon) ? `<i class="${x.icon}"></i>` : '';
                var text = x.text ? x.text : '';

                className = `mt-4 btn btn-${color} `;

                let buttonEvents = {
                    onclick :x.fn
                };

                if(x.onClick)
                buttonEvents = { click: x.onClick }



 
                var button = $('<button>',{
                    class: className + (x.className ? x.className :''),
                    html: `${i} ${text} `,
                    id: x.id,
                    ...buttonEvents,
                    type: 'button'
                    
                });

                // var _btn = $("<button>", {
                //     class: ` w-100 `,
                //     type: "button",
                   
                // });

                div_hijo.append(button);


            break;
                

            case "select":
                var select = $(`<select>`, {
                    class: "form-select input-sm",
                    id: x.id,
                    name: x.id,
                    required: false,
                    onchange: x.onchange,
                    placeholder: x.placeholder,
                });

                if (x.selected) {
                    select.html(`<option value="0" > ${x.selected} </option>`);
                }

                $.each(x.data, function (index, item) {
                    option = item.id;
                    option_selected = x.value;
                    bandera = false;

                    if (option == option_selected) {
                        bandera = true;
                    }

                    select.append(
                        $("<option>", {
                            value: option,
                            text: item.valor,
                            selected: bandera,
                        })
                    );
                });

                div_hijo.append(select);

                break;

            case "input-calendar":
                var inputGroup = $("<div>", {
                    class: "input-group date calendariopicker",
                });
                // Crear objeto input calendar

                inputGroup.append(
                    $("<input>", {
                        class: `select_input form-control input-sm `,
                        id: x.id,
                        tipo: x.tipo,
                        name: x.id,
                        value: x.value,
                    })
                );

                inputGroup.append(

                    $("<span>", {
                        class: "input-group-text",
                    }).append(
                        $("<i>", {
                            class: "icon-calendar-2",
                        })
                    )
                );

                div_hijo.append(inputGroup);
            break;    

            case 'btn-select':

                const iptGroup = $('<div>',{class: 'input-group'});

                const btnGroup = $('<a>',{ 
                    class: 'btn btn-primary' ,
                    text: x.text,
                    onclick: x.fn 
                });

                const icons = $('<i>',{class: x.icon});
                btnGroup.append(icons);

                // select 

                var iptSelect = $('<select>', {
                    class   : "form-control input-sm",
                    id      : x.id,
                    name    : x.id,
                    required: required,
                    onchange: x.onchange
                });

                if (x.selected) {
                    iptSelect.html(`<option value="0" > ${x.selected} </option>`);
                }

                $.each(x.data, function (index, item) {
                    var option = item.id;
                    var option_selected = x.value;
                    var bandera = false;

                    if (option == option_selected) {
                        bandera = true;
                    }

                    iptSelect.append(
                        $("<option>", {
                            value: option,
                            text: item.valor,
                            selected: bandera,
                        })
                    );
                });




                iptGroup.append(iptSelect);
                iptGroup.append(btnGroup);


                div_hijo.append(iptGroup);

                

            break;    

            default:
               
                div_hijo.append($('<'+x.opc+'>',x));
            break;
    

        }
        /* vaciar el contenido */
        div.append(div_hijo);
    }


    // Crear botón para envio:

    if (opts.type == "btn") {
    
        var div_btn = $("<div>", {
        class: 'mt-3 col-12 d-flex justify-content-center',
        });

        var btn_submit = $("<button>", {
        class: "btn btn-"+opts.color+" bt-sm col-12 col-lg-4",
        text : "Aceptar",
        id   : "btnAceptar",
        type : "submit",
        });

        div_btn.append(btn_submit);
        div.append(div_btn);
    
    }


    

    $(this).append(div);

};