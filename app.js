
// Variables.
let app;

// Init components.
$(function () {
    app = new App('', '');
    app.init();
});

// The 'App' class organizes and manages all elements available to other application classes.
class App extends Templates {
    
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    init() {
        this.showGrid(); // Initializes the grid.
        this.layout();   // Configures the layout.
    }

    // Configures the main layout of the application.
    layout() {
        this.splitLayout({
            parent: 'splitLayout',
            id: 'split',
        });

        this.verticalLinearLayout({
            parent: 'verticalLinearLayout'
        });

        this.primaryLayout({
            parent: 'primaryLayout',
            id: 'primary',
        });

        this.secondaryLayout({
            parent: 'secondaryLayout',
            id: 'secondary',
        });

        this.tabsLayout({
            parent: 'tabsLayout',
            json: [ // JSON data for the tabs.
                { tab: 'tab1', active: true, onClick: () => console.log('tabs') },
                { tab: 'tab2',  onClick: () => console.log('tabs2') }
            ]
        });
    }

    // Creates the main grid with its respective layouts.
    showGrid() {
        this.createLayaout({
            
            parent: 'root',
           
         
            data: {
                id: "singleLayout",
                class: "flex grid grid-cols-3 gap-2",

                contenedor: [
                    { type: 'div', id: 'splitLayout', class: 'h-52 w-100' },
                    { type: 'div', id: 'verticalLinearLayout', class: 'h-52 w-100 border' },
                    { type: 'div', id: 'accordionLayout', class: 'h-52 w-100 border' },
                    { type: 'div', id: 'primaryLayout', class: 'w-100 h-52 border' },
                    { type: 'div', id: 'secondaryLayout', class: 'w-100 border' },
                    { type: 'div', id: 'tabsLayout', class: 'w-100 h-52 border' },
                ]
            }
        });
    }
}
