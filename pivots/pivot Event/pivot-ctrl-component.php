<?php
if (empty($_POST['opc'])) exit(0);

// Incluir el modelo correspondiente
require_once '../mdl/mdl-payment.php';

class ctrl extends mdl {

      public function getDataComponent(){

        // Info Event.

        $Event                  = $this -> getEventsByID([$_POST['idEvent']]);
        $Event['day']           = formatSpanishDay($Event['date_start']);
        $Event['date_start']    = formatSpanishDate($Event['date_start'], 'normal');
        $Event['date_end']      = formatSpanishDate($Event['date_end'], 'normal');
        $Event['date_creation'] = formatSpanishDate($Event['date_creation'], 'normal');

        // Info SubEvent.
        $ls            = $this -> listSubEvents([ $_POST['idEvent'] ]);

        $SubEvent = [];

        foreach($ls as $key){


            $menu   = $this -> getMenuById([$key['id']]);
            $dishes = $this -> getDishesByMenu([$menu[0]['id']]);
            
            $SubEvent[] = [
                'id'              => $key['id'],
                'name_subevent'   => $key['name_subevent'],
                'date'            => $key['date'],
                'date_start'      => $key['date_start'],
                'date_end'        => $key['date_end'],
                'time_start'      => $key['time_start'],
                'time_end'        => $key['time_end'],
                'total_pay'       => $key['total_pay'],
                'location'        => $key['location'],
                'quantity_people' => $key['quantity_people'],

                'menu'   => $menu[0],
                'dishes' => $dishes
            ];
        }



          return[
            'Event'    => $Event,
            'SubEvent' => $SubEvent
        ];

    }

}

// Instancia del objeto
$obj = new ctrl();
$fn = $_POST['opc'];
$response = $obj->$fn();

echo json_encode($response);