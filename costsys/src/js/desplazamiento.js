class Desplazamiento extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.link = link;
        this.div_modulo = div_modulo;
    }

    init() {
        this.render();
    }

    render() {
        this.createNavBar();
        this.layout();
        this.filterBar();
        this.ls();
    }

    layout() {
        $(`#${this.div_modulo}`).html(`
            <div class="container-fluid">
                <div id="filterBarDesplazamientos" class="row mb-3"></div>
                <div id="containerDesplazamiento" class="row"></div>
            </div>
        `);
    }

    filterBar() {
        this.createfilterBar({
            parent: "filterBarDesplazamientos",
            data: [
                { 
                    opc: "input-calendar", 
                    class: "col-6 col-sm-4 col-lg-3", 
                    id: "calendar", 
                    lbl: "Selecciona una fecha" 
                },
                { 
                    opc: 'select', 
                    id: 'typeReport', 
                    class: 'col-6 col-sm-4 col-lg-2', 
                    lbl: 'Tipo de reporte', 
                    data: [
                        { id: 1, valor: 'desglozado' }, 
                        { id: 2, valor: 'resumido' }
                    ], 
                    onChange: () => this.ls() 
                },
                { 
                    opc: 'button', 
                    class: 'col-6 col-sm-2 col-lg-2',
                    className: 'w-full', 
                    color_btn: 'soft', 
                    text: 'Subir despl.', 
                    onClick: () => this.messageUpload() 
                },
                { 
                    opc: 'button', 
                    class: 'col-6 col-sm-2 col-lg-2', 
                    className: 'w-full', 
                    color_btn: 'outline-primary', 
                    text: 'Subir despl.', 
                    onClick: () => this.lsDesp() 
                }
            ]
        });

        dataPicker({
            parent: "calendar",
            rangepicker: {
                ranges: {
                    'Hoy': moment().subtract(1, "days"),
                    "Primeros 5 dias": [
                        moment().startOf("month"),
                        moment().startOf("month").add(5, "days")
                    ],
                    "Primera Quincena": [
                        moment().startOf("month"),
                        moment().startOf("month").add(14, "days")
                    ],
                    "Ultima quincena": [
                        moment().startOf("month").add(15, "days"),
                        moment().endOf("month")
                    ]
                },
                showDropdowns: true,
                autoApply: true
            },
            onSelect: (start, end) => { this.ls(); }
        });
    }

    messageUpload() {
        let month = $('#Mes option:selected').text();
        let year = $('#Anio option:selected').text();
        
        this.swalQuestion({
            opts: {
                title: `¿Deseas subir el desplazamiento del mes de ${month} del ${year}?`,
                text: 'Esta acción actualizará la información del costo potencial'
            },
            data: {
                opc: 'updateDesplazamiento',
                UDNs: $('#UDNs').val(),
                Clasificacion: $('#Clasificacion').val(),
                Anio: $('#Anio').val(),
                Mes: $('#Mes').val(),
                subir: 1
            },
            methods: {
                request: (data) => {
                    $('#containerDesplazamiento').rpt_json_table2({data: data});
                }
            }
        });
    }

    lsDesp() {
        this.createTable({
            parent: "containerDesplazamiento",
            idFilterBar: "filterBarCostsys",
            data: {
                opc: 'updateDesplazamiento',
                UDNs: $('#UDNs').val(),
                Clasificacion: $('#Clasificacion').val(),
                Anio: $('#Anio').val(),
                Mes: $('#Mes').val(),
                subir: 0
            },
            conf: { datatable: false, pag: 15 },
            attr: {
                color_th: 'bg-primary',
                color: 'bg-default',
                class: "table table-bordered table-sm",
                f_size: 10,
                id: "lsTable",
                center: [1, 6, 7],
                extends: true
            }
        });
    }

    ls() {
        let rangePicker = getDataRangePicker("calendar");

        this.createTable({
            parent: "containerDesplazamiento",
            idFilterBar: "filterBarCostsys",
            data: {
                opc: "lsDesplazamiento",
                date_init: rangePicker.fi,
                date_end: rangePicker.ff,
                type: $('#typeReport').val()
            },
            conf: { datatable: false, pag: 15 },
            attr: {
                color_th: 'bg-primary',
                color: 'bg-default',
                class: "table table-bordered table-sm",
                f_size: 10,
                id: "lsTable",
                center: [1, 6, 7],
                extends: true
            }
        });
    }
} 