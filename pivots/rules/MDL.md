

✅ El modelo debe extender `CRUD` (`class mdl extends CRUD {}`).  
✅ Requerir archivos de configuración necesarios:
  - `require_once '../../conf/_CRUD.php';`
  - `require_once '../../conf/_Utileria.php';`

 - Las funciones de los modulos deben ir separadas por un comentario indicando a que pertenecen por ejemplo `// Finanzas., // Eventos., etc`
 - Los nombres de las funciones deben ser en ingles y Mantener la nomenclatura camelCase 


Declarar propiedades:
```php
protected $util;
protected $bd;
