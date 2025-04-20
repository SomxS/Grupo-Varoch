let api = 'ctrl/ctrl-admin.php';
let app;
let rol, sucursal;
// initial 
$(function () {

    fn_ajax({ opc: "init" }, api).then((data) => {

        rol = data.rol;
        sucursal = data.sucursal;

        app = new User(api, 'root');
        app.render();


    });
});

class User extends Template {
    constructor(link, divModule) {
        super(link, divModule);
        this.PROJECT_NAME = "User";
    }


    render() {
        this.layout();
        
    }

    layout() {
        this.primaryLayout({
            parent: `root`,
            id: this.PROJECT_NAME,
            class: 'd-flex mx-2 my-2 h-100 mt-5 p-3',
            card: {
                filterBar: { class: 'lg:h-[12%] line', id: "filterBar" + this.PROJECT_NAME },
                container: { class: 'lg:h-[88%] line', id: "container" + this.PROJECT_NAME },
            },
        });

        this.newUserLayout();
    }

    newUserLayout() {
        $('#containerUser').empty();
        this.createTableForm({
            parent: 'containerUser',
            id: 'Users',
            classForm: 'col-12 border border-gray-200 rounded-lg p-3',
            title: '',
            table: {
                id: 'tbUsers',
                conf: { datatable: true, beforeSend: false },
                data: { opc: "lsUsers" },
                attr: {
                    color_th: 'bg-[#374151] text-white p-2',
                    id: 'tbUser',
                },
                success: (data) => { },
            },
            form: {
                data: { opc: 'addUser' },
                json: [
                    {
                        opc  : "select",
                        lbl  : "Rol",
                        id   : "rol_id",
                        class: "col-12",
                        data : rol
                    },
                    {
                        opc: "select", lbl: "Sucursal", id: "subsidiaries_id", class: "col-12",
                        data: sucursal
                    },
                    { opc: "input", lbl: "Nombre", id: "user", class: "col-12", tipo: "texto", required: true },
                    {
                        opc    : "input-group",
                        lbl    : "Contraseña",
                        id     : "key",
                        icon   : 'icon-key',
                        type   : 'password',
                        onkeyup: '',
                        class  : "col-12"
                    },
                    { opc: "btn-submit", id: "btnAgregar", text: "Agregar", class: "col-12" }
                ],
            },
            success: (data) => {
                alert();
            }
        });
    }

    ls() {
        $('#contentTableUsers').empty();
        this.createTable({
            parent: "contentTableUsers",
            idFilterBar: "filterBarUser",
            data: { opc: "lsUsers" },
            conf: { datatable: true, pag: 10 },
            attr: {
                id: "tbUser",
            },
        });
    }

    async edit(id) {

        let data = await useFetch({ url: this._link, data: { opc: 'getUser', id: id }   });

        $('#contentFormUsers').empty();
        $('#contentFormUsers').off();

        this.createForm({
            parent: 'contentFormUsers',
            autofill: data.user,
            autovalidation: false,
            data: { opc: 'editUser', id: id },
            json: [
                {
                    opc: "select", lbl: "Rol", id: "usr_rols_id", class: "col-12",
                    data: rol
                },
                {
                    opc: "select", lbl: "Sucursal", id: "subsidiaries_id", class: "col-12",
                    data: sucursal
                },
                { opc: "input", lbl: "Nombre", id: "user", class: "col-12", tipo: "texto", required: true },
                { opc: "btn-submit", id: "btnActualizar", text: "Actualizar", class: "col-6" },
                {
                    opc: "button",
                    className: 'w-100',
                    color_btn: 'danger',
                    id: "btnSalir",
                    text: "Cancelar",
                    class: "col-6",
                    onClick: () => {
                        this.newUserLayout();
                    }
                }
            ],
            success: (request) => {
                this.newUserLayout();
            }
        });
    }

    delete(id) {
        let tr = $(event.target).closest("tr");
        let title = tr.find("td").eq(0).text();
        this.swalQuestion({
            opts: { title: `¿Deseas eliminar el usuario ${title} ?` },
            data: {
                opc: "deleteUser",
                enabled: 0,
                id: id,
            },
            methods: {
                request: (response) => {
                    if (response.status == 200) {
                        alert({ icon: "success", text: response.message });
                        this.lsUsers();
                    } else {
                        alert({ icon: "error", text: response.message });
                    }
                }
            }
        });
    }
}
