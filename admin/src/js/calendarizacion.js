window.ctrl = "ctrl/app.php";

class Calendarizacion extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);

    }

    render() {
        this.layout();
        this.filterBar({ type: "admin" });
        this.ls();

        $('#containerCalendarizacion').append('Hello world');
    }

    modalNewEvent() {

        this.modalFormEvents({
            bootbox: { title: "Nuevo Evento ", id: "modalNuevoEvento", size: "large" },
            data: { opc: "addEvent" },
            success: (data) => {
                if (data.success === true) {
                    alert({text:'Se ha creado un nuevo evento'});
                    this.ls();
                }
            }
        });
        
    }


    async editModal(id) {
        // get data.
        let data = await useFetch({ url: this._link, data: { opc: "getEvent", id: id } });

        console.warn(data.id_Season);
        // create component.

        this.modalFormEvents({
            id: 'containerModalEdit',
            bootbox: { title: "Editar Evento ", id: "modalNuevoEvento", size: "large" },
            data: { opc: "updateEvent", id: id },
            autofill: data,
            success: (data) => {
            
                // if (data.success === true) {
                alert({ text: "Se ha editado el evento" });
                this.ls();
                // }
            },
        });

        $("#id_Season").val(data.id_Season).trigger("change");
       
        setTimeout(() => {
         
            const valores = $("#id_Employed option")
                .map(function () {
                    return $(this).val();
                })
                .get();


            console.log(data.id_Employed);
            
            $("#id_Employed").val(data.id_Employed).trigger("change");

        }, 400);
    }


    modalFormEvents(options){

        let defaults = {
            id: "mdlEvent",
            
            bootbox: { title: "editar Evento ", id: "modalNuevoEvento", size: "large" },
            json: [
                { id: "id_UDN", opc: "select", lbl: "UDN:", data: udnForm, value: 8, class: "col-12", required: false, onchange: "calendarizacion.getListEmployed()" },
                { id: "title", opc: "input", lbl: "Titulo:", required: true, class: "col-12", required: true },
                { id: "id_Season", opc: "select", lbl: "Temporada", data: temporadas, class: "col-12" },
                { id: "id_Replay", opc: "select", lbl: "Repetir evento:", data: [{ id: 1, valor: "Anual" }], class: "col-12" },
                { id: "date_init", opc: "input-calendar", class: "col-6", lbl: "Fecha inicial:" },
                { id: "date_end", opc: "input-calendar", class: "col-6", lbl: "Fecha final:" },
                { id: "activities", opc: "textarea", class: "col-12", lbl: "Actividades", rows: 5, required: true },
                { id: "id_Employed", opc: "select", class: "col-12", lbl: "Responsable (s):", multiple: true },
            ],

            validation: true,
         
            dynamicValues: {
                id_Employed: "#id_Employed",
            },
            success: (data) => {

                if (data.success === true) {
                    alert();
                    temporadas = data.temporada;
                    this.ls();
                }
            }
        }; 


        let opts = this.ObjectMerge(defaults,options)

     
        this.createModalForm(opts);
        // initialized.
        this.getListEmployed();
        // datapicker
        dataPicker({ parent: "date_init", type: "simple" });
        dataPicker({ parent: "date_end", type: "simple" });
        // select2
        $("#id_Season").option_select({ select2: true,  father: true });
    




    }


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

    async getListEmployed() {
        let data = await useFetch({
            url: this._link,
            data: { opc: "getListEmployed", udn: $("#id_UDN").val() },
        });

        $("#id_Employed").attr("multiple", true);
        $("#id_Employed").option_select({ select2: true, father: true, data: data.employeds, multiple: true });
    }

    feedBackModal(id, year) {
        let dialog = bootbox.dialog({
            title: 'A custom dialog with buttons and callbacks',
            message: "<p>This dialog has buttons. Each button has it's own callback function.</p>",
            size: 'large',
            closeButton: true,
            buttons: {
                cancel: {
                    label: "I'm a cancel button!",
                    className: 'btn-danger',
                    callback: function () {
                        console.log('Custom cancel clicked');
                    }
                },
                noclose: {
                    label: "I don't close the modal!",
                    className: 'btn-warning',
                    callback: function () {
                        console.log('Custom button clicked');
                        return false;
                    }
                },
                ok: {
                    label: "I'm an OK button!",
                    className: 'btn-info',
                    callback: function () {
                        console.log('Custom OK clicked');
                    }
                }
            }
        });
    }

    feedBackModal(id) {
    
        bootbox.dialog({
            title: "<h3>RETROALIMENTACIÓN</h3>",
            size: "large",
            closeButton: true,
            message: `
                <div class="row mb-3">
                    <div class="col-12" id="containerTableFeed">
                    </div>
                </div>
                <form class="row" id="formFeedback" novalidate>
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
                </form>
                `,
        });
        $("#formFeedback").validation_form({}, function (result) {
            $("#formFeedback button[type='submit']").attr("disabled", "disabled");
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
            if (response.status == 200) {
                alert({ icon: "success", text: response.message });
                calendarizacion.lsFeedBack(idEvent);
                $("#formFeedback button[type='submit']").removeAttr("disabled");
                $("#formFeedback textarea").val("");
            } else {
                alert({ icon: "error", text: response.message });
                $("#formFeedback button[type='submit']").removeAttr("disabled");
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
