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
        $query = "SELECT idUDN AS id, UDN AS valor FROM rfwsmqex_gvsl.udn 
        WHERE Stado = 1 AND idUDN != 10 AND idUDN != 8  
        ORDER BY Antiguedad ASC";
        return $this->_Read($query, null);
    }




} 