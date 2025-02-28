<?php
if (empty($_POST['opc'])) exit(0);


class Act
{
    private $obj;
    private $msg;
    private $util;
    public function __construct()
    {
        require_once('../../conf/_Message.php');
        $this->msg = new Message();

        require_once('../../conf/_Utileria.php');
        $this->util = new Utileria;

        require_once('../mdl/mdl-actividades.php');
        $this->obj = new Actividades;
    }
    // Listas 
    function initComponent(){
        if (isset($_COOKIE['IDU'])) {
            if (!isset($_COOKIE['IDT'])) {
                $lsCookie = $this->obj->lsCookie([$_COOKIE['IDU'], 'IDT']);
                if (count($lsCookie) > 0) {
                    setcookie('IDT', $lsCookie[0]['valor'], time() + 3600, '/');
                }
            } 
        }

        // Objeto para FullCalendar
        $__events = [];
        $lsEvents = $this->obj->lsEvents();
        foreach ($lsEvents as $key) {
            $lsPeople = $this->obj->lsPeople([$key['id']]);
            $__people = [];
            $__event = [];
            $__replay = [];
            $event_status = $this->obj->lsEventsStatus([$key['id']]);

            // Responsables
            foreach ($lsPeople as $keyPeople) {
                $people_status = $this->obj->lsPeopleStatus([$keyPeople['id'], $key['id']]);
                $__people[] = [
                    'id' => $keyPeople['id'],
                    'idevent' => $keyPeople['idevent'],
                    'nombre' => $keyPeople['nombres'] . ' ' . $keyPeople['apellido'],
                    'idstatus' => $keyPeople['idstatus'],
                    'status' => $keyPeople['status'],
                    'dateinitiation' => $keyPeople['dateinitiation'],
                    'datefinished' => $keyPeople['datefinished'],
                    'telefono' => $keyPeople['telefono'],
                    'iduser' => $keyPeople['iduser'],
                    'estados' => $people_status,
                ];
            }

            // Eventos
            $__event = [
                'id' => $key['id'],
                'title' => $key['title'],
                'color' => $key['color'],
                'custom' => $key['custom'],
                'idpriority' => $key['idpriority'],
                'priority' => $key['priority'],
                'idudn' => $key['idudn'],
                'udn' => $key['udn'],
                'idseason' => $key['idseason'],
                'season' => $key['season'],
                'activities' => $key['activities'],
                'note' => $key['note'],
                'idcategory' => $key['category'], // 1: Corporativo, 2: Personal
                'idcreator' => $key['idcreator'],
                'idemployed' => $key['employedCreator'],
                'creator' => $key['creator'],
                'duration' => isset($key['duration']) ? [
                    'days' => intval($key['duration']),
                ] : "",
                'assign' => $__people,
                'estados' => $event_status,
            ];

            // Repeticiones
            $__replay = [
                'idfrecuency' => $key['idfrecuency'],
                'frecuency' => $key['frecuency'],
                'interval' => $key['intervalo'],
                'text' => $key['text'],
                'start' => $key['start'],
                'end' => $key['end'],
                'weekDay' => isset($key['weekDay']) ? json_decode($key['weekDay']) : "",
                'numWeek' => isset($key['numWeek']) ? intval($key['numWeek']) : "",
                'until' => $key['until'],
            ];

            $__events[] = [
                'event' => $__event,
                'replay' => $__replay,
            ];
        }

        // Responsables
        $__responsible = [];
        $lsResponsible = $this->obj->lsResponsible();
        foreach ($lsResponsible as $key) {
            $__responsible[] = [
                'id' => $key['id'],
                'valor' => '[' . $key['udn'] . '] ' . $key['area'] . ' / ' . $key['puesto'] . ' / ' . $key['nombres'] . ' ' . $key['apellido'],
                'nombre' => $key['nombres'] . ' ' . $key['apellido'],
                'telefono' => $key['telefono'],
                'idudn' => $key['idudn'],
                'iduser' => $key['iduser'],
                'idarea' => $key['idarea'],
            ];
        }

        // Retorno
        return [
            'udn'         => $this->obj->lsUDN(),
            'season'      => $this->obj->lsSeason(),
            'replay'      => $this->obj->lsReplay(),
            'responsible' => $__responsible,
            "events"      => $__events,
        ];
    }

