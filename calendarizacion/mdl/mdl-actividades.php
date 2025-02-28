<?php
require_once ('../../conf/_CRUD.php');

class Actividades extends CRUD
{
    private $bd_ch;
    private $bd;
    public function __construct()
    {
        $this->bd = 'rfwsmqex_gvsl_calendarizacion.';
        $this->bd_ch = 'rfwsmqex_gvsl_rrhh.';
    }
    // READ --------------------------------------------------------------------
    // Listar UDN
    function lsUDN()
    {
        $sql = $this->_Select([
            'table' => 'udn',
            'values' => 'idUDN AS id, UDN AS valor, Abreviatura AS abreviado',
            'where' => 'Stado = 1',
            'order' => ['ASC' => 'Antiguedad']
        ]);

        array_unshift($sql, ['id' => 0, 'valor' => 'TODAS LAS UDN', 'abreviado' => 'TODAS']);
        return $sql;
    }

    // Listar temporadas
    function lsSeason()
    {
        return $this->_Select([
            'table' => "{$this->bd}season",
            'values' => 'idSeason AS id, `name` AS valor',
            'where' => '`status` = 1',
        ]);
    }

    // Listar tipo de repeticiones
    function lsReplay()
    {
        return $this->_Select([
            'table' => "{$this->bd}replay",
            'values' => 'idReplay AS id, `name` AS valor, frecuency',
        ]);
    }

    // Listar responsables
    function lsResponsible()
    {
        $values = [
            "idEmpleado AS id",
            "FullName AS nombres",
            "APaterno AS apellido",
            "Nombre_Puesto AS puesto",
            "id_AreaUDN AS idarea",
            "Area AS area",
            "udn.Abreviatura AS udn",
            "id_UDN AS idudn",
            "Telefono_Movil AS telefono",
            "idUser AS iduser"
        ];

        $leftjoin = [
            "usuarios" => "idEmpleado = usr_empleado",
            "rh_puesto_area" => "idPuesto_Area = Puesto_Empleado",
            "rh_puestos" => "idPuesto = id_Puesto",
            "rh_area_udn" => "idAreaUDN = id_AreaUDN",
            "rh_area" => "idArea = id_Area",
            "udn" => "idUDN = id_UDN"
        ];

        $where = "Estado = 1";

        $order = [
            "ASC" => "udn, Area, Nombre_Puesto"
        ];

        return $this->_Select([
            'table' => "{$this->bd_ch}empleados",
            'values' => $values,
            'leftjoin' => $leftjoin,
            'where' => $where,
            'order' => $order
        ]);
    }

    // Listar eventos
    function lsEvents()
    {
        $values = [
            // Event
            "idEvent AS id",
            "title",
            "color",
            "custom",
            "id_Priority AS idpriority",
            "priority.`name` AS priority",
            "id_UDN AS idudn",
            "udn.UDN AS udn",
            "id_Season AS idseason",
            "season.`name` AS season",
            "activities",
            "note",
            "usr_creator AS idcreator",//userCreator
            "usr_empleado AS employedCreator",
            "Nombres AS creator",
            "duration",
            "categoria AS category",

            // Replay
            "id_Replay AS idfrecuency",
            "replay.frecuency AS frecuency",
            "{$this->bd}`events`.intervalo",
            "text",
            "date_start AS `start`",
            "date_end AS `end`",
            "until",
            "weekDay",
            "numWeek",
        ];

        $leftjoin = [
            "{$this->bd}priority" => "id_Priority = idPriority",
            "udn" => "id_UDN = idUDN",
            "{$this->bd}season" => "id_Season = idSeason",
            "usuarios" => "usr_creator = idUser",
            "{$this->bd_ch}empleados" => "usr_empleado = idEmpleado",
            "{$this->bd}replay" => "id_Replay = idReplay"
        ];
        $where = "(YEAR(`until`) >= YEAR(NOW()) OR `until` IS NULL OR `until` = '')";

        return $this->_Select([
            'table' => "{$this->bd}`events`",
            'values' => $values,
            "leftjoin" => $leftjoin,
            'where' => $where
        ]);
    }

    // Listar eventos - status
    function lsEventsStatus($array)
    {
        $values = [
            "idEventStatus AS id",
            "date_ocurrence AS ocurrence",
            "id_Status  AS idstatus",
            "`status`.`name` AS `status`",
        ];

        $leftjoin = [
            "{$this->bd}`status`" => "id_Status = idStatus",
        ];

        $where = "id_Event = ? AND YEAR(date_ocurrence) >= YEAR(NOW()) - 2 AND YEAR (date_ocurrence) <= YEAR(NOW()) + 1 AND id_Status NOT IN (5)" ;

        return $this->_Select([
            'table' => "{$this->bd}`events_status`",
            'values' => $values,
            "leftjoin" => $leftjoin,
            'where' => $where,
            'data' => $array
        ]);
    }

