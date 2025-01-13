window.ctrlactividades = "ctrl/ctrl-actividades.php";

let jsonUDN = {};
let jsonSeason = {};
let jsonReplay = {};
let jsonPriority = {};
let jsonCategory = {};
let lsEvents = [];
let lsEventsAll = [];
let jsonResponsible = {};
let jsonResponsibleAll = {};
let calendar; // Variable para fullcalendar


const idUsuario = parseInt(getCookie("IDU"));
const idE = parseInt(getCookie("IDE"));
const idA = parseInt(getCookie("IDA"));
let idTutorial = 0;



jsonPriority = [
    // { id: 0, valor: "Selecciona una opción", icon: "" },
    { id: 3, valor: "🟢BAJA" },
    { id: 2, valor: "⚠️MEDIA" },
    { id: 1, valor: "🔥ALTA" },
];
jsonCategory = [
    { id: 1, valor: "EVENTO CORPORATIVO" },
    { id: 2, valor: "EVENTO PERSONAL/EVENTO DE MI ÁREA" },
];

$(function () {
    // Función inicial
    initComponent().then(() => {
        // Aquí se inicializa el calendario
        onchangeAssignAndUdn();

        // Agregar udn abreviado
        if (jsonUDN.length > 0) {
            $(".fc-header-toolbar .fc-toolbar-chunk:first").append(
                `<span class="text-danger fw-bold">
            ${jsonUDN.filter((e) => e.id == $("#cbUDN").val())[0].abreviado}
          </span>`
            );
        }

        idTutorial = getCookie("IDT");
        // Guía virtual de inicio
        if (idTutorial != 1) {
            firtsVirtualGuide();
        }

        // Guía virtual de ayuda
        let oncompleteHelp = function () {
            $('#btnSimulation').trigger('click');
        };

        $('#btnGuideHelp').on('click', () => virtualGuide(jsonHelpVirtualGuide(), oncompleteHelp));
    });

    // Boton agregar evento
    $("#btnPlus").on("click", () => addEventModal());

    // Boton simular evento
    $("#btnSimulation").on("click", () => addEventModalSimulation());

});

//? INICIALIZAR ------------------------------------------
function initComponent() {
    return new Promise((resolve) => {
        let datos = new FormData();
        datos.append("opc", "initComponent");
        send_ajax(datos, ctrlactividades).then((data) => {
            $("#cbUDN").option_select({ data: data.udn });
            jsonUDN = data.udn;
            jsonSeason = data.season;
            jsonReplay = data.replay;
            jsonResponsibleAll = data.responsible;
            lsEventsAll = data.events;
            resolve();
        });
    });
}
// Filtrar por creador, responsable, ambos y udn.
async function filterEventsAllForAssignAndUdn(group, udn) {
    const todos = group == 0;
    const esAsignado = group == 1;
    const esCreador = group == 2;
    const udnValida = udn !== "0" && udn !== 0;
    const filtroUdn = (e) =>
        !udnValida || parseInt(e.event.idudn) == parseInt(udn);

    // Si selecciona pendientes.
    if (esAsignado) {
        lsEvents = lsEventsAll.filter(
            (e) =>
                e.event.assign.some((assign) => parseInt(assign.iduser) == idUsuario) &&
                filtroUdn(e)
        );
        // Si selecciona creados.
    } else if (esCreador) {
        lsEvents = lsEventsAll.filter(
            (e) => e.event.idcreator == idUsuario && filtroUdn(e)
        );
        // Si selecciona todos.
    } else if (todos) {
        // Si udn es diferente de "TODAS LAS UDN".
        if (udnValida) {
            lsEvents = lsEventsAll.filter(
                (e) =>
                    (e.event.idcreator == idUsuario ||
                        e.event.assign.some((assign) => assign.iduser == idUsuario)) &&
                    filtroUdn(e)
            );
            // SI es direccion operativa.
            if (idA == 36) {
                lsEvents = lsEventsAll.filter(
                    (e) =>
                        e.event.idcategory == 1 &&
                        filtroUdn(e) // Solo eventos corporativos.
                );
            }
        } else {
            // Si udn es "TODAS LAS UDN".
            lsEvents = lsEventsAll.filter(
                (e) =>
                    e.event.idcreator == idUsuario ||
                    e.event.assign.some((assign) => assign.iduser == idUsuario)
            );
            // SI es direccion operativa.
            if (idA == 36) {
                lsEvents = lsEventsAll.filter(
                    (e) =>
                        e.event.idcategory == 1 // Solo eventos corporativos.
                );
            }
        }
    }

    // Mostrar calendario.
    fullCalendar();
}
// Filtrar de acuerdo a la asignación y la udn (evento onchange).
async function onchangeAssignAndUdn() {
    let group = $("#cbGroup").val();
    let udn = $("#cbUDN").val();

    await filterEventsAllForAssignAndUdn(group, udn);

    $("#cbGroup")
        .off("change")
        .on("change", function () {
            group = $(this).val();
            filterEventsAllForAssignAndUdn(group, udn);
        });

    $("#cbUDN")
        .off("change")
        .on("change", function () {
            udn = $(this).val();
            if (udn !== "0") {
                $(
                    ".fc-header-toolbar .fc-toolbar-chunk:first .text-danger.fw-bold"
                ).remove();
                $(".fc-header-toolbar .fc-toolbar-chunk:first").append(
                    `<span class="text-danger fw-bold">${jsonUDN.find((e) => e.id == udn).abreviado
                    }</span>`
                );
            }
            filterEventsAllForAssignAndUdn(group, udn);
        });
}
// JSON de guía virtual de inicio
function firtsVirtualGuide() {
    //Bloquear la opción de crear eventos reales
    $("#containerBtnPlus").addClass("hide");

    // JSON de guía virtual de inicio
    let calendar_guide = [
        {
            title: "¡BIENVENIDO A CALENDARIZACIÓN!",
            intro: "Al ser tu primera vez en la aplicación, ¿por qué no empezamos con un recorrido?👀👉",
        },
        {
            element: $("#btnGuideHelp")[0],
            title: "Guía de Ayuda",
            intro: "Aquí podrás encontrar una guía de ayuda para conocer las funcionalidades de la aplicación.",
        },
        {
            element: $("#cbGroup")[0],
            title: "Filtro de Agrupación de Eventos",
            intro: "Aquí tu eliges si quieres ver todos los eventos, solo los que has creado o los eventos que te han asignado.",
        },
        {
            element: $("#cbUDN")[0],
            title: "Filtro de Unidad de Negocio",
            intro: "Aquí puedes seleccionar la Unidad de Negocio a la que quieres acceder.",
        },
        {
            element: $(".fc-button-group")[0],
            title: "Retroceder y Avanzar",
            intro: "Aquí puedes retroceder o avanzar en el calendario, dependiendo de la vista seleccionada.",
        },
        {
            element: $(".fc-today-button")[0],
            title: "Hoy",
            intro: "Aquí puedes regresar ala fecha actual.",
        },
        {
            element: $(".fc-header-toolbar .fc-toolbar-chunk:first .text-danger.fw-bold")[0],
            title: "Unidad de Negocio",
            intro: "Aquí puedes visualizar la Unidad de Negocio seleccionada abreviada.",
        },
        {
            element: $(".fc-toolbar-title")[0],
            title: "Fecha Actual",
            intro: "Aquí puedes visualizar la fecha actual, dependiendo de la vista seleccionada, ya sea por mes, semana, día o año.",
        },
        {
            element: $(".fc-header-toolbar .fc-toolbar-chunk:last")[0],
            title: "Vista de Eventos",
            intro: "Aquí tu eliges cómo quieres visualizar los eventos, ya sea por mes, semana, día o año.",
        },
        {
            element: $("#btnSimulation")[0],
            title: "Simular evento",
            intro: "Aquí puedes simular la adición de un evento al calendario. Realiza tu primera simulación para desbloquear la opción de crear eventos reales. 🙋‍♀️✨",
        },
    ];

    introJs()
        .setOptions({
            exitOnOverlayClick: false,
            steps: calendar_guide,
            showStepNumbers: false,
            showProgress: true,
        }).oncomplete(() => {
            $('#btnSimulation').trigger('click');
        }).start();
}
// JSON de guía virtual de ayuda
function jsonHelpVirtualGuide() {
    calendar_guide = [
        {
            title: "¡BIENVENIDO A CALENDARIZACIÓN!",
            intro: "¿Por qué no empezamos con un recorrido por la aplicación?👀👉",
        },
        {
            element: $("#btnGuideHelp")[0],
            title: "Guía de Ayuda",
            intro: "Aquí podrás encontrar una guía de ayuda para conocer las funcionalidades de la aplicación.",
        },
        {
            element: $("#cbGroup")[0],
            title: "Filtro de Agrupación de Eventos",
            intro: "Aquí tu eliges si quieres ver todos los eventos, solo los que has creado o los eventos que te han asignado.",
        },
        {
            element: $("#cbUDN")[0],
            title: "Filtro de Unidad de Negocio",
            intro: "Aquí puedes seleccionar la Unidad de Negocio a la que quieres acceder.",
        },
        {
            element: $(".fc-button-group")[0],
            title: "Retroceder y Avanzar",
            intro: "Aquí puedes retroceder o avanzar en el calendario, dependiendo de la vista seleccionada.",
        },
        {
            element: $(".fc-today-button")[0],
            title: "Hoy",
            intro: "Aquí puedes regresar ala fecha actual.",
        },
        {
            element: $(".fc-header-toolbar .fc-toolbar-chunk:first .text-danger.fw-bold")[0],
            title: "Unidad de Negocio",
            intro: "Aquí puedes visualizar la Unidad de Negocio seleccionada abreviada.",
        },
        {
            element: $(".fc-toolbar-title")[0],
            title: "Fecha Actual",
            intro: "Aquí puedes visualizar la fecha actual, dependiendo de la vista seleccionada, ya sea por mes, semana, día o año.",
        },
        {
            element: $(".fc-header-toolbar .fc-toolbar-chunk:last")[0],
            title: "Vista de Eventos",
            intro: "Aquí tu eliges cómo quieres visualizar los eventos, ya sea por mes, semana, día o año.",
        },
        {
            element: $("#btnPlus")[0],
            title: "Agregar evento",
            intro: "Aquí puedes agregar un nuevo evento al calendario. ¡Inténtalo!🎉",
        },
        {
            element: $("#btnSimulation")[0],
            title: "Simular evento",
            intro: "Aquí puedes simular la adición de un evento al calendario. ¡Échale un vistazo!. 🙋‍♀️✨",
        },
    ];

    return calendar_guide;
}
// Inicializar guía virtual
function virtualGuide(steps, oncomplete) {
    const intro = introJs()
        .setOptions({
            exitOnOverlayClick: false,
            steps,
        });

    // Verificar si `oncomplete` está definido
    if (typeof oncomplete === 'function') {
        intro.oncomplete(oncomplete);
    }

    intro.start();
}


