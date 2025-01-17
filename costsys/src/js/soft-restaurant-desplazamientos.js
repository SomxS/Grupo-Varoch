class Desplazamiento extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    render() {
        this.createNavBar();
        this.layout();

        this.filterBarDesplazamiento();
        // this.filterBar();
        // this.ls();
    }

    filterBarDesplazamiento(options) {

        this.createfilterBar({
            parent: "filterBarDesplazamientos",
            data: [
                { opc: "input-calendar", class: "col-3", id: "calendar", lbl: "Selecciona una fecha" },
                { opc: 'button', class:'col-3',color_btn:'outline-primary', text : 'Detallado' ,onClick:()=>this.ls()}
               ],
        });

        // initialized.
        dataPicker({
            parent: "calendar",
            onSelect: (start, end) => { this.ls(); },
        });
    }

    ls() {

        let rangePicker = getDataRangePicker("calendar");

        this.createTable({
            
            parent      :"containerDesplazamiento",
            idFilterBar :"filterBarCostsys",

            data       : { 
            
                opc      : "lsDesplazamiento",
                date_init: rangePicker.fi,
                date_end : rangePicker.ff
            
            },
            conf       : { datatable: false, pag: 15 },

            attr: {
                color_th: 'bg-primary',
                color:'bg-default',
                class: "table table-bordered table-sm ",
                f_size:12,
                id: "lsTable",
                center: [1, 6, 7],
                extends: true,

            },
        });



    }





}