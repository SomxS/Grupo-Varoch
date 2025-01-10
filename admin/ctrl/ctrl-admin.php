<?php
if (empty($_POST['opc']))
    exit(0);

// incluir tu modelo
require_once ('../mdl/mdl-admin.php');

// sustituir 'mdl' extends de acuerdo al nombre que tiene el modelo
class ctrl extends mdl{

    function init(){
        return[
            'udn' => $this->lsUDN()
        ];

    }


}


// Instancia del objeto

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);