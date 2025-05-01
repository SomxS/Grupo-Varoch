Quiero que generes un **Controlador PHP** siguiendo esta estructura:

El archivo debe iniciar la sesión PHP (`session_start();`).  
Validar que `$_POST['opc']` esté definido o salir (`if (empty($_POST['opc'])) exit(0);`).  
Requerir el modelo correcto (`require_once '../mdl/mdl-[proyecto].php';`).  
Crear una clase `ctrl` que extienda la clase del modelo.

Implementar los métodos siguientes dentro de la clase `ctrl`:

1. **list()**
   - Recibe fechas `fi` y `ff`.
   - Llama al método `getEntities()`.
   - Formatea el resultado en arreglo `__row` para tabla.
   - Agrega `dropdown` para cada fila con opciones de acciones (`editar`, `eliminar`, etc.).

2. **get()**
   - Recibe `id` por POST.
   - Ejecuta `getById(id)`.
   - Retorna `status`, `message` y `data`.

3. **add()** *(si aplica)*
   - Recibe datos por POST.
   - Ejecuta `create()`.
   - Retorna `status` y `message` de inserción.

4. **edit()**
   - Recibe datos por POST.
   - Ejecuta `update()`.
   - Retorna `status` y `message` de actualización.

5. **cancel() / finalize()** *(según flujo)*
   - Cambia estatus de registros con `update()`.

Funciones extra:

- **dropdown($id)**: Construye opciones de acciones disponibles según el estado del registro.
- **getEstatus($idStatus)**: Devuelve el texto correspondiente al estado (opcional).

Formato de salida:
- Al final instanciar `$obj = new ctrl();`
- Llamar a la función dinámica:  
  ```php
  $fn = $_POST['opc'];
  $encode = $obj->$fn();
  echo json_encode($encode);
