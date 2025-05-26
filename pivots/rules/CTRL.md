Quiero que generes un **Controlador PHP** siguiendo esta estructura:

El archivo debe iniciar la sesión PHP (`session_start();`).  
Validar que `$_POST['opc']` esté definido o salir (`if (empty($_POST['opc'])) exit(0);`).  
Requerir el modelo correcto (`require_once '../mdl/mdl-[proyecto].php';`).  
Crear una clase `ctrl` que extienda la clase del modelo.

Implementar los métodos siguientes dentro de la clase `ctrl`:

1. ** init() **
- Este método solo se crea si el frontend utiliza filtros dinámicos (como `select`, `radio`, etc.).
- Cada lista se debe obtener mediante métodos del modelo, como `lsUDN()`, `lsStatus()`, `lsTipos()`, etc.
- Si el perfil del usuario requiere condiciones especiales (como admin), se deben aplicar en este método.
- El resultado debe retornarse como un arreglo asociativo, listo para ser consumido por JavaScript.

   ```php ejemplo
    public function init() {
        $lsUDN    = $this->lsUDN();
        $lsStatus = $this->lsStatus();

        return [
            'udn'    => $lsUDN,
            'status' => $lsStatus
        ];
       }

2. **list()**
   - Si la filterBar tiene calendar Recibe fechas `fi` y `ff`.
   - Llama al método `getEntities()`.
   - Formatea el resultado en arreglo `__row` para tabla.
   - Agrega `dropdown` para cada fila con opciones de acciones (`editar`, `eliminar`, etc.).
   - Agrega `a` a la ultima fila de row si , solo es editar y eliminar. 

3. **get()**
   - Recibe `id` por POST.
   - Ejecuta `getById(id)`.
   - Retorna `status`, `message` y `data`.

4. **add()** *(si aplica)*
   - Recibe datos por POST.
   - Ejecuta `create()`.
   - Retorna `status` y `message` de inserción.

5. **edit()**
   - Recibe datos por POST.
   - Ejecuta `update()`.
   - Retorna `status` y `message` de actualización.

6. **cancel() ** *(según flujo)*
   - Cambia estatus de registros con `update()`.

Funciones extra:

- **dropdown($id)**: Construye opciones de acciones disponibles según el estado del registro.
- **getEstatus($idStatus)**: Devuelve el texto correspondiente al estado (opcional).
- **a**: arreglo dentro de row para crear botones

Formato de salida:
- Al final instanciar `$obj = new ctrl();`
- Llamar a la función dinámica:  
  ```php
  $fn = $_POST['opc'];
  $encode = $obj->$fn();
  echo json_encode($encode);


  ** funciones auxiliares
<merge-multiple>

🎯 **Objetivo**  
Combinar un conjunto de claves fijas con atributos calculados dinámicamente desde una lista, generando una fila homogénea que puede ser usada para inserción, consolidación o visualización.
Se puede sugerir usar cuando son consultas por grupos o de forma dinamica.

🧩🧩 **Estructura Base**

```php

$base = [
    'clave_fija_1' => $idReferencia,
    'clave_fija_2' => $registro['identificador'],
];

$atributos = [];

foreach ($lista as $item) {
    $resultado = $this->obtenerDato([$item['id']]);
    $atributos[$item['clave']] = floatval($resultado['valor']);
}

$atributos['conteo'] = 1;

$row = array_merge($base, $atributos);

```

</merge-multiple>









    