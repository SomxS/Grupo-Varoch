<?php
require_once('conf/_Utileria.php');
require_once('conf/_CRUD.php');
class App extends CRUD {
    public $util;
    public function __construct() {
        $this->util = new Utileria();
    }
    function lsUDN(){
        return $this->_Select([
            'table'  => "udn",
            'values' => 'idUDN AS id, UDN as valor',
            'where'  => 'Stado = 1',
            'order'  => ['ASC'=>'Antiguedad'],
        ]);
    }
    function nuevaUDN(){
        $array          = $this->util->sql($_POST);
        $array['table'] = "udn";
        
        $success =  $this->_Insert($array);

        return ['success'=>$success];
    }
    function borrarUDN(){
        $array          = $this->util->sql($_POST,1);
        $array['table'] = "udn";
        
        $success =  $this->_Delete($array);

        return ['success'=>$success];
    }
}

$opc    = $_POST['opc'];
$obj    = new App();
$encode = $obj->$opc();
echo json_encode($encode);
?>