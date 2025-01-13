<?php
if (empty($_COOKIE["IDU"]))
    require_once('../acceso/ctrl/ctrl-logout.php');

require_once('layout/head.php');
require_once('layout/script.php');
?>

<body>
    <?php require_once('../layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content">
            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>calendarizacion</li>

                    <li class='breadcrumb-item fw-bold active'>Actividades</li>
                </ol>
            </nav>

            <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-5 mb-3">
                <div class="col-12 col-md-5 mb-3">
                    <label for="cbUDN">Seleccionar UDN</label>
                    <select class="form-select" id="cbUDN"></select>
                </div>
                <div class="col-12 col-md-5 mb-3">
                    <label for="cbGroup">Agrupación de eventos</label>
                    <select class="form-select" id="cbGroup">
                        <option value="0">Todos</option>
                        <option value="1">Mis pendientes</option>
                        <option value="2">Mis creados</option>
                    </select>
                </div>
                <!-- <div class="col mb-3 hide" id="contentIptDate">
                    <label for="iptDate">Fecha</label>
                    <div class="input-group">
                        <input type="text" class="form-control datepicker" id="iptDate">
                        <span class="input-group-text" onclick="$('#iptDate').click()"><i class="icon-calendar"></i></span>
                    </div>
                </div>
                <div class="col mb-3 hide" id="contentBtnSearch">
                    <label for="btnSearch" col="col-12"> </label>
                    <button type="button" class="btn btn-primary col-12" id="btnSearch"><i class="icon-search"></i>
                        <span class="d-inline d-sm-none d-lg-inline">Buscar</span></button>
                </div> -->
                <div class="col-3 col-sm-4 col-md-2 mb-3">
                    <label for="btnGuideHelp" class="col-12"> </label>
                    <button type="button" class="btn btn-outline-warning col-12 col-md-12 col-lg-4" id="btnGuideHelp" title="Ayuda">
                        <i class="icon-question"></i>
                    </button>
                </div>
                <div class="col-9 col-sm-4 col-md-6 ms-auto">
                    <label for="btnSimulation" col="col-12"> </label>
                    <button type="button" class="btn btn-outline-info col-12" id="btnSimulation" title="Crear Simulación">
                        <i class="icon-plus"></i> Simulación
                    </button>
                </div>
                <div class="col-12 col-sm-4 col-md-6 mb-3 ms-auto" id="containerBtnPlus">
                    <label for="btnPlus" col="col-12"> </label>
                    <button type="button" class="btn btn-info col-12" id="btnPlus" title="Crear Evento">
                        <i class="icon-plus"></i> Evento
                    </button>
                </div>
            </div>
            <div class="row">
                <nav class="p-0">
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active text-dark" id="tbDatos-tab" data-bs-toggle="tab"
                            data-bs-target="#tbDatos" type="button" role="tab" aria-controls="tbDatos"
                            aria-selected="true">
                            Calendario
                        </button>
                        <!-- <button class="nav-link  text-dark" id="listaCalendar" data-bs-toggle="tab"
                            data-bs-target="#nav-lista" type="button" role="tab" aria-controls="nav-lista"
                            aria-selected="false">
                            Lista
                        </button> -->
                    </div>
                </nav>
                <div class="tab-content col-12" id="nav-tabContent">
                    <div class="tab-pane fade show active pt-3" id="tbDatos" role="tabpanel"
                        aria-labelledby="tbDatos-tab" tabindex="0">
                    </div>
                    <!-- <div class="tab-pane fade show pt-3 col-lg-12" id="nav-lista" role="tabpanel"
                        aria-labelledby="listaCalendar" tabindex="0">
                        <div class="table-responsive" id="containerTbEvents"></div>
                    </div> -->
                </div>
            </div>
            <script src='src/js/actividades.js?t=<?php echo time(); ?>'></script>
            <script src="https://15-92.com/ERP3/src/js/CoffeSoft.js?t=<?php echo time(); ?>"></script>
        </div>
    </main>
</body>

</html>