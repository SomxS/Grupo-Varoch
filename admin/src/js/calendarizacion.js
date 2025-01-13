window.ctrl = "ctrl/app.php";

class Calendarizacion extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);

    }

    render() {
        this.layout();
        this.filterBar({ type: "admin" });
        this.ls();
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
        let data = await useFetch({ url:this._link, data: { opc:'editEvent',id:id}});
        // create component.

        this.modalFormEvents({
            bootbox: {title: "Editar Evento ", id: "modalNuevoEvento", size: "large"},
            data: { opc: 'editEvent', id: id },
            autofill: data,
        });
     
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
        $("#id_Season").option_select({ select2: true, tags: true, father: true });
    




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
}
