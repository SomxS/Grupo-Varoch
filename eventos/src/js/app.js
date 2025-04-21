// let ctrl = "ctrl/app.php";
const link = 'https://erp-varoch.com/DEV/costsys/ctrl/ctrl-costo-potencial-soft.php';

const api = 'https://huubie.com.mx/alpha/eventos/ctrl/ctrl-payment.php';

// init vars.
let app,sub;

let idEvent ;


$(async () => {

    await fn_ajax({ opc: "init" }, link).then((request) => {
        console.log(request)
    // vars.
    // instancias.
    app = new App(api, 'root');
    app.init();

    sub = new subEvent(api,'');
    sub.init();
  
    });
});

class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Survey";
    }

    init() {
        this.render();
    }

    render(options) {
        this.layout();
        this.filterBar();
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

    filterBar(options) {

        this.createfilterBar({
            parent: "filterBar"+this.PROJECT_NAME,
            data: [
                {
                    opc: "button",
                    className: "w-100",
                    class: "col-lg-3",
                    color_btn: "primary",
                    id: "btnNuevoEvento",
                    text: "Nuevo evento",
                    onClick: () => this.showTypeEvent()
                },
            ],
        });
      

    }

    showTypeEvent() {
        let modal = bootbox.dialog({
            closeButton: true,
            message: '<div id="containerTypeEvents"></div>',
            id: "modal",
            size: 'large'
        });

        this.createItemCard({
            parent: 'containerTypeEvents',
            title: 'Selecciona el tipo de evento: ',
            color:'bg-gray-700',
            json: [
                {
                    titulo: "Evento",
                    descripcion: "Dar de alta un nuevo evento",
                    imagen: "https://huubie.com.mx/alpha/src/img/eventos.svg",

                    onClick: () => {
                        calendario.redirectToEventos();
                        modal.modal('hide');
                    }
                },
                {
                    titulo: "Multiples Eventos",
                    descripcion: "Dar de alta más de un evento",
                    img: [
                        {
                            src: "https://huubie.com.mx/alpha/src/img/eventos.svg",
                            title: 'events'
                        },
                        {
                            src: "https://huubie.com.mx/alpha/src/img/eventos.svg",
                            title: 'events'
                        }
                    ],
                    onClick: () => {
                        sub.layout();
                        modal.modal('hide');
                    }

                }
            ]
        });

    }


}

