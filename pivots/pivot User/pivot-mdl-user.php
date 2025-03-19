<?php
require_once('../../conf/_CRUD.php');
require_once('../../conf/_Utileria.php');

class MUser extends CRUD {
    protected $util;

    public function __construct() {
        $this->util = new Utileria;
    }

    function listUsers(){
        $query = "
        SELECT
            subsidiaries.name as sucursal,
            usr_users.id,
            usr_users.user,
            usr_users.enabled,
            usr_rols.rols
        FROM
            usr_users
        INNER JOIN subsidiaries ON usr_users.subsidiaries_id = subsidiaries.id
        INNER JOIN usr_rols ON usr_users.usr_rols_id = usr_rols.id
        WHERE usr_users.enabled = 1
        ";
        return $this->_Read($query, null);   
    }

    function createUser($array){
        return $this->_Insert([
            'table'  => "usr_users",
            'values' => $array['values'],
            'data'   => $array['data'],
        ]);
    }

    function updateUser($array){
        return $this->_Update([
            'table'  => "usr_users",
            'values' => $array['values'],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function deleteUsr($array){
        return $this->_Update([
            'table'  => "usr_users",
            'values' => ['enabled' => 0],
            'where'  => $array['where'],
            'data'   => $array['data']
        ]);
    }

    function getUserByID($id){
        $query = "
        SELECT
            usr_users.id,
            usr_users.user,
            usr_users.usr_rols_id,
            usr_users.subsidiaries_id,
            usr_rols.rols,
            subsidiaries.name as sucursal
        FROM
            usr_users
        INNER JOIN subsidiaries ON usr_users.subsidiaries_id = subsidiaries.id
        INNER JOIN usr_rols ON usr_users.usr_rols_id = usr_rols.id
        WHERE usr_users.id = ?
        ";
        return $this->_ReadOne($query, [$id]);   
    }

    function lsSucursal($d){
        $query = "SELECT
            subsidiaries.id,
            subsidiaries.name as valor,
            subsidiaries.companies_id
        FROM
            subsidiaries
        WHERE companies_id = ?
        AND enabled = 1";
        return $this->_Read($query, $d);
    }

    function lsRol(){
        $query = "SELECT
            usr_rols.id as id,
            usr_rols.rols as valor
        FROM
            usr_rols";
        return $this->_Read($query, null);
    }
}
?>
