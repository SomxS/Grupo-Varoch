window.ctrl = "ctrl/app.php";

class Calendarizacion extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    render() {
        this.layout();
        this.filterBar({ type: typeFilter });
        this.ls();
    }

    async getListEmployed() {
        let data = await useFetch({
            url: this._link,
            data: { opc: "getListEmployed", udn: $("#id_UDN").val() },
        });

        $("#id_Employed").attr("multiple", true);
        $("#id_Employed").option_select({ select2: true, father: true, data: data.employeds, multiple: true });
    }

    // GESTIONAR EVENTO
    modalNewEvent() {
        this.modalFormEvents({
            bootbox: { title: "Nuevo Evento ", id: "modalNuevoEvento", size: "large" },
            data: { opc: "addEvent" },
            success: (data) => {
                if (data.success === true) {
                    alert({ text: "Se ha creado un nuevo evento" });
                    this.ls();
                }
            },
        });
    }

    async addEvent(opc) {
        let formData = new FormData($("#mdlEvent")[0]);

        const datos = {};
        formData.forEach((value, key) => (datos[key] = value));

        datos.id_Employed = $("#id_Employed").val();
        datos.opc = opc;

        const data = await fn_ajax(datos, this._link);

        if (data.success === true) {
            alert();
            temporadas = data.temporada;
            this.ls();
            closedModal();
        }
    }

    async editModal(id) {
        // get data.
        let data = await useFetch({ url: this._link, data: { opc: "getEvent", id: id } });
        // create component.

        this.modalFormEvents({
            id: "containerModalEdit",
            bootbox: { title: "Editar Evento ", id: "modalNuevoEvento", size: "large" },
            data: { opc: "updateEvent", id: id },
            autofill: data,
            success: (data) => {
                if (data.success === true) {
                    alert({ text: "Se ha editado el evento" });
                    this.ls();
                }
            },
        });

        $("#id_Season").val(data.id_Season).trigger("change");

        // // ESTO SE TIENE QUE CORREGIR, !! OJO, el autofill funciona unicamente con componentes html.
        setTimeout(() => {
            // $("#id_Employed").val(data.id_Employed);
            const valores = $("#id_Employed option")
                .map(function () {
                    return $(this).val();
                })
                .get();

            $("#id_Employed").val(data.id_Employed).trigger("change");
        }, 400);
    }

    // ACTUALIZAR ESTADOS
    async statusEvents(id_status, id_Event, year, title) {
        const lblStatus = ["", "", "Comenzar", "Pausar", "Finalizar", "Eliminar", "Reanudar"];

        const result = await alert({
            icon: "question",
            title: lblStatus[id_status] + " evento",
            text: "¿Estás seguro de " + lblStatus[id_status].toLowerCase() + ' el evento "' + title.toLowerCase() + '"?',
        });

        if (result.isConfirmed) {
            id_status = id_status == 6 ? 2 : id_status;
            fn_ajax({ opc: "statusEvents", id_status, id_Event, year }, this._link).then((data) => {
                if (data === true) {
                    alert();
                    this.ls();
                }
            });
        }
    }

    // ACTIVIDADES
    activitiesModal(id) {
        let tr = $(event.target).closest("tr");
        let udn = tr.find("td").eq(1).text();
        let temporada = tr.find("td").eq(2).text();
        let titulo = tr.find("td").eq(3).text();

        useFetch({
            url: this._link,
            data: { opc: "getActivities", id },
            success: (data) => {
                bootbox.dialog({
                    title: `${udn} - ${titulo} (${temporada})`,
                    size: "large",
                    closeButton: true,
                    message: `
                            <div class="row mb-3">
                                <div class="col-12">
                                    <label class="col-12 mb-3 font-bold">Actividades:</label>
                                    <textarea class="form-control textarea" rows="5" required="required" placeholder="No hay actividades" id="txtActivities" disabled></textarea>
                                </div>
                            </div>
                            `,
                });
                $("#txtActivities").val(data);
            },
        });
    }

    // RETROALIMENTACIÓN
    feedBackModal(id) {
        let area = parseInt(calendarizacion.getCookie("IDA"));
        let form = "";
        if (area == 36) {
            form = `<form class="row" id="formFeedback" novalidate>
                        <div class="col-12 mb-3">
                            <textarea class="form-control textarea" rows="4" required="required" placeholder="Escribe aquí..."></textarea>
                        </div>
                        <div class="col-12">
                            <div class="row d-flex justify-content-between mt-3">
                                <div class="col-5" id="containerBtnSubmit">
                                    <button type="submit" class="btn btn-primary col-12"><small>GUARDAR</small></button>
                                </div>
                                <div class="col-5">
                                    <button type="button" class="btn btn-outline-danger col-12" data-bs-dismiss="modal"><small>CANCELAR</small></button>
                                </div>
                            </div>
                        </div>
                    </form>`;
        }

        bootbox.dialog({
            title: "<h3>RETROALIMENTACIÓN</h3>",
            size: "large",
            closeButton: true,
            message: `
                <div class="row mb-3">
                    <div class="col-12" id="containerTableFeed">
                    </div>
                </div>
                ${form}
                `,
        });

        $("#formFeedback").validation_form({}, function (result) {
            // $("#formFeedback button[type='submit']").attr("disabled", "disabled");
            calendarizacion.addFeedback(id);
        });
        calendarizacion.lsFeedBack(id);
    }

    lsFeedBack(id) {
        this.createTable({
            parent: "containerTableFeed",
            idFilterBar: "filterBarFeed",
            data: { opc: "lsFeedbacks", id: id },
            conf: { datatable: false, pag: 15 },
            attr: {
                class_table: "table table-bordered table-sm table-striped text-uppercase",
                id: "lsTbFeed",
                center: [1, 2],
            },
        });


    }

    addFeedback(idEvent) {
        let year = parseInt(new Date().getFullYear());
        let usser = parseInt(calendarizacion.getCookie("IDU"));
        let date = new Date().toISOString().slice(0, 10);
        let datos = {
            opc: "addFeedback",
            id_Event: idEvent,
            year: year,
            date: date,
            feedback: $("#formFeedback textarea").val(),
            id_usser: usser,
        };

        fn_ajax(datos, ctrl).then((response) => {
            console.log('respuesta: ', response);

            if (response.status == 200) {
                alert({ icon: "success", text: response.message });
                calendarizacion.lsFeedBack(idEvent);
                // $("#formFeedback button[type='submit']").removeAttr("disabled");
                $("#formFeedback textarea").val("");
            } else {
                alert({ icon: "error", text: response.message });
                // $("#formFeedback button[type='submit']").removeAttr("disabled");
            }
        });
    }

    editFeedback(id, idEvent) {
        let datos = {
            opc: "getByIdFeedback",
            id: id,
        };

        fn_ajax(datos, ctrl).then((response) => {
            if (response.status == 200) {
                $("#containerBtnSubmit").html(`<a class="btn btn-primary col-12" id="btnUpdateFeed" onclick="calendarizacion.updateFeedback(${id}, ${idEvent})"><small>ACTUALIZAR</small></a>`);
                response.data.forEach((element) => {
                    $("#formFeedback textarea").val(element.valor);
                });
            } else {
                alert({ icon: "error", text: response.message });
            }
        });
    }

    updateFeedback(id, idEvent) {
        let jsonUpdate = {
            opc: "editFeedback",
            feedback: $("#formFeedback textarea").val(),
            idFeedback: id,
        };

        fn_ajax(jsonUpdate, ctrl).then((response) => {
            if (response.status == 200) {
                alert({ icon: "success", text: response.message, time: 1000 });
                $("#formFeedback textarea").val("");
                $("#containerBtnSubmit").html('<button type="submit" class="btn btn-primary col-12"><small>GUARDAR</small></button>');
                setTimeout(() => {
                    calendarizacion.lsFeedBack(idEvent);
                }, "1000");
            } else {
                alert({ icon: "error", text: response.message });
            }
        });
    }

    deleteFeedback(id, idEvent) {
        let datos = {
            opc: "destroyFeedback",
            idFeedback: id,
        };

        fn_ajax(datos, ctrl).then((response) => {
            if (response.status == 200) {
                alert({ icon: "success", text: response.message });
                calendarizacion.lsFeedBack(idEvent);
            } else {
                alert({ icon: "error", text: response.message });
            }
        });
    }

    // RECORDATORIOS
    reminderModal(id) {
     
        bootbox.dialog({
            title: `<h1>RECORDATORIOS</h1>`,
            size: "xl",
            closeButton: true,
            message: `
              
                <form class="" id="formReminder" novalidate> 

                    <div class="row" id="filterBarReminder">

                     <div class="col-6 mb-3"  >
                    <label class="col-12 font-bold mb-2">Selecciona una UDN:</label>
                        <select class="form-select" id="cbUDNReminder" name="udn"  onchange="calendarizacion.lsReminder()">
                        </select>
                    </div>
                    <div class="col-6 mb-3">
                        <label class="col-12 font-bold mb-2">Selecciona eventos a recordar:</label>
                        <select class="form-select w-full" id="cbEventsList" name="reminder" onchange="calendarizacion.lsReminder()">
                            <option value="hoy">EVENTOS DEL DÍA DE HOY</option>
                            <option value="siete_dias">EVENTOS DE LOS PRÓXIMOS 7 DÍAS</option>
                            <option value="atrasados">EVENTOS ATRASADOS</option>
                        </select>
                    </div>
                    
                    </div>
                   

                    <div class="col-12 h-92" id="containerTableReminder">
                    </div>
                    <div class="col-12">
                        <div class="row d-flex justify-content-between mt-3">
                            <div class="col-5">
                                <button type="submit" class="btn btn-primary col-12"><small>ENVIAR RECORDATORIOS</small></button>
                            </div>
                            <div class="col-5">
                                <button type="button" class="btn btn-outline-danger col-12" data-bs-dismiss="modal"><small>CANCELAR</small></button>
                            </div>
                        </div>
                    </div>
                </form>
                `,
        });




        $("#cbUDNReminder").option_select({ select2: false, father: true, data: udn });
        $("#formReminder").validation_form({}, function (result) {

            // $("#formReminder button[type='submit']").attr("disabled", "disabled");
            calendarizacion.sendRecorder();

        });

        calendarizacion.lsReminder(id);
    }

    sendIndividualRecorder(id) {
        let tr = $(event.target).closest("tr");
        let title = tr.find("td").eq(2).text();

        this.swalQuestion({
            opts: { title: `¿Deseas enviar el recordatorio de ${title} ?` },
            data: {
                opc: 'sendIndividualRecorder',
                idList: id 
            },
            methods: {
                request: (data) => {
                    if (data.status == true) {
                        alert({ title: 'Se ha enviado correctamente', timer: 500 });
                    } else {
                        alert('Ocurrió un error, verificar con soporte');
                    }
                }
            }
        });
    }

    sendRecorder() {

        this.swalQuestion({
            opts: { title: `Deseas enviar la lista de recordatorios `  },
            data: { opc: 'sendRecorders', udn: $('#cbUDNReminder').val(), reminder: $('#cbEventsList').val()},
            methods: {
                request: (data) => {
                    if (data.status == 200) {

                        alert({title:'Se ha enviado correctamente ',timer:1000});
                        
                    }else{
                        alert('Ocurrio un error, verificar con soporte');
                    }

                }
            }
        });

    }

    lsReminder(id) {
        this.createTable({
            parent: "containerTableReminder",
            idFilterBar: "filterBarReminder",
            data: { opc: "lsReminders", id: id },
            conf: { datatable: true, pag: 10 },
            attr: {
                class: "table table-bordered table-sm text-uppercase",
                id         : "lsTbFeed",
                center     : [1, 2, 6],
                extends    : true,
            },


        });
    }

    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Verifica si la cookie comienza con el nombre deseado
                if (cookie.substring(0, name.length + 1) === name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}