//? FORMULARIO DE EVENTOS --------------------------------
function elementsEventModal() {
    col6 = { div: { class: "col-12 col-lg-6 mb-3" } };
    col4 = { div: { class: "col-12 col-lg-4 mb-3" } };
    col12 = { div: { class: "col-12 mb-3" } };
    let formulario = [];

    formulario = [
        {
            div: { class: "col-10 mb-3" },
            lbl: "Evento",
            id: "evento",
            placeholder: "Agregar título",
            required: true,
        },
        {
            div: { class: "col-2 mb-3" },
            elemento: "color_menu",
            colores: { col: 2 },
        },
        {
            ...col4,
            lbl: "Fecha inicial",
            id: "fechainicial",
            elemento: "input",
            type: "date",
            icon: '<i class="icon-calendar"></i>',
            pos: "right",
            required: true,
        },
        {
            ...col4,
            lbl: "Fecha final",
            id: "fechafinal",
            elemento: "input",
            type: "date",
            icon: '<i class="icon-calendar"></i>',
            pos: "right",
            required: true,
        },
        {
            ...col4,
            lbl: "Repetir evento",
            id: "modalcbRepeat",
            elemento: "select-group",
            icon: '<i class="icon-arrows-cw"></i>',
            pos: "right",
            required: true,
            option: {
                data: [
                    {
                        "id": "1",
                        "valor": "No repetir",
                        "frecuency": "no-repeat"
                    },
                    {
                        "id": "6",
                        "valor": "Personalizado",
                        "frecuency": "custom"
                    },
                ], // El ing Leo me dijo que borrara el resto de las opciones, sin embargo, sigo requiriendo jsonReplay.
                placeholder: "Selecciona una opción",
            },
        },
        {
            ...col6,
            lbl: "Prioridad",
            id: "modalcbPrioridad",
            elemento: "select-group",
            icon: '<i class="icon-angle-circled-down"></i>',
            option: {
                data: jsonPriority,
                placeholder: "Selecciona una opción",
            },
            pos: "left",
            required: true,
        },
        {
            ...col6,
            lbl: "Unidad de negocio",
            id: "modalcbUDN",
            elemento: "select",
            option: { data: jsonUDN },
        },
        {
            ...col6,
            lbl: "Categoría",
            id: "modalcbTemporada",
            elemento: "select-group",
            icon: '<i class="icon-plus"></i>',
            span: {
                class: "btn btn-outline-success",
                id: "spanPlusSeason",
                onclick: "addSeasonModal();",
            },
            option: {
                data: jsonSeason,
                placeholder: "Selecciona una opción",
            },
            pos: "left",
            required: true,
        },
        {
            ...col6,
            lbl: "Tipo de evento",
            id: "modalcbCategory",
            elemento: "select",
            pos: "right",
            required: true,
            option: { data: jsonCategory },
        },
        {
            ...col12,
            lbl: "Responsable(s)",
            id: "modalcbResponsable",
            elemento: "select-group",
            icon: '<i class="icon-users-2"></i>',
            pos: "left",
            multiple: true,
            required: true,
            option: {
                data: jsonResponsible,
                placeholder: "Selecciona una opción",
                select2: true,
                group: true,
            },
        },
        {
            ...col12,
            lbl: "Actividades",
            elemento: "textarea",
            placeholder: "Agregar actividades",
            id: "actividades",
            required: true,
        },
        {
            ...col12,
            lbl: "Notas adicionales",
            id: "notasadicionales",
            placeholder: "Agregar nota",
            elemento: "textarea",
        },
        { elemento: "modal_button" },
    ];

    return formulario;
}
// Agregar evento
function addEventModal() {
    // Crear formulario
    let form = $("<form>", {
        novalidate: true,
        class: "row",
        id: "formNuevoEvento",
    });

    form.create_elements(elementsEventModal());
    let opts = [];

    // Modal
    bootbox
        .dialog({
            title: "<button class='btn btn-outline-warning' id='btnNewEventGuide'><i class='icon-question'></i></button> NUEVO EVENTO",
            size: "large",
            message: form,
            closeButton: true,
        })
        .on("shown.bs.modal", function () {
            // Cambiar tamaño de textarea
            $('#actividades').attr('rows', 5);
            $('#notasadicionales').attr('rows', 3);

            // Tutorial de nuevo evento
            let newEventGuide = [];
            newEventGuide = [
                {
                    title: "Nuevas funcionalidades",
                    intro: "¡Descubre las nuevas funcionalidades de la aplicación!🚀",
                },
                {
                    element: $("#btnCircleColors")[0],
                    title: "Colores",
                    intro: "Aquí puedes seleccionar el color del evento.",
                },
                {
                    element: $("#fechainicial")[0],
                    title: "Fecha Inicial",
                    intro: "Aquí puedes seleccionar la fecha de inicio del evento.",
                },
                {
                    element: $("#fechafinal")[0],
                    title: "Fecha Final",
                    intro: "Esta es la fecha final o duración del evento, cuando tiene una duración de un día, la fecha final es la misma que la inicial.",
                },
                {
                    element: $("#modalcbRepeat")[0],
                    title: "Repetir Evento",
                    intro: "Puedes repetir un evento de acuerdo a la frecuencia que desees (personalizado), o no repetir el evento.",
                },
                {
                    element: $("#modalcbPrioridad")[0],
                    title: "Prioridad",
                    intro: "Aquí puedes seleccionar la prioridad del evento.",
                },
                {
                    element: $("#spanPlusSeason")[0],
                    title: "Agregar Categoría",
                    intro: "Aquí puedes agregar una nueva categoría.",
                },
                {
                    element: $("#modalcbCategory")[0],
                    title: "Tipo de evento",
                    intro: "Hay dos tipos de evento: Corporativo y Personal. Los eventos corporativos son visibles para Dirección.",
                },
                {
                    element: $(".icon-users-2")[0],
                    title: "Responsable(s)",
                    intro: "Aquí puedes seleccionar a los responsables del evento, se les notificará por whatsapp.",
                },
                {
                    title: "¡Listo!",
                    intro: "¡Ahora ya puedes agregar un nuevo evento!🎉",
                }
            ];
            $('#btnNewEventGuide').on('click', () => virtualGuide(newEventGuide, null));

            // Inicializamos el color form
            color = new Colors();
            color.open();

            // Renderizar selects
            $("#modalcbPrioridad").option_select({
                father: true,
                group: true,
            });

            $("#modalcbTemporada").option_select({
                select2: true,
                father: true,
                group: true,
            });

            // Asignar valores por defecto
            $('#modalcbTemporada').val(1).trigger('change');
            $('#modalcbPrioridad').val(3).trigger('change');

            // Cambiar a mayúsculas
            $("#evento").on("input", function () {
                let upperCaseValue = $(this).val().toUpperCase();
                $(this).val(upperCaseValue);
            });

            // Select repetición
            $("#modalcbRepeat").on("change", function () {
                let selectedValue = $(this).val();
                $("#fechafinal").prop("disabled", false);
                // Si es personalizado
                if (selectedValue == 6) {
                    if ($("#fechainicial").val() == "") {
                        alert({
                            icon: "error",
                            title: "Error en la fecha",
                            text: "Debes seleccionar una fecha de inicio",
                            btn1: "Aceptar",
                        });
                        $("#modalcbRepeat").val("1").trigger("change");
                        return false;
                    }
                    repeatCustomModal(opts).then((datos) => {
                        opts = Object.assign({}, datos);
                    });
                } else if (selectedValue != "custom") {
                    // Si no es personalizado se limpian los datos
                    opts = [];
                    if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                        $("#modalcbRepeat").find('option[value="custom"]').remove();
                    }
                }
            });

            // Cambiar la descripción del option custom
            $("#fechainicial").on("change", function () {
                // Si hay una opción custom
                if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                    // Si es mensual
                    if (opts.idfrecuency === "4") {
                        // Cambiar la descripción
                        let fecha = $(this).val();
                        let dayOfMonth = getDayOfMonth(fecha);
                        let dayOfWeek = getDayOfWeek(fecha);
                        let interval = opts.interval;
                        let text = "";

                        if (interval > 1) {
                            text = `Cada ${interval} meses`;
                        } else {
                            text = `Cada mes`;
                        }
                        let mes = "";
                        if (opts.numWeek === 1) {
                            mes = `el primer ${dayOfWeek}`;
                        } else if (opts.numWeek === -1) {
                            mes = `el último ${dayOfWeek}`;
                        } else {
                            mes = `el día ${dayOfMonth}`;
                        }
                        if (opts.end != "") {
                            text = `${text} ${mes} hasta el ${opts.end}`;
                        } else {
                            text = `${text} ${mes}`;
                        }

                        // Cambiar el texto del option custom
                        $("#modalcbRepeat")
                            .find('option[value="custom"]')
                            .text(text)
                            .val("custom");
                    }
                }
            });

            // Eliminar opción por defecto ´- Seleccionar -´
            $("#modalcbUDN option")
                .filter(function () {
                    return $(this).val() === "0" && $(this).text() === "- Seleccionar -";
                })
                .remove();

            $("#modalcbUDN").on("change", function () {
                let udn = $(this).val();
                filtrarResponsables(udn).then((jsonResponsible) => {
                    $("#modalcbResponsable").empty();
                    $("#modalcbResponsable").option_select({
                        data: jsonResponsible,
                        placeholder: "Selecciona una opción",
                        select2: true,
                        father: true,
                        group: true,
                    });
                });
            });

            // Asignar valores por defecto
            $("#fechainicial").val(today());
            $("#fechafinal").val(today());
            $("#modalcbRepeat").val("1").trigger("change");
            $("#modalcbUDN").val($("#cbUDN").val()).trigger("change");

            // Validar formulario
            form.validation_form({}, () => {
                let fechaInicio = $("#fechainicial").val();
                let fechaTermino = $("#fechafinal").val();
                let startDate = new Date(fechaInicio);
                let endDate = new Date(fechaTermino);
                let title = $("#evento").val();

                let eventoCreado = false;
                lsEvents.forEach((e) => {
                    if (e.event.title == title) {
                        alert({
                            icon: "error",
                            title: "Error al agregar",
                            text: "El evento ya existe",
                            btn1: "Aceptar",
                        });
                        $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
                        eventoCreado = true;
                    }
                });
                if (!eventoCreado) {
                    // Validar si fechaInicial es menor que fechaFinal
                    if (startDate > endDate) {
                        alert({
                            icon: "error",
                            title: "Error en la fecha",
                            text: "La fecha de inicio no puede ser mayor a la fecha de término",
                            btn1: "Aceptar",
                        });
                        $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
                        return false;
                    } else {
                        form.find("button[type='submit']").attr("disabled", "disabled");
                        createEvent(opts);
                    }
                } else {
                    return false;
                }
            });
        });
}
// Editar evento
function editEventModal(id, selectedDate) {
    // Crear formulario
    let form = $("<form>", {
        novalidate: true,
        class: "row",
        id: "formNuevoEvento"
    });

    form.create_elements(elementsEventModal());
    let opts = [];

    // Modal
    bootbox
        .dialog({
            title: "EDITAR EVENTO",
            size: "large",
            message: form,
            closeButton: true,
        })
        .on("shown.bs.modal", function () {
            // Inicializamos el color form
            color = new Colors();
            color.open();


            // Renderizar selects
            $("#modalcbPrioridad").option_select({
                father: true,
                group: true,
            });
            $("#modalcbTemporada").option_select({
                select2: true,
                father: true,
                group: true,
            });

            // Cambiar a mayúsculas
            $("#evento").on("input", function () {
                let upperCaseValue = $(this).val().toUpperCase();
                $(this).val(upperCaseValue);
            });

            // Eliminar opción por defecto ´- Seleccionar -´
            $("#modalcbUDN option")
                .filter(function () {
                    return $(this).val() === "0" && $(this).text() === "- Seleccionar -";
                })
                .remove();

            // Cambiar jsonResponsible
            $("#modalcbUDN").on("change", function () {
                let udn = $(this).val();
                filtrarResponsables(udn).then((jsonResponsible) => {
                    $("#modalcbResponsable").empty();
                    $("#modalcbResponsable").option_select({
                        data: jsonResponsible,
                        placeholder: "Selecciona una opción",
                        select2: true,
                        group: true,
                    });
                    $("#modalcbResponsable")
                        .val(
                            lsEvents
                                .filter((e) => e.event.id == id)[0]
                                .event.assign.map((e) => e.id)
                        )
                        .trigger("change");
                });
            });

            // Asignar valores por defecto
            $("#evento").val(lsEvents.filter((e) => e.event.id == id)[0].event.title);


            const colorUsed = lsEvents.filter((e) => e.event.id == id)[0].event.color;

            $("#circleBTN").css(
                "background-color",
                colorUsed
            ).attr('data-color', colorUsed);

            $('#circleMenu').find('.icon-ok').addClass('hide');
            $('#circleMenu').find('[data-color="' + colorUsed + '"]').find('.icon-ok').removeClass('hide');

            $("#modalcbTemporada")
                .val(lsEvents.filter((e) => e.event.id == id)[0].event.idseason)
                .trigger("change");
            $("#modalcbUDN")
                .val(lsEvents.filter((e) => e.event.id == id)[0].event.idudn)
                .trigger("change");
            if (
                lsEvents.filter((e) => e.event.id == id)[0].event.idudn == 0 ||
                lsEvents.filter((e) => e.event.id == id)[0].event.idudn == null
            ) {
                $("#modalcbUDN").val(0).trigger("change");
            }
            $("#fechainicial").val(
                lsEvents.filter((e) => e.event.id == id)[0].replay.start
            );
            $("#fechafinal").val(
                lsEvents.filter((e) => e.event.id == id)[0].replay.end
            );
            $("#modalcbPrioridad")
                .val(lsEvents.filter((e) => e.event.id == id)[0].event.idpriority)
                .trigger("change");
            $("#actividades").val(
                lsEvents.filter((e) => e.event.id == id)[0].event.activities
            );
            $("#notasadicionales").val(
                lsEvents.filter((e) => e.event.id == id)[0].event.note
            );
            $("#modalcbCategory").val(
                lsEvents.filter((e) => e.event.id == id)[0].event.idcategory
            );

            // Cambiar frecuencia
            if (
                lsEvents.filter((e) => e.event.id == id)[0].replay.text != "" &&
                lsEvents.filter((e) => e.event.id == id)[0].replay.text != null &&
                lsEvents.filter((e) => e.event.id == id)[0].replay.text != undefined &&
                lsEvents.filter((e) => e.event.id == id)[0].event.custom == 1
            ) {
                $("#modalcbRepeat").append(
                    $("<option>", {
                        value: "custom",
                        text: lsEvents.filter((e) => e.event.id == id)[0].replay.text,
                    })
                );
                $("#modalcbRepeat").val("custom").trigger("change");
                opts = lsEvents.filter((e) => e.event.id == id)[0].replay;
            } else {
                $("#modalcbRepeat")
                    .val(lsEvents.filter((e) => e.event.id == id)[0].replay.idfrecuency)
                    .trigger("change");
            }

            // Select repetición
            $("#modalcbRepeat").on("change", function () {
                let selectedValue = $(this).val();
                let fechaInicial = $("#fechainicial").val();
                let replay = selectedValue;
                $("#fechafinal").prop("disabled", false);
                // Si es personalizado
                if (selectedValue == 6) {
                    repeatCustomModal(opts).then((datos) => {
                        opts = Object.assign({}, datos);
                    });
                } else if (selectedValue != "custom") {
                    // Si no es personalizado se limpian los datos
                    opts = [];
                    if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                        $("#modalcbRepeat").find('option[value="custom"]').remove();
                    }
                }
            });

            // Cambiar la descripción del option custom
            $("#fechainicial").on("change", function () {
                // Si hay una opción custom
                if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                    // Si es mensual
                    if (opts.idfrecuency === "4") {
                        // Cambiar la descripción
                        let fecha = $(this).val();
                        let dayOfMonth = getDayOfMonth(fecha);
                        let dayOfWeek = getDayOfWeek(fecha);
                        let interval = opts.interval;
                        let text = "";

                        if (interval > 1) {
                            text = `Cada ${interval} meses`;
                        } else {
                            text = `Cada mes`;
                        }
                        let mes = "";
                        if (opts.numWeek === 1) {
                            mes = `el primer ${dayOfWeek}`;
                        } else if (opts.numWeek === -1) {
                            mes = `el último ${dayOfWeek}`;
                        } else {
                            mes = `el día ${dayOfMonth}`;
                        }
                        if (opts.end != "") {
                            text = `${text} ${mes} hasta el ${opts.end}`;
                        } else {
                            text = `${text} ${mes}`;
                        }

                        // Cambiar el texto del option custom
                        $("#modalcbRepeat")
                            .find('option[value="custom"]')
                            .text(text)
                            .val("custom");
                    }
                }
            });

            // Validar formulario
            form.validation_form({}, () => {
                let fechaInicio = $("#fechainicial").val();
                let fechaTermino = $("#fechafinal").val();
                let startDate = new Date(fechaInicio);
                let endDate = new Date(fechaTermino);
                let title = $("#evento").val();

                let eventoCreado = false;
                lsEvents.forEach((e) => {
                    if (e.event.title == title && e.event.id != id) {
                        alert({
                            icon: "error",
                            title: "Error al agregar",
                            text: "El evento ya existe",
                            btn1: "Aceptar",
                        });
                        $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
                        eventoCreado = true;
                    }
                });

                if (!eventoCreado) {
                    // Validar si fechaInicial es menor que fechaFinal
                    if (startDate > endDate) {
                        alert({
                            icon: "error",
                            title: "Error en la fecha",
                            text: "La fecha de inicio no puede ser mayor a la fecha de término",
                            btn1: "Aceptar",
                        });
                        $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
                        return false;
                    } else {
                        form.find("button[type='submit']").attr("disabled", "disabled");
                        updateEvent(id, opts, selectedDate);
                    }
                } else {
                    return false;
                }
            });
        });
}
// Agregar temporada
function addSeasonModal() {
    // Crear formulario
    let form = $("<form>", {
        novalidate: true,
        class: "row",
        id: "formAddSeason",
    });

    form.create_elements([
        {
            div: { class: "col-12 mb-3" },
            lbl: "Temporada",
            placeholder: "Agregar temporada",
            id: "temporada",
            name: "name",
        },
        { elemento: "modal_button" },
    ]);

    // Modal
    bootbox
        .dialog({
            title: "NUEVA TEMPORADA",
            message: form,
        })
        .on("shown.bs.modal", function () {
            // Enfocar input
            $("#temporada").focus();

            // Cambiar a mayúsculas
            $("#temporada").on("input", function () {
                let upperCaseValue = $(this).val().toUpperCase();
                $(this).val(upperCaseValue);
            });

            // Validar formulario
            form.validation_form({ opc: "createSeason" }, function (result) {
                let valor = $("#temporada").val().trim();

                if (jsonSeason.find((e) => e.valor == valor)) {
                    alert({
                        icon: "error",
                        title: "Error al agregar",
                        text: "La temporada ya existe",
                    });
                    return false;
                } else {
                    // Deshabilitar botón hasta que se complete la petición
                    $("#formAddSeason button[type='submit']").attr(
                        "disabled",
                        "disabled"
                    );
                    send_ajax(result, ctrlactividades).then((data) => {
                        if (data.status == 200) {
                            alert({
                                icon: "success",
                                title: "Agregado correctamente",
                            });
                            // Agregar al select
                            $("#modalcbTemporada").append(
                                $("<option>").text(valor).val(data.id).attr("id", data.id)
                            );
                            $("#modalcbTemporada").val(data.id).trigger("change");
                            // Agregar al json
                            jsonSeason.push({ id: data.id, valor: valor });
                            // Limpiar formulario
                            valor = "";
                            form.find("button[type='submit']").removeAttr("disabled");
                            form.find("button[type='button']").click();
                        } else
                            alert({
                                icon: "error",
                                title: "Error al agregar",
                            });
                    });
                }
            });
        });
}
// Recurrencia personalizada
function repeatCustomModal(options) {
    return new Promise((resolve) => {
        // Modal
        let customModal = bootbox
            .dialog({
                title: "RECURRENCIA PERSONALIZADA",
                message: `<div class="row">
                        <div class="col-3 mb-3">
                            <label class="form-label">Repetir cada</label>
                        </div>
                        <div class="col-4 mb-3">
                             <input type="number" class="form-control" id="repeatInterval" value="1" min="1">
                        </div>
                        <div class="col-5 mb-3">
                            <select class="form-select" id="repeatType">
                                <option value="2">Día(s)</option>
                                <option value="3">Semana(s)</option>
                                <option value="4">Mes(s)</option>
                                <option value="5">Año(s)</option>
                            </select>
                        </div>
                        <div class="col-12 mb-3" id="days">
                            <label class="form-label">Repetir el</label>
                            <div class="content-days-of-week">
                                <input type="checkbox" class="btn-check" id="domingo" autocomplete="off">
                                <label class="btn btn-check-radio days-of-week" for="domingo">D</label>
  
                                <input type="checkbox" class="btn-check" id="lunes" autocomplete="off">
                                <label class="btn btn-check-radio days-of-week" for="lunes">L</label>
  
                                <input type="checkbox" class="btn-check" id="martes" autocomplete="off">
                                <label class="btn btn-check-radio days-of-week martes" for="martes">M</label>
  
                                <input type="checkbox" class="btn-check" id="miercoles" autocomplete="off">
                                <label class="btn btn-check-radio days-of-week" for="miercoles">X</label>
  
                                <input type="checkbox" class="btn-check" id="jueves" autocomplete="off">
                                <label class="btn btn-check-radio days-of-week" for="jueves">J</label>
  
                                <input type="checkbox" class="btn-check" id="viernes" autocomplete="off">
                                <label class="btn btn-check-radio days-of-week" for="viernes">V</label>
  
                                <input type="checkbox" class="btn-check" id="sabado" autocomplete="off">
                                <label class="btn btn-check-radio days-of-week" for="sabado">S</label>
                            </div>
                        </div>
                        <div class="col-12 mb-3 hide" id="months">
                            <select class="form-select form-label" id="monthlyClass">
                            </select>
                        </div>
                        <div class="col-12 mb-3">
                            <label class="form-label">Hasta</label>
                           <div class="form-check mb-3">
                                <input class="form-check-input" type="radio" name="exampleRadios" id="radioNever" value="option1" checked>
                                <label class="form-check-label" for="radioNever">
                                    Nunca
                                </label>
                            </div>
                            <div class="form-check d-flex align-items-center">
                                <input class="form-check-input" type="radio" name="exampleRadios" id="radioDateEnd" value="option2" style="padding: 0.45rem!important;">
                                <label class="form-check-label ms-2" for="radioDateEnd">
                                    El
                                </label>
                                <input type="date" class="form-control" id="repeatEnd" style="margin-left: 5.5rem !important" disabled> 
                            </div>
                        </div>
                         <hr>
                          <div class="col-12 mb-3 d-flex justify-content-between">
                              <button class="btn btn-primary col-5" id="btnSaveCustomRepeat">Guardar</button>
                              <button class="btn btn-outline-danger col-5" id="btnCloseCustomRepeat">Cancelar</button>
                          </div>
                    </div>`,
            })
            .on("shown.bs.modal", function () {
                let fechaInicial = $("#fechainicial").val();
                let dayOfMonth = getDayOfMonth(fechaInicial);
                let dayOfWeek = getDayOfWeek(fechaInicial);
                let text = {
                    1: `Mensual el día ${dayOfMonth}`,
                    2: `Mensual el último ${dayOfWeek}`,
                    3: `Mensual el primer ${dayOfWeek}`,
                };
                // Agregar opciones al select del día del mes
                agregarOpciones("monthlyClass", text);

                // Asignar valores por defecto al modal
                if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                    // Si ya existe la opción custom, asignar valores
                    if (Object.keys(options).length > 0) {
                        $("#repeatInterval").val(options.interval);
                        $("#repeatType").val(options.idfrecuency).click();

                        // Si until es diferente de vacío tiene una repetición infinita.
                        if (options.until != "") {
                            $("#radioDateEnd").prop("checked", true);
                            $("#repeatEnd").prop("disabled", false);
                            $("#repeatEnd").val(options.until);
                        } else {
                            $("#radioNever").prop("checked", true);
                            $("#repeatEnd").prop("disabled", true);
                            let fecha = $("#fechainicial").val();
                            let replay = $("#repeatType").val();
                            calculateEndDate(fecha, replay, "#repeatEnd");
                        }

                        //Si la repetición es diferente de semanal
                        if (options.idfrecuency != 3 && options.idfrecuency != 4) {
                            $("#days").addClass("hide");
                            $("#months").addClass("hide");
                        } else {
                            //Si la repetición es mensual
                            if (options.idfrecuency == 4) {
                                $("#days").addClass("hide");
                                $("#months").removeClass("hide");
                                if (options.numWeek == 1) {
                                    $("#monthlyClass").val(3).trigger("change");
                                } else if (options.numWeek == -1) {
                                    $("#monthlyClass").val(2).trigger("change");
                                } else {
                                    $("#monthlyClass").val(1).trigger("change");
                                }
                            } else {
                                //Si la repetición es semanal
                                $("#days").removeClass("hide");
                                $("#months").addClass("hide");
                                if (options.weekDay) {
                                    options.weekDay.forEach((day) => {
                                        switch (day) {
                                            case "su":
                                                $("#domingo").prop("checked", true);
                                                break;
                                            case "mo":
                                                $("#lunes").prop("checked", true);
                                                break;
                                            case "tu":
                                                $("#martes").prop("checked", true);
                                                break;
                                            case "we":
                                                $("#miercoles").prop("checked", true);
                                                break;
                                            case "th":
                                                $("#jueves").prop("checked", true);
                                                break;
                                            case "fr":
                                                $("#viernes").prop("checked", true);
                                                break;
                                            case "sa":
                                                $("#sabado").prop("checked", true);
                                                break;
                                        }
                                    });
                                } else {
                                    $(`#${dayOfWeek}`).prop("checked", true);
                                    $("#repeatEnd").val(today());
                                    $("#dayOfMonth").text(today().split("-")[2]);
                                    $("#dayOfWeek").text(today().split("-")[2]);
                                    $("#repeatType").val("3").trigger("change");
                                }
                            }
                        }
                    }
                } else {
                    // Si no existe la opción custom, asignar valores por defecto
                    let dayMap = {
                        domingo: "#domingo",
                        lunes: "#lunes",
                        martes: "#martes",
                        miércoles: "#miercoles",
                        jueves: "#jueves",
                        viernes: "#viernes",
                        sábado: "#sabado",
                    };

                    $(dayMap[dayOfWeek]).prop("checked", true);
                    $("#repeatEnd").val(today());
                    $("#dayOfMonth").text(today().split("-")[2]);
                    $("#dayOfWeek").text(today().split("-")[2]);
                    $("#repeatType").val("3").trigger("change");

                    // Calcular fecha final
                    let fecha = $("#fechainicial").val();
                    let replay = $("#repeatType").val();
                    calculateEndDate(fecha, replay, "#repeatEnd");
                }

                // Cambiar contenido si es mes/semanal
                $("#repeatType").on("change", function () {
                    let fecha = $("#fechainicial").val();
                    let replay = $(this).val();
                    calculateEndDate(fecha, replay, "#repeatEnd");
                    let selectedValue = $(this).val();
                    // Si es diferente de semanal, ocultar días de la semana
                    if (selectedValue != "3") {
                        $("#days").addClass("hide");
                    } else {
                        $("#days").removeClass("hide");
                    }
                    // Si es diferente de mensual, ocultar select de día del mes
                    if (selectedValue != "4") {
                        $("#months").addClass("hide");
                    } else {
                        $("#months").removeClass("hide");
                    }
                });

                // Si no se selecciona una fecha final, se deshabilita el input
                $("#radioNever").on("change", function () {
                    if ($(this).is(":checked")) {
                        $("#repeatEnd").prop("disabled", true);
                    } else {
                        $("#repeatEnd").prop("disabled", false);
                    }
                });

                // Si se selecciona una fecha final, se habilita el input
                $("#radioDateEnd").on("change", function () {
                    if ($(this).is(":checked")) {
                        $("#repeatEnd").prop("disabled", false);
                    } else {
                        $("#repeatEnd").prop("disabled", true);
                    }
                });

                // Boton cancelar
                $("#btnCloseCustomRepeat").on("click", function () {
                    if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                        $("#modalcbRepeat").val("custom").trigger("change");
                    } else {
                        $("#modalcbRepeat").val("1").trigger("change");
                    }
                    customModal.modal("hide");
                });

                // Guardar
                $("#btnSaveCustomRepeat").on("click", function () {
                    let fechaInicio = $("#fechainicial").val();
                    let fechaTermino = "";
                    let frecuency = $("#repeatType").val();
                    let interval = $("#repeatInterval").val();
                    let weekDay = [];
                    let selectMonth = $("#monthlyClass").val();
                    // Alerta de error
                    const showAlert = (message) => {
                        alert({
                            icon: "error",
                            title: "Error",
                            text: message,
                        });
                    };

                    // Obtener días de la semana
                    $.each($(".days-of-week"), function (index, value) {
                        let day = $(value).attr("for");
                        if ($(`#${day}`).is(":checked")) {
                            //   weekDay.push(day);
                            switch (day) {
                                case "domingo":
                                    weekDay.push("su");
                                    break;
                                case "lunes":
                                    weekDay.push("mo");
                                    break;
                                case "martes":
                                    weekDay.push("tu");
                                    break;
                                case "miercoles":
                                    weekDay.push("we");
                                    break;
                                case "jueves":
                                    weekDay.push("th");
                                    break;
                                case "viernes":
                                    weekDay.push("fr");
                                    break;
                                case "sabado":
                                    weekDay.push("sa");
                                    break;
                                default:
                                    break;
                            }
                        }
                    });

                    //Validar si finaliza o no
                    if ($("#radioDateEnd").is(":checked")) {
                        fechaTermino = $("#repeatEnd").val();
                    }

                    // Asignar nueva fecha final y deshabilitar el input
                    // $("#fechafinal").val(fechaTermino).prop("disabled", true);

                    // Eliminar opción personalizada si existe
                    if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                        $("#modalcbRepeat").find('option[value="custom"]').remove();
                    }

                    let opcion = "";
                    let frecuencia = "";
                    // Cambiar el valor del select a una nueva opción de acuerdo a la repetición elegida
                    if (frecuency == "2") {
                        frecuencia = "daily";
                        // Validación de intervalo

                        if (interval > 1) {
                            opcion = `Cada ${interval} días`;
                        } else {
                            opcion = "Cada día";
                        }
                        // Validación de fecha final
                        if (fechaTermino != "") {
                            opcion = `${opcion} hasta el ${fechaTermino}`;
                        }
                        // Agregar opción al select
                        $("#modalcbRepeat").append(
                            `<option value="custom" selected>${opcion}</option>`
                        );
                    } else if (frecuency == "3") {
                        frecuencia = "weekly";
                        // Validación de intervalo
                        if (interval > 1) {
                            opcion = `Cada ${interval} semanas`;
                        } else {
                            opcion = "Cada semana";
                        }
                        // Validación de los días de la semana
                        let dias = "";
                        weekDay.forEach((d) => {
                            switch (d) {
                                case "su":
                                    dias += "dom., ";
                                    break;
                                case "mo":
                                    dias += "lun., ";
                                    break;
                                case "tu":
                                    dias += "mar., ";
                                    break;
                                case "we":
                                    dias += "mie., ";
                                    break;
                                case "th":
                                    dias += "jue., ";
                                    break;
                                case "fr":
                                    dias += "vie., ";
                                    break;
                                case "sa":
                                    dias += "sab., ";
                                    break;
                                default:
                                    break;
                            }
                        });
                        // Validar si se seleccionaron todos los días
                        if (weekDay.length == 7) {
                            dias = "todos los días";
                            opcion = `${opcion} ${dias}`;
                        } else if (
                            // Validar de lunes a viernes
                            weekDay.length == 5 &&
                            !weekDay.includes("su") &&
                            !weekDay.includes("sa")
                        ) {
                            opcion = `${opcion} de lunes a viernes`;
                        } else {
                            // Validar días seleccionados
                            opcion = `${opcion} el ${dias}`;
                        }

                        // Validación de fecha final
                        if (fechaTermino != "") {
                            opcion = `${opcion} hasta el ${fechaTermino}`;
                        }

                        // Agregar opción al select
                        $("#modalcbRepeat").append(
                            `<option value="custom" selected>${opcion}</option>`
                        );
                    } else if (frecuency == "4") {
                        frecuencia = "monthly";
                        // Validación de intervalo
                        if (interval > 1) {
                            opcion = `Cada ${interval} meses`;
                        } else {
                            opcion = "Cada mes";
                        }
                        // Validación del select escogido
                        let mes = "";

                        switch (selectMonth) {
                            case "1":
                                mes = `el día ${dayOfMonth}`;
                                break;
                            case "2":
                                mes = `el último ${dayOfWeek}`;
                                break;
                            case "3":
                                mes = `el primer ${dayOfWeek}`;
                                break;
                            default:
                                break;
                        }
                        // Validación de fecha final
                        if (fechaTermino != "") {
                            opcion = `${opcion} ${mes} hasta el ${fechaTermino}`;
                        } else {
                            opcion = `${opcion} ${mes}`;
                        }
                        // Agregar opción al select
                        $("#modalcbRepeat").append(
                            `<option value="custom" selected>${opcion}</option>`
                        );
                    } else if (frecuency == "5") {
                        frecuencia = "yearly";
                        // Validación de intervalo
                        if (interval > 1) {
                            opcion = `Cada ${interval} años`;
                        } else {
                            opcion = "Cada año";
                        }
                        // Validación de fecha final
                        if (fechaTermino != "") {
                            opcion = `${opcion} hasta el ${fechaTermino}`;
                        }
                        // Agregar opción al select
                        $("#modalcbRepeat").append(
                            `<option value="custom" selected>${opcion}</option>`
                        );
                    }

                    // Opciones por defecto
                    let opts = {
                        start: fechaInicio,
                        until: fechaTermino,
                        idfrecuency: frecuency,
                        frecuency: frecuencia,
                        interval: interval,
                        text: opcion,
                    };

                    // Validar las opciones de repetición
                    switch (frecuency) {
                        // Si es semanal
                        case "3":
                            // Si no se selecciona ningún día de la semana
                            if (weekDay.length === 0) {
                                showAlert("Selecciona al menos un día de la semana");
                                return;
                            }

                            // Guardar días de la semana seleccionados
                            opts.weekDay = weekDay;
                            break;

                        // Si es mensual
                        case "4":
                            // Si no se selecciona un opción en el select mes
                            if (selectMonth == null) {
                                showAlert("Selecciona un día del mes");
                                return;
                            }

                            // Guardar opciones de mes
                            switch (selectMonth) {
                                case "1":
                                    // Si es una vez al mes, opts por defecto
                                    break;

                                // Mensual, el último día del mes
                                case "2":
                                    opts.numWeek = -1;
                                    // Agregar weekDay el día de la semana, de acuerdo a startDate
                                    switch (dayOfWeek) {
                                        case "domingo":
                                            opts.weekDay = ["su"];
                                            break;
                                        case "lunes":
                                            opts.weekDay = ["mo"];
                                            break;
                                        case "martes":
                                            opts.weekDay = ["tu"];
                                            break;
                                        case "miércoles":
                                            opts.weekDay = ["we"];
                                            break;
                                        case "jueves":
                                            opts.weekDay = ["th"];
                                            break;
                                        case "viernes":
                                            opts.weekDay = ["fr"];
                                            break;
                                        case "sábado":
                                            opts.weekDay = ["sa"];
                                            break;
                                        default:
                                            showAlert("Selecciona un día del mes válido");
                                            return;
                                    }
                                    break;

                                // Mensual, el primer día del mes
                                case "3":
                                    opts.numWeek = 1;
                                    // Agregar weekDay el día de la semana, de acuerdo a startDate
                                    switch (dayOfWeek) {
                                        case "domingo":
                                            opts.weekDay = ["su"];
                                            break;
                                        case "lunes":
                                            opts.weekDay = ["mo"];
                                            break;
                                        case "martes":
                                            opts.weekDay = ["tu"];
                                            break;
                                        case "miércoles":
                                            opts.weekDay = ["we"];
                                            break;
                                        case "jueves":
                                            opts.weekDay = ["th"];
                                            break;
                                        case "viernes":
                                            opts.weekDay = ["fr"];
                                            break;
                                        case "sábado":
                                            opts.weekDay = ["sa"];
                                            break;
                                        default:
                                            showAlert("Selecciona un día del mes válido");
                                            return;
                                    }
                                    break;
                                default:
                                    showAlert("Selecciona un día del mes válido");
                                    return;
                            }
                            break;
                    }

                    customModal.modal("hide");

                    // Retornar opciones
                    resolve(opts);
                });
            });
    });
}


