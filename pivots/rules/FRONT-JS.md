
 ## Objetivo
Desarrollar un archivo JavaScript estructurado y modular, siguiendo estrictamente las convenciones del sistema y buenas prácticas de ingeniería.

## Instrucciones:

1. Crear una instancia principal utilizando la clase App, conectada a su respectivo Controlador PHP.
2. Construir una clase `App` que herede de `Templates`.
3. El constructor debe recibir dos parámetros: el enlace del controlador (`link`) y el identificador de contenedor principal (`div_modulo`).

## La clase debe implementar los siguientes métodos:

- init()
  - Ejecuta el método render().
- render()
  - Ejecuta los métodos layout() y filterBar().
- layout()
  - Utiliza el método primaryLayout() de CoffeeSoft para generar la estructura visual principal (barra de filtros y contenedor de datos).
- filterBar()
  - Implementa el filtro principal utilizando createfilterBar() y configura el componente dataPicker() para capturar rangos de fechas.
- ls()
  - Carga datos de la tabla utilizando createTable(), incluyendo paginación y configuración responsiva.
- add()
  - Despliega un formulario modal mediante createModalForm() para agregar nuevos registros.
- edit(id)
  - Realiza una consulta asincrónica useFetch({ opc: 'get', id: id }).
  - Posteriormente despliega un formulario modal de edición, usando autofill para precargar los datos obtenidos.
  - El formulario, al ser enviado, debe ejecutar el flujo opc: 'edit'.
- cancel(id)
  - Utiliza swalQuestion() para confirmar la cancelación de un registro, y luego envía la acción opc: 'cancel'.

## Consideraciones técnicas:
- Utilizar funciones flecha para callbacks y eventos.
- Implementar estructuras limpias y optimizadas.
- Mantener la nomenclatura camelCase en nombres de funciones y atributos.
- Incluir comentarios breves sobre la funcionalidad principal de cada método.
- No repetir bloques de código.
- Estandarizar la validación de formularios usando plugins nativos de CoffeeSoft.

## Estándar de calidad:
- El código debe ser minimalista, funcional, escalable y fácil de mantener.
- Cada método debe seguir una única responsabilidad.
- Evitar la generación de código que dependa de estilos o elementos visuales innecesarios.

## Resultado esperado:
Un archivo JavaScript modular, basado en clases modernas, perfectamente alineado a las prácticas de arquitectura de sistemas profesionales, compatible con CoffeeSoft Framework.
