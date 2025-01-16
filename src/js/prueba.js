const link = "prueba.php";

$(async () => {
    lsUDN();

    data = await fn_ajax({ opc: "lsUDN", udn: "N" }, link);
});

async function lsUDN() {
    let data = await fn_ajax({ opc: "lsUDN" }, link);
    $("#contenido").html("");
    data.forEach((element) => {
        $("#contenido").append("> " + element.valor + "<br>");
    });
}

function nuevaUDN(UDN) {
    fn_ajax({ opc: "nuevaUDN", UDN }, link).then((data) => {
        if (data.success === true) lsUDN();
    });
}

function borrarUDN(UDN) {
    fn_ajax({ opc: "borrarUDN", UDN }, link).then((data) => {
        if (data.success === true) lsUDN();
    });
}
