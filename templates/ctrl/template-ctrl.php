<?php
if (empty($_POST['opc'])) exit(0);

setlocale(LC_TIME, 'es_ES.UTF-8');
date_default_timezone_set('America/Mexico_City');

header("Access-Control-Allow-Origin: *"); // Permite solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type"); // Encabezados permitidos
// incluir tu modelo
require_once ('../mdl/mdl.php');

// sustituir 'mdl' extends de acuerdo al nombre que tiene el modelo 
class ctrl extends mdl{

    function list(){
        $instancia = 'app';
        # Declarar variables
        $__row = [];

        // #Consultar a la base de datos
        $ls = $this->get();

        foreach ($ls as $key) {
            $a = [];

            $a[] = [
                'html'  => '<i class="icon-pencil"></i> ',
                'icon'  => 'icon-pencil',
                'fn'    => "{$instancia}.edit({$key['id']})",
                'class' => 'btn btn-sm btn-outline-info me-1'
            ];
            $a[] = [
                'html'  => '<i class="icon-cancel"></i>',
                'fn'    => "{$instancia}.cancel({$key['id']})",
                'class' => 'btn btn-sm btn-outline-danger'
            ];  
         

            $__row[] = array(
            'id'       => $key['id'],
            'nombre'   => $key['valor'],
            'fecha'    => $key['date'],

            'a'  => $a
            );
        }

        #encapsular datos
        return [

            "thead" => '',
            "row" => $__row,
        ];

    }

     function get(){
        $status = 500;
        $message = 'Error al obtener los datos';
        $get = $this->getById([$_POST['id']]);

        if ($get) {
            $status = 200;
            $message = 'Datos obtenidos correctamente.';
        }
        return [
            'status'  => $status,
            'message' => $message,
            'data'    => $get[0]
        ];
    }

    function add() {
        $status = 500;
        $message = 'No se pudo insertar correctamente';
        $_POST['date_creation'] = date('Y-m-d H:i:s');
        $_POST['status_process_id'] = 1;
        $create = $this->create($this->util->sql($_POST));

        if ($create) {
            $status  = 200;
            $message = 'Se agregó correctamente.';
        }

        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

    function edit() {
        $status = 500;
        $message = 'Error al editar';
        $edit = $this->update($this->util->sql($_POST, 1));

        if ($edit) {
            $status = 200;
            $message = 'Se ha editado correctamente';
        }
        return [
            'status'  => $status,
            'message' => $message,
        ];
    }

    function delete() {
        $status = 500;
        $message = 'Error al eliminar';
        $delete = $this->delete($this->util->sql($_POST, 1));
        if ($delete) {
            $status = 200;
            $message = 'Se ha eliminado correctamente.';
        }
        return [
            'status'  => $status,
            'message' => $message,
            $delete
        ];
    }

   

}


// Instancia del objeto

$obj    = new ctrl();
$fn     = $_POST['opc'];
$encode = $obj->$fn();

echo json_encode($encode);