class subEvent extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SubEvent";
    }

    render(){
        this.layout();
    }

    layout() {
        $("#root" ).simple_json_tab({
            class: "p-4 h-100 ", //  bg-[#1F2A37]
            id: "tabsSubEvent",
            data: [
                { tab: "Eventos", id: "tab-new-event", active: true },
                { tab: "Sub Eventos", id: "tab-new-subevent" },
            ],
        });

        // initiliazed.
        this.showEvent();
    }

    // Evento.
    showEvent() {

        $("#tab-new-event").html(`<form id="formEvent" novalidate></form></div>`);

        this.createForm({
            parent: 'formEvent',
            id    : 'frmEvento',
            data  : { opc: 'addEvent' },
            json  : [
                { 
                    opc: "label", 
                    id: 'lblCliente', 
                    text: "Datos del cliente", 
                    class: "col-12 fw-bold text-lg mb-2" 
                },
                { 
                    opc: "input", 
                    lbl: "Contacto", 
                    id: "name_client", 
                    class: "col-12 col-sm-4 col-lg-3 mb-3", 
                    tipo: "texto", 
                    placeholder: "Nombre del contacto" 
                },
                { 
                    opc: "input", 
                    lbl: "Teléfono", 
                    id: "phone", 
                    class: "col-12 col-sm-4 col-lg-3", 
                    tipo: "tel", 
                    placeholder: "999-999-9999" 
                },
                { 
                    opc: "input", 
                    lbl: "Correo electrónico", 
                    id: "email", 
                    class: "col-12 col-sm-4 col-lg-3", 
                    tipo: "email", 
                    placeholder: "cliente@gmail.com" 
                },
                { 
                    opc: "label", 
                    id: 'lblEvento', 
                    text: "Datos del evento", 
                    class: "col-12 fw-bold text-lg mt-2 mb-2" 
                },
                { 
                    opc: "input", 
                    lbl: "Evento", 
                    id: "name_event", 
                    class: "col-12 col-sm-4 col-lg-3", 
                    tipo: "texto", 
                    placeholder: "Nombre del evento" 
                },
                { 
                    opc: "input", 
                    lbl: "Locación", 
                    id: "location", 
                    class: "col-12 col-sm-4 col-lg-3 mb-3", 
                    tipo: "texto", 
                    placeholder: "Locación" 
                },
                { 
                    opc: "input", 
                    lbl: "Fecha de inicio", 
                    id: "date_start", 
                    class: "col-12 col-sm-4 col-lg-3", 
                    type: "date", 
                },
                { 
                    opc: 'input', 
                    lbl: 'Hora de inicio', 
                    id: 'time_start', 
                    tipo: 'hora', 
                    type: "time", 
                    class: 'col-3 mb-3', 
                    required: true 
                },
                { 
                    opc: "input", 
                    lbl: "Fecha de cierre", 
                    id: "date_end", 
                    class: "col-12 col-sm-4 col-lg-3 mb-3", 
                    type: "date", 
                },
                {
                    opc: 'select', 
                    lbl: 'Tipo de evento', 
                    id: 'type_event', 
                    class: 'col-12 col-sm-4 col-lg-3 mb-3',
                    data: [
                        { id: 'Abierto', valor: "Abierto" },
                        { id: 'Privado', valor: "Privado" }
                    ]
                },

                { 
                    opc        : 'input',
                    placeholder: '0.00',
                    lbl        : 'Anticipo',
                    id         : 'total_pay',
                    tipo       : 'cifra',
                    class      : 'col-12 col-sm-4 col-lg-3 mb-3',
                    required:false
                },

                { 
                    opc: "textarea", 
                    lbl: "Observaciones", 
                    id: "notes", 
                    class: "col-12 col-sm-12 col-md-12 col-lg-12", 
                    rows: 3 
                },
                
        
                { 
                    opc: "btn-submit", 
                    id: "btnGuardar", 
                    text: "Guardar", 
                    class: "col-5 col-sm-3 col-md-2 col-lg-2 offset-lg-8" 
                },
                {
                    opc: "button", 
                    id: "btnCancelar", 
                    text: "Cancelar",
                    class: "col-6 col-sm-3 col-md-2 col-lg-2",
                    color_btn: "danger",
                    className: 'w-full',
                    onClick: () => eventos.closeEvent()
                }
            ],

            success: (response) => {
                if (response.status == 200) {
                    console.log('max id', response.data.id);
                    idEvent = response.data.id;
                    alert({
                        icon: "success",
                        title: "Evento creado con éxito",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                    $("#formEvent button[type='submit']").removeAttr("disabled");
                    $("#formEvent input").attr("disabled", "disabled");
                    $("#formEvent select").attr("disabled", "disabled");
                    $("#formEvent textarea").attr("disabled", "disabled");
                    $("#tab-new-subevent-tab").tab("show");
                    $("#btnGuardar").addClass("d-none");
                    $("#btnCancelar").addClass("d-none");
                    $("#btnNewSubEvent").removeClass("d-none");
                } else {
                    alert({
                        icon: "error",
                        text: response.message,
                        btn1: true,
                        btn1Text: "Ok"
                    });
                    $("#formEvent button[type='submit']").removeAttr("disabled");
                }
            }
        });

        // initialized.
        $("#date_start").val(new Date().toISOString().split("T")[0]);
        $("#date_end").val(new Date().toISOString().split("T")[0]);
        $('#lblCliente').addClass('border-b p-1');
        $('#lblEvento').addClass('border-b p-1');
        
    }


   


}