//? CALENDARIO DE EVENTOS --------------------------------
function fullCalendar() {
    var calendarEl = $("#tbDatos")[0];

    let today = new Date();

    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();

    let twoYearsAgo = new Date(currentYear - 2, currentMonth, 1);
    let nextYear = new Date(currentYear + 1, currentMonth, 1);

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        views: {
            multiMonthYear: {
                type: 'multiMonth',
                duration: { months: 12 },
                buttonText: 'Año'
            }
        },
        locale: "es",
        themeSystem: "bootstrap5",
        allDayText: "Todo el día",
        moreLinkText: "más",
        noEventsText: "No hay eventos para mostrar",
        buttonText: {
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            list: "Agenda",
        },
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        businessHours: true,

        validRange: {
            start: twoYearsAgo,
            end: nextYear
        },

        // Eventos
        events: createJsonEvents(lsEvents),

        // Cómo se mostrará el evento en el calendario
        eventContent: function (arg) {
            let fecha = new Date(arg.event.start).toISOString().split("T")[0] // Obtener la fecha exacta del evento
            let event = lsEvents.filter((e) => e.event.id == arg.event.id)[0];
            let titleEl = document.createElement("div");
            let Status = document.createElement("div");
            let statusEvent = "Pendiente";
            let statusUser = "Pendiente";
            let argColor = "";

            titleEl.innerHTML = arg.event.title;
            titleEl.classList.add("fw-bold");

            if (event) {
                let asignado = false;
                let creador = event.event.idcreator == idUsuario; // ¿Es el creador del evento?

                // Evaluación de estados de usuario
                if (Object.keys(event.event.assign).length > 0) {
                    event.event.assign.forEach((assig) => {
                        // ¿El usuario está asignado?
                        if (assig.iduser == idUsuario) {
                            asignado = true;
                            // Evaluar el estado del día seleccionado
                            if (assig.estados) {
                                assig.estados.forEach((stado) => {
                                    let occDate = stado.ocurrence;
                                    if (occDate == fecha) {
                                        statusUser = stado.status;
                                    }
                                });
                            }
                        }
                    }
                    );
                }

                // Evaluación de estados de evento
                if (event.event.estados && Object.keys(event.event.estados).length > 0) {
                    event.event.estados.forEach(stado => {
                        if (fecha == stado.ocurrence) {
                            statusEvent = stado.status;
                        }
                    });
                }

                // Validar si los eventos son asignados o creados
                if (asignado && creador) {
                    // Si el usuario es creador y responsable del evento
                    if (statusEvent == "Pendiente") {
                        if (statusUser == "Pendiente") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(205, 73, 69); display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "not-started",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusUser || "";
                        } else if (statusUser == "En proceso") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(202, 142, 27); display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "in-progress",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusUser || "";
                        } else if (statusUser == "Terminado") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(45, 153, 100); display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "completed",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusUser || "";
                        } else if (statusUser == "Cancelado") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #DC3545; display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "cancelled",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusUser || "";
                        }
                    } else if (statusEvent == "Revisado") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #28A745; display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "completed",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    } else if (statusEvent == "Pausado") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #7861B2; display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "paused",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    } else if (statusEvent == "Cancelado") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #DC3545; display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "cancelled",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    }
                } else if (asignado && !creador) {
                    // Si el usuario es responsable
                    if (statusEvent != "Pendiente") {
                        if (statusEvent == "Cancelado") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(205, 73, 69); display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "cancelled",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusEvent || "";
                        } else if (statusEvent == "Pausado") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #7861B2; display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "paused",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusEvent || "";
                        } else if (statusEvent == "Revisado") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #28A745; display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "completed",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusEvent || "";
                        }
                    } else {
                        if (statusUser == "Pendiente") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(205, 73, 69); display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "not-started",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusUser || "";
                        } else if (statusUser == "En proceso") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(202, 142, 27); display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "in-progress",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusUser || "";
                        } else if (statusUser == "Terminado") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(45, 153, 100); display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "completed",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusUser || "";
                        } else if (statusUser == "Cancelado") {
                            argColor =
                                '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #DC3545; display: inline-flex; flex-shrink: 0;"></div>';
                            Status.classList.add(
                                "cancelled",
                                "rounded-pill",
                                "text-center",
                                "d-inline-block",
                                "pe-1",
                                "ps-1",
                                "font-10"
                            );
                            Status.innerHTML = argColor + statusUser || "";
                        }
                    }
                } else if (!asignado && creador) {
                    // Si el usuario es creador
                    if (statusEvent == "Pendiente") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(205, 73, 69); display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "not-started",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    } else if (statusEvent == "Revisado") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #28A745; display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "completed",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    } else if (statusEvent == "Pausado") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #7861B2; display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "paused",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    } else if (statusEvent == "Cancelado") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #DC3545; display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "cancelled",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    }
                } else if (!asignado && !creador) {
                    // Si el usuario no es creador ni responsable
                    if (statusEvent == "Pendiente") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(205, 73, 69); display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "not-started",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    } else if (statusEvent == "Revisado") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #28A745; display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "completed",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    } else if (statusEvent == "Pausado") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #7861B2; display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "paused",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    } else if (statusEvent == "Cancelado") {
                        argColor =
                            '<div style="margin-right: 5px; margin-top:5px; border-radius: 99px; height: 8px; width: 8px; background-color: #DC3545; display: inline-flex; flex-shrink: 0;"></div>';
                        Status.classList.add(
                            "cancelled",
                            "rounded-pill",
                            "text-center",
                            "d-inline-block",
                            "pe-1",
                            "ps-1",
                            "font-10"
                        );
                        Status.innerHTML = argColor + statusEvent || "";
                    }
                }
            }

            let arrayOfDomNodes = [titleEl, Status];

            return { domNodes: arrayOfDomNodes };
        },

        // Click en el evento
        eventClick: function (info) {
            let fecha = new Date(info.event.start).toISOString().split("T")[0];

            let event = lsEvents.filter((e) => e.event.id == info.event.id)[0];
            if (event.event.simulation && event.event.simulation == true) {
                showEventSimulation(info.event.id, fecha);
            } else {
                showEvent(info.event.id, fecha);
            }
        },
    });

    $(".fc-header-toolbar .fc-toolbar-chunk:last-child .fc-button-group").html("");

    calendar.render();

    $(".fc-prev-button").removeClass("fc-button-primary");
    $(".fc-next-button").removeClass("fc-button-primary");
    $(".fc-today-button").removeClass("fc-button-primary");
    $(".fc-dayGridMonth-button").removeClass("fc-button fc-button-primary");
    $(".fc-timeGridWeek-button").removeClass("fc-button fc-button-primary");
    $(".fc-timeGridDay-button").removeClass("fc-button fc-button-primary");
    $(".fc-listDay-button").removeClass("fc-button fc-button-primary");

    $(".fc-prev-button").addClass("btn btn-outline-primary");
    $(".fc-next-button").addClass("btn btn-outline-primary");
    $(".fc-today-button").addClass("btn btn-outline-primary");
    $(".fc-dayGridMonth-button").addClass("btn btn-outline-primary");
    $(".fc-timeGridWeek-button").addClass("btn btn-outline-primary");
    $(".fc-timeGridDay-button").addClass("btn btn-outline-primary");
    $(".fc-listDay-button").addClass("btn btn-outline-primary");

    $(".fc-dayGridMonth-button").addClass("d-none d-sm-block");
    $(".fc-timeGridWeek-button").addClass("d-none d-sm-block");
    $(".fc-timeGridDay-button").addClass("d-none d-sm-block");
    $(".fc-listDay-button").addClass("d-none d-sm-block");

    $(".fc-dayGridMonth-button").on("click", function () {
        $(".fc-prev-button").removeClass("fc-button-primary");
        $(".fc-next-button").removeClass("fc-button-primary");
        $(".fc-today-button").removeClass("fc-button-primary");
        $(".fc-dayGridMonth-button").removeClass("fc-button fc-button-primary");
        $(".fc-timeGridWeek-button").removeClass("fc-button fc-button-primary");
        $(".fc-timeGridDay-button").removeClass("fc-button fc-button-primary");
        $(".fc-listDay-button").removeClass("fc-button fc-button-primary");

        $(".fc-prev-button").addClass("btn btn-outline-primary");
        $(".fc-next-button").addClass("btn btn-outline-primary");
        $(".fc-today-button").addClass("btn btn-outline-primary");
        $(".fc-dayGridMonth-button").addClass("btn btn-outline-primary");
        $(".fc-timeGridWeek-button").addClass("btn btn-outline-primary");
        $(".fc-timeGridDay-button").addClass("btn btn-outline-primary");
        $(".fc-listDay-button").addClass("btn btn-outline-primary");

        $(".fc-dayGridMonth-button").addClass("btn btn-outline-primary");
        $(".fc-dayGridMonth-button").addClass("active");
        $(".fc-timeGridWeek-button").removeClass("active");
        $(".fc-timeGridDay-button").removeClass("active");
        $(".fc-listDay-button").removeClass("active");
    });

    $(".fc-timeGridWeek-button").on("click", function () {
        $(".fc-prev-button").removeClass("fc-button-primary");
        $(".fc-next-button").removeClass("fc-button-primary");
        $(".fc-today-button").removeClass("fc-button-primary");
        $(".fc-dayGridMonth-button").removeClass("fc-button fc-button-primary");
        $(".fc-timeGridWeek-button").removeClass("fc-button fc-button-primary");
        $(".fc-timeGridDay-button").removeClass("fc-button fc-button-primary");
        $(".fc-listDay-button").removeClass("fc-button fc-button-primary");

        $(".fc-prev-button").addClass("btn btn-outline-primary");
        $(".fc-next-button").addClass("btn btn-outline-primary");
        $(".fc-today-button").addClass("btn btn-outline-primary");
        $(".fc-dayGridMonth-button").addClass("btn btn-outline-primary");
        $(".fc-timeGridWeek-button").addClass("btn btn-outline-primary");
        $(".fc-timeGridDay-button").addClass("btn btn-outline-primary");
        $(".fc-listDay-button").addClass("btn btn-outline-primary");

        $(".fc-timeGridWeek-button").addClass("btn btn-outline-primary");
        $(".fc-timeGridWeek-button").addClass("active");
        $(".fc-dayGridMonth-button").removeClass("active");
        $(".fc-timeGridDay-button").removeClass("active");
        $(".fc-listDay-button").removeClass("active");
    });

    $(".fc-timeGridDay-button").on("click", function () {
        $(".fc-prev-button").removeClass("fc-button-primary");
        $(".fc-next-button").removeClass("fc-button-primary");
        $(".fc-today-button").removeClass("fc-button-primary");
        $(".fc-dayGridMonth-button").removeClass("fc-button fc-button-primary");
        $(".fc-timeGridWeek-button").removeClass("fc-button fc-button-primary");
        $(".fc-timeGridDay-button").removeClass("fc-button fc-button-primary");
        $(".fc-listDay-button").removeClass("fc-button fc-button-primary");

        $(".fc-prev-button").addClass("btn btn-outline-primary");
        $(".fc-next-button").addClass("btn btn-outline-primary");
        $(".fc-today-button").addClass("btn btn-outline-primary");
        $(".fc-dayGridMonth-button").addClass("btn btn-outline-primary");
        $(".fc-timeGridWeek-button").addClass("btn btn-outline-primary");
        $(".fc-timeGridDay-button").addClass("btn btn-outline-primary");
        $(".fc-listDay-button").addClass("btn btn-outline-primary");

        $(".fc-timeGridDay-button").addClass("btn btn-outline-primary");
        $(".fc-timeGridDay-button").addClass("active");
        $(".fc-dayGridMonth-button").removeClass("active");
        $(".fc-timeGridWeek-button").removeClass("active");
        $(".fc-listDay-button").removeClass("active");
    });

    $(".fc-listDay-button").on("click", function () {
        $(".fc-prev-button").removeClass("fc-button-primary");
        $(".fc-next-button").removeClass("fc-button-primary");
        $(".fc-today-button").removeClass("fc-button-primary");
        $(".fc-dayGridMonth-button").removeClass("fc-button fc-button-primary");
        $(".fc-timeGridWeek-button").removeClass("fc-button fc-button-primary");
        $(".fc-timeGridDay-button").removeClass("fc-button fc-button-primary");
        $(".fc-listDay-button").removeClass("fc-button fc-button-primary");

        $(".fc-prev-button").addClass("btn btn-outline-primary");
        $(".fc-next-button").addClass("btn btn-outline-primary");
        $(".fc-today-button").addClass("btn btn-outline-primary");
        $(".fc-dayGridMonth-button").addClass("btn btn-outline-primary");
        $(".fc-timeGridWeek-button").addClass("btn btn-outline-primary");
        $(".fc-timeGridDay-button").addClass("btn btn-outline-primary");
        $(".fc-listDay-button").addClass("btn btn-outline-primary");

        $(".fc-listDay-button").addClass("btn btn-outline-primary");
        $(".fc-listDay-button").addClass("active");
        $(".fc-dayGridMonth-button").removeClass("active");
        $(".fc-timeGridWeek-button").removeClass("active");
        $(".fc-timeGridDay-button").removeClass("active");
    });

    $(".fc-header-toolbar .fc-toolbar-chunk:last-child .fc-button-group").append(
        '<button type="button" class="btn btn-outline-primary fc-multiMonthYear-button" id="btnYearView">Año</button>'
    );

    $("#fc-dom-1").addClass("text-capitalize");

    $("#btnYearView").on("click", function () {
        // Obtener la fecha actual
        let currentDate = calendar.getDate();

        // Obtener solo el año y el mes de la fecha actual
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        // Crear las fechas de inicio y fin
        let startDate = new Date(currentYear - 2, currentMonth, 1);
        let endDate = new Date(currentYear + 1, currentMonth, 1);   // El endDate debe ser el primer día del mismo mes del siguiente año

        // Establecer el rango de fechas válido basado solo en el año y mes actuales
        calendar.setOption('validRange', {
            start: startDate, // Primer día del mes dos años antes
            end: endDate // Primer día del mismo mes del año siguiente
        });
        calendar.changeView("multiMonthYear");
    });

    $(".fc-today-button").on("click", function () {
        let currentDate = calendar.getDate();

        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        let startDate = new Date(currentYear - 2, currentMonth, 1);
        let endDate = new Date(currentYear + 1, currentMonth, 1);

        calendar.setOption('validRange', {
            start: startDate, // Primer día del mes dos años antes
            end: endDate // Primer día del mismo mes del año siguiente
        });
    });
}
// Crear json eventos
function createJsonEvents(lsEvents) {
    let events = [];

    lsEvents.forEach((e) => {
        let dfult = {
            allDay: true,
            backgroundColor: "#DDDDDD",
            borderColor: "#DDDDDD",
            textColor: "#000000",
        };
        if (e.event.color) {
            dfult.backgroundColor = e.event.color;
            dfult.borderColor = e.event.color;
            if (
                e.event.color === "#8E24AA" ||
                e.event.color === "#3F51B5" ||
                e.event.color === "#0B8043" ||
                e.event.color === "#D50000" ||
                e.event.color === "#F4511E" ||
                e.event.color === "#E67C73"
            ) {
                dfult.textColor = "#FFFFFF";
            } else {
                dfult.textColor = "#000000";
            }
        }

        let event = {
            ...dfult,
            ...e.event,
            ...rules(e.replay),
        };

        // Asignar rrule a extendedProps si está disponible
        if (event.rrule) {
            event.extendedProps = {
                rrule: event.rrule,
            };
        }

        events.push(event);
    });

    return events;
}
// Crear reglas de repetición
function rules(opts) {
    let jsonRules = {};
    let result = {};
    jsonRules.dtstart = opts.start;

    jsonRules.until = opts.until ?? "";

    if (opts.frecuency != "no-repeat") {
        jsonRules.freq = opts.frecuency;
        jsonRules.interval = parseInt(opts.interval);

        if (opts.frecuency == "weekly" || opts.frecuency == "monthly")
            jsonRules.byweekday = opts.weekDay;

        if (opts.frecuency == "monthly" && opts.numWeek != undefined)
            jsonRules.bysetpos = opts.numWeek;

        result = {
            rrule: jsonRules,
        };
    } else {
        result = {
            start: opts.start,
            end: endDate(opts.end),
        };
    }
    return result;
}
// Mostrar evento
function showEvent(id, fecha) {
    let event = lsEvents.find((e) => e.event.id == id); // Buscar el evento
    // Atributos del evento
    let btn = "";
    let status = "";
    let responsibles = "";
    let btnSendWhatsapp = "";
    let statusUser = "Pendiente";
    let statusEvent = "Pendiente";
    let titulo = event.event.title;
    let dateStart = moment(event.replay.start).format('DD/MM/YYYY');
    let dateEnd = event.replay.end ? moment(event.replay.end).format('DD/MM/YYYY') : "Nunca";
    let color = event.event.color ? event.event.color : "#DDDDDD";
    let nameCreator = event.event.creator ? event.event.creator : "N/A";
    let activities = event.event.activities ? event.event.activities : "";
    let note = event.event.note ? event.event.note : "";
    let udn = jsonUDN.find((u) => u.id == (event.event.idudn || 0)).abreviado;
    let subtittle = event.event.season ? udn + " - " + event.event.season : "";
    let dateUntil = event.replay.until ? event.replay.until : "Nunca";
    let repeat = event.replay.text ? event.replay.text : "No repetir";
    let priority = priorityEvent(event.event.priority);

    if (event) {
        // Definir responsabilidad
        let assigned = false;
        let creator = event.event.idcreator == idUsuario || idA == 36; // ¿Es el creador del evento o dirección?

        // Evaluación de estados de usuario
        if (Object.keys(event.event.assign).length > 0) {
            event.event.assign.forEach((assig) => {
                // ¿El usuario está asignado?
                if (assig.iduser == idUsuario) {
                    assigned = true;
                    // Evaluar el estado del día seleccionado
                    if (assig.estados) {
                        assig.estados.forEach((stado) => {
                            let occDate = stado.ocurrence;
                            if (occDate == fecha) {
                                statusUser = stado.status;
                            }
                        });
                    }
                }
            });
        }

        // Evaluación de estados de evento
        if (event.event.estados && Object.keys(event.event.estados).length > 0) {
            event.event.estados.forEach(stado => {
                if (fecha == stado.ocurrence) {
                    statusEvent = stado.status;
                }
            });
        }

        // Estados de acuerdo a la responsabilidad
        if (assigned === true && creator === false) {
            // SI ES ASIGNADO/ RESPONSABLE

            // Añadir responsables.
            responsibles =
                event.event.assign && event.event.assign.length > 0
                    ? event.event.assign.map((e) => e.nombre).join(", ")
                    : "N/A";

            // Si el evento es cancelado, pausado o revisado, toma en cuenta su estado.
            if (statusEvent != "Pendiente") {
                if (statusEvent === "Cancelado") {
                    status = eventStatus(statusEvent);
                } else if (statusEvent === "Pausado") {
                    status = eventStatus(statusEvent);
                    btn = `
                    <div class="d-flex justify-content-center row">
                        <button class="btn btn-warning col-3" id="btnInProgressAll">🕒Reanudar</button>
                    </div>`;
                } else if (statusEvent === "Revisado") {
                    status = eventStatus(statusEvent);
                }
            } else {
                // Si el evento es pendiente, toma en cuenta el estado del usuario.
                if (statusUser === "Pendiente") {
                    status = userStatus(statusUser);
                    btn = `
                    <div class="d-flex justify-content-center row">
                        <button class="btn btn-info col-3" id="btnInProgress">Iniciar!👋</button>
                    </div>`;
                } else if (statusUser === "En proceso") {
                    status = userStatus(statusUser);
                    btn = `
                    <div class="d-flex justify-content-between row pe-3 ps-3">
                        <button class="btn btn-success col-3" id="btnCompleted">Listo!🥳</button>
                        <button class="btn btn-outline-purple col-3" id="btnPaused">Pausar</button>
                    </div>`;
                } else if (statusUser === "Terminado") {
                    status = userStatus(statusUser);
                } else if (statusUser === "Cancelado") {
                    status = userStatus(statusUser);
                }
            }

        } else if (assigned === false && creator === true) {
            // SI ES CREADOR

            // Añadir responsables.
            let nombres = "";
            event.event.assign.forEach((e) => {
                if (e.estados && e.estados.length > 0) {
                    e.estados.forEach((stado) => {
                        if (stado.ocurrence == fecha) {
                            if (stado.status === "Terminado") {
                                nombres = "✔️" + e.nombre + ", ";
                            } else if (stado.status === "En proceso") {
                                nombres = "🕒" + e.nombre + ", ";
                            } else if (stado.status === "Pendiente") {
                                nombres = e.nombre + ", ";
                            } else if (stado.status === "Cancelado") {
                                nombres = e.nombre + ", ";
                            }
                        } else {
                            nombres = e.nombre + ", ";
                        }
                    });
                    responsibles += nombres;
                } else {
                    responsibles += e.nombre + ", ";
                }
            });

            // Se toma en cuenta el estado del evento.
            if (statusEvent === "Pendiente") {
                status = eventStatus(statusEvent);
                btn = `
                <div class="d-flex justify-content-around row">
                    <button class="btn btn-success col-3" id="btnReviewed">✔️ Revisar</button>
                    <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                    <button class="btn btn-outline-purple col-2" id="btnPaused">Pausar</button>
                    <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                </div>`;
                btnSendWhatsapp = `
                <div class="mb-3 d-flex justify-content-center">
                    <button class="btn btn-outline-success" id="btnWhatsApp"><i class="icon-whatsapp"></i>Enviar</button>
                </div>`;
            } else if (statusEvent === "Revisado") {
                status = eventStatus(statusEvent);
            } else if (statusEvent === "Pausado") {
                status = eventStatus(statusEvent);
                btn = `
                <div class="d-flex justify-content-around row">
                    <button class="btn btn-warning col-3" id="btnInProgressAll">🕒Reanudar</button>
                    <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                    <button class="btn btn-outline-danger col-3" id="btnDelete"><i class='icon-trash'></i>Eliminar</button>
                    <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                </div>`;
            } else if (statusEvent === "Cancelado") {
                status = eventStatus(statusEvent);
            }

        } else if (assigned === true && creator === true) {
            // SI ES ASIGNADO Y CREADOR

            // Añadir responsables.
            let nombres = "";
            event.event.assign.forEach((e) => {
                if (e.estados && e.estados.length > 0) {
                    e.estados.forEach((stado) => {
                        if (stado.ocurrence == fecha) {
                            if (stado.status === "Terminado") {
                                nombres = "✔️" + e.nombre + ", ";
                            } else if (stado.status === "En proceso") {
                                nombres = "🕒" + e.nombre + ", ";
                            } else if (stado.status === "Pendiente") {
                                nombres = e.nombre + ", ";
                            } else if (stado.status === "Cancelado") {
                                nombres = e.nombre + ", ";
                            }
                        } else {
                            nombres = e.nombre + ", ";
                        }
                    });
                    responsibles += nombres;
                } else {
                    responsibles += e.nombre + ", ";
                }
            });

            // Si es pendiente, toma en cuenta el estado del usuario
            if (statusEvent === "Pendiente") {
                if (statusUser === "Pendiente") {
                    status = userStatus(statusUser);
                    btn = `
                    <div class="d-flex justify-content-around row">
                        <button class="btn btn-info col-3" id="btnInProgress">Iniciar👋</button>
                        <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                        <button class="btn btn-outline-purple col-2" id="btnPaused">Pausar</button>
                        <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                    </div>`;
                    btnSendWhatsapp = `
                    <div class="mb-3 d-flex justify-content-center">
                        <button class="btn btn-outline-success" id="btnWhatsApp"><i class="icon-whatsapp"></i>Enviar</button>
                    </div>`;
                } else if (statusUser === "En proceso") {
                    status = userStatus(statusUser);
                    btn = `
                    <div class="d-flex justify-content-around row">
                        <button class="btn btn-success col-3" id="btnCompleted">Listo!🥳</button>
                        <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                        <button class="btn btn-outline-purple col-2" id="btnPaused">Pausar</button>
                        <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                    </div>`;
                    btnSendWhatsapp = `
                    <div class="mb-3 d-flex justify-content-center">
                        <button class="btn btn-outline-success" id="btnWhatsApp"><i class="icon-whatsapp"></i>Enviar</button>
                    </div>`;
                } else if (statusUser === "Terminado") {
                    status = userStatus(statusUser);
                    btn = `
                     <div class="d-flex justify-content-around row">
                        <button class="btn btn-success col-3" id="btnReviewed">✔️Revisar</button>
                        <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                        <button class="btn btn-outline-purple col-2" id="btnPaused">Pausar</button>
                        <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                    </div>`;
                    btnSendWhatsapp = `
                    <div class="mb-3 d-flex justify-content-center">
                        <button class="btn btn-outline-success" id="btnWhatsApp"><i class="icon-whatsapp"></i>Enviar</button>
                    </div>`;
                } else if (statusUser === "Cancelado") {
                    status = userStatus(statusUser);
                }

                // Si es revisado, pausado o cancelado, toma en cuenta el estado del evento
            } else if (statusEvent === "Revisado") {
                status = eventStatus(statusEvent);
            } else if (statusEvent === "Pausado") {
                status = eventStatus(statusEvent);
                btn = `
                <div class="d-flex justify-content-around row">
                    <button class="btn btn-warning col-3" id="btnInProgressAll">🕒Reanudar</button>
                    <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                    <button class="btn btn-outline-danger col-3" id="btnDelete"><i class='icon-trash'></i>Eliminar</button>
                    <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                </div>`;
            } else if (statusEvent === "Cancelado") {
                status = eventStatus(statusEvent);
            }
        }
    }

    // Mostrar modal
    bootbox
        .dialog({
            title: `<div>
                  <h5><i class="icon-blank" style="color: ${color}"></i>${titulo}</h5>
                  <p class="fs-6 text-muted mb-0">${subtittle}</p>
              </div>`,
            closeButton: true,
            message: `
                  <div class="mb-3">
                     <strong><i class="icon-users-2"></i> Asignado(s):</strong>
                     ${responsibles}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-spinner"></i> Estado:</strong>
                     ${status}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-angle-circled-down"></i>Prioridad:</strong>
                     ${priority}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-calendar"></i> Periodo:</strong>
                     ${dateStart ? dateStart : "N/A"} - ${dateEnd ? dateEnd : "N/A"}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-arrows-cw"></i> Repetición:</strong>
                     ${repeat}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-clock"></i> Repetir hasta:</strong>
                     ${dateUntil}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-user-5"></i> Creador:</strong>
                     ${nameCreator}
                 </div>
                    ${btnSendWhatsapp}
                 <hr>
                 <strong>Actividades:</strong>
                 <p>
                     ${activities}
                 </p>
                 <div class="card-footer text-body-secondary mb-3">
                     Notas: ${note}
                 </div>
                 <div class="">
                     ${btn}
                 </div>
                    `,
        })
        .on("shown.bs.modal", function () {
            setEventsButtonsModal(id, fecha);
        });
}
// Establecer eventos de botones de showEvent
function setEventsButtonsModal(id, selectedDate) {
    // EDITAR, ELIMINAR Y ENVIAR WHATSAPP
    $("#btnEdited").on("click", function () {
        editEventModal(id, selectedDate);
    });

    $("#btnDelete").on("click", function () {
        deleteEvent(id);
    });

    $("#btnWhatsApp").on("click", function () {
        sendWhatsapp(id);
    });

    // ESTADOS EVENTO
    $("#btnCancelled").on("click", function () {
        alert({
            icon: "question",
            title: "Cancelar Evento",
            text: "¿Estás seguro de cancelar el evento?",
        }).then((result) => {
            if (result.isConfirmed) {
                updateOrCreateStatusEvent(
                    id,
                    5,
                    "Cancelado",
                    selectedDate,
                    "Evento Cancelado 🚫",
                    "El evento ha sido cancelado correctamente"
                );
            }
        });
    });

    $("#btnReviewed").on("click", function () {
        updateOrCreateStatusEvent(
            id,
            6,
            "Revisado",
            selectedDate,
            "Evento Finalizado 🎊✨",
            "El evento ha sido revisado correctamente"
        );
    });

    $("#btnPaused").on("click", function () {
        alert({
            icon: "question",
            title: "¿Estás seguro de Pausar el evento para TODOS los involucrados?",
            // text: "¿Estás seguro de cancelar el evento?",
        }).then((result) => {
            if (result.isConfirmed) {
                updateOrCreateStatusEvent(
                    id,
                    4,
                    "Pausado",
                    selectedDate,
                    "Evento Pausado 🤚",
                    "El evento ha sido pausado correctamente"
                );
            }
        });
    });

    $("#btnInProgressAll").on("click", function () {
        updateOrCreateStatusEvent(
            id,
            1,
            "Pendiente",
            selectedDate,
            "Evento Reanudado ✨",
            "El evento ha sido reanudado correctamente"
        );
    });

    // ESTADOS USUARIO
    $("#btnInProgress").on("click", function () {
        updateOrCreateStatusUser(
            id,
            2,
            "En proceso",
            selectedDate,
            "Evento en Proceso",
            "Es hora de trabajar. ¡Vamos! 💪🚀"
        );
    });

    $("#btnCompleted").on("click", function () {
        updateOrCreateStatusUser(
            id,
            3,
            "Terminado",
            selectedDate,
            "¡Evento Completado! 🎉",
            "¡Has hecho un trabajo excelente! Sigue así. 💪👏"
        );
    });
}
// Actualizar o crear estado de evento en FullCalendar
function setStatusEvent(idEvent, idEventStatus, idStatus, status, selectedDate) {
    // Variables
    let dateFound = false;
    let today = moment().format('YYYY-MM-DD');
    let event = lsEvents.find((e) => e.event.id == idEvent);

    // Verifica si existe un estado para la fecha seleccionada
    if (event.event.estados && Object.keys(event.event.estados).length > 0) {
        event.event.estados.forEach((stado) => {
            if (stado.ocurrence == selectedDate) {
                dateFound = true;
            }
        });
    }

    if (!dateFound) {
        // Crea un nuevo estado
        event.event.estados.push({
            id: idEventStatus,
            idstatus: idStatus,
            status: status,
            ocurrence: selectedDate,
            finished: today
        });

    } else {
        // Actualiza el estado
        event.event.estados.forEach((stado) => {
            if (stado.ocurrence == selectedDate) {
                stado.idstatus = idStatus,
                    stado.status = status,
                    stado.finished = today;
            }
        });
    }

    fullCalendar();
    bootbox.hideAll();
}
// Actualizar o crear estado de usuario en FullCalendar
function setStatusUser(idEvent, idUser, idEventStatus, idStatus, status, selectedDate) {
    // Variables
    let dateFound = false;
    let today = moment().format('YYYY-MM-DD');
    let event = lsEvents.find((e) => e.event.id == idEvent);

    // Verifica si existe un estado para la fecha seleccionada
    if (event.event.assign && event.event.assign.length > 0) {
        event.event.assign.forEach((e) => {
            if (e.estados && e.estados.length > 0) {
                e.estados.forEach((stado) => {
                    if (stado.ocurrence == selectedDate) {
                        dateFound = true;
                    }
                });
            }
        });
    }

    if (!dateFound) {
        // Crea un nuevo estado
        event.event.assign.forEach((e) => {
            if (e.iduser == idUser) {
                if (!e.estados) e.estados = [];
                e.estados.push({
                    id: idEventStatus,
                    idstatus: idStatus,
                    status: status,
                    ocurrence: selectedDate,
                    initiation: today
                });
            }
        });

    } else {
        // Actualiza el estado
        event.event.assign.forEach((e) => {
            if (e.iduser == idUser) {
                if (e.estados && e.estados.length > 0) {
                    e.estados.forEach((stado) => {
                        if (stado.ocurrence == selectedDate) {
                            stado.idstatus = idStatus,
                                stado.status = status,
                                stado.initiation = today;
                        }
                    });
                }
            }
        });
    }

    fullCalendar();
    bootbox.hideAll();
}


