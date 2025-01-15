// let ctrl = "ctrl/app.php";
const link = 'https://erp-varoch.com/DEV/costsys/ctrl/ctrl-costo-potencial-soft.php';


// init vars.
let app, desplazamiento;


$(async () => {
    await fn_ajax({ opc: "init" }, link).then((data) => {
        
        // vars.
       
        
        // instancias.

        app = new App(link,'root');
     

        // Instanciar.
        desplazamiento = new Desplazamiento(link, '');
        desplazamiento.init();
   
    
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
     
    }

    layout() {

        this.primaryLayout({ parent:'root', id:'Costsys' });

        this.tabsLayout({
            
            parent: "containerCostsys",
            id    : "container",

            json  : [
                { 
                    tab:'Desplazamientos' , id: 'tab-desplazamientos',active:true ,
                    contenedor: [
                        { id: 'filterBarDesplazamientos',class:'line' },
                        { id:'containerDesplazamiento',class: 'line my-2'},
                    ]
                
                },

                { tab:'Costo potencial' ,id: 'tab-costo-potencial'},

            ]
        });

    }


    filterBar(options) {

  

        this.createfilterBar({
            parent: "filterBarCostsys",
            data: [
                { opc: "select", class: "col-3", id: "UDNs", lbl: "Seleccionar UDN: ", data: [{id: 4, valor:'BAOS'}] },
                { opc: "select", class: "col-2", id: "Anio", lbl: "Seleccionar Año: ", data: [{id: 2025, valor:'2025'}] },
                { opc: "select", class: "col-2", id: "Mes", lbl: "Seleccionar mes:", data: [{id: 1, valor:'ENERO'}] },
            ],
        });


     
    }

    
}