    // Listar responsables
    function lsPeople($array)
    {
        $values = [
            "id_Employe AS id",
            "id_Event AS idevent",
            "FullName AS nombres",
            "APaterno AS apellido",
            "id_Status AS idstatus",
            "`status`.`name` AS status",
            "Telefono_Movil AS telefono",
            "idUser AS iduser"
        ];

        $leftjoin = [
            "usuarios" => "id_Employe = usr_empleado",
            "{$this->bd_ch}empleados " => "id_Employe = idEmpleado",
            "{$this->bd}`status`" => "id_Status = idStatus"
        ];

        return $this->_Select([
            'table' => "{$this->bd}people",
            'values' => $values,
            'leftjoin' => $leftjoin,
            'where' => 'id_Event',
            'data' => $array
        ]);
    }

    // Listar los responsables - status
    function lsPeopleStatus($array)
    {
        $values = [
            "idPeopleStatus AS id",
            "date_ocurrence AS ocurrence",
            "date_initiation AS initiation",
            "date_finished AS finished",
            "id_Status  AS idstatus",
            "`status`.`name` AS `status`",
        ];

        $leftjoin = [
            "{$this->bd}`status`" => "id_Status = idStatus",
        ];

        $where = "id_Employe = ? AND id_Event = ? AND YEAR(date_ocurrence) >= YEAR(NOW()) - 2 AND YEAR (date_ocurrence) <= YEAR(NOW()) + 1";

        return $this->_Select([
            'table' => "{$this->bd}`people_status`",
            'values' => $values,
            "leftjoin" => $leftjoin,
            'where' => $where,
            'data' => $array
        ]);
    }

    // Listar cookies
    function lsCookie($array)
    {
        $values = [
            "idCookie AS id",
            "id_User AS iduser",
            "nameCookie AS nombre",
            "valueCookie AS valor",
        ];

        $where = "id_User = ? AND nameCookie = ?";

        return $this->_Select([
            'table' => "usuarios_cookie",
            'values' => $values,
            'where' => $where,
            'data' => $array
        ]);
    }

    // CREATE ------------------------------------------------------------------
    // Crear evento
    function createEvent($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}`events`",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    // Crear responsables
    function createPeople($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}people",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    // Crear notificación
    function createNotification($array)
    {
        return $this->_Insert([
            'table' => "notifications",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    // Crear temporada
    function createSeason($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}season",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    // Crear evento - status
    function createEventStatus($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}`events_status`",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    // Crear responsables - status
    function createPeopleStatus($array)
    {
        return $this->_Insert([
            'table' => "{$this->bd}people_status",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    // Crear cookie
    function createCookie($array)
    {
        return $this->_Insert([
            'table' => "usuarios_cookie",
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    // UPDATE ------------------------------------------------------------------
    // Actualizar evento
    function updateEvent($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}`events`",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Actualizar responsables
    function updatePeople($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}people",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Actualizar estado de los eventos
    function updateEventStatus($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}events_status",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Actualizar estado de los responsables
    function updatePeopleStatus($array)
    {
        return $this->_Update([
            'table' => "{$this->bd}people_status",
            'values' => $array['values'],
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }
    // DELETE ------------------------------------------------------------------
    // Eliminar evento
    function deleteEvent($array)
    {
        return $this->_Delete([
            'table' => "{$this->bd}`events`",
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Eliminar responsables
    function deletePeople($array)
    {
        return $this->_Delete([
            'table' => "{$this->bd}people",
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // Eliminar notificaciones
    function deleteNotification($array)
    {
        return $this->_Delete([
            'table' => "notifications",
            'where' => $array['where'],
            'data' => $array['data']
        ]);
    }

    // OTRAS -------------------------------------------------------------------
    // Obtener el último evento
    function maxEvent()
    {
        return $this->_Select([
            'table' => "{$this->bd}`events`",
            'values' => 'max(idEvent) AS id'
        ])[0]['id'];
    }

    // Obtener la última temporada
    function maxSeason()
    {
        return $this->_Select([
            'table' => "{$this->bd}season",
            'values' => 'max(idSeason) AS id'
        ])[0]['id'];
    }

    // Obtener el último estado de evento
    function maxEventStatus()
    {
        return $this->_Select([
            'table' => "{$this->bd}events_status",
            'values' => 'max(idEventStatus) AS id'
        ])[0]['id'];
    }

    // Obtener el último estado de responsable
    function maxPeopleStatus()
    {
        return $this->_Select([
            'table' => "{$this->bd}people_status",
            'values' => 'max(idPeopleStatus) AS id'
        ])[0]['id'];
    }

}
?>