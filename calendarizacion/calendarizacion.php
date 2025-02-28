<?php
if (empty($_COOKIE["IDU"]))  require_once('../acceso/ctrl/ctrl-logout.php');
require_once('layout/head.php');
require_once('layout/script.php');
?>
<!-- CDN TAILWIND -->
<script src="https://cdn.tailwindcss.com"></script>
<body>
<?php require_once('../layout/navbar.php'); ?>
    <main>
        <section id="sidebar"></section>
        <div id="main__content">
            <nav aria-label='breadcrumb'>
                <ol class='breadcrumb'>
                    <li class='breadcrumb-item text-uppercase text-muted'>calendarizacion</li>
                        
                    <li class='breadcrumb-item fw-bold active'>Calendarizacion</li>
                </ol>
            </nav>
            <div class="main-container" id="root"></div>
            <script src='src/js/app.js?t=<?php echo time(); ?>'></script>
            <script src='src/js/calendarizacion.js?t=<?php echo time(); ?>'></script>
        </div>
    </main>
</body>
</html>