//? CUD EVENTOS -----------------------------------------
// Crear evento
function createEvent(datos) {
    // Valores Replay
    let text = "";
    let weekDay = "";
    let numWeek = "";
    let until = "";
    let interval = "";

    // Valores Evento
    let custom = 0;
    let frecuency = "";
    let duration = "";
    let titulo = $("#evento").val();
    let color = $("#circleBTN").attr("data-color");
    let replay = $("#modalcbRepeat").val();
    let udn = $("#modalcbUDN").val();
    let priority = $("#modalcbPrioridad").val();
    let actividades = $("#actividades").val();
    let nota = $("#notasadicionales").val();
    let creator = jsonResponsible.filter((e) => e.iduser == idUsuario)[0].nombre;
    let temporada = $("#modalcbTemporada").val();
    let category = $("#modalcbCategory").val();
    let fechaInicio = $("#fechainicial").val();
    let fechaTermino = moment($("#fechafinal").val()).format("YYYY-MM-DD");
    let priorityText = $("#modalcbPrioridad option:selected").text();
    priorityText = priorityText.substring(2, priorityText.length);
    let temporadaText = $("#modalcbTemporada option:selected").text().toUpperCase();
    let responsable = $("#modalcbResponsable option:selected")
        .map(function () {
            return {
                id: parseInt($(this).val()),
                nombre: jsonResponsible.filter(
                    (e) => e.id == parseInt($(this).val())
                )[0].nombre,
                idstatus: 1,
                status: "Pendiente",
                telefono: jsonResponsible.filter(
                    (e) => e.id == parseInt($(this).val())
                )[0].telefono,
                idudn: jsonResponsible.filter((e) => e.id == parseInt($(this).val()))[0]
                    .idudn,
                iduser: jsonResponsible.filter(
                    (e) => e.id == parseInt($(this).val())
                )[0].iduser,
                idarea: jsonResponsible.filter(
                    (e) => e.id == parseInt($(this).val())
                )[0].idarea,
            };
        })
        .get();

    // Obtener valores del modal de repetición
    if (Object.keys(datos).length > 0 || datos.length > 0) {
        text = datos.text;
        custom = 1;
        duration = restarFechas(fechaInicio, fechaTermino);

        if (
            datos.until &&
            datos.until.trim() !== "" &&
            datos.until.trim() !== "Invalid date"
        ) {
            until = moment(datos.until).format("YYYY-MM-DD");
        } else {
            until = "";
        }

        if (datos.frecuency) {
            frecuency = jsonReplay.filter(
                (e) => e.id == parseInt(datos.idfrecuency)
            )[0].frecuency;
            replay = datos.idfrecuency;
        }
        interval = datos.interval || interval;
        weekDay = datos.weekDay || weekDay;
        numWeek = datos.numWeek || numWeek;
    } else {
        interval = 1;
        frecuency = jsonReplay.filter((e) => e.id == replay)[0].frecuency;
    }

    // Crear JSON para rrules
    let jsonreapeat = {};
    jsonreapeat = {
        start: fechaInicio,
        end: fechaTermino,
        idfrecuency: replay,
        frecuency: frecuency,
        interval: parseInt(interval),
        until: until || '',
        ...(weekDay.length > 0 && { weekDay }),
        ...(numWeek && { numWeek }),
        text: text,
    };


    // Crear JSON para fn_ajax
    let formDatos = {
        opc: "createEvent",
        usr_creator: idUsuario,
        title: titulo,
        id_Priority: priority,
        id_Replay: replay,
        id_Season: temporada,
        id_UDN: udn == "0" ? null : udn,
        note: nota,
        date_start: fechaInicio,
        date_end: fechaTermino,
        color: color,
        custom: custom,
        activities: actividades,
        intervalo: interval,
        weekDay: weekDay != "" ? JSON.stringify(weekDay) : "",
        numWeek: numWeek,
        text: text,
        persons: responsable,
        duration: duration,
        categoria: category,
        until: until,
    };

    fn_ajax(formDatos, ctrlactividades).then((data) => {
        //Crear JSON
        let event = [
            {
                event: {
                    id: data.id,
                    title: titulo,
                    color: color,
                    custom: custom,
                    idudn: udn,
                    udn: jsonUDN.filter((e) => e.id == udn)[0].valor,
                    idpriority: priority,
                    priority: priorityText,
                    idseason: temporada,
                    season: temporadaText,
                    activities: actividades,
                    note: nota,
                    idcreator: idUsuario,
                    creator: creator,
                    assign: responsable,
                    duration: { "days": + duration },
                    idcategory: category,
                    estados: [],
                },
                replay: jsonreapeat,
            },
        ];
        if (data.status == 200) {
            alert({
                icon: "success",
                title: "Correcto",
                text: data.message,
            });
            lsEvents.push(event[0]);

            // Agregar evento al calendario
            event = createJsonEvents(event);
            calendar.addEvent(event[0]);

            $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
            bootbox.hideAll();
        } else {
            alert({
                icon: "error",
                title: "Error",
                text: data.message,
                btn1: "Aceptar",
            });
            $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
        }
    });
}
// Actualizar evento
function updateEvent(id, datos, selectedDate) {
    let event = lsEvents.filter((e) => e.event.id == id)[0].event;
    // Valores Replay
    let text = "";
    let weekDay = "";
    let numWeek = "";
    let until = "";
    let interval = "";

    // Valores Evento
    let custom = 0;
    let frecuency = "";
    let duration = "";
    let titulo = $("#evento").val();
    let color = $("#circleBTN").attr("data-color");
    // let color = $("#circleBTN").attr("data-color") || event.color;
    let replay = $("#modalcbRepeat").val();
    let udn = $("#modalcbUDN").val();
    let priority = $("#modalcbPrioridad").val();
    let actividades = $("#actividades").val();
    let nota = $("#notasadicionales").val();
    let creator = jsonResponsible.filter((e) => e.iduser == idUsuario)[0].nombre;
    let temporada = $("#modalcbTemporada").val();
    let category = $("#modalcbCategory").val();
    let fechaInicio = $("#fechainicial").val();
    let fechaTermino = moment($("#fechafinal").val()).format("YYYY-MM-DD");
    let priorityText = $("#modalcbPrioridad option:selected").text();
    priorityText = priorityText.substring(2, priorityText.length);
    let temporadaText = $("#modalcbTemporada option:selected").text().toUpperCase();

    let responsable = $("#modalcbResponsable option:selected")
        .map(function () {
            if (event.assign.filter((e) => e.id == parseInt($(this).val())).length > 0) {
                return {
                    id: parseInt($(this).val()),
                    nombre: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].nombre,
                    telefono: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].telefono,
                    idudn: jsonResponsible.filter((e) => e.id == parseInt($(this).val()))[0]
                        .idudn,
                    iduser: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].iduser,
                    idarea: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].idarea,
                    estados: event.assign.filter((e) => e.id == parseInt($(this).val()))[0].estados,
                };
            } else {
                return {
                    id: parseInt($(this).val()),
                    nombre: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].nombre,
                    telefono: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].telefono,
                    idudn: jsonResponsible.filter((e) => e.id == parseInt($(this).val()))[0]
                        .idudn,
                    iduser: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].iduser,
                    idarea: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].idarea,
                    estados: [],
                    // estados: event.assign.filter((e) => e.id == parseInt($(this).val()))[0].estados,
                };
            }
        })
        .get();

    // Obtener valores del modal de repetición
    if (Object.keys(datos).length > 0 || datos.length > 0) {
        text = datos.text;
        custom = 1;
        duration = restarFechas(fechaInicio, fechaTermino);

        if (
            datos.until &&
            datos.until.trim() !== "" &&
            datos.until.trim() !== "Invalid date"
        ) {
            until = moment(datos.until).format("YYYY-MM-DD");
        } else {
            until = "";
        }

        if (datos.frecuency) {
            frecuency = jsonReplay.filter(
                (e) => e.id == parseInt(datos.idfrecuency)
            )[0].frecuency;
            replay = datos.idfrecuency;
        }

        interval = datos.interval || interval;
        weekDay = datos.weekDay || weekDay;
        numWeek = datos.numWeek || numWeek;
    } else {
        interval = 1;
        frecuency = jsonReplay.filter((e) => e.id == replay)[0].frecuency;
    }

    // Crear JSON para rrules
    let jsonreapeat = {};
    jsonreapeat = {
        start: fechaInicio,
        end: fechaTermino,
        idfrecuency: replay,
        frecuency: frecuency,
        interval: parseInt(interval),
        until: until || '',
        ...(weekDay.length > 0 && { weekDay }),
        ...(numWeek && { numWeek }),
        text: text,
    };

    // Obtener responsables que estaban y los nuevos
    let personasQueEstaban = lsEvents.filter((e) => e.event.id == id)[0].event.assign;
    let personasActuales = responsable;
    let personasNuevas = [];
    let personasEliminadas = [];

    personasQueEstaban.forEach((e) => {
        let existe = personasActuales.filter((p) => p.id == e.id);
        if (existe.length == 0) {
            personasEliminadas.push(e);
        }
    });
    personasActuales.forEach((e) => {
        let existe = personasQueEstaban.filter((p) => p.id == e.id);
        if (existe.length == 0) {
            personasNuevas.push(e);
        }
    });

    // Crear JSON para enviar
    let formDatos = {
        opc: "updateEvent",
        usr_creator: idUsuario,
        title: titulo,
        id_Priority: priority,
        id_Replay: replay,
        id_Season: temporada,
        id_UDN: udn == "0" ? null : udn,
        note: nota,
        date_start: fechaInicio,
        date_end: fechaTermino,
        color: color,
        custom: custom,
        activities: actividades,
        intervalo: interval,
        weekDay: weekDay != "" ? JSON.stringify(weekDay) : "",
        numWeek: numWeek,
        categoria: category,
        text: text,
        duration: duration,
        until: until,
        idEvent: id,
        newPersons: personasNuevas,
        deletePersons: personasEliminadas,
    };

    // Enviar petición
    $.ajax({
        type: "POST",
        url: ctrlactividades,
        data: formDatos,
        dataType: "json",

        // Antes de enviar la petición
        beforeSend: () => {
            Swal.fire({
                title: "Cargando...",
                html: `Por favor, espera mientras procesamos tu solicitud.😅😉`,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        },

        // Si la petición es correcta
        success: (data) => {
            if (data.status == 200) {
                alert({
                    icon: "success",
                    title: "Correcto",
                    text: data.message,
                });
                // Actualizar evento en fullCalendar
                lsEvents.forEach((e) => {
                    if (e.event.id == id) {
                        e.event.title = titulo;
                        e.event.color = color;
                        e.event.custom = custom;
                        e.replay = jsonreapeat;
                        e.event.idudn = idudn;
                        e.event.udn = udn;
                        e.event.idpriority = priority;
                        e.event.priority = priorityText;
                        e.event.idseason = idseason;
                        e.event.season = temporadaText;
                        e.event.activities = actividades;
                        e.event.note = nota;
                        e.event.idcreator = idUsuario;
                        e.event.creator = creator;
                        e.event.assign = responsable;
                        e.event.idcategory = category;
                        e.event.duration = { "days": + duration };
                    }
                });

                $("#formNuevoEvento button[type='submit']").removeAttr("disabled");

                fullCalendar();
                bootbox.hideAll();
                setTimeout(() => {
                    showEvent(id, selectedDate);
                }, 1000);
            } else {
                alert({
                    icon: "error",
                    title: "Error",
                    text: data.message,
                    btn1: "Aceptar",
                });
                $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
            }
        },

        // Si la petición es incorrecta
        error: function (xhr, status, error) {
            swal_error(xhr, status, error);
        },
    });
}
// Eliminar evento
function deleteEvent(id) {
    alert({
        icon: "question",
        title: "¿Estás seguro de eliminar este evento?",
        text: "Una vez eliminado, no podrás recuperar este evento, ni sus repeticiones",
    }).then((result) => {
        if (result.isConfirmed) {
            fn_ajax({ opc: "deleteEvent", id: id }, ctrlactividades).then((data) => {
                if (data.status == 200) {
                    // Eliminar evento
                    let index = lsEvents.findIndex((e) => e.event.id === id);
                    lsEvents.splice(index, 1);
                    alert({
                        icon: "success",
                        title: "Evento Eliminado",
                        text: data.message,
                        timer: 1000,
                    });
                    tbEventos(lsEvents).then(() => {
                        lsEvents.forEach((e) => dropdownCalendar(e.event.id));
                    });
                    fullCalendar();
                    bootbox.hideAll();
                } else {
                    alert({
                        icon: "error",
                        title: "Error",
                        text: data.message,
                        btn1: "Aceptar",
                    });
                }
            });
        }
    });
}
// Actualizar o Crear estado de evento
function updateOrCreateStatusEvent(id, idStatus, status, dateOcurrence, title, text) {
    // Datos para fn_ajax
    let formDatos = {
        opc: "updateOrCreateEventStatus",
        id_Status: idStatus,
        date_finished: today(),
        id_Event: id,
        date_ocurrence: dateOcurrence,
    };

    fn_ajax(formDatos, ctrlactividades).then((data) => {
        if (data.status == 200) {
            alert({
                icon: "success",
                title: title,
                text: text,
                timer: 1500,
            });

            setStatusEvent(id, data.id, idStatus, status, dateOcurrence);

        } else {
            alert({
                icon: "error",
                title: "Error",
                text: data.message,
                btn1: "Aceptar",
            });
        }
    });
}
// Actualizar o Crear estado de usuario
function updateOrCreateStatusUser(id, idStatus, status, dateOcurrence, title, text) {
    let idEmploye = jsonResponsibleAll.filter((e) => e.iduser == idUsuario)[0].id;

    // Datos para fn_ajax
    let formDatos = {
        opc: "updateOrCreatePeopleStatus",
        id_Status: idStatus,
        id_User: idUsuario,
        id_Employe: idEmploye,
        ...(idStatus == 2 ? { date_initiation: today() } : idStatus == 3 ? { date_finished: today() } : {}),
        id_Event: id,
        date_ocurrence: dateOcurrence,
    };

    fn_ajax(formDatos, ctrlactividades).then((data) => {
        if (data.status == 200) {
            alert({
                icon: "success",
                title: title,
                text: text,
                timer: 1500,
            });

            setStatusUser(id, idUsuario, data.id, idStatus, status, dateOcurrence);

        } else {
            alert({
                icon: "error",
                title: "Error",
                text: data.message,
                btn1: "Aceptar",
            });
        }
    });
}


//? SIMULACIÓN DE EVENTOS ------------------------------
// Simular evento
function elementsEventModalSimulation() {
    col6 = { div: { class: "col-12 col-lg-6 mb-3" } };
    col4 = { div: { class: "col-12 col-lg-4 mb-3" } };
    col12 = { div: { class: "col-12 mb-3" } };
    let formulario = [];

    formulario = [
        {
            div: { class: "col-10 mb-3" },
            lbl: "Evento",
            id: "evento",
            placeholder: "Agregar título",
            required: true,
        },
        {
            div: { class: "col-2 mb-3" },
            elemento: "color_menu",
            colores: { col: 2 },
        },
        {
            ...col4,
            lbl: "Fecha inicial",
            id: "fechainicial",
            elemento: "input",
            type: "date",
            icon: '<i class="icon-calendar"></i>',
            pos: "right",
            required: true,
        },
        {
            ...col4,
            lbl: "Fecha final",
            id: "fechafinal",
            elemento: "input",
            type: "date",
            icon: '<i class="icon-calendar"></i>',
            pos: "right",
            required: true,
        },
        {
            ...col4,
            lbl: "Repetir evento",
            id: "modalcbRepeat",
            icon: '<i class="icon-arrows-cw"></i>',
            elemento: "select-group",
            pos: "right",
            required: true,
            option: {
                data: [
                    {
                        "id": "1",
                        "valor": "No repetir",
                        "frecuency": "no-repeat"
                    },
                    {
                        "id": "6",
                        "valor": "Personalizado",
                        "frecuency": "custom"
                    },
                ], // El ing Leo me dijo que borrara el resto de las opciones, sin embargo, sigo requiriendo jsonReplay.
                placeholder: "Selecciona una opción",
            },
        },
        {
            ...col6,
            lbl: "Prioridad",
            id: "modalcbPrioridad",
            elemento: "select-group",
            required: true,
            icon: '<i class="icon-angle-circled-down"></i>',
            option: {
                data: jsonPriority,
                placeholder: "Selecciona una opción",
            },
            pos: "left",
            required: true,
        },
        {
            ...col6,
            lbl: "Unidad de negocio",
            id: "modalcbUDN",
            elemento: "select",
            option: { data: jsonUDN },
        },
        {
            ...col6,
            lbl: "Categoria",
            elemento: "select-group",
            icon: '<i class="icon-plus"></i>',
            id: "modalcbTemporada",
            span: {
                class: "btn btn-outline-success",
                id: "spanPlusSeason",
                onclick: "addSeasonModalSimulation();",
            },
            option: {
                data: jsonSeason,
                placeholder: "Selecciona una opción",
            },
            pos: "left",
            required: true,
        },
        {
            ...col6,
            lbl: "Tipo de evento",
            id: "modalcbCategory",
            elemento: "select",
            pos: "right",
            required: true,
            option: { data: jsonCategory },
        },
        {
            ...col12,
            lbl: "Responsable(s)",
            id: "modalcbResponsable",
            elemento: "select-group",
            icon: '<i class="icon-users-2"></i>',
            pos: "left",
            multiple: true,
            required: true,
            option: {
                data: jsonResponsible,
                placeholder: "Selecciona una opción",
                select2: true,
                group: true,
            },
        },
        {
            ...col12,
            lbl: "Actividades",
            elemento: "textarea",
            placeholder: "Agregar actividades",
            id: "actividades",
            required: true,
        },
        {
            ...col12,
            lbl: "Notas adicionales",
            id: "notasadicionales",
            placeholder: "Agregar nota",
            elemento: "textarea",
        },
        { elemento: "modal_button" },
    ];

    return formulario;
}
// Agregar evento simulado
function addEventModalSimulation() {
    let form = $("<form>", {
        novalidate: true,
        class: "row",
        id: "formNuevoEvento",
    });

    form.create_elements(elementsEventModalSimulation());

    // Modal
    bootbox.dialog({
        title: `
                <span class="text-gradient fs-4 fw-bold">SIMULACIÓN DE UN NUEVO EVENTO</span>🪄
            `,
        size: "large",
        message: form,
        closeButton: true,
    }).on("shown.bs.modal", function () {
        // Cambiar tamaño de textarea
        $('#actividades').attr('rows', 5);
        $('#notasadicionales').attr('rows', 3);

        // Tutorial de la simulación
        if (localStorage.getItem('dontShowAgainAddSimulation') != 1) {
            let newEventGuide = [];
            newEventGuide = [
                {
                    title: "Bienvenido a la simulación🪄",
                    intro: "¡Aquí puedes simular agregar un nuevo evento al calendario, sin guardarlo realmente!😉",
                },
                {
                    element: $("#btnCircleColors")[0],
                    title: "Colores",
                    intro: "Aquí puedes seleccionar el color del evento.",
                },
                {
                    element: $("#fechainicial")[0],
                    title: "Fecha Inicial",
                    intro: "Aquí puedes seleccionar la fecha de inicio del evento.",
                },
                {
                    element: $("#fechafinal")[0],
                    title: "Fecha Final",
                    intro: "Intenta jugar con la fecha de inicio y la fecha de término👀☝️.",
                },
                {
                    element: $("#modalcbRepeat")[0],
                    title: "Repetir Evento",
                    intro: "Intenta crear un evento que no se repita y uno de repetición personalizada.🙆‍♀️",
                },
                {
                    element: $("#modalcbPrioridad")[0],
                    title: "Prioridad",
                    intro: "Aquí puedes seleccionar la prioridad del evento.",
                },
                {
                    element: $("#spanPlusSeason")[0],
                    title: "Agregar Categoría",
                    intro: "Aquí puedes agregar una nueva categoría.",
                },
                {
                    element: $("#modalcbCategory")[0],
                    title: "Tipo de evento",
                    intro: "Hay dos tipos de evento: Corporativo y Personal. Los eventos corporativos son visibles para Dirección.",
                },
                {
                    element: $(".icon-users-2")[0],
                    title: "Responsable(s)",
                    intro: "Esta es una simulación, por lo que no se enviará ninguna notificación a los responsables.📲🤐",
                },
                {
                    element: $(".btn.btn-primary.col-5")[0],
                    title: "¡Listo!",
                    intro: `¡Ahora intenta crear tu primera simulación!🎉😀 <br><br> <p><label class='fw-bold'><input type="checkbox" id="dontShowAgain"> No volver a mostrar</label></p>`,
                },

            ];

            introJs()
                .setOptions({
                    exitOnOverlayClick: false,
                    steps: newEventGuide,
                }).oncomplete(
                    function () {
                        if ($('#dontShowAgain').is(':checked')) {
                            localStorage.setItem('dontShowAgainAddSimulation', 1);
                        }
                    }
                ).start();
        }

        // Inicializamos el color form
        color = new Colors();
        color.open();

        // Renderizar selects
        $("#modalcbPrioridad").option_select({
            father: true,
            group: true,
        });

        $("#modalcbTemporada").option_select({
            select2: true,
            father: true,
            group: true,
        });

        // Asignar valores por defecto
        $('#modalcbTemporada').val(1).trigger('change');
        $('#modalcbPrioridad').val(3).trigger('change');

        // Cambiar a mayúsculas
        $("#evento").on("input", function () {
            let upperCaseValue = $(this).val().toUpperCase();
            $(this).val(upperCaseValue);
        });

        // Select repetición
        $("#modalcbRepeat").on("change", function () {
            let selectedValue = $(this).val();
            $("#fechafinal").prop("disabled", false);
            // Si es personalizado
            if (selectedValue == 6) {
                if ($("#fechainicial").val() == "") {
                    alert({
                        icon: "error",
                        title: "Error en la fecha",
                        text: "Debes seleccionar una fecha de inicio",
                        btn1: "Aceptar",
                    });
                    $("#modalcbRepeat").val("1").trigger("change");
                    return false;
                }
                repeatCustomModal(opts).then((datos) => {
                    opts = Object.assign({}, datos);
                });
            } else if (selectedValue != "custom") {
                // Si no es personalizado se limpian los datos
                opts = [];
                if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                    $("#modalcbRepeat").find('option[value="custom"]').remove();
                }
            }
        });

        // Cambiar la descripción del option custom
        $("#fechainicial").on("change", function () {
            // Si hay una opción custom
            if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                // Si es mensual
                if (opts.idfrecuency === "4") {
                    // Cambiar la descripción
                    let fecha = $(this).val();
                    let dayOfMonth = getDayOfMonth(fecha);
                    let dayOfWeek = getDayOfWeek(fecha);
                    let interval = opts.interval;
                    let text = "";

                    if (interval > 1) {
                        text = `Cada ${interval} meses`;
                    } else {
                        text = `Cada mes`;
                    }
                    let mes = "";
                    if (opts.numWeek === 1) {
                        mes = `el primer ${dayOfWeek}`;
                    } else if (opts.numWeek === -1) {
                        mes = `el último ${dayOfWeek}`;
                    } else {
                        mes = `el día ${dayOfMonth}`;
                    }
                    if (opts.end != "") {
                        text = `${text} ${mes} hasta el ${opts.end}`;
                    } else {
                        text = `${text} ${mes}`;
                    }

                    // Cambiar el texto del option custom
                    $("#modalcbRepeat")
                        .find('option[value="custom"]')
                        .text(text)
                        .val("custom");
                }
            }
        });

        // Eliminar opción por defecto ´- Seleccionar -´
        $("#modalcbUDN option")
            .filter(function () {
                return $(this).val() === "0" && $(this).text() === "- Seleccionar -";
            })
            .remove();

        $("#modalcbUDN").on("change", function () {
            let udn = $(this).val();
            filtrarResponsables(udn).then((jsonResponsible) => {
                $("#modalcbResponsable").empty();
                $("#modalcbResponsable").option_select({
                    data: jsonResponsible,
                    placeholder: "Selecciona una opción",
                    select2: true,
                    father: true,
                    group: true,
                });
            });
        });

        // Asignar valores por defecto
        $("#fechainicial").val(today());
        $("#fechafinal").val(today());
        $("#modalcbRepeat").val("1").trigger("change");
        $("#modalcbUDN").val($("#cbUDN").val()).trigger("change");

        // Validar formulario
        form.validation_form({}, () => {
            let fechaInicio = $("#fechainicial").val();
            let fechaTermino = $("#fechafinal").val();
            let startDate = new Date(fechaInicio);
            let endDate = new Date(fechaTermino);
            let title = $("#evento").val();

            let eventoCreado = false;
            lsEvents.forEach((e) => {
                if (e.event.title == title) {
                    alert({
                        icon: "error",
                        title: "Error al agregar",
                        text: "El evento ya existe",
                        btn1: "Aceptar",
                    });
                    $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
                    eventoCreado = true;
                }
            });
            if (!eventoCreado) {
                // Validar si fechaInicial es menor que fechaFinal
                if (startDate > endDate) {
                    alert({
                        icon: "error",
                        title: "Error en la fecha",
                        text: "La fecha de inicio no puede ser mayor a la fecha de término",
                        btn1: "Aceptar",
                    });
                    $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
                    return false;
                } else {
                    form.find("button[type='submit']").attr("disabled", "disabled");
                    createEventSimulation(opts);
                }
            } else {
                return false;
            }
        });
    });
}
// Editar evento simulado
function editEventModalSimulation(id, selectedDate) {
    // Crear formulario
    let form = $("<form>", {
        novalidate: true,
        class: "row",
        id: "formNuevoEvento"
    });

    form.create_elements(elementsEventModalSimulation());
    let opts = [];

    // Modal
    bootbox
        .dialog({
            title: "EDITAR EVENTO",
            size: "large",
            message: form,
            closeButton: true,
        })
        .on("shown.bs.modal", function () {
            // Inicializamos el color form
            color = new Colors();
            color.open();


            // Renderizar selects
            $("#modalcbPrioridad").option_select({
                father: true,
                group: true,
            });
            $("#modalcbTemporada").option_select({
                select2: true,
                father: true,
                group: true,
            });

            // Cambiar a mayúsculas
            $("#evento").on("input", function () {
                let upperCaseValue = $(this).val().toUpperCase();
                $(this).val(upperCaseValue);
            });

            // Eliminar opción por defecto ´- Seleccionar -´
            $("#modalcbUDN option")
                .filter(function () {
                    return $(this).val() === "0" && $(this).text() === "- Seleccionar -";
                })
                .remove();

            // Cambiar jsonResponsible
            $("#modalcbUDN").on("change", function () {
                let udn = $(this).val();
                filtrarResponsables(udn).then((jsonResponsible) => {
                    $("#modalcbResponsable").empty();
                    $("#modalcbResponsable").option_select({
                        data: jsonResponsible,
                        placeholder: "Selecciona una opción",
                        select2: true,
                        group: true,
                    });
                    $("#modalcbResponsable")
                        .val(
                            lsEvents
                                .filter((e) => e.event.id == id)[0]
                                .event.assign.map((e) => e.id)
                        )
                        .trigger("change");
                });
            });

            // Asignar valores por defecto
            $("#evento").val(lsEvents.filter((e) => e.event.id == id)[0].event.title);


            const colorUsed = lsEvents.filter((e) => e.event.id == id)[0].event.color;

            $("#circleBTN").css(
                "background-color",
                colorUsed
            ).attr('data-color', colorUsed);

            $('#circleMenu').find('.icon-ok').addClass('hide');
            $('#circleMenu').find('[data-color="' + colorUsed + '"]').find('.icon-ok').removeClass('hide');

            $("#modalcbTemporada")
                .val(lsEvents.filter((e) => e.event.id == id)[0].event.idseason)
                .trigger("change");
            $("#modalcbUDN")
                .val(lsEvents.filter((e) => e.event.id == id)[0].event.idudn)
                .trigger("change");
            if (
                lsEvents.filter((e) => e.event.id == id)[0].event.idudn == 0 ||
                lsEvents.filter((e) => e.event.id == id)[0].event.idudn == null
            ) {
                $("#modalcbUDN").val(0).trigger("change");
            }
            $("#fechainicial").val(
                lsEvents.filter((e) => e.event.id == id)[0].replay.start
            );
            $("#fechafinal").val(
                lsEvents.filter((e) => e.event.id == id)[0].replay.end
            );
            $("#modalcbPrioridad")
                .val(lsEvents.filter((e) => e.event.id == id)[0].event.idpriority)
                .trigger("change");
            $("#actividades").val(
                lsEvents.filter((e) => e.event.id == id)[0].event.activities
            );
            $("#notasadicionales").val(
                lsEvents.filter((e) => e.event.id == id)[0].event.note
            );
            $("#modalcbCategory").val(
                lsEvents.filter((e) => e.event.id == id)[0].event.idcategory
            );

            // Cambiar frecuencia
            if (
                lsEvents.filter((e) => e.event.id == id)[0].replay.text != "" &&
                lsEvents.filter((e) => e.event.id == id)[0].replay.text != null &&
                lsEvents.filter((e) => e.event.id == id)[0].replay.text != undefined &&
                lsEvents.filter((e) => e.event.id == id)[0].event.custom == 1
            ) {
                $("#modalcbRepeat").append(
                    $("<option>", {
                        value: "custom",
                        text: lsEvents.filter((e) => e.event.id == id)[0].replay.text,
                    })
                );
                $("#modalcbRepeat").val("custom").trigger("change");
                opts = lsEvents.filter((e) => e.event.id == id)[0].replay;
            } else {
                $("#modalcbRepeat")
                    .val(lsEvents.filter((e) => e.event.id == id)[0].replay.idfrecuency)
                    .trigger("change");
            }

            // Select repetición
            $("#modalcbRepeat").on("change", function () {
                let selectedValue = $(this).val();
                let fechaInicial = $("#fechainicial").val();
                let replay = selectedValue;
                $("#fechafinal").prop("disabled", false);
                // Si es personalizado
                if (selectedValue == 6) {
                    repeatCustomModal(opts).then((datos) => {
                        opts = Object.assign({}, datos);
                    });
                } else if (selectedValue != "custom") {
                    // Si no es personalizado se limpian los datos
                    opts = [];
                    if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                        $("#modalcbRepeat").find('option[value="custom"]').remove();
                    }
                }
            });

            // Cambiar la descripción del option custom
            $("#fechainicial").on("change", function () {
                // Si hay una opción custom
                if ($("#modalcbRepeat").find('option[value="custom"]').length) {
                    // Si es mensual
                    if (opts.idfrecuency === "4") {
                        // Cambiar la descripción
                        let fecha = $(this).val();
                        let dayOfMonth = getDayOfMonth(fecha);
                        let dayOfWeek = getDayOfWeek(fecha);
                        let interval = opts.interval;
                        let text = "";

                        if (interval > 1) {
                            text = `Cada ${interval} meses`;
                        } else {
                            text = `Cada mes`;
                        }
                        let mes = "";
                        if (opts.numWeek === 1) {
                            mes = `el primer ${dayOfWeek}`;
                        } else if (opts.numWeek === -1) {
                            mes = `el último ${dayOfWeek}`;
                        } else {
                            mes = `el día ${dayOfMonth}`;
                        }
                        if (opts.end != "") {
                            text = `${text} ${mes} hasta el ${opts.end}`;
                        } else {
                            text = `${text} ${mes}`;
                        }

                        // Cambiar el texto del option custom
                        $("#modalcbRepeat")
                            .find('option[value="custom"]')
                            .text(text)
                            .val("custom");
                    }
                }
            });

            // Validar formulario
            form.validation_form({}, () => {
                let fechaInicio = $("#fechainicial").val();
                let fechaTermino = $("#fechafinal").val();
                let startDate = new Date(fechaInicio);
                let endDate = new Date(fechaTermino);
                let title = $("#evento").val();

                let eventoCreado = false;
                lsEvents.forEach((e) => {
                    if (e.event.title == title && e.event.id != id) {
                        alert({
                            icon: "error",
                            title: "Error al agregar",
                            text: "El evento ya existe",
                            btn1: "Aceptar",
                        });
                        $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
                        eventoCreado = true;
                    }
                });

                if (!eventoCreado) {
                    // Validar si fechaInicial es menor que fechaFinal
                    if (startDate > endDate) {
                        alert({
                            icon: "error",
                            title: "Error en la fecha",
                            text: "La fecha de inicio no puede ser mayor a la fecha de término",
                            btn1: "Aceptar",
                        });
                        $("#formNuevoEvento button[type='submit']").removeAttr("disabled");
                        return false;
                    } else {
                        form.find("button[type='submit']").attr("disabled", "disabled");

                        const eventEdited = lsEvents.find((e) => e.event.id == id);

                        if (eventEdited && eventEdited.event.simulation && eventEdited.event.simulation == true) {
                            updateEventSimulation(id, opts, selectedDate);
                        }
                    }
                } else {
                    return false;
                }
            });
        });
}
// Crear evento simulado
function createEventSimulation(opts) {
    // Valores Replay
    let text = "";
    let weekDay = "";
    let numWeek = "";
    let until = "";
    let interval = "";

    // Valores Evento
    let custom = 0;
    let frecuency = "";
    let duration = "";
    let titulo = $("#evento").val();
    let color = $("#circleBTN").attr("data-color");
    let replay = $("#modalcbRepeat").val();
    let udn = $("#modalcbUDN").val();
    let priority = $("#modalcbPrioridad").val();
    let actividades = $("#actividades").val();
    let nota = $("#notasadicionales").val();
    let creator = jsonResponsible.filter((e) => e.iduser == idUsuario)[0] ? jsonResponsible.filter((e) => e.iduser == idUsuario)[0].nombre : "";
    let temporada = $("#modalcbTemporada").val();
    let category = $("#modalcbCategory").val();
    let fechaInicio = $("#fechainicial").val();
    let fechaTermino = moment($("#fechafinal").val()).format("YYYY-MM-DD");
    let priorityText = $("#modalcbPrioridad option:selected").text();
    priorityText = priorityText.substring(2, priorityText.length);
    let temporadaText = $("#modalcbTemporada option:selected").text().toUpperCase(); // Junta UDN y categoría
    let responsable = $("#modalcbResponsable option:selected")
        .map(function () {
            return {
                id: parseInt($(this).val()),
                nombre: jsonResponsible.filter(
                    (e) => e.id == parseInt($(this).val())
                )[0].nombre,
                idstatus: 1,
                status: "Pendiente",
                telefono: jsonResponsible.filter(
                    (e) => e.id == parseInt($(this).val())
                )[0].telefono,
                idudn: jsonResponsible.filter((e) => e.id == parseInt($(this).val()))[0]
                    .idudn,
                iduser: jsonResponsible.filter(
                    (e) => e.id == parseInt($(this).val())
                )[0].iduser,
                idarea: jsonResponsible.filter(
                    (e) => e.id == parseInt($(this).val())
                )[0].idarea,
            };
        })
        .get();

    // Obtener valores del modal de repetición
    if (Object.keys(opts).length > 0 || opts.length > 0) {
        text = opts.text;
        custom = 1;
        duration = restarFechas(fechaInicio, fechaTermino);

        if (
            opts.until &&
            opts.until.trim() !== "" &&
            opts.until.trim() !== "Invalid date"
        ) {
            until = moment(opts.until).format("YYYY-MM-DD");
        } else {
            until = "";
        }

        if (opts.frecuency) {
            frecuency = jsonReplay.filter(
                (e) => e.id == parseInt(opts.idfrecuency)
            )[0].frecuency;
            replay = opts.idfrecuency;
        }
        interval = opts.interval || interval;
        weekDay = opts.weekDay || weekDay;
        numWeek = opts.numWeek || numWeek;
    } else {
        interval = 1;
        frecuency = jsonReplay.filter((e) => e.id == replay)[0].frecuency;
    }

    // Crear JSON para rrules
    let jsonreapeat = {};
    jsonreapeat = {
        start: fechaInicio,
        end: fechaTermino,
        idfrecuency: replay,
        frecuency: frecuency,
        interval: parseInt(interval),
        until: until || '',
        ...(weekDay.length > 0 && { weekDay }),
        ...(numWeek && { numWeek }),
        text: text,
    };

    let event = [
        {
            event: {
                id: lsEvents.length + 30000000,
                title: titulo,
                color: color,
                custom: custom,
                idudn: udn,
                udn: jsonUDN.filter((e) => e.id == udn)[0].valor,
                idpriority: priority,
                priority: priorityText,
                idseason: temporada,
                season: temporadaText,
                activities: actividades,
                note: nota,
                idcreator: idUsuario,
                creator: creator,
                assign: responsable,
                duration: { "days": + duration },
                idcategory: category,
                simulation: true,
                estados: [],
            },
            replay: jsonreapeat,
        },
    ];


    alert({
        icon: "success",
        title: "Correcto",
        text: "Evento simulado correctamente🎉",
        timer: 1000,
    });

    // Agregar evento al arreglo
    lsEvents.push(event[0]);

    // Agregar evento al calendario
    event = createJsonEvents(event);
    calendar.addEvent(event[0]);
    $("#formNuevoEvento button[type='submit']").removeAttr("disabled");

    bootbox.hideAll();
    fullCalendar();
    setTimeout(() => {
        showEventSimulation(event[0].id, fechaInicio);
    }, 1000);

    if (idTutorial = !0) {
        let formDatos = {
            opc: "createCookie",
            id_User: idUsuario,
            nameCookie: "IDT",
            valueCookie: 1,
        };

        fn_ajax(formDatos, ctrlactividades).then((data) => {
            if (data.status == 200) {
                // Actualizar el valor de la cookie
                setCookie('IDT', 1, 3650);
                //Desbloquear el contenedor de eventos
                $("#containerBtnPlus").removeClass("hide");
            }
        });

    }
}
// Actualizar evento simulado
function updateEventSimulation(id, datos, selectedDate) {
    let event = lsEvents.filter((e) => e.event.id == id)[0].event;
    // Valores Replay
    let text = "";
    let weekDay = "";
    let numWeek = "";
    let until = "";
    let interval = "";

    // Valores Evento
    let custom = 0;
    let frecuency = "";
    let duration = "";
    let titulo = $("#evento").val();
    let color = $("#circleBTN").attr("data-color");
    let replay = $("#modalcbRepeat").val();
    let idudn = $("#modalcbUDN").val();
    let udn = jsonUDN.filter((e) => e.id == idudn)[0].valor;
    let priority = $("#modalcbPrioridad").val();
    let actividades = $("#actividades").val();
    let nota = $("#notasadicionales").val();
    let creator = jsonResponsible.filter((e) => e.iduser == idUsuario)[0].nombre;
    let idseason = $("#modalcbTemporada").val();
    let category = $("#modalcbCategory").val();
    let fechaInicio = $("#fechainicial").val();
    let fechaTermino = moment($("#fechafinal").val()).format("YYYY-MM-DD");
    let priorityText = $("#modalcbPrioridad option:selected").text();
    priorityText = priorityText.substring(2, priorityText.length);
    let temporadaText = $("#modalcbTemporada option:selected").text().toUpperCase();
    let responsable = $("#modalcbResponsable option:selected")
        .map(function () {
            if (event.assign.filter((e) => e.id == parseInt($(this).val())).length > 0) {
                return {
                    id: parseInt($(this).val()),
                    nombre: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].nombre,
                    telefono: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].telefono,
                    idudn: jsonResponsible.filter((e) => e.id == parseInt($(this).val()))[0]
                        .idudn,
                    iduser: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].iduser,
                    idarea: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].idarea,
                    estados: event.assign.filter((e) => e.id == parseInt($(this).val()))[0].estados,
                };
            } else {
                return {
                    id: parseInt($(this).val()),
                    nombre: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].nombre,
                    telefono: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].telefono,
                    idudn: jsonResponsible.filter((e) => e.id == parseInt($(this).val()))[0]
                        .idudn,
                    iduser: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].iduser,
                    idarea: jsonResponsible.filter(
                        (e) => e.id == parseInt($(this).val())
                    )[0].idarea,
                    estados: [],
                    // estados: event.assign.filter((e) => e.id == parseInt($(this).val()))[0].estados,
                };
            }
        })
        .get();

    // Obtener valores del modal de repetición
    if (Object.keys(datos).length > 0 || datos.length > 0) {
        text = datos.text;
        custom = 1;
        duration = restarFechas(fechaInicio, fechaTermino);

        if (
            datos.until &&
            datos.until.trim() !== "" &&
            datos.until.trim() !== "Invalid date"
        ) {
            until = moment(datos.until).format("YYYY-MM-DD");
        } else {
            until = "";
        }

        if (datos.frecuency) {
            frecuency = jsonReplay.filter(
                (e) => e.id == parseInt(datos.idfrecuency)
            )[0].frecuency;
            replay = datos.idfrecuency;
        }

        interval = datos.interval || interval;
        weekDay = datos.weekDay || weekDay;
        numWeek = datos.numWeek || numWeek;
    } else {
        interval = 1;
        frecuency = jsonReplay.filter((e) => e.id == replay)[0].frecuency;
    }

    // Crear JSON para rrules
    let jsonreapeat = {};
    jsonreapeat = {
        start: fechaInicio,
        end: fechaTermino,
        idfrecuency: replay,
        frecuency: frecuency,
        interval: parseInt(interval),
        until: until || '',
        ...(weekDay.length > 0 && { weekDay }),
        ...(numWeek && { numWeek }),
        text: text,
    };

    // Obtener responsables que estaban y los nuevos
    let personasQueEstaban = lsEvents.filter((e) => e.event.id == id)[0].event.assign;
    let personasActuales = responsable;
    let personasNuevas = [];
    let personasEliminadas = [];

    personasQueEstaban.forEach((e) => {
        let existe = personasActuales.filter((p) => p.id == e.id);
        if (existe.length == 0) {
            personasEliminadas.push(e);
        }
    });
    personasActuales.forEach((e) => {
        let existe = personasQueEstaban.filter((p) => p.id == e.id);
        if (existe.length == 0) {
            personasNuevas.push(e);
        }
    });


    alert({
        icon: "success",
        title: "Correcto",
        text: "Evento simulado actualizado correctamente🎉",
        timer: 1000,
    });

    // Actualizar evento en fullCalendar
    lsEvents.forEach((e) => {
        if (e.event.id == id) {
            e.event.title = titulo;
            e.event.color = color;
            e.event.custom = custom;
            e.replay = jsonreapeat;
            e.event.idudn = idudn;
            e.event.udn = udn;
            e.event.idpriority = priority;
            e.event.priority = priorityText;
            e.event.idseason = idseason;
            e.event.season = temporadaText;
            e.event.activities = actividades;
            e.event.note = nota;
            e.event.idcreator = idUsuario;
            e.event.creator = creator;
            e.event.assign = responsable;
            e.event.idcategory = category;
            e.event.duration = { "days": + duration };
        }
    });

    $("#formNuevoEvento button[type='submit']").removeAttr("disabled");

    fullCalendar();
    bootbox.hideAll();

    setTimeout(() => {
        showEventSimulation(id, selectedDate);
    }, 1000);
}
// Mostrar evento simulado
function showEventSimulation(id, fecha) {
    let event = lsEvents.find((e) => e.event.id == id); // Buscar el evento
    // Atributos del evento
    let btn = "";
    let status = "";
    let responsibles = "";
    let btnSendWhatsapp = "";
    let statusUser = "Pendiente";
    let statusEvent = "Pendiente";
    let titulo = event.event.title;
    let dateStart = moment(event.replay.start).format('DD/MM/YYYY');
    let dateEnd = event.replay.end ? moment(event.replay.end).format('DD/MM/YYYY') : "Nunca";
    let color = event.event.color ? event.event.color : "#DDDDDD";
    let nameCreator = event.event.creator ? event.event.creator : "N/A";
    let activities = event.event.activities ? event.event.activities : "";
    let note = event.event.note ? event.event.note : "";
    let udn = jsonUDN.find((u) => u.id == (event.event.idudn || 0)).abreviado;
    let subtittle = udn + " - " + event.event.season;
    let dateUntil = event.replay.until ? event.replay.until : "Nunca";
    let repeat = event.replay.text ? event.replay.text : "No repetir";
    let priority = priorityEvent(event.event.priority);

    if (event) {
        // Definir responsabilidad
        let assigned = false;
        let creator = event.event.idcreator == idUsuario || idA == 36; // ¿Es el creador del evento o dirección?

        // Evaluación de estados de usuario
        if (Object.keys(event.event.assign).length > 0) {
            event.event.assign.forEach((assig) => {
                // ¿El usuario está asignado?
                if (assig.iduser == idUsuario) {
                    assigned = true;
                    // Evaluar el estado del día seleccionado
                    if (assig.estados) {
                        assig.estados.forEach((stado) => {
                            let occDate = stado.ocurrence;
                            if (occDate == fecha) {
                                statusUser = stado.status;
                            }
                        });
                    }
                }
            });
        }

        // Evaluación de estados de evento
        if (event.event.estados && Object.keys(event.event.estados).length > 0) {
            event.event.estados.forEach(stado => {
                if (fecha == stado.ocurrence) {
                    statusEvent = stado.status;
                }
            });
        }

        // Estados de acuerdo a la responsabilidad
        if (assigned === true && creator === false) {
            // SI ES ASIGNADO/ RESPONSABLE

            // Añadir responsables.
            responsibles =
                event.event.assign && event.event.assign.length > 0
                    ? event.event.assign.map((e) => e.nombre).join(", ")
                    : "N/A";

            // Si el evento es cancelado, pausado o revisado, toma en cuenta su estado.
            if (statusEvent != "Pendiente") {
                if (statusEvent === "Cancelado") {
                    status = eventStatus(statusEvent);
                } else if (statusEvent === "Pausado") {
                    status = eventStatus(statusEvent);
                    btn = `
                    <div class="d-flex justify-content-center row">
                        <button class="btn btn-warning col-3" id="btnInProgressAll">🕒Reanudar</button>
                    </div>`;
                } else if (statusEvent === "Revisado") {
                    status = eventStatus(statusEvent);
                }
            } else {
                // Si el evento es pendiente, toma en cuenta el estado del usuario.
                if (statusUser === "Pendiente") {
                    status = userStatus(statusUser);
                    btn = `
                    <div class="d-flex justify-content-center row">
                        <button class="btn btn-info col-3" id="btnInProgress">Iniciar!👋</button>
                    </div>`;
                } else if (statusUser === "En proceso") {
                    status = userStatus(statusUser);
                    btn = `
                    <div class="d-flex justify-content-between row pe-3 ps-3">
                        <button class="btn btn-success col-3" id="btnCompleted">Listo!🥳</button>
                        <button class="btn btn-outline-purple col-3" id="btnPaused">Pausar</button>
                    </div>`;
                } else if (statusUser === "Terminado") {
                    status = userStatus(statusUser);
                } else if (statusUser === "Cancelado") {
                    status = userStatus(statusUser);
                }
            }

        } else if (assigned === false && creator === true) {
            // SI ES CREADOR

            // Añadir responsables.
            let nombres = "";
            event.event.assign.forEach((e) => {
                if (e.estados && e.estados.length > 0) {
                    e.estados.forEach((stado) => {
                        if (stado.ocurrence == fecha) {
                            if (stado.status === "Terminado") {
                                nombres = "✔️" + e.nombre + ", ";
                            } else if (stado.status === "En proceso") {
                                nombres = "🕒" + e.nombre + ", ";
                            } else if (stado.status === "Pendiente") {
                                nombres = e.nombre + ", ";
                            } else if (stado.status === "Cancelado") {
                                nombres = e.nombre + ", ";
                            }
                        } else {
                            nombres = e.nombre + ", ";
                        }
                    });
                    responsibles += nombres;
                } else {
                    responsibles += e.nombre + ", ";
                }
            });

            // Se toma en cuenta el estado del evento.
            if (statusEvent === "Pendiente") {
                status = eventStatus(statusEvent);
                btn = `
                <div class="d-flex justify-content-around row">
                    <button class="btn btn-success col-3" id="btnReviewed">✔️ Revisar</button>
                    <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                    <button class="btn btn-outline-purple col-2" id="btnPaused">Pausar</button>
                    <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                </div>`;
                btnSendWhatsapp = `
                <div class="mb-3 d-flex justify-content-center">
                    <button class="btn btn-outline-success" id="btnWhatsApp"><i class="icon-whatsapp"></i>Enviar</button>
                </div>`;
            } else if (statusEvent === "Revisado") {
                status = eventStatus(statusEvent);
            } else if (statusEvent === "Pausado") {
                status = eventStatus(statusEvent);
                btn = `
                <div class="d-flex justify-content-around row">
                    <button class="btn btn-warning col-3" id="btnInProgressAll">🕒Reanudar</button>
                    <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                    <button class="btn btn-outline-danger col-3" id="btnDelete"><i class='icon-trash'></i>Eliminar</button>
                    <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                </div>`;
            } else if (statusEvent === "Cancelado") {
                status = eventStatus(statusEvent);
            }

        } else if (assigned === true && creator === true) {
            // SI ES ASIGNADO Y CREADOR

            // Añadir responsables.
            let nombres = "";
            event.event.assign.forEach((e) => {
                if (e.estados && e.estados.length > 0) {
                    e.estados.forEach((stado) => {
                        if (stado.ocurrence == fecha) {
                            if (stado.status === "Terminado") {
                                nombres = "✔️" + e.nombre + ", ";
                            } else if (stado.status === "En proceso") {
                                nombres = "🕒" + e.nombre + ", ";
                            } else if (stado.status === "Pendiente") {
                                nombres = e.nombre + ", ";
                            } else if (stado.status === "Cancelado") {
                                nombres = e.nombre + ", ";
                            }
                        } else {
                            nombres = e.nombre + ", ";
                        }
                    });
                    responsibles += nombres;
                } else {
                    responsibles += e.nombre + ", ";
                }
            });

            // Si es pendiente, toma en cuenta el estado del usuario
            if (statusEvent === "Pendiente") {
                if (statusUser === "Pendiente") {
                    status = userStatus(statusUser);
                    btn = `
                    <div class="d-flex justify-content-around row">
                        <button class="btn btn-info col-3" id="btnInProgress">Iniciar👋</button>
                        <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                        <button class="btn btn-outline-purple col-2" id="btnPaused">Pausar</button>
                        <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                    </div>`;
                    btnSendWhatsapp = `
                    <div class="mb-3 d-flex justify-content-center">
                        <button class="btn btn-outline-success" id="btnWhatsApp"><i class="icon-whatsapp"></i>Enviar</button>
                    </div>`;
                } else if (statusUser === "En proceso") {
                    status = userStatus(statusUser);
                    btn = `
                    <div class="d-flex justify-content-around row">
                        <button class="btn btn-success col-3" id="btnCompleted">Listo!🥳</button>
                        <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                        <button class="btn btn-outline-purple col-2" id="btnPaused">Pausar</button>
                        <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                    </div>`;
                    btnSendWhatsapp = `
                    <div class="mb-3 d-flex justify-content-center">
                        <button class="btn btn-outline-success" id="btnWhatsApp"><i class="icon-whatsapp"></i>Enviar</button>
                    </div>`;
                } else if (statusUser === "Terminado") {
                    status = userStatus(statusUser);
                    btn = `
                     <div class="d-flex justify-content-around row">
                        <button class="btn btn-success col-3" id="btnReviewed">✔️Revisar</button>
                        <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                        <button class="btn btn-outline-purple col-2" id="btnPaused">Pausar</button>
                        <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                    </div>`;
                    btnSendWhatsapp = `
                    <div class="mb-3 d-flex justify-content-center">
                        <button class="btn btn-outline-success" id="btnWhatsApp"><i class="icon-whatsapp"></i>Enviar</button>
                    </div>`;
                } else if (statusUser === "Cancelado") {
                    status = userStatus(statusUser);
                }

                // Si es revisado, pausado o cancelado, toma en cuenta el estado del evento
            } else if (statusEvent === "Revisado") {
                status = eventStatus(statusEvent);
            } else if (statusEvent === "Pausado") {
                status = eventStatus(statusEvent);
                btn = `
                <div class="d-flex justify-content-around row">
                    <button class="btn btn-warning col-3" id="btnInProgressAll">🕒Reanudar</button>
                    <button class="btn btn-outline-primary col-2" id="btnEdited">Editar</button>
                    <button class="btn btn-outline-danger col-3" id="btnDelete"><i class='icon-trash'></i>Eliminar</button>
                    <button class="btn btn-outline-danger col-2" id="btnCancelled">Cancelar</button>
                </div>`;
            } else if (statusEvent === "Cancelado") {
                status = eventStatus(statusEvent);
            }
        }
    }

    // Mostrar modal
    bootbox
        .dialog({
            title: `<div>
                  <h5 class='h5'><i class="icon-blank" style="color: ${color}"></i>${titulo}</h5>
                  <p class="fs-6 text-muted mb-0">${subtittle}</p>
              </div>`,
            closeButton: true,
            message: `
            <div class="mb-3" id="contentEventData">
                  <div class="mb-3" id="assignUssers">
                     <strong><i class="icon-users-2"></i> Asignado(s):</strong>
                     ${responsibles}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-spinner"></i> Estado:</strong>
                     ${status}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-angle-circled-down"></i>Prioridad:</strong>
                     ${priority}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-calendar"></i> Periodo:</strong>
                     ${dateStart ? dateStart : "N/A"} - ${dateEnd ? dateEnd : "N/A"}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-arrows-cw"></i> Repetición:</strong>
                     ${repeat}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-clock"></i> Repetir hasta:</strong>
                     ${dateUntil}
                 </div>
                 <div class="mb-3">
                     <strong><i class="icon-user-5"></i> Creador:</strong>
                     ${nameCreator}
                 </div>
                    ${btnSendWhatsapp}
                 <hr>
                 <strong>Actividades:</strong>
                 <p>
                     ${activities}
                 </p>
                 <div class="card-footer text-body-secondary mb-3">
                     Notas: ${note}
                 </div>
            </div>
            <div class="botones">
                ${btn}
            </div>
            
            `,
        })
        .on("shown.bs.modal", function () {
            let idBotonUniversal = '';
            let tituloProp = '';
            let textoProp = '';
            let showEventGuide = [];
            let showEventGuideAfter = [];

            if ($('.botones').find('button').length > 0) {
                const buttonIds = $('.botones button').map(function () {
                    return this.id;
                }).get();

                if (buttonIds.includes("btnInProgress")) {
                    if (localStorage.getItem('dontShowAgainInProgress') != 1) {
                        idBotonUniversal = "#btnInProgress";
                        tituloProp = "Iniciar Evento";
                        textoProp = `Intenta iniciar el evento simulado después del tutorial.👋🚀 (Este boton aparece cuando eres creador y responsable a la vez) <br><br> <p><label class='fw-bold'><input type="checkbox" id="dontShowAgain"> No volver a mostrar</label></p>`;
                        showEventGuide = [
                            {
                                element: $(".h5")[0],
                                title: "Este es tu nuevo evento simulado",
                                intro: "¡Aquí puedes ver el color y el nombre de tu evento!👀",
                            },
                            {
                                element: $(".fs-6.text-muted.mb-0")[0],
                                title: "UDN y Temporada",
                                intro: "Aquí puedes ver la UDN y la temporada a la que pertenece tu evento.🏢🌞",
                            },
                            {
                                element: $("#contentEventData")[0],
                                title: "Datos del evento",
                                intro: "Aquí puedes ver los datos de tu evento simulado.📊📅",
                            },
                            {
                                element: $("#assignUssers")[0],
                                title: "Lista de responsables",
                                intro: "Aquí puedes ver los responsables y su estado en el evento con la símbología de: pendiente (sin emoji), en proceso (reloj🕒) y terminado (check✔️).",
                            },
                            {
                                element: $("#btnWhatsApp")[0],
                                title: "WhatsApp",
                                intro: "Con este botón puedes enviar un recordatorio a los responsables del evento.📲📢",
                            },
                            {
                                element: $(".d-flex.row")[0],
                                title: "Opciones del evento",
                                intro: "Esto es lo que puedes realizar en tu evento simulado📝. Las opciones cambiarán dependiendo si eres el creador del evento o responsable de el mismo.",
                            },
                            {
                                element: $(idBotonUniversal)[0],
                                title: tituloProp,
                                intro: textoProp,
                            },
                        ];
                        introJs()
                            .setOptions({
                                exitOnOverlayClick: false,
                                steps: showEventGuide,
                                showStepNumbers: false,
                            }).oncomplete(
                                function () {
                                    if ($('#dontShowAgain').is(':checked')) {
                                        localStorage.setItem('dontShowAgainInProgress', 1);
                                    }
                                }
                            ).start();
                    }
                } else if (buttonIds.includes("btnReviewed")) {
                    if (localStorage.getItem('dontShowAgainReviewed') != 1) {
                        idBotonUniversal = "#btnReviewed";
                        tituloProp = "Revisar Evento";
                        textoProp = `Una vez que ya todos los responsables han terminado su parte (tengan la ✔️ antes de su nombre), puedes revisar el evento. <br> ¡Pruebálo ahora en la simulación!👀 <br><br> <p><label class='fw-bold'><input type="checkbox" id="dontShowAgain"> No volver a mostrar</label></p>`;
                        showEventGuide = [
                            {
                                element: $(".h5")[0],
                                title: "Este es tu nuevo evento simulado",
                                intro: "¡Aquí puedes ver el color y el nombre de tu evento!👀",
                            },
                            {
                                element: $(".fs-6.text-muted.mb-0")[0],
                                title: "UDN y Temporada",
                                intro: "Aquí puedes ver la UDN y la temporada a la que pertenece tu evento.🏢🌞",
                            },
                            {
                                element: $("#contentEventData")[0],
                                title: "Datos del evento",
                                intro: "Aquí puedes ver los datos de tu evento simulado.📊📅",
                            },
                            {
                                element: $("#assignUssers")[0],
                                title: "Lista de responsables",
                                intro: "Aquí puedes ver los responsables y su estado en el evento con la símbología de: pendiente (sin emoji), en proceso (reloj🕒) y terminado (check✔️).",
                            },
                            {
                                element: $("#btnWhatsApp")[0],
                                title: "WhatsApp",
                                intro: "Con este botón puedes enviar un recordatorio a los responsables del evento.📲📢",
                            },
                            {
                                element: $(".d-flex.row")[0],
                                title: "Opciones del evento",
                                intro: "Esto es lo que puedes realizar en tu evento simulado📝. Las opciones cambiarán dependiendo si eres el creador del evento o responsable de el mismo.☝️",
                            },
                            {
                                element: $(idBotonUniversal)[0],
                                title: tituloProp,
                                intro: textoProp,
                            },
                        ];
                        introJs()
                            .setOptions({
                                exitOnOverlayClick: false,
                                steps: showEventGuide,
                                showStepNumbers: false,
                            }).oncomplete(
                                function () {
                                    if ($('#dontShowAgain').is(':checked')) {
                                        localStorage.setItem('dontShowAgainReviewed', 1);
                                    }
                                }
                            ).start();
                    }
                } else if (buttonIds.includes("btnInProgressAll")) {
                    if (localStorage.getItem('dontShowAgainInProgressAll') != 1) {
                        idBotonUniversal = "#btnInProgressAll";
                        tituloProp = "Reanudar Evento";
                        textoProp = `Este botón aparece cuando el evento está pausado. Intenta reanudar el evento simulado.🕒🚀<br><br> <p><label class='fw-bold'><input type="checkbox" id="dontShowAgain"> No volver a mostrar</label></p>`;
                        showEventGuideAfter = [
                            {
                                element: $("#btnDelete")[0],
                                title: "Eliminar Evento",
                                intro: "Si el evento no es necesario, puedes eliminarlo.🗑️🚫",
                            },
                            {
                                element: $(idBotonUniversal)[0],
                                title: tituloProp,
                                intro: textoProp,
                            },
                        ];
                        introJs()
                            .setOptions({
                                exitOnOverlayClick: false,
                                steps: showEventGuideAfter,
                                showStepNumbers: false,
                            }).oncomplete(
                                function () {
                                    if ($('#dontShowAgain').is(':checked')) {
                                        localStorage.setItem('dontShowAgainInProgressAll', 1);
                                    }
                                }
                            ).start();
                    }
                } else if (buttonIds.includes("btnCompleted")) {
                    if (localStorage.getItem('dontShowAgainCompleted') != 1) {
                        idBotonUniversal = "#btnCompleted";
                        tituloProp = "Completar Evento";
                        textoProp = `Una vez que hayas terminado el evento, puedes completarlo.🎉👏 <br><br> <p><label class='fw-bold'><input type="checkbox" id="dontShowAgain"> No volver a mostrar</label></p>`;
                        showEventGuideAfter = [
                            {
                                element: $(idBotonUniversal)[0],
                                title: tituloProp,
                                intro: textoProp,
                            },
                        ];
                        introJs()
                            .setOptions({
                                exitOnOverlayClick: false,
                                steps: showEventGuideAfter,
                                showStepNumbers: false,
                            }).oncomplete(
                                function () {
                                    if ($('#dontShowAgain').is(':checked')) {
                                        localStorage.setItem('dontShowAgainCompleted', 1);
                                    }
                                }
                            ).start();
                    }
                }
            }

            setEventsButtonsSimulation(id, fecha);
        });
}
// Establecer eventos de botones de showEvent Simulation
function setEventsButtonsSimulation(id, selectedDate) {
    // EDITAR, ELIMINAR Y ENVIAR WHATSAPP
    $("#btnEdited").on("click", function () {
        editEventModalSimulation(id, selectedDate);
    });

    $("#btnDelete").on("click", function () {
        alert({
            icon: "question",
            title: "¿Estás seguro de eliminar este evento?",
            text: "Una vez eliminado, no podrás recuperar este evento, ni sus repeticiones",
        }).then((result) => {
            if (result.isConfirmed) {
                // Eliminar evento
                let index = lsEvents.findIndex((e) => e.event.id === id);
                lsEvents.splice(index, 1);
                alert({
                    icon: "success",
                    title: "Evento Eliminado 🗑️",
                    text: "El evento ha sido eliminado correctamente",
                    timer: 1000,
                });

                fullCalendar();
                bootbox.hideAll();
            }
        });
    });

    $("#btnWhatsApp").on("click", function () {
        // Preguntar si desea enviar un mensaje de whatsapp
        bootbox.dialog({
            title: "¿Deseas enviar un mensaje personalizado? 📲🤔",
            size: 'large',
            className: 'rubberBand animated',
            message: `
        <div class="form-group">
            <textarea id="whatsappMessage" class="form-control" placeholder="Hola, te recordamos que tienes un evento por realizar: ${lsEvents.find((e) => e.event.id == id).event.title
                }. Para más información, revisa tu calendario.🤗 https://www.erp-varoch.com/ERP24/calendarizacion/actividades.php"></textarea>
        </div>`,

            buttons: {
                noconfirm: {
                    label: "Enviar Genérico",
                    className: "btn-primary",
                    callback: function () {
                        let telefono = "";
                        let mensaje = "";
                        mensaje = `Hola, te recordamos que tienes un evento por realizar: ${lsEvents.find((e) => e.event.id == id).event.title
                            }. Para más información, revisa tu calendario.🤗 https://www.erp-varoch.com/ERP24/calendarizacion/actividades.php`
                        alert({
                            icon: "success",
                            title: "Mensaje enviado",
                            text: "Mensaje enviado ficticiamente 😉",
                            btn1: true,
                        });
                    },
                },


                ok: {
                    label: "Enviar Personalizado",
                    className: "btn-success",
                    callback: function () {
                        let telefono = "";
                        let mensaje = "";
                        mensaje = $("#whatsappMessage").val();
                        if (mensaje.trim() == "") {
                            alert({
                                icon: "error",
                                title: "Error",
                                text: "Debes escribir un mensaje",
                                btn1: true,
                            });
                            return false;
                        }
                        mensaje += `Para más información, revisa tu calendario.🤗 https://www.erp-varoch.com/ERP24/calendarizacion/actividades.php`;

                        alert({
                            icon: "success",
                            title: "Mensaje enviado",
                            text: "Mensaje enviado ficticiamente 😉",
                            btn1: true,
                        });
                    },
                },

                cancel: {
                    label: "Cerrar",
                    className: "btn-secondary",
                },
            },
        }).on("shown.bs.modal", function () {
            $("#whatsappMessage").focus();
        });
    });

    // ESTADOS EVENTO
    $("#btnCancelled").on("click", function () {
        alert({
            icon: "question",
            title: "Cancelar Evento",
            text: "¿Estás seguro de cancelar el evento?",
        }).then((result) => {
            if (result.isConfirmed) {
                alert({
                    icon: "error",
                    title: "Evento Cancelado 🚫",
                    text: "El evento ha sido cancelado correctamente",
                    timer: 1500,
                });
                setStatusEvent(id, 1, 5, "Cancelado", selectedDate);
            }
        });
    });

    $("#btnReviewed").on("click", function () {
        alert({
            icon: "success",
            title: "Evento Finalizado 🎊✨",
            text: "El evento ha sido revisado correctamente",
            timer: 1500,
        });
        setStatusEvent(id, 1, 6, "Revisado", selectedDate);
    });

    $("#btnPaused").on("click", function () {
        alert({
            icon: "question",
            title: "¿Estás seguro de Pausar el evento para TODOS los involucrados?",
            // text: "¿Estás seguro de cancelar el evento?",
        }).then((result) => {
            if (result.isConfirmed) {
                alert({
                    icon: "success",
                    title: "Evento Pausado 🤚",
                    text: "El evento ha sido pausado correctamente",
                    timer: 1500,
                });
                setStatusEvent(id, 1, 4, "Pausado", selectedDate);
            }
        });

    });

    $("#btnInProgressAll").on("click", function () {
        alert({
            icon: "success",
            title: "Evento Reanudado ✨",
            text: "El evento ha sido reanudado correctamente",
            timer: 1500,
        });
        setStatusEvent(id, 1, 3, "Pendiente", selectedDate);
    });

    // ESTADOS USUARIO
    $("#btnInProgress").on("click", function () {
        alert({
            icon: "success",
            title: "Evento en Proceso",
            text: "Es hora de trabajar. ¡Vamos! 💪🚀",
            timer: 1500,
        });
        setStatusUser(id, idUsuario, 1, 2, "En proceso", selectedDate);
    });

    $("#btnCompleted").on("click", function () {
        alert({
            icon: "success",
            title: "¡Evento Completado! 🎉",
            text: "¡Has hecho un trabajo excelente! Sigue así. 💪👏",
            timer: 1500,
        });
        setStatusUser(id, idUsuario, 1, 3, "Terminado", selectedDate);
    });
}
// Agregar temporada simulada
function addSeasonModalSimulation() {
    // Crear formulario
    let form = $("<form>", {
        novalidate: true,
        class: "row",
        id: "formAddSeason",
    });

    form.create_elements([
        {
            div: { class: "col-12 mb-3" },
            lbl: "Temporada",
            placeholder: "Agregar temporada",
            id: "temporada",
            name: "name",
        },
        { elemento: "modal_button" },
    ]);

    // Modal
    bootbox
        .dialog({
            title: "NUEVA TEMPORADA",
            message: form,
        })
        .on("shown.bs.modal", function () {
            // Enfocar input
            $("#temporada").focus();

            // Cambiar a mayúsculas
            $("#temporada").on("input", function () {
                let upperCaseValue = $(this).val().toUpperCase();
                $(this).val(upperCaseValue);
            });

            // Validar formulario
            form.validation_form({ opc: "createSeason" }, function (result) {
                let valor = $("#temporada").val().trim();

                if (jsonSeason.find((e) => e.valor == valor)) {
                    alert({
                        icon: "error",
                        title: "Error al agregar",
                        text: "La temporada ya existe",
                    });
                    return false;
                } else {
                    // Deshabilitar botón hasta que se complete la petición
                    $("#formAddSeason button[type='submit']").attr(
                        "disabled",
                        "disabled"
                    );
                    // Si el evento es una simulación, entonces se agrega la temporada a la simulación

                    alert({
                        icon: "success",
                        title: "Agregado correctamente",
                    });
                    let idSeason = jsonSeason.length + 3000000;
                    // Agregar al select
                    $("#modalcbTemporada").append(
                        $("<option>").text(valor).val(idSeason).attr("id", idSeason)
                    );
                    $("#modalcbTemporada").val(idSeason).trigger("change");
                    // Agregar al json
                    jsonSeason.push({ id: idSeason, valor: valor });
                    // Limpiar formulario
                    valor = "";
                    form.find("button[type='submit']").removeAttr("disabled");
                    form.find("button[type='button']").click();
                }
            });
        });
}


