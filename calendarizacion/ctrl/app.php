<?php
if(empty($_POST['opc'])) exit(0);

setlocale(LC_TIME, 'es_ES.UTF-8');
date_default_timezone_set('America/Mexico_City');
header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos

require_once('../../conf/_Message.php');
require_once('../mdl/mdl-app.php');

class App extends MApp {
    function init(){
        return [
            'udn'       => $this -> permissionUDN(),
            'udnForm'   => $this -> lsUDN(),
            'estados'   => $this -> lsStatus(),
            'temporada' => $this -> lsSeason(),
            'replay'    => $this -> lsReplay(),
            'type'      => $this -> permissionUser()
        ];
    }
    function getListEmployed(){
        return [ 'employeds' => $this -> lsEmployed([$_POST['udn'],8]) ];
    }
    function permissionUDN(){
        return $_COOKIE['IDE'] == 8 ? $this -> lsUDN('all') : $this->lsUDNbyID([$_COOKIE['IDE']]);
    }
    function permissionUser(){
        return $_COOKIE['IDA'] == 36 ? 'admin' : ($_COOKIE['IDA'] == 48 ? 'mufasa!' : '');
    }

    // TABLA DE EVENTOS
    function existenceEvents(){
        $year    = date('Y');
        $success = $this->eventYearExistence([$year]);
        if($success === false) {
            $beforeYear         = intval($year) - 1;
            // Consultar listas
            $lsBeforeEvent      = $this->listBeforeEventYear([$beforeYear]);
            $lsBeforeReponsible = $this->listBeforeReponsible([$beforeYear]);
            // Insertar listas
            $successYear        = $this->newEventYear($this->util->sql($lsBeforeEvent));
            $successResponsible = $this->newResponsibleEvent($this->util->sql($lsBeforeReponsible));
            //////////////////
            return ( $successYear === true && $successResponsible === true ) ? true : false;
        }
        return $success;
    }
    function lsEvents(){
        $__row = [];
        
        if($this->existenceEvents()){
            unset($_POST['calendar'],$_POST['opc'],$_POST['date_init']);
            if($_COOKIE['IDE'] == 8 && $this->permissionUser() == '') $_POST['id_Employed'] = $this->getEmployedByUser([$_COOKIE['IDU']]);
            
            $ls = $this->listEvent($_POST);
            foreach ($ls as $index => $key) {
                $responsible = $this->lsReponsibleEventByID([$key['id'],$key['year']]);
                $responsables = "";
                foreach ($responsible as $value) 
                    $responsables .= "{$value['valor']}<br>";
    
    
                $__row[$index] = [
                    'id'           => $key['id'],
                    'fecha'        => $this->dateAnalitycs($key['date_init'],$key['date_end'],$key['id_status']),
                    'udn'          => $key['abreviatura'],
                    'temporada'    => $key['name_season'],
                    'titulo'       => $key['title'],
                    'responsables' => $responsables,
                    'estado'       => $this->getEstatus($key['id_status']),
                ];
    
                if ( $this->permissionUser() === 'admin' ) {
                    if($key['id_status'] != 5 ){
                        $__row[$index]['dropdown'] = $this->list_dropdown($key['id_status'],$key['id'],$key['year'],$key['title']);
                    } else {
                        $__row[$index]['btn'] = 
                        [[
                            'color' => 'info',
                            'icon'  => 'icon-list',
                            'fn'    => "calendarizacion.activitiesModal({$key['id']})"
                        ]];
                    }
                } else {
                    $btn = [];
                    $btn[] = 
                        [
                            'color' => 'info',
                            'icon'  => 'icon-list',
                            'fn'    => "calendarizacion.activitiesModal({$key['id']})"
                        ];
                    if ( $this->permissionUser() === 'mufasa' || $_COOKIE['IDE'] != 8 ) {
                        $btn[] = [
                            'color' => 'info',
                            'icon'  => 'icon-comment',
                            'fn'    => "calendarizacion.feedBackModal({$key['id']})"
                        ];
                    }

                    $__row[$index]['btn'] = $btn;
                }
            }
            return [ "row" => $__row ];
        } else {
            return [ "row" => $__row ];
        }

    }
    function list_dropdown($idEstado,$idEvent,$year,$title){
        $values = [
            'delete'     => ['icon' => 'icon-trash',    'text' => 'Cancelar',           'onclick' => "calendarizacion.statusEvents(5,{$idEvent},{$year},'{$title}')"],
            'inProcess'  => ['icon' => 'icon-spinner',  'text' => 'En proceso',         'onclick' => "calendarizacion.statusEvents(2,{$idEvent},{$year},'{$title}')"],
            'pause'      => ['icon' => 'icon-pause',    'text' => 'Pausar',             'onclick' => "calendarizacion.statusEvents(3,{$idEvent},{$year},'{$title}')"],
            'finalize'   => ['icon' => 'icon-ok',       'text' => 'Finalizar',          'onclick' => "calendarizacion.statusEvents(4,{$idEvent},{$year},'{$title}')"],
            'resume'     => ['icon' => 'icon-play',     'text' => 'Reanudar',           'onclick' => "calendarizacion.statusEvents(6,{$idEvent},{$year},'{$title}')"],
            'edit'       => ['icon' => 'icon-pencil',   'text' => 'Editar',             'onclick' => "calendarizacion.editModal({$idEvent},{$year})"],
            'feedback'   => ['icon' => 'icon-comment',  'text' => 'Retroalimentacion',  'onclick' => "calendarizacion.feedBackModal({$idEvent})"],
            'activities' => ['icon' => 'icon-list',     'text' => 'Actividades',        'onclick' => "calendarizacion.activitiesModal({$idEvent})"],
        ];
    
        $options = [
            '1' => [
                $values['activities'],
                $values['inProcess'],
                $values['edit'],
                $values['pause'],
                $values['delete']
            ],
            '2' => [
                $values['activities'],
                $values['edit'],
                $values['pause'],
                $values['delete'],
                $values['finalize']
            ],
            '3' => [
                $values['activities'],
                $values['resume'],
                $values['delete'],
                $values['finalize']
            ],
            '4' => [
                $values['activities'],
                $values['edit'],
                $values['delete'],
                $values['feedback']
            ],
            // '5' => [
            //     $values['activities'],
            //     $values['feedback']
            // ]
        ];
    
        return $options[$idEstado] ?? [];
    }
    function dateAnalitycs($inicio,$fin,$status){
        $hoy     = date("Y-m-d");
        // $start   = $this->util->formatDate($inicio,'dayMonth');
        // $end     = $this->util->formatDate($fin,'dayMonth');
        $start   = $this->util->formatDate($inicio,'smMonth');
        $end     = $this->util->formatDate($fin,'smMonth');
        $bgClass = "";
        $red = "#f87171";
        $orange = "#fdba74";

        if (strtotime($fin) < strtotime($hoy) && ($status == 1 || $status == 2 )) $bgClass = $red;
        elseif (strtotime($hoy) > strtotime($inicio) && $status == 1) $bgClass = $orange;
        

        return ['class'=>"text-center col-2",'html'=>"{$start} <br> {$end}","style"=>"background:{$bgClass}"];
    }
    function getEstatus($idEstado){
        switch ($idEstado) {
            case '1': return '⌚ POR INICIAR';
            case '2': return '⏳  EN PROCESO';
            case '3': return '⏸️ PAUSADO';
            case '4': return '✅ FINALIZADO';
            case '5': return '🚫 CANCELADO';
        }
    }

    // ACTIVIDADES
    function getActivities(){
        return $this->textActivities([$_POST['id']]);
    }
    function updateActivities(){
        return $this->util->sql($_POST);
    }

    // GESTION DE EVENTOS
    function addEvent() {
        $date_init  = explode('-',$_POST['date_init']);
        $date_end   = explode('-',$_POST['date_end']);
        // DESGLOSE FI
        $init_day   = $date_init[0];
        $init_month = $date_init[1];
        $init_year  = $date_init[2];
        // DESGLOSE FF
        $end_day    = $date_end[0];
        $end_month  = $date_end[1];
        $end_year   = $date_end[2];
        
        // PROCESAR TEMPORADA
        $idSeason = intval($_POST['id_Season']) === 0 ? $this->newSeason([$_POST['id_Season']]) : $_POST['id_Season'];
        
        // NUEVO EVENTO
        $array_event = [
            'title'      => $_POST['title'],
            'activities' => $_POST['activities'],
            'day_init'   => $init_day,
            'month_init' => $init_month,
            'day_end'    => $end_day,
            'month_end'  => $end_month,
            'id_UDN'     => $_POST['id_UDN'],
            'id_Season'  => $idSeason,
            'id_Replay'  => $_POST['id_Replay'],
        ];
        $idEvent = $this->newEvent($this->util->sql($array_event));
        
        // ASIGNAR RESPONSABLES
        $array_employed = [];
        foreach (explode(',',$_POST['id_Employed']) as $value) {
            $array_employed[] = [
                "id_Employed" => $value,
                "id_Event"    => $idEvent,
                'year'        => date('Y')
            ];
        }
        $success = $this->newResponsibleEvent($this->util->sql($array_employed));//Nuevo responsable del evento.
        if($success !== true) return $success;

        // EVENTO POR AÑO
        $date1 = strtotime($_POST['date_init']);
        $date2 = strtotime($_POST['date_end']);        
        $array_event_year =  [
            'id_Event'  => $idEvent,
            'year'      => $init_year,
            'date_init' => date('Y-m-d',$date1),
            'date_end'  => date('Y-m-d',$date2),
        ];

        $success = $this->newEventYear($this->util->sql($array_event_year));//Nuevo evento del año.

        return [
            'success'   => $success,
            'temporada' => $this->lsSeason()
        ];
    }
    function getEvent(){
        return $this->getEventByID([$_POST['id']]);
    }
    function updateEvent(){
        $date_init  = explode('-',$_POST['date_init']);
        $date_end   = explode('-',$_POST['date_end']);
        $init_day   = $date_init[0];
        $init_month = $date_init[1];
        $init_year  = $date_init[2];
        $end_day    = $date_end[0];
        $end_month  = $date_end[1];
        $end_year   = $date_end[2];
        
        $idSeason = intval($_POST['id_Season']) === 0 ? $this->newSeason([$_POST['id_Season']]) : $_POST['id_Season'];

        $array_event = [
            'title'      => $_POST['title'],
            'activities' => $_POST['activities'],
            'day_init'   => $init_day,
            'month_init' => $init_month,
            'day_end'    => $end_day,
            'month_end'  => $end_month,
            'id_UDN'     => $_POST['id_UDN'],
            'id_Season'  => $idSeason,
            'id_Replay'  => $_POST['id_Replay'],
            'idEvent'    => $_POST['id'],
        ];
        $success = $this->eventChangeByID($this->util->sql($array_event,1));
        if( $success === true ){
            $array_delete_reponsible = $this->util->sql(["id_Event"=>$_POST['id'],'year'=>date('Y')],2);
            $this->deleteReponsible($array_delete_reponsible);

            $array_employed = [];
            $employeds = is_array($_POST['id_Employed']) ? $_POST['id_Employed'] : explode(',',$_POST['id_Employed']);
            foreach ($employeds as $value) {
                $array_employed[] = [
                    "id_Employed" => $value,
                    "id_Event"    => $_POST['id'],
                    'year'        => date('Y')
                ];
            }
            $this->newResponsibleEvent($this->util->sql($array_employed));//Nuevo responsable del evento.
            
            $date1 = strtotime($_POST['date_init']);
            $date2 = strtotime($_POST['date_end']);        
            
            $array_event_year =  $this->util->sql([
                'date_init' => date('Y-m-d',$date1),
                'date_end'  => date('Y-m-d',$date2),
                'id_Event'  => $_POST['id'],
                'year'      => date('Y'),
            ],2);
    
            $success = $this->updateEventYear($array_event_year);//Nuevo evento del año.
    
            return [
                'success'   => $success,
                'temporada' => $this->lsSeason()
            ];
        }
        
    }
    function statusEvents(){
        return $this->statusEvent($this->util->sql($_POST,2));
    }

    // RETROALIMENTACION
    function lsFeedbacks(){
        $__row = [];
        $ls = $this->lsFeedback([$_POST['id']]);
        foreach ($ls as $key) {
            $a = [];
            // Obtener la cookie de área
            $area = $_COOKIE['IDA'];
            if ($key['anio'] == date('Y') && $area == 36) {
                
                $a[] = [
                
                    "class"   => 'btn btn-sm btn-outline-info me-1',
                    "html"    => '<i class="icon-pencil"></i>',
                    "onclick" => 'calendarizacion.editFeedback('.$key['id'].', '.$key['id_Event'].')',
                ];

                                    
                $a[] = [
                    
                    "class"   => 'btn btn-sm btn-outline-danger',
                    "html"    => '<i class="icon-trash"></i>',
                    "onclick" => 'calendarizacion.deleteFeedback('.$key['id'].', '.$key['id_Event'].')',
                ];

            }

            $__row[] = [
                'id'                => $key['id'],
                'fecha'             => $key['fecha'],
                'retroalimentación' => $key['valor'],
                "a"                 => $a,
            ];
        }

        return [ 
            "thead" => [
                "Fecha",
                "Retroalimentación",
                "Acciones"
            ],
            "row" => $__row
        ];
    }
    function getByIdFeedback() {
        $status = 500;
        $message = 'Error al obtener los datos de la retroalimentación.';
        $getbyid = $this->getFeedbackByID([$_POST['id']]);

        if ($getbyid) {
            $status = 200;
            $message = 'Datos de la retroalimentación obtenidos correctamente.';
        }

        return [
            'status'   => $status,
            'message' => $message,
            'data'     => $getbyid
        ];
    }
    function addFeedback(){
        $status = 500;
        $message = 'Error al crear la retroalimentación.';
        $create = $this->createFeedback($this->util->sql($_POST));

        if ($create == true) {
            $status = 200;
            $message = 'Retroalimentación creada correctamente.';
        }

        return [
            'status'   => $status,
            'message' => $message
        ];
    }
    function editFeedback(){
        $status = 500;
        $message = 'Error al editar la retroalimentación.';
        $edit = $this->updateFeedback($this->util->sql($_POST, 1));

        if ($edit == true) {
            $status = 200;
            $message = 'Retroalimentación editada correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }
    function destroyFeedback(){
        $status = 500;
        $message = 'Error al eliminar la retroalimentación.';
        $delete = $this->deleteFeedback($this->util->sql($_POST, 1));

        if ($delete == true) {
            $status = 200;
            $message = 'Retroalimentación eliminada correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message
        ];
    }

    // RECORDATORIOS
    function lsReminders(){
        $__row = [];
        
        $ls = $this->lsReminder([
            'udn'        => $_POST['udn'],
            'reminder'   => $_POST['reminder']
        ]);

        foreach ($ls as $key) {

            $responsible = $this->lsReponsibleEventByID([$key['id'],$key['year']]);
                $responsables = "";
                foreach ($responsible as $value) 
                    $responsables .= "<span class='text-xs'>{$value['valor']}  </span><br>";

            $a = [];
            
            $a[] = [
                "class"   => 'btn btn-sm btn-outline-success me-1',
                "html"    => '<i class="icon-whatsapp"></i>',
                "onclick" => 'calendarizacion.sendIndividualRecorder('.$key['id'].')',
            ];

            $estado = $this->getEstatus($key['id_status']);

            $__row[] = [
                'id'           => $key['id'],
                'fecha'        => $this->dateAnalitycs($key['date_init'],$key['date_end'],$key['id_status']),

                'temporada'    => $key['name_season'],
                'título'       => $key['title'],
                'actividad'    => $key['activities'],
                'responsables' => $responsables,
                'Estado' => $this->getEstatus($key['id_status']),
              
            
                "a"            => $a,
            ];
        }

        return [ 
      
            'thead'    => '',
            "row"      => $__row,
            'reminder' => $ls
        ];
    }

    function sendIndividualRecorder(){

       $idList = $_POST['idList'];
        
        $events = $this -> lsEventsByID([$idList]);

        $responsibles = $this->lsReponsibleEventByID([$idList,2025]);
        $list = [];
        foreach ($responsibles as $responsible):

            $list[] = $responsible['valor'].' - '.$responsible['Telefono_movil'];

            $ok = $this -> MessageWhatsApp([
                'phone'      => $responsible['Telefono_movil'],
                'name'       => $responsible['FullName'],
                'title'      => $events['title'].' ('.$events['name_season'].')',
                'activities' => $events['activities']
            ]);
            
        endforeach;

        return ['status'=>$ok , 'POST' => $events];
    }

    function MessageWhatsApp($opts){
            $msg    = new Message();
            // Construcción del mensaje con saltos de línea explícitos
            $message = "¡Hola {$opts['name']}!\n\n".
               "Tienes un nuevo recordatorio:\n".
               "📌 *{$opts['title']}*\n\n".
               "Actividades:\n".
               " _{$opts['activities']}_ \n\n".
               "¿Alguna duda? Comunícate con Dirección Operativa 💬👥";

            // Process api
            return $msg->whatsapp(
                $opts['phone'],
                $message
            );
    }


    function sendRecorders(){

         $__row = [];

        $ls = $this->lsReminder([
            'udn'        => $_POST['udn'],
            'reminder'   => $_POST['reminder']
        ]);
            // Recordatorio de eventos..

        foreach ($ls as $recordatorio) {


            $responsibles = $this->lsReponsibleEventByID([$recordatorio['id'],$recordatorio['year']]);

            foreach ($responsibles as $responsible) {

                // SOLO ENVIAR CUANDO ESTE ATRASADO en estado de : '.$recordatorio['name_status'].'
                
                $success = $this -> MessageWhatsApp([
                    'phone'      => $responsible['Telefono_movil'],
                    'name'       => $responsible['FullName'],
                    'title'      => $recordatorio['title'],
                    'activities' => $recordatorio['activities']
                ]);

       
            }
            
        }


        return [
            'status' => 200,
            'ls'     => $__row
        ];        
    }

 
}


$opc    = $_POST['opc'];
$obj    = new App();
$encode = $obj->$opc();
echo json_encode($encode);
?>