    // Crear evento
    function createEvent()
    {
        $persons = $_POST['persons'];
        unset($_POST['persons']);

        $event = $this->obj->createEvent($this->util->sql($_POST));
        if ($event === true) {
            $max = $this->obj->maxEvent();
            if ($max > 0) {
                $__assign = [];
                $__telefonos = [];
                // $__notification = [];
                foreach ($persons as $key) {
                    $__assign[] = [
                        'id_Employe' => $key['id'],
                        'id_Event' => $max,
                    ];
                    $__telefonos[] = $key['telefono'];
                    // $__notification[] = [
                    //     'title' => $_POST['title'],
                    //     'description' => 'Se te ha asignado un nuevo evento',
                    //     'id_Module' => 30,
                    //     'id_Area' => $key['idarea'],
                    //     'id_User' => $key['iduser'],
                    //     'id_UDN' => $key['idudn'],
                    // ];
                }
                $assign = $this->obj->createPeople($this->util->sql($__assign));
                if ($assign === true) {
                    // $this->obj->createNotification($this->util->sql($__notification));
                    $this->msg->whatsapp($__telefonos, 'Te han asignado un nuevo evento: ' . $_POST['title'] . ', para más información, revisa tu calendario.🤗 https://www.erp-varoch.com/ERP24/calendarizacion/actividades.php');
                    $encode = ['status' => 200, 'message' => 'Evento creado correctamente.', 'id' => $max];
                } else {
                    $encode = ['status' => 500, 'message' => 'Error al crear el evento.'];
                }
            } else {
                $encode = ['status' => 500, 'message' => 'Error al crear el evento.'];
            }
        } else {
            $encode = ['status' => 500, 'message' => 'Error al crear el evento.'];
        }
        return $encode;
    }

    // Crear temporada
    function createSeason()
    {
        $season = $this->obj->createSeason($this->util->sql($_POST));
        if ($season === true) {
            $max = $this->obj->maxSeason();
            if ($max > 0) {
                $encode = ['status' => 200, 'message' => 'Temporada creada correctamente.', 'id' => $max];
            } else {
                $encode = ['status' => 500, 'message' => 'Error al crear la temporada.'];
            }
        } else {
            $encode = ['status' => 500, 'message' => 'Error al crear la temporada.'];
        }
        return $encode;
    }

    // Actualizar o Crear estado de evento
    function updateOrCreateEventStatus()
    {
        $foundState = false;
        $event_status = $this->obj->lsEventsStatus([$_POST['id_Event']]);

        // Si hay estados, busca si hay un estado para el día seleccionado.
        if (!empty($event_status) && count($event_status) > 0) {
            foreach ($event_status as $key) {
                if ($key['ocurrence'] == $_POST['date_ocurrence']) {
                    $foundState = true;
                    break;
                }
            }
        }

        // Si hay un estado para el día seleccionado, actualizalo.
        if ($foundState) {
            $update = $this->obj->updateEventStatus($this->util->sql($_POST, 2));
            if ($update === true) {
                $encode = ['status' => 200, 'message' => 'Estado actualizado correctamente.', 'id' => $key['id']];
            } else {
                $encode = ['status' => 500, 'message' => 'Error al actualizar el estado.', 'id' => $key['id']];
            }
        } else {
            // Si no hay un estado para el día seleccionado, crealo.
            $create = $this->obj->createEventStatus($this->util->sql($_POST));
            if ($create === true) {
                $max = $this->obj->maxEventStatus();
                if ($max > 0) {
                    $encode = ['status' => 200, 'message' => 'Estado creado correctamente.', 'id' => $max];
                } else {
                    $encode = ['status' => 500, 'message' => 'Error al crear el estado.'];
                }
            } else {
                $encode = ['status' => 500, 'message' => 'Error al crear el estado.'];
            }
        }

        return $encode;
    }

    // Actualizar o Crear estado de responsable
    function updateOrCreatePeopleStatus()
    {
        $foundState = false;
        $people_status = $this->obj->lsPeopleStatus([$_POST['id_Employe'], $_POST['id_Event']]);

        // Si hay estados, busca si hay un estado para el día seleccionado.
        if (!empty($people_status) && count($people_status) > 0) {
            foreach ($people_status as $key) {
                if ($key['ocurrence'] == $_POST['date_ocurrence']) {
                    $foundState = true;
                    break;
                }
            }
        }

        // Si hay un estado para el día seleccionado, actualizalo.
        if ($foundState) {
            $update = $this->obj->updatePeopleStatus($this->util->sql($_POST, 2));
            if ($update === true) {
                $encode = ['status' => 200, 'message' => 'Estado actualizado correctamente.', 'id' => $key['id']];
            } else {
                $encode = ['status' => 500, 'message' => 'Error al actualizar el estado.', 'id' => $key['id']];
            }
        } else {
            // Si no hay un estado para el día seleccionado, crealo.
            $create = $this->obj->createPeopleStatus($this->util->sql($_POST));
            if ($create === true) {
                $max = $this->obj->maxPeopleStatus();
                if ($max > 0) {
                    $encode = ['status' => 200, 'message' => 'Estado creado correctamente.', 'id' => $max];
                } else {
                    $encode = ['status' => 500, 'message' => 'Error al crear el estado.'];
                }
            } else {
                $encode = ['status' => 500, 'message' => 'Error al crear el estado.'];
            }
        }

        return $encode;
    }

