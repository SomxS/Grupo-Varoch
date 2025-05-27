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

    


}
