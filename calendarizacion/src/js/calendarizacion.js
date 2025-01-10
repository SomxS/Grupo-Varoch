window.ctrl = "ctrl/app.php";

class Calendarizacion extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);

        form_elements = [
            { id: "id_UDN", opc: "select", lbl: "UDN:", data: udn, value: 8, class: "col-12", required: false, onchange: "calendarizacion.getListEmployed()" },
            { id: "title", opc: "input", lbl: "Titulo:", required: true, class: "col-12", required: true },
            { id: "id_Season", opc: "select", lbl: "Temporada", data: temporadas, class: "col-12" },
            { id: "id_Replay", opc: "select", lbl: "Repetir evento:", data: [{ id: 1, valor: "Anual" }], class: "col-12" },
            { id: "date_init", opc: "input-calendar", class: "col-6", lbl: "Fecha inicial:" },
            { id: "date_end", opc: "input-calendar", class: "col-6", lbl: "Fecha final:" },
            { id: "activities", opc: "textarea", class: "col-12", lbl: "Actividades", rows: 5, required: true },
            { id: "id_Employed", opc: "select", class: "col-12", lbl: "Responsable (s):", multiple: true },
            { opc: "button", onClick: () => this.successEvent("addEvent"), text: "Enviar", class: "col-12" },
        ];
    }

    render() {
        this.layout();
        this.filterBar({ type: "admin" });
        this.ls();
    }

    modalNewEvent() {
        this.createModalForm({
            id: "mdlEvent",
            bootbox: { title: "Nuevo Evento ", id: "modalNuevoEvento", size: "large" },
            json: form_elements,
        });

        // initialized.
        this.getListEmployed();
        // datapicker
        dataPicker({ parent: "date_init", type: "simple" });
        dataPicker({ parent: "date_end", type: "simple" });
        // select2
        $("#id_Season").option_select({ select2: true, tags: true, father: true });
    }

    async successEvent(opc) {
        let formData = new FormData($("#mdlEvent")[0]);

        const datos = {};
        formData.forEach((value, key) => (datos[key] = value));

        datos.id_Employed = $("#id_Employed").val();
        datos.opc = opc;

        const data = await fn_ajax(datos, this._link);
        console.error(data);

        if (data.success === true) {
            alert();
            temporadas = data.temporada;
            this.ls();
            closedModal();
        }
    }

    editModal(id) {
        this.createModalForm({
            id: "mdlEvent",
            bootbox: { title: "Nuevo Evento ", id: "modalNuevoEvento", size: "large" },
            json: form_elements,
            autovalidation: true,
            data: { opc: "editEvent", id },
            success: (data) => {},
        });
    }
    async statusEvents(id_status, id_Event, year, title) {
        const lblStatus = ["Eliminar", "", "Comenzar", "Pausar", "Finalizar", "Reanudar"];

        const result = await alert({
            icon: "question",
            title: lblStatus[id_status] + " evento",
            text: "¿Estás seguro de " + lblStatus[id_status].toLowerCase() + ' el evento "' + title.toLowerCase() + '"?',
        });

        if (result.isConfirmed) {
            id_status = id_status == 5 ? 2 : id_status;
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
}
