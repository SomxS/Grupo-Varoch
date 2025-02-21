<?php
require_once('../../conf/_Utileria.php');
require_once('../../conf/_CRUD.php');
class MApp extends CRUD {
    public $bd_event = "rfwsmqex_gvsl_calendarizacion2.";
    public $bd_ch = "rfwsmqex_gvsl_rrhh.";
    public $util;

    public function __construct() {
        $this->util = new Utileria();
    }
// INIT
function lsUDNbyID($array){
    return $this->_Select([
            'table'  => 'udn',
            'values' => 'idUDN AS id, UDN AS valor',
            'where'  => 'Stado = 1,idUDN',
            'data'   => $array,
        ]);
}
function lsUDN($tipo = null){
    $sql = $this->_Select([
            'table'  => 'udn',
            'values' => 'idUDN AS id, UDN AS valor',
            'where'  => 'Stado = 1',
            'order' => ['ASC'=>'Antiguedad']
        ]);
    
    return empty($tipo) ? $sql : array_merge([["id"=>0,"valor"=>"TODAS LAS UDN"]],$sql);
}

function lsReplay(){
    return $this->_Select([
        'table'  => "{$this->bd_event}event_replay",
        'values' => 'idReplay AS id,name_replay AS valor',
    ]);
}

function lsSeason(){
    return $this->_Select([
        'table'     => "{$this->bd_event}event_seasons",
        'values'    => 'idSeason AS id,name_season AS valor',
        'order'     => ['ASC'=>'name_season'],
    ]);
}

function lsStatus(){
    $sql = $this->_Select([
        'table'  => "{$this->bd_event}event_status",
        'values' => 'idStatus AS id,UPPER(name_status) AS valor',
    ]);
    
    return array_merge([["id"=>0,"valor"=>"TODOS LOS ESTADOS"]],$sql);
}

function lsEmployed($array){
    return $this->_Select([
        'table'     => "{$this->bd_ch}empleados",
        'values'    => 'idEmpleado AS id,CONCAT("[",Abreviatura,"] ",Nombres) AS valor',
        'where'     => 'Estado = 1, (UDN_Empleado = ? OR UDN_Empleado = ?)',
        'innerjoin' => ["udn" => "UDN_Empleado = idUDN"],
        'order'     => ['ASC'=>'idUDN,Nombres'],
        'data'      => $array
    ]);
}
    
// Retroaliemntacion
function lsFeedback($array){
    return $this->_Select([
        'table'  => "{$this->bd_event}event_feedback",
        'values' => "idFeedback AS id, feedback AS valor, id_Event, DATE_FORMAT(date, '%d-%m-%Y') AS fecha, `year` AS anio, id_usser",
        'where'  => "id_Event = ? AND (`year` = YEAR (CURDATE()) OR `year` = YEAR (CURDATE()) - 1 OR `year` = YEAR (CURDATE()) - 2)",
        'order'     => ['ASC'=>'date'],
        'data'   => $array
    ]);
    
}

function getFeedbackByID ($array){
    return $this->_Select([
        'table'  => "{$this->bd_event}event_feedback",
        'values' => "idFeedback AS id, feedback AS valor, id_Event, DATE_FORMAT(date, '%d-%m-%Y') AS fecha, year, id_usser",
        'where'  => 'idFeedback = ?',
        'data'   => $array
    ]);
}

function createFeedback($array)
{
    return $this->_Insert([
        'table' => "{$this->bd_event}event_feedback",
        'values' => $array['values'],
        'data' => $array['data']
    ]);
}

function updateFeedback($array)
{
    return $this->_Update([
        'table' => "{$this->bd_event}event_feedback",
        'values' => $array['values'],
        'where' => $array['where'],
        'data' => $array['data']
    ]);
}

function deleteFeedback($array)
{
    return $this->_Delete([
        'table' => "{$this->bd_event}event_feedback",
        'where' => $array['where'],
        'data' => $array['data']
    ]);
}

// Recordatorios
function lsReminder($array){
    
    $values = [
        'idEvent AS id',
        'title',
        'name_season',
        'activities',
        'date_init',
        'date_end',
        'abreviatura',
        'id_status',
        'name_status',
        'year',
    ];

    $innerjoin = [
        "udn"                             => "idUDN = id_UDN",
        "{$this->bd_event}event_year"    => "idEvent = id_Event",
        "{$this->bd_event}event_seasons" => "idSeason = id_Season",
        "{$this->bd_event}event_status"  => "idStatus = id_Status",
    ];

    $where = ['id_status NOT IN (4, 5)'];

    // FILTROS POR UDN
    if ( $array['udn'] == '0') unset($array['udn']);
    else $where[] = 'id_UDN';

    // // FILTRO DE FECHAS
    if( $array['reminder'] == 'hoy' ) {
         $where[] = 'date_end <= ?';
         $array['reminder'] = date('Y-m-d');
    }


    if( $array['reminder'] == 'siete_dias' ) {
       $where[] = 'date_init BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)';
        unset($array['reminder']); // No es necesario enviar valores adicionales
    }

    if ($array['reminder'] == 'atrasados') {
        $where[] = 'date_end < CURDATE()';
        unset($array['reminder']); // No es necesario enviar valores adicionales
    }
   
 
    return $this->_Select([
        'table'     => "{$this->bd_event}events",
        'values'    => $values,
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'data'      => array_values($array)
    ]);
}
function getEmployedByUser($array){
    return $this->_Select([
        'table'     => "usuarios",
        'values'    => 'usr_empleado AS id',
        'where'     => 'idUser',
        'data'      => $array
    ])[0]['id'];
}

// RESPONSABLES
function listBeforeReponsible($array){
    $values = [
        "{$this->bd_event}event_responsible.id_Employed AS id_Employed",
        "{$this->bd_event}event_responsible.id_Event AS id_Event",
        "({$this->bd_event}event_responsible.`year`+1) AS `year`"
    ];

    $innerjoin = [
        "{$this->bd_event}event_responsible" => "idEvent = {$this->bd_event}event_responsible.id_Event",
        "{$this->bd_event}event_year"        => "idEvent = {$this->bd_event}event_year.id_Event",
    ];

    return $this->_Select([
        'table'     => "{$this->bd_event}`events`",
        'values'    => $values,
        'innerjoin' => $innerjoin,
        'where'     => "id_Replay = 1,id_status != 5,{$this->bd_event}event_responsible.`year`",
        'order'     => ['ASC'=>"{$this->bd_event}event_responsible.id_Event"],
        'data'      => $array
    ]);
}
function lsReponsibleEventByID($array){

    return $this->_Select([
        'table'     => "{$this->bd_event}event_responsible",
        'values'    => 'id_Employed AS id,Nombres AS valor,Telefono_movil,FullName',
        'innerjoin' => ["{$this->bd_ch}empleados"=>'idEmpleado = id_Employed'],
        'where'     => 'id_Event,year',
        'order'     => ['ASC'=>'Nombres'],
        'data'      => $array
    ]);
    
}

function lsEventsByID($array){
    $query = "
    SELECT
        title,
        activities,
        day_init,
        month_init,
        day_end,
        month_end,
        date_init,
        date_end,
        name_status,
        name_season
    FROM
    {$this->bd_event}events
    INNER JOIN {$this->bd_event}event_year ON event_year.id_Event = events.idEvent
    INNER JOIN {$this->bd_event}event_status ON event_year.id_status = event_status.idStatus
    INNER JOIN {$this->bd_event}event_seasons ON id_Season = idSeason
    WHERE idEvent = ?
    ";
    return $this->_Read($query, $array)[0];
}

function deleteReponsible($array){
    $array['table'] = "{$this->bd_event}event_responsible";
    return $this->_Delete($array);
}
function newResponsibleEvent($array){
    $array['table'] = "{$this->bd_event}event_responsible";
    return $this->_Insert($array);
}



// TEMPORADAS
function maxSeason(){
    return $this->_Select([
        'table'  => "{$this->bd_event}event_seasons",
        'values' => 'MAX(idSeason) AS id',
    ])[0]['id'];
}
function newSeason($array){
    $success = $this->_Insert([
        'table'  => "{$this->bd_event}event_seasons",
        'values' => 'name_season',
        'data'   => $array
    ]);
    if($success) return $this->maxSeason();
    return $success;
}

// EVENTOS
function listEvent($array){
    $values = [
        'idEvent AS id',
        'title',
        'name_season',
        'activities',
        'date_init',
        'date_end',
        'abreviatura',
        'id_status',
        "{$this->bd_event}event_year.year"
    ];

    

    $innerjoin = [
        "udn"                            => "idUDN = id_UDN",
        "{$this->bd_event}event_year"    => "idEvent = {$this->bd_event}event_year.id_Event",
        "{$this->bd_event}event_seasons" => "idSeason = id_Season",
        "{$this->bd_event}event_status"  => "idStatus = id_Status",
    ];


    $where[] = 'date_end <= ?';

    

    // FILTROS POR UDN
    if ( $array['udn'] == '0') unset($array['udn']);
    else $where[] = 'id_UDN';
    

    // FILTRO DE ESTADOS
    if( $array['status'] != '0' ) $where[] = 'id_Status';
    else {
        unset($array['status']);
        $where[] = 'id_Status NOT IN (3, 4, 5)';
    }

    // FILTROS EN CASO QUE USUARIO SEA CORPORATIVO
    if(!empty($array['id_Employed'])) {
        $innerjoin["{$this->bd_event}event_responsible"] = "idEvent = {$this->bd_event}event_responsible.id_Event";
        $where[] = 'id_Employed';
    }
    

    return $this->_Select([
        'table'     => "{$this->bd_event}`events`",
        'values'    => $values,
        'innerjoin' => $innerjoin,
        'where'     => $where,
        'order'     => ['ASC' => 'id_Status,date_init'],
        'data'      => array_values($array)
    ]);
}
function maxEvent(){
    return $this->_Select([
        'table'  => "{$this->bd_event}events",
        'values' => 'MAX(idEvent) AS id',
    ])[0]['id'];
}
function getEventByID($array){
    $values = [
        "title",
        "id_Season",
        "id_Replay",
        "day_init",
        "month_init",
        "day_end",
        "month_end",
        "id_UDN",
        "activities",
    ];

    $event = $this->_Select([
        'table'  => "{$this->bd_event}events",
        'values' => $values,
        'where'  => 'idEvent',
        'data'   => $array
    ])[0];

    $event['date_init']   = sprintf("%02d",$event['day_init']).'-'.sprintf("%02d",$event['month_init']).'-'.date('Y');
    $event['date_end']    = sprintf("%02d",$event['day_end']).'-'.sprintf("%02d",$event['month_end']).'-'.date('Y');

    $employeds = $this->lsReponsibleEventByID(array_merge($array,[date('Y')]));
    $event['id_Employed'] = array_column($employeds,'id');
    
    unset($event['day_init'],$event['month_init'],$event['day_end'],$event['month_end']);

    return $event;
}
function newEvent($array){
    $array['table'] = "{$this->bd_event}events";
    $success        = $this->_Insert($array);

    
    if($success) return $this->maxEvent();
    return $success;
}
function statusEvent($array){
    $array['table'] = "{$this->bd_event}event_year";
    return $this->_Update($array);
}
function eventChangeByID($array){
    $array['table'] = "{$this->bd_event}events";
    return $this->_Update($array);
}

// EVENTO ANUAL
function eventYearExistence($array){
    $count = $this->_Select([
        'table'     => "{$this->bd_event}event_year",
        'values'    => 'count(*) AS c',
        'where'     => 'year',
        'data'      => $array
    ])[0]['c'];

    return ($count !== '0');
}
function listBeforeEventYear($array){
    $values = [
        'id_Event',
        '(`year` + 1) AS `year`',
        "CONCAT(YEAR(CURDATE()),'-',DATE_FORMAT(date_init,'%m-%d')) AS date_init",
        "CONCAT(YEAR(CURDATE()),'-',DATE_FORMAT(date_end,'%m-%d')) AS date_end",
        'IF(id_status = 4,4,1) as id_status'
    ];

    return $this->_Select([
        'table'     => "{$this->bd_event}event_year",
        'values'    => $values,
        'innerjoin' => ["{$this->bd_event}events" => "id_Event = idEvent"],
        'where'     => 'id_Replay = 1,id_status != 5,year',
        'order'     => ['ASC'=>'date_init'],
        'data'      => $array
    ]);
}
function newEventYear($array){
    $array['table'] = "{$this->bd_event}event_year";
    return $this->_Insert($array);
}
function updateEventYear($array){
    $array['table'] = "{$this->bd_event}event_year";
    return $this->_Update($array);
}

// ACTIVIDADES
function textActivities($array){
    return $this->_Select([
        'table'     => "{$this->bd_event}events",
        'values'    => 'activities AS act',
        'where'     => 'idEvent',
        'data'      => $array
    ])[0]['act'];
}
}
?>