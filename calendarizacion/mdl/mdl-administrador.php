<?php
require_once('mdl-app.php');
class MAdministrador extends MApp {
function listEvent($array){
    $values = [
        "event_seasons.name_season",
        "title",
        "activities",
        "day_init",
        "month_init",
        "day_end",
        "month_end",
        "event_replay.name_replay",
        "event_year.idYear",
        "event_year.id_Event as id",
        "event_year.`year`",
        "event_year.date_init",
        "event_year.date_end",
        "event_year.id_status",
        "title",
        "event_status.name_status",
        "abreviatura",
    ];

    $innerjoin = [
        "{$this->bd_event}events"       => "id_Season = idSeason",
        "{$this->bd_event}event_replay" => "id_Replay = idReplay",
        "{$this->bd_event}event_year"   => "{$this->bd_event}event_year.id_Event = idEvent",
        "{$this->bd_event}event_status" => "{$this->bd_event}event_year.id_status = idStatus",
        "udn"                           => "id_UDN = idUDN",
    ];

    return $this->_Select([
        'table'     => "{$this->bd_event}event_seasons",
        'values'    => $values,
        'where'     => "id_status != 0, date_init >= ? OR date_end <= ?",
        'innerjoin' => $innerjoin,
        'data'      => $array
    ]);
}
function lsReponsibleEvent($array){
    return $this->_Select([
        'table'     => "{$this->bd_event}event_responsible",
        'values'    => 'Nombres',
        'innerjoin' => ["{$this->bd_ch}empleados"=>'idEmpleado = id_Employed'],
        'where'     => 'id_Event,year',
        'order'     => ['ASC'=>'Nombres'],
        'data'      => $array
    ]);
}
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
function maxEvent(){
    return $this->_Select([
        'table'  => "{$this->bd_event}events",
        'values' => 'MAX(idEvent) AS id',
    ])[0]['id'];
}
function newEvent($array){
    $array['table'] = "{$this->bd_event}events";
    $success = $this->_Insert($array);
    if($success) return $this->maxEvent();
    return $success;
}
function statusEvent($array){
    $array['table'] = "{$this->bd_event}event_year";
    return $this->_Update($array);
}
function newResponsibleEvent($array){
    $array['table'] = "{$this->bd_event}event_responsible";
    return $this->_Insert($array);
}
function newEventYear($array){
    $array['table'] = "{$this->bd_event}event_year";
    return $this->_Insert($array);
}
function getEventByID($array = null){
    $array = $array ?? $_POST['id'];
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
        'table'     => "{$this->bd_event}events",
        'values'    => $values,
        'where'     => 'idEvent',
        'data'      => $array
    ])[0];

    $event['date_init']   = date('Y').'-'.$event['month_init'].'-'.$event['day_init'];
    $event['date_end']    = date('Y').'-'.$event['month_end'].'-'.$event['day_end'];
    $event['id_Employed'] = [1,2,3,4];
    
    unset($event['day_init'],$event['month_init'],$event['day_end'],$event['month_end']);

    return $event;
}
function employedByidEvent($array){
    return $this->_Select([
        'table'     => "{$this->bd_event}event_responsible",
        'values'    => 'id_Employed',
        'where'     => 'id_Event',
        'data'      => $array
    ]);
}
}
?> 