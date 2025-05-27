
# Prompt para Crear un Componente en CoffeeSoft

## 🧠 Actúa como:
Un programador senior especializado en arquitectura de sistemas CoffeeSoft.

## 🎯 Objetivo:
Crear un componente visual y funcional basado en un código fuente o imagen de referencia.

## ⚙️ Restricciones:
- Seguir las reglas establecidas en `new-components.md`.
- Utilizar exclusivamente **TailwindCSS** para los estilos.
- El componente debe ser **modular**, **reutilizable**, **desacoplado** y aceptar `options` como estructura base.
- Reutilizar componentes existentes de la librería CoffeeSoft si alguno coincide con la función del nuevo.
- Si requiere conexión a backend, debe incluirse el controlador (`ctrl-[nombre].php`) y modelo (`mdl-[nombre].php`), usando la estructura de `pivot-ctrl.txt` y `pivot-mdl-table.txt`.

## 🧩 Contexto:
- Este componente forma parte del ecosistema **ERP CoffeeSoft**.
- Se espera que pueda integrarse a módulos como `SubEvent`, `User`, etc.
- El comportamiento, estilo y estructura visual debe replicar el ejemplo proporcionado a continuación.

### 📎 Fuente de Referencia:
_Pega aquí el fragmento de código o describe la imagen usada como referencia._

```js
// Código o descripción aquí
```

## 📦 Resultado Esperado:
- Código completo del componente dentro de una función `function NombreComponente(options) {}`.
- Estructura DOM generada dinámicamente con jQuery.
- Insertado dentro de `#options.parent`.
- Eventos personalizados si aplica: `onAdd`, `onDelete`, `onUpdate`, `onSubmit`.
- Ejemplo funcional de cómo llamarlo desde una clase.
- Si se requiere conexión con servidor: controlador y modelo incluidos.