//? FUNCIONES DE AYUDA ---------------------------------
// Obtener cookie
function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}
// Establecer cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
// Obtener fecha actual
function today() {
    let hoy = new Date();
    let dd = hoy.getDate();
    let mm = hoy.getMonth() + 1;
    let yyyy = hoy.getFullYear();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return yyyy + "-" + mm + "-" + dd;
}
// Formatear fecha final
function endDate(endDate) {
    if (endDate != "" && endDate != undefined) {
        var date = new Date(endDate);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD' format
    }
    return endDate ?? "";
}
// Formatear fecha final para mostrar
function showEndDate(showDate) {
    var date = new Date(showDate);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD' format
}
// Función para obtener el día de la semana
function getDayOfWeek(date) {
    let daysOfWeek = [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
    ];

    // Dividir la fecha en componentes
    let [year, month, day] = date.split("-").map(Number);

    // Crear una fecha en UTC
    let currentDate = new Date(Date.UTC(year, month - 1, day));

    // Verificar si la fecha es válida
    if (isNaN(currentDate.getTime())) {
        return null;
    }

    return daysOfWeek[currentDate.getUTCDay()]; // Devuelve el nombre del día de la semana en UTC
}
// Función para obtener el día del mes
function getDayOfMonth(date) {
    //   let currentDate = new Date(date);
    let currentDate = new Date(date + "T00:00:00"); // Convertir a formato ISO
    return currentDate.getDate(); // Devuelve el día del mes actual (1-31)
}
// Función para obtener la fecha final de acuerdo a la repetición
function calculateEndDate(startDate, repeatType, endDate) {
    let fecha = moment(startDate);
    let fechaFinal = "";
    switch (repeatType) {
        case "2":
            fechaFinal = fecha.add(1, "days").format("YYYY-MM-DD");
            break;
        case "3":
            fechaFinal = fecha.add(1, "weeks").format("YYYY-MM-DD");
            break;
        case "4":
            fechaFinal = fecha.add(1, "months").format("YYYY-MM-DD");
            break;
        case "5":
            fechaFinal = fecha.add(1, "years").format("YYYY-MM-DD");
            break;
        case "5":
            fechaFinal = fecha.add(1, "days").format("YYYY-MM-DD");
            break;
    }
    $(endDate).val(fechaFinal);
}
// Función para agregar opciones al select de repetición mensual
function agregarOpciones(idSelect, textObj) {
    let select = $("#" + idSelect);

    // Vaciar el select por si ya tiene opciones previas
    select.empty();

    // Recorrer el objeto text y agregar cada opción al select
    $.each(textObj, function (value, optionText) {
        let option = $("<option></option>").attr("value", value).text(optionText);
        select.append(option);
    });
}
// Función para filtrar el select de responsables en el modal de ass/edit evento
async function filtrarResponsables(udn) {
    if (udn != 0) {
        jsonResponsible = jsonResponsibleAll.filter(
            (e) => e.idudn == parseInt(udn) || e.idudn == 8
        );
    } else {
        jsonResponsible = jsonResponsibleAll;
    }
    return jsonResponsible;
}
// Función para enviar el recordatorio
function sendWhatsapp(id) {
    // Preguntar si desea enviar un mensaje de whatsapp
    bootbox.dialog({
        title: "¿Deseas enviar un mensaje personalizado? 📲🤔",
        size: 'large',
        className: 'rubberBand animated',
        message: `
        <div class="form-group">
            <textarea id="whatsappMessage" class="form-control" placeholder="Hola, te recordamos que tienes un evento por realizar: ${lsEvents.find((e) => e.event.id == id).event.title
            }. Para más información, revisa tu calendario.🤗 https://www.erp-varoch.com/ERP24/calendarizacion/actividades.php"></textarea>
        </div>`,

        buttons: {
            noconfirm: {
                label: "Enviar Genérico",
                className: "btn-primary",
                callback: function () {
                    let telefono = "";
                    let mensaje = "";
                    mensaje = `Hola, te recordamos que tienes un evento por realizar: ${lsEvents.find((e) => e.event.id == id).event.title
                        }. Para más información, revisa tu calendario.🤗 https://www.erp-varoch.com/ERP24/calendarizacion/actividades.php`
                    telefono = lsEvents.find((e) => e.event.id == id).event.assign.map(
                        (e) => e.telefono
                    );
                    wsp(telefono, mensaje);
                    alert({
                        icon: "success",
                        title: "Mensaje enviado",
                        text: "Mensaje enviado correctamente",
                        timer: 1000,
                    });
                },
            },


            ok: {
                label: "Enviar Personalizado",
                className: "btn-success",
                callback: function () {
                    let telefono = "";
                    let mensaje = "";
                    mensaje = $("#whatsappMessage").val();
                    if (mensaje.trim() == "") {
                        alert({
                            icon: "error",
                            title: "Error",
                            text: "Debes escribir un mensaje",
                            btn1: true,
                        });
                        return false;
                    }
                    mensaje += `Para más información, revisa tu calendario.🤗 https://www.erp-varoch.com/ERP24/calendarizacion/actividades.php`;
                    telefono = lsEvents.find((e) => e.event.id == id).event.assign.map(
                        (e) => e.telefono
                    );

                    // Enviar mensaje de whatsapp
                    wsp(telefono, mensaje);
                    alert({
                        icon: "success",
                        title: "Mensaje enviado",
                        text: "Mensaje enviado correctamente",
                        timer: 1000,
                    });
                },
            },

            cancel: {
                label: "Cerrar",
                className: "btn-secondary",
            },
        },
    }).on("shown.bs.modal", function () {
        $("#whatsappMessage").focus();
    });
}
// Función para obtener la duration en days de FullCalendar
function restarFechas(fecha1, fecha2) {
    // Convertir las fechas a objetos Date
    const date1 = new Date(fecha1 + " 00:00:00");
    const date2 = new Date(fecha2 + " 00:00:00");

    // Obtener la diferencia en milisegundos
    const diferenciaMilisegundos = Math.abs(date2.getTime() - date1.getTime());

    // Obtenemos los milisegundos por dia
    const milisegundosPorDia = 24 * 60 * 60 * 1000; // Milisegundos en un día

    // Dividir por milisegundos por día y agregar 1 para incluir ambos extremos
    return (diferenciaMilisegundos / milisegundosPorDia) + 1;
}
// Estados de evento
function eventStatus(statusEvent) {
    let status = "";
    switch (statusEvent) {
        case "Pendiente":
            status = `<div class="not-started rounded-pill text-center d-inline-block pe-1 ps-1">
                    <div style="margin-right: 5px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(205, 73, 69); display: inline-flex; flex-shrink: 0;"></div>${statusEvent}</div>`;
            break;
        case "Revisado":
            status = `<div class="completed rounded-pill text-center d-inline-block pe-1 ps-1">
                    <div style="margin-right: 5px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(45, 153, 100); display: inline-flex; flex-shrink: 0;"></div>${statusEvent}</div>`;
            break;
        case "Pausado":
            status = `<div class="paused rounded-pill text-center d-inline-block pe-1 ps-1">
                    <div style="margin-right: 5px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color: #7861B2; display: inline-flex; flex-shrink: 0;"></div>${statusEvent}</div>`;
            break;
        case "Cancelado":
            status = `<div class="cancelled rounded-pill text-center d-inline-block pe-1 ps-1">
                    <div style="margin-right: 5px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color: #FF0000; display: inline-flex; flex-shrink: 0;"></div>${statusEvent}</div>`;
            break;
    }

    return status;
}
// Estados de usuario
function userStatus(statusUser) {
    let status = "";
    switch (statusUser) {
        case "Pendiente":
            status = `<div class="not-started rounded-pill text-center d-inline-block pe-1 ps-1">
                    <div style="margin-right: 5px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(205, 73, 69); display: inline-flex; flex-shrink: 0;"></div>${statusUser}</div>`;
            break;
        case "En proceso":
            status = `<div class="in-progress rounded-pill text-center d-inline-block pe-1 ps-1">
                    <div style="margin-right: 5px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(202, 142, 27); display: inline-flex; flex-shrink: 0;"></div>${statusUser}</div>`;
            break;
        case "Terminado":
            status = `<div class="completed rounded-pill text-center d-inline-block pe-1 ps-1">
                    <div style="margin-right: 5px; margin-bottom:2px; border-radius: 99px; height: 8px; width: 8px; background-color: rgb(45, 153, 100); display: inline-flex; flex-shrink: 0;"></div>${statusUser}</div>`;
            break;
    }

    return status;
}
// Prioridades
function priorityEvent(priority) {
    let prioridad = "";
    switch (priority) {
        case "Alta":
            prioridad = `<div class="bg-danger text-white rounded text-center d-inline-block pe-1 ps-1">🔥${priority}</div>`;
            break;
        case "Media":
            prioridad = `<div class="in-progress rounded text-center d-inline-block pe-1 ps-1">⚠️${priority}</div>`;
            break;
        case "Baja":
            prioridad = `<div class="completed rounded text-center d-inline-block pe-1 ps-1" style="color: white !important">🟢${priority}</div>`;
            break;
    }
    return prioridad;
}

// FINAL FINAL. NO TOCAR.
// FINAL FINAL ESTE SI.