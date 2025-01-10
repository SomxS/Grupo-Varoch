<?php
class Utileria{
// Formatear el numero teléfonico
function format_phone($numero) {
    if (strlen($numero) === 10) {
        return '('.substr($numero, 0, 3) . ') '. substr($numero, 3, 3) .' '. substr($numero, 6, 2) .' '. substr($numero, 8, 2);
    } else {
        return $numero;
    }
}
// Formatear numeros en monedas y porcentajes
function format_number($number,$icon = '$'){
    // Validamos si $number es numerico y quitamos posibles espacios en blanco
    $number = (is_numeric(trim($number))) ? trim($number) : 0;

    // Le damos formato de numero con 2 decimales
    $format = ($number == 0 || $number == '') ? '-' : number_format($number,2,'.',',');


    if($format !== '-') 
        return ($icon === '$') ? "{$icon} {$format}" : "{$format} {$icon}";
    else 
        return $format;
}
// Generar codigo de seguridad
function code_security($longitud = 6){
    // $caracteres = '0123456789abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    $caracteres = '0123456789';
    $codigo     = '';

    $caracteres_length = strlen($caracteres);
    
    // Se hace un recorrido para concatenar numeros aleatoriamente
    for ($i=0; $i < $longitud; $i++)  
        $codigo .= $caracteres[random_int( 0, $caracteres_length - 1)];    

    return $codigo;
}
// Subir un archivo al servidor
function upload_file($file,$ruta,$new_name = null){    
    //Comprobar la existencia de la ruta
    if (!file_exists($ruta)) {
        mkdir($ruta, 0777, true); //Crearla si no existe.
    }

    $original_name  = $file['name'];
    $temporary_name = $file['tmp_name'];
    $file_extension = pathinfo($original_name, PATHINFO_EXTENSION);

    // Se asigna el nombre del archivo en caso que se quiera cambiar.
    $name_file = ($new_name !== null) ? $new_name.'.'.$file_extension : $original_name;

    // Asignamos la ruta completa con el nombre del archivo incluido.
    $full_ruta = $ruta.$name_file;

    // Se mueve de la ubicación temporal al servidor.
    if (move_uploaded_file($temporary_name,$full_ruta)) return true;

    // En caso que no funcione correctamente se retorna null
    return false;
}
// Obtener el dominio y la url completa con http
function url(){
    $https   = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https://' : 'http://';
    $dominio = $HTTPS.$_SERVER['HTTP_HOST'].'/';
    $erp     = explode('/',$_SERVER['REQUEST_URI'])[1].'/';
    return [$https.$dominio,$erp];
}
//Darle tratamiento al nombre del colaborador
function tratamiento_nombre($name,$last_name){
    // Se cuentan cuantas palabras tiene el nombre.
    $nombre = ucwords(mb_strtolower($name,'utf-8'));

    // Si el nombre es 1 o más de 2 se retorna el apellido
    if(str_word_count($nombre) === 1 || str_word_count($nombre) > 2 ) 
        $nombre = explode(' ',$nombre)[0].' '.ucfirst(explode(' ',mb_strtolower($last_name,'utf-8'))[0]);

    return $nombre;
}
// Tratamiento del array para SQL
function sql($arreglo, $where = 0){
    if(isset($arreglo['opc'])) unset($arreglo['opc']);
    $array = []; //Creamo un nuevo array para darle tratamiento
    foreach ($arreglo as $key => $value) {
        $array['values'][] = $key; // Obtenemos los index y los guardamos como values
        $array['data'][] = $value; // Obtenemos los values que usamos para cada ?
    }

    // Comprobamos que where exista
    if ($where !== 0) {
        // Separamos los valores acorde a la cantidad de valores del where
        $array['where'] = array_slice($array['values'],-$where);
        array_splice($array['values'],-$where);
    }

    // En caso que values sea igual a 0 lo eliminamos del array
    if(count($array['values']) == 0 ) unset($array['values']);

    return $array;
}
}
?>