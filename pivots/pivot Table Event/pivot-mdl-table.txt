<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';

// 📜 Modelo para la gestión de evt_subevents
class mdl extends CRUD {
    protected $util;
    protected $bd;

    public function __construct(){
        $this->util = new Utileria;
        $this->bd = '.';
    }

    function lsUDN(){
        return $this->_Select([
            'table' => 'udn',
            'values' => 'idUDN AS id, UDN AS valor',
            'where' => 'Stado = 1',
            'order' => ['ASC' => 'Antiguedad'],
        ]);
    }


    // Table.
    function getEntities($array){

        $values = [
            'evt_events.id as id',
            'name_event',
         
            "DATE_FORMAT(date_creation,'%Y-%m-%d') AS date_creation",
            'date_start',
            "DATE_FORMAT(date_start,'%H:%i hrs') as hours_start",
            'date_end',
           
            'phone',
            'email',
            'status_process_id AS idStatus',
        ];

        $innerjoin = [
            'status_process' => 'evt_events.status_process_id = status_process.id',
        ];

         // $where = [];
        $where = ['subsidiaries_id = ? AND date_creation BETWEEN ? AND ? '];

       

        // FILTROS POR ESTADO

        if ( $array['status'] == '0') unset($array['status']);
        else $where[] = 'status_process_id = ?';


        return $this->_Select([
            'table'  => "{$this->bd}name_table",
            'values'    => $values,
            'innerjoin' => $innerjoin,
            'where'     => $where,
            'order'     => ['ASC' => 'status_process.id','DESC' => 'evt_events.date_creation'],
            'data'      => array_values($array),

        ]);

    }


    function getById($array){
        return $this->_Select([
            'table'  => "{$this->bd}name_table",
            'values' => 'id,name AS valor',
            'where'  => 'ID = ?',
            'data'   => $array
        ])[0];
    }

    function create($array) {
        return $this->_Insert([
            'table' => "{$this->bd}name_table", 
            'values' => $array['values'],
            'data' => $array['data'],
        ]);
    }

    function maxID(){
        return $this->_Select([
            'table'  => "{$this->bd}name_table",
            'values' => 'MAX(id) AS id',
        ])[0]['id'];
    }


    function update($array){
        return $this->_Update([
            'table'  => "{$this->bd}name_table",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data'],
        ]);
    }





}