    // Actualizar evento
    function updateEvent()
    {
        $newPersons = $_POST['newPersons'];
        $deletePersons = $_POST['deletePersons'];
        unset($_POST['newPersons']);
        unset($_POST['deletePersons']);

        $event = $this->obj->updateEvent($this->util->sql($_POST, 1));
        if ($event === true) {
            // Eliminar responsables
            $__deletePersons = [];
            // $__users = [];
            foreach ($deletePersons as $key) {
                $__deletePersons = [
                    'id_Event' => $_POST['idEvent'],
                    'id_Employe' => $key['id']
                ];
                // $__users = [
                //     'id_Module' => 30,
                //     'id_User' => $key['iduser']
                // ];
                $this->obj->deletePeople($this->util->sql($__deletePersons, 2));
                // $this->obj->deleteNotification($this->util->sql($__users, 2));
                $this->msg->whatsapp($key['telefono'], 'Se te ha eliminado de la actividad: ' . $_POST['title'] . ', para más información, revisa tu calendario.🤗 https://www.erp-varoch.com/ERP2/calendarizacion/actividades.php');
            }

            // Asignar nuevos responsables
            $__newPersons = [];
            // $__notifications = [];
            foreach ($newPersons as $key) {
                $__newPersons = [
                    'id_Event' => $_POST['idEvent'],
                    'id_Employe' => $key['id'],
                ];
                // $__notifications = [
                //     'title' => $_POST['title'],
                //     'description' => 'Se te ha asignado un nuevo evento: ' . $_POST['title'],
                //     'id_Module' => 30,
                //     'id_Area' => $key['idarea'],
                //     'id_User' => $key['iduser'],
                //     'id_UDN' => $key['idudn'],
                // ];
                $this->obj->createPeople($this->util->sql($__newPersons));
                // $this->obj->createNotification($this->util->sql($__notifications));
                $this->msg->whatsapp($key['telefono'], 'Te han asignado una nueva actividad: ' . $_POST['title'] . ', para más información, revisa tu calendario.🤗 https://www.erp-varoch.com/ERP2/calendarizacion/actividades.php');
            }
            $encode = ['status' => 200, 'message' => 'Evento actualizado correctamente.', 'id' => $_POST['idEvent']];
        } else {
            $encode = ['status' => 500, 'message' => 'Error al actualizar el evento.'];
        }
        return $encode;
    }

    // Eliminar evento
    function deleteEvent()
    {
        // $__users = [];
        // $people = $this->obj->lsPeople([$_POST['id']]);
        // foreach ($people as $key) {
        //     $__users = [
        //         'id_Module' => 30,
        //         'id_User' => $key['iduser']
        //     ];
        //     $this->obj->deleteNotification($this->util->sql($__users, 2));
        // }
        $delete_people = $this->obj->deletePeople($this->util->sql(['id_Event' => $_POST['id']], 1));
        if ($delete_people) {
            $event = $this->obj->deleteEvent($this->util->sql(['idEvent' => $_POST['id']], 1));
            if ($event === true) {
                $encode = ['status' => 200, 'message' => 'Evento ha sido eliminado correctamente.'];
            } else {
                $encode = ['status' => 500, 'message' => 'Error al eliminar el evento.'];
            }
        } else {
            $encode = ['status' => 500, 'message' => 'Error al eliminar el evento.'];
        }
        return $encode;
    }

    // Agregar la cookie
    function createCookie()
    {
        $cookie = $this->obj->createCookie($this->util->sql($_POST));
        if ($cookie === true) {
            $encode = ['status' => 200, 'message' => 'Cookie agregada correctamente.'];
        } else {
            $encode = ['status' => 500, 'message' => 'Error al agregar la cookie.'];
        }
        return $encode;
    }	

    function notificacionesAutomaticasDeWhatsApp()
    {
        // $lsEvents = $this->obj->lsEvents();
        // foreach ($lsEvents as $key) {
        //     $lsPeople = $this->obj->lsPeople([$key['id']]);
        //     foreach ($lsPeople as $keyPeople) {
        //         $people_status = $this->obj->lsPeopleStatus([$keyPeople['id'], $key['id']]);
        //         if (count($people_status) > 0) {
        //             foreach ($people_status as $keyPeopleStatus) {
        //                 if ($keyPeopleStatus['ocurrence'] == date('Y-m-d')) {
        //                     $this->msg->whatsapp($keyPeople['telefono'], 'Recuerda que tienes una actividad programada para hoy: ' . $key['title'] . ', para más información, revisa tu calendario.🤗 https://www.erp-varoch.com/ERP2/calendarizacion/actividades.php')
        //                 }
        //             }
        //         }
        //     }
        // }
        $encode = ['status' => 200, 'message' => 'Notificaciones enviadas correctamente.'];
        return $encode;
    }
}



$hoy = date('Y-m-d');
$dates = empty($_POST['dates']) ? [$hoy, $hoy] : explode(',', $_POST['dates']);

$act = new Act();

$opc = $_POST['opc'];
$encode = $act->$opc();

echo json_encode($encode);
?>