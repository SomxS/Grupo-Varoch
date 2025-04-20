<?php
require_once('../../conf/_CRUD.php');


class mdl extends CRUD {
    public $bd;
    public $bd2;
    public $_;
    
    public function __construct(){
        $this->bd = 'rfwsmqex_gvsl_costsys2.';

        $this-> _ = $this -> bd.'costopotencial';
    }

    function lsUDN(){
        return $this->_Select([
                'table'  => 'udn',
                'values' => 'idUDN AS id, UDN AS valor',
                'where'  => 'Stado = 1',
                'order' => ['ASC'=>'Antiguedad']
            ]);
    }




} 