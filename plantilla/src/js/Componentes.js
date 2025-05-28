class UI extends Templates {

    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    // Create Tabs.
    tabLayout(options) {
        const defaults = {
            parent: "root",
            id: "tabComponent",
            type: "short", // 'short' | 'large'
            theme: "light", // 'dark' | 'light'
            class: "",
            renderContainer: true,

            json: [
                { id: "TAB1", tab: "TAB1", icon: "", active: true, onClick: () => { } },
                { id: "TAB2", tab: "TAB2", icon: "", onClick: () => { } },
            ]
        };

        const opts = Object.assign({}, defaults, options);

        const themes = {
            dark: {
                base: "bg-gray-800 text-white",
                active: "bg-blue-600 text-white",
                inactive: "text-gray-300 hover:bg-gray-700"
            },
            light: {
                base: "bg-gray-200 text-black",
                active: "bg-white text-black",
                inactive: "text-gray-600 hover:bg-white"
            }
        };

        const sizes = {
            large: "rounded-lg flex gap-1 px-1 py-1 w-full text-sm ",
            short: "rounded-lg flex  gap-1 p-1  px-1 py-1 text-sm "
        };

        const container = $("<div>", {
            id: opts.id,
            class: `${themes[opts.theme].base} ${sizes[opts.type]} ${opts.class}`
        });

        const equalWidth = opts.type === "short" ? `` : `flex-1`;

        opts.json.forEach(tab => {
            const isActive = tab.active || false;

            const tabButton = $("<button>", {
                id: `tab-${tab.id}`,
                html: tab.icon ? `<i class='${tab.icon} mr-2 h-4 w-4'></i>${tab.tab}` : tab.tab,
                class: `${opts.type === "short" ? "" : "flex-1"} flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
                 data-[state=active]:${themes[opts.theme].active} ${themes[opts.theme].inactive}`,
                "data-state": isActive ? "active" : "inactive",
                click: () => {
                    $(`#${opts.id} button`).each(function () {
                        $(this).attr("data-state", "inactive").removeClass(themes[opts.theme].active).addClass(themes[opts.theme].inactive);
                    });

                    tabButton.attr("data-state", "active").removeClass(themes[opts.theme].inactive).addClass(themes[opts.theme].active);

                    if (opts.renderContainer) {
                        $(`#content-${opts.id} > div`).addClass("hidden");
                        $(`#container-${tab.id}`).removeClass("hidden");
                    }

                    if (typeof tab.onClick === "function") tab.onClick(tab.id);
                }
            });

            container.append(tabButton);
        });

        $(`#${opts.parent}`).html(container);

        if (opts.renderContainer) {
            const contentContainer = $("<div>", {
                id: `content-${opts.id}`,
                class: "mt-2"
            });

            opts.json.forEach(tab => {
                const contentView = $("<div>", {
                    id: `container-${tab.id}`,
                    class: `hidden border p-3 h-full rounded-lg`,
                    html: tab.content || ""
                });
                contentContainer.append(contentView);
            });

            $(`#${opts.parent}`).append(contentContainer);

            const activeTab = opts.json.find(t => t.active);
            if (activeTab) {
                $(`#container-${activeTab.id}`).removeClass("hidden");
            }
        }
    }

    removeDiscount(id, event) {
        const { name_event, discount, percentage, reason, total } = event;

        this.createModalForm({
            id: "modalQuitarDescuento",
            parent: "root",
            data: { opc: "removeDiscount", id: id },
            class: "",
            json: [
                {
                    opc: "div",
                    id: "bloqueDescuentoActual",
                    class: "col-12",
                    html: `
                    <div class="bg-[#334155] text-red-400 p-4 rounded-lg">
                        <p class="text-sm">Descuento actual:</p>
                        <p class="text-lg font-bold">-$${discount.toLocaleString('es-MX')} (${percentage}% OFF)</p>
                        <p class="text-sm text-white">${reason}</p>
                    </div>
                `
                },
                {
                    opc: "div",
                    id: "bloquePrecioSinDescuento",
                    class: "col-12",
                    html: `
                    <div class="bg-[#1E293B] p-4 rounded-lg text-center">
                        <p class="text-sm text-gray-400">Precio sin descuento</p>
                        <p class="text-2xl font-bold text-white">$${total.toLocaleString('es-MX')}</p>
                    </div>
                `
                },
                {
                    opc: "div",
                    id: "mensajeConfirmacion",
                    class: "col-12 text-center",
                    html: `<p class="text-sm text-gray-400">¿Estás seguro de que deseas quitar el descuento aplicado?</p>`
                },
            ],
            bootbox: {
                title: `<i class="icon-tag"></i> Quitar Descuento de ${name_event}`,
                closeButton: true
            },
            buttons: {
                confirm: {
                    label: 'Confirmar Eliminación',
                    className: 'bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded',
                    callback: () => {
                        // lógica de confirmación externa
                        this.deleteDiscount(id);
                    }
                },
                cancel: {
                    label: 'Cancelar',
                    className: 'bg-white text-gray-800 text-sm px-4 py-2 rounded',
                }
            }
        });
    }

    createCoffeTable2(options) {
        const defaults = {
            parent: "root",
            id: "coffeeSoftGridTable",
            title: null,
            data: { thead: [], row: [] },
            center: [],
            right: [],
            dark: false,
            striped: true,
            class: "w-full table-auto text-sm text-gray-800",
            color_th: "bg-[#003360] text-gray-100",
            color_row: "bg-white",
            color_row_alt: "bg-gray-100",
            color_group: "bg-gray-200",
            f_size: 14,
            extends: true,
            onEdit: () => { },
            onDelete: () => { },
        };

        const opts = Object.assign({}, defaults, options);

        if (opts.dark) {
            opts.color_th = "bg-[#0F172A] text-white";
            opts.color_row = "bg-[#1E293B] text-white";
            opts.color_row_alt = "bg-[#334155] text-white";
            opts.color_group = "bg-[#334155] text-white";
            opts.class = "w-full table-auto text-sm text-white";
        }

        const container = $("<div>", {
            id: opts.id,
            class: "rounded-md border border-gray-300 shadow-sm overflow-hidden my-5",
        });

        if (opts.title) {
            container.append(`
        <div class="flex justify-between items-center px-4 py-3 border-b border-gray-300 bg-white">
          <h2 class="text-base font-semibold text-gray-800">${opts.title}</h2>
        </div>
      `);
        }

        const table = $("<table>", { class: opts.class });
        const thead = $("<thead>");
        const tbody = $("<tbody>");

        if (opts.data.thead.length) {
            const row = $("<tr>");
            opts.data.thead.forEach((col) =>
                row.append(`<th class="text-center px-3 py-2 ${opts.color_th}">${col}</th>`)
            );
            thead.append(row);
        } else {
            const row = $("<tr>");
            Object.keys(opts.data.row[0] || {}).forEach((key) => {
                if (!["opc", "id"].includes(key)) {
                    row.append(`<th class="text-center px-3 py-2 ${opts.color_th} capitalize">${key}</th>`);
                }
            });
            thead.append(row);
        }

        opts.data.row.forEach((data, i) => {
            const colorBg = opts.striped && i % 2 === 0 ? opts.color_row_alt : opts.color_row;

            const tr = $("<tr>", {
                class: `${colorBg} border-t border-gray-200`,
            });

            Object.keys(data).forEach((key, colIndex) => {
                if (["btn", "a", "dropdown", "id"].includes(key)) return;

                const align =
                    opts.center.includes(colIndex) ? "text-center" :
                        opts.right.includes(colIndex) ? "text-right" : "text-left";

                const content = typeof data[key] === "object" && data[key].html ? data[key].html : data[key];

                const td = $("<td>", {
                    id: `${key}_${data.id}`,
                    style: `font-size:${opts.f_size}px;`,
                    class: `${align} px-3 py-2 truncate`,
                    html: content,
                });

                if (opts.extends && typeof data[key] === "object") {
                    td.attr(data[key]);
                }

                tr.append(td);
            });

            const actions = $("<td>", { class: "px-3 py-2 text-right flex gap-2 justify-end" });

            if (data.dropdown) {
                const btn = $("<button>", {
                    class: "icon-dot-3 text-gray-600 hover:text-black",
                });
                const menu = $("<ul>", {
                    class: "absolute right-0 mt-2 w-44 z-10 bg-white border rounded-md shadow-md hidden",
                });

                data.dropdown.forEach((item) =>
                    menu.append(`
            <li><a onclick="${item.onclick}" class="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-800">
              <i class="${item.icon} mr-2"></i> ${item.text}</a>
            </li>
          `)
                );

                const wrapper = $("<div>").append(btn, menu);
                actions.append(wrapper);
            }

            tr.append(actions);
            tbody.append(tr);
        });

        table.append(thead).append(tbody);
        container.append(table);
        $(`#${opts.parent}`).html(container);
    }

  








}
