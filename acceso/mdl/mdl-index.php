<?php
require_once('../../conf/_CRUD.php');
class Index extends CRUD {
    private $bd;
    public function __construct() {
        $this->bd = "rfwsmqex_erp_rh.";
    }
// SELECT
function name_empleado($array){
    return $this->_Select([
        'table'     => 'usuarios',
        'values'    => 'Nombres AS nombres,APaterno AS apaterno,Telefono_Movil AS telefono',
        'innerjoin' => ["{$this->bd}empleados" => 'usr_empleado = idEmpleado'],
        'where'     => 'idUser',
        'data'      => $array,
    ])[0];
}
function consulta_user($array){
    $query = "SELECT
                    usuarios.idUser,
                    usuarios.usr_perfil,
                    usuarios.user_photo,
                    usuarios.activacion,
                    directorios.dir_ruta,
                    modulos.mod_ruta,
                    directorios.dir_submodulo,
                    submodulos.sub_ruta AS submodulo 
                FROM
                    usuarios
                    INNER JOIN permisos ON usuarios.usr_perfil = permisos.id_Perfil
                    INNER JOIN directorios ON permisos.id_Directorio = directorios.idDirectorio
                    INNER JOIN modulos ON directorios.dir_modulo = modulos.idModulo 
                    LEFT JOIN submodulos ON submodulos.idSubmodulo = directorios.dir_submodulo
                WHERE
                    usuarios.usser = ? 
                    AND ( 
                        usuarios.keey = MD5(?) 
                        OR usuarios.keey2 = MD5(?)
                    )
                    AND usuarios.usr_estado = 1 
                    AND directorios.dir_estado = 1 
                    AND directorios.dir_visible = 1 
                ORDER BY
                    mod_orden,
                    sub_orden,
                    dir_orden ASC 
                    LIMIT 1";
    return $this->_Read($query,$array)[0];
}
function datos_empleado($array){
    $value = [
        'idUser AS id',
        'Telefono_Movil AS telefono', 
        'Email AS correo',
        'Nombres AS nombre',
        'APaterno AS aPaterno'
    ];

    return $this->_Select([
        'table'  => "{$this->bd}empleados",
        'values' => $values,
        'innerjoin' => ['usuarios' => 'usr_empleado = idEmpleado'],
        'where'  => 'usser = ? OR Telefono_Movil = ? OR Email = ?',
        'data'   => $array
    ])[0];
    // return $this->_Read("SELECT
    //                     usuarios.idUser AS id,
    //                     rh_empleados.Telefono_Movil AS telefono, 
    //                     rh_empleados.Email AS correo,
    //                     rh_empleados.Nombres AS nombre,
    //                     rh_empleados.APaterno AS aPaterno
    //                 FROM
    //                     usuarios
    //                     LEFT JOIN rh_empleados ON usuarios.usr_empleado = rh_empleados.idEmpleado 
    //                 WHERE
    //                     usuarios.usser = ? 
    //                     OR rh_empleados.Telefono_Movil = ? 
    //                     OR rh_empleados.Email = ?",$array)[0];
}
// UPDATE
function update_clave_temporal($array){
    return $this->_Update([
        "table"  => "usuarios",
        "values" => "keey2 = MD5(?), activacion = null",
        "where"  => "idUser",
        "data"   => $array
    ]);
}
}
?>