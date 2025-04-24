
// Variables.
let app;

let api = "https://erp-varoch.com/DEV/calendarizacion/ctrl/app.php";

// Init components.
$(function () {

    fn_ajax({ opc: "init" }, link).then((data) => {
     
        app = new App(api, "root");
        app.init();

    });

});

class App extends Template {
    init() { 
        this.render();
    }

    render() {
        this.layout();
     }

    layout(){

    }

    filterBar(){

    }

    // List primary

    // Crud primary Proyect
    // Tomar como base el verbo(edit,cancel,add...)
    // seguido del sustantivo en dado si aplica poner el nombre del componente.

    show() { }
    add() { }
    edit(id) { }
    cancel(id) { }

    // Crud secondary Proyect

    show() { }
    add() { }
    edit(id) { }
    cancel(id) { }

    // Crud terciario ( En caso de tener mas de 4 , hay que revisar proyecto )

    // Funciones auxiliares
}