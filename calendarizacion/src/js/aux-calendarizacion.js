class Calendarizacion extends App {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    render() {
        this.layout();
        this.filterBar({ type: "" });
        this.lsEvents();
    }

    lsEvents() {
        this.ls({ type: "admin" });
    }
}
