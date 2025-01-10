let app;
const ctrl = 'ctrl/ctrl-admin.php';


/* Init components */
$(function () {
    fn_ajax({ opc: 'init' }, ctrl).then((data) => {


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
        // this.filterBar();
    }


    layout(){
        this.primaryLayout({ parent: 'layout' });
    }




    filterBar() {
        const filter = [
            {
                opc: "input-calendar",
                lbl: "Fecha",
                id: "iptCalendar",
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

        this.createfilterBar({ parent: 'filterBar', data: filter });


    }




}