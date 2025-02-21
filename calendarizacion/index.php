<?php 
    if( empty($_COOKIE["IDU"]) )  require_once('../acceso/ctrl/ctrl-logout.php');

    require_once('layout/head.php');
    require_once('layout/script.php'); 
?>

<body>
    <?php require_once('../layout/navbar.php'); ?>
    <main>
        <?php require_once('../layout/sidebar.php'); ?>

        <div id="main__content">
            <div class="d-flex justify-content-center align-items-center"
                style="height:100vh; background-color:transparent;">
                <h3 class="text-primary">
                    <i class="animate-spin icon-spin4"></i>
                    A N A L I Z A N D O . . .
                </h3>
            </div>
        </div>
    </main>
</body>

</html>


<div class="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg border border-gray-200">
    <div class="flex items-start gap-3">
        <!-- Icono de notificación -->
        <div class="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        </div>

        <!-- Contenido -->
        <div class="flex-1">
            <h3 class="text-gray-500 text-sm font-medium mb-1">Nueva incorporación</h3>
            <p class="text-gray-900 font-semibold">
                Juan Carlos Valera
                <span class="text-gray-500 font-normal">se ha unido al chat</span>
            </p>
        </div>
    </div>
</div>

<div class="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg border border-gray-200">
    <div class="flex items-start gap-3">
        <!-- Contenedor de la imagen de usuario -->
        <div class="shrink-0 w-10 h-10">
            <img src="https://erp-varoch.com/erp_files/user.png" alt="Avatar de usuario"
                class="w-full h-full rounded-full object-cover border-2 border-blue-100">
        </div>

        <!-- Contenido -->
        <div class="flex-1">
            <h3 class="text-gray-500 text-sm font-medium mb-1">Nueva incorporación</h3>
            <p class="text-gray-900 font-semibold">
                Juan Carlos Valera
                <span class="text-gray-500 font-normal">se ha unido al chat</span>
            </p>
        </div>
    </div>
</div>