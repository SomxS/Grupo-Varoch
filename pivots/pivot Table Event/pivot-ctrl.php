<?php
session_start();
if (empty($_POST['opc'])) exit(0);

// incluir tu modelo
require_once '../mdl/pivot-mdl.php';

// sustituir 'mdl' extends de acuerdo al nombre que tiene el modelo
$encode = [];
class ctrl extends mdl{

    function list() {

        // 📜 Obtener parámetros de la solicitud
        $__row     = [];

        $idEstatus = $_POST['status'];
        $fi        = $_POST['fi'];
        $ff        = $_POST['ff'];

        #Consultar a la base de datos
        $ls = $this->getEvents([
            'subsidiaries_id' => $_SESSION['SUB'],
            'fi'              => $fi,
            'ff'              => $ff,
            'status'          => $_POST['status']
        ]);
        
        foreach ($ls as $key) {

           // 🔵 Variables (ajusta según tus necesidades)
           $folio = "T-" . $this->util->zeroFill($key['id']);
           

            // 🔵 Formateo de datos
            $date_creation = formatSpanishDate($key['date_creation'],'normal');
             
               
           
            $__row[] = [

                'id'       => $key['id'],
                'folio'    => $folio,
                'Nombre'   => $key['name_event'],
                'Fecha'    => $date_creation,

                'Total'     => [
                    "html"  => evaluar($total),
                    "class" => " text-green-500 text-end"
                ],

                'Horario'   => $key['hours'],
                'Estado'    => getEstatus($key['idStatus']),
                'dropdown'  => dropdown($key['id'],$key['idStatus'])
            ];
        }

        // 📜 Encapsular y retornar datos 
        return [

            "row" => $__row,
            'ls'  => $ls           
        ];

    }

    function get(){
        
        $list = $this -> getTableByID([ $_POST['id'] ]);

        return ['data' => $list ];
      
    }

    function cancel() {
        $status = 500;
        $message = 'Error al eliminar registro.';
        // Eliminar platillos
        $delete = $this->delete($this->util->sql($_POST, 1));

        if ($delete == true) {
            $status  = 200;
            $message = 'Se ha eliminado correctamente';
        }

        return [
            'status'   => $status,
            'message' => $message
        ];
    }

    


}

// Complements.
 function dropdown($id, $idStatus) {

         // 📏 INSTANCIA BASE
        $instancia = 'gestor';

        $values = [
            'inProgress' => ['icon' => 'icon-play',    'text' => 'Iniciar',   'onclick' => "{$instancia}.statusTasks(2,{$id})"],
            'finalize'   => ['icon' => 'icon-ok',      'text' => 'Finalizar', 'onclick' => "{$instancia}.statusTasks(4,{$id})"],
            'delete'     => ['icon' => 'icon-cancel',  'text' => 'Cancelar',  'onclick' => "{$instancia}.statusTasks(5,{$id})"],
            'edit'       => ['icon' => 'icon-pencil',  'text' => 'Editar',    'onclick' => "{$instancia}.editTaskModal({$id})"],
            'advance'    => ['icon' => 'icon-comment', 'text' => 'Avances',   'onclick' => "{$instancia}.advanceModal({$id})"],
            'reminder'   => ['icon' => 'icon-whatsapp','text' => 'Recordar',  'onclick' => "{$instancia}.reminderModal({$id})"],
        ];


       $options = [
            '1' => [
                $values['inProgress'],
                $values['edit'],
                $values['advance'],
                $values['reminder'],
                $values['delete'],
            ],
            '2' => [
                $values['finalize'],
                $values['edit'],
                $values['advance'],
                $values['reminder'],
                $values['delete'],
            ],
            '4' => [
                $values['advance'],
                $values['delete'],
            ],
            '5' => [
                $values['advance'],
            ],
        ];


        // 📌 Verificar estado, si no crea dropdown vacion
        return $options[$idStatus] ?? [];
}


function getEstatus($idstatus) {
    // 🔵 Definimos los estados con sus respectivos emojis y etiquetas
    $estados = [
        1 => '⏳  EN PROCESO',
        2 => '✅ FINALIZADO',
        3 => '❌ CANCELADO'
    ];

    // 📌 Verificamos si el estado existe en la lista, de lo contrario, asignamos un valor por defecto
    return $estados[$idstatus] ?? '❓ DESCONOCIDO';
}




$obj = new ctrl();
$fn = $_POST['opc'];
$encode = $obj->$fn();
echo json_encode($encode);