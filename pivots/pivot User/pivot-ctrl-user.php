<?php
if (empty($_POST['opc'])) exit(0);
require_once '../mdl/mdl-user.php';

class User extends MUser{
    
    function init(){
        return [
            'sucursal' => $this->lsSucursal([1]),
            'rol'      => $this->lsRol()
        ];
    }

    function list(){
        $__row = [];
        $ls    = $this->listUsers();

        foreach ($ls as $key) {
            $a = [];
            $a[] = [
                'class'   => 'btn btn-sm btn-primary me-1',
                'html'    => '<i class="icon-pencil"></i>',
                'onclick' => 'app.edit('.$key['id'].')'
            ];
            $a[] = [
                'class'   => 'btn btn-sm btn-danger',
                'html'    => '<i class="icon-trash-empty"></i>',
                'onclick' => 'app.delete('.$key['id'].')'
            ];
            $__row[] = [
                'id'       => $key['id'],
                'User'     => $key['user'],
                'Rol'      => $key['rols'],
                'Sucursal' => $key['sucursal'],
                'a'        => $a,
            ];
        }
        
        return [
            "row" => $__row,
        ];
    }

    function getUser(){
        $status = 500;
        $message = 'Error al obtener los datos';
        $lsUser =  $this->getUserByID($_POST['id']);
        if ($lsUser) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
        }
        return [
            'status'  => $status,
            'message' => $message,
            'user'    => $lsUser[0]
        ];
    }

    function addUser(){

        $status = 500;
        $message = 'No se pudo insertar correctamente';

        $__values = [
            'rol_id'          => $_POST['rol_id'],
            'user'            => $_POST['user'],
            'subsidiaries_id' => $_POST['subsidiaries_id'],
            'pass'            => $_POST['key'],
        ];

        $create = $this->createUser($this->util->sql($__values));

         if ($create == true) {
          
            $status  = 200;
            $message = 'Se agrego correctamente.';
        }

        return [
            'status'   => $status,
            'message' => $message,
           
        ];
        
    }

    function editUser(){
        $status = 500;
        $message = 'Error al editar';
        $edit = $this->updateUser($this->util->sql($_POST, 1));
        
        if ($edit) {
            $status = 200;
            $message = 'Se ha editado correctamente';
        }
        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

    function deleteUser(){
        $status = 500;
        $message = 'Error al eliminar usuario';
        $delete = $this->deleteUsr($this->util->sql($_POST, 1));
        if ($delete) {
            $status = 200;
            $message = 'Usuario eliminado correctamente.';
        }
        return [
            'status'  => $status,
            'message' => $message,
            $delete
        ];
    }
}

$obj    = new User();
$fn     = $_POST['opc'];
$encode = [];
$encode = $obj->$fn();
echo json_encode($encode);
?>
