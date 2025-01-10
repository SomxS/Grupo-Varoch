$(() => {
    // Obtener la cantidad de barras diagonales (/) en la URL - 4 que corresponden a https://.../ERP/
    let slashesCount = (window.location.href.match(/\//g) || []).length - 4;

    // Crear el string de slashes (../)
    let slash = "";
    for (let i = 0; i < slashesCount; i++) {
        slash += "../";
    }

    $('#imgPerfil').attr('src', slash + 'src/img/user.png');

    $('#btnSidebar').on('click', () => {
        $('#sidebar').toggleClass('active');
        $('#main__content').toggleClass('active');
    });

    $('#navbar li:has(ul)').on("click", function (e) {
        $(this).children('ul').slideToggle();
    });

    $('#btnNavbarPerfil').on('click', function (e) {
        e.preventDefault();

        const HREF = $(this).attr("href");
        $.ajax({
            type: "POST",
            url: HREF,
            cache: false,
            success: function (data) {
                $("#main__content").html(data);

                if ($(window).width() <= 500) {
                    $("#sidebar").toggleClass("active");
                    $("#main__content").toggleClass("active");
                }
            },
        });
    });

    $('#sidebar').addClass('active');
    $('#main__content').addClass('active');

    if ($(window).width() <= 500) {
        $("#sidebar").removeClass("active");
        $("#main__content").removeClass("active");
    }
});