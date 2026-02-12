# Componentes y Lógica

El motor está dividido en dos capas: **Comportamiento** y **Representación**.

## 1. CrudBaseComponent<T> (Lógica)

Es una `Directive` abstracta que contiene toda la "inteligencia" del CRUD.

### Responsabilidades:
- **Estado Global**: Maneja `isLoading`, `dataList` y `filteredData`.
- **Carga de Datos**: Ejecuta `apiService.getAll()` y gestiona la respuesta.
- **Búsqueda**: Implementa un algoritmo de búsqueda recursiva que escanea todas las propiedades del objeto (incluyendo arrays y objetos anidados).
- **Eliminación**: Ejecuta la lógica de confirmación y borrado centralizada.
- **Refresh**: Permite recargar la data sin perder el estado visual.

## 2. CrudTemplateComponent<T> (UI)

Es el componente visual que el usuario ve. Hereda de `CrudBaseComponent`.

### Responsabilidades:
- **Renderizado de Grid**: Utiliza `MtxGridModule` para mostrar las columnas definidas en el config.
- **Gestión de Modos**: Cambia entre modo `'list'`, `'add'` y `'edit'`.
- **Slots de Contenido**:
    - `[form]`: ng-content para inyectar un formulario personalizado mientras se mantiene el layout del motor (tarjetas, botones de acción).
    - `cellTemplates`: Permite inyectar `TemplateRef` externos para celdas específicas (ej. chips de colores, fotos).

## 3. CrudBaseAddEditComponent<T> (Lógica de Formulario)

Separado del listado, esta clase base gestiona los formularios reactivos.

### Funciones principales:
- **Validación**: Método `getErrorMessage` para estandarizar errores de Material.
- **Submit**: Maneja el flujo de guardado (create vs update).
- **Notificaciones**: Muestra Snackbars de éxito o error automáticamente.
- **Navigation**: Redirige al listado tras una operación exitosa.
