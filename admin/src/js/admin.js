let app;
const ctrl = 'ctrl/ctrl-admin.php';

let udn;

/* Init components */
$(function () {
    fn_ajax({ opc: 'init' }, ctrl).then((data) => {

        udn = data.udn;

        // Instanciar.
        app = new App(ctrl, '');
        app.init();
    });

});



class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    init() {
        this.render();
    }


    render(){
        this.layout();
        this.filterBar();
    }


    layout(){
        this.primaryLayout({ parent: 'root' ,id:'Admin'});
    }






    filterBar() {
        const filter = [
            {
                opc: "select",
                lbl: "Selecciona una udn",
              
                data: udn,
                class: 'col-sm-4 col-12'
            },


            {
                opc: 'btn',
                class: 'col-sm-3',
                color_btn: 'secondary',
                text: 'Buscar',
                fn: '',
            },

        ];

        this.createfilterBar({ parent: 'filterBarAdmin', data: filter });


    }




}