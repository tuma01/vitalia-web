# CRUD Engine Architecture

El **CRUD Engine** es una infraestructura técnica diseñada para estandarizar y acelerar la creación de módulos administrativos dentro de la plataforma. Su filosofía principal es el diseño **Config-Driven**, donde la lógica y la representación visual están separadas de la definición de cada entidad.

## Principios Fundamentales

1.  **Agnosticismo al Dominio**: El motor no sabe si está operando en `Platform` o `Tenant`.
2.  **Boilerplate Mínimo**: Crear un nuevo CRUD solo requiere definir una configuración, sin escribir lógica de componentes repetitiva.
3.  **Separación de Responsabilidades**:
    *   **Configuración**: Define columnas, campos y servicios.
    *   **Lógica**: Gestiona el estado, búsqueda y operaciones API.
    *   **UI**: Renderiza la tabla (Grid) y el formulario.

## Estructura de Archivos

La infraestructura reside en `src/app/shared/components/crud-template/`:

-   `crud-config.ts`: Interfaces y tipos base.
-   `crud-base.component.ts`: Directiva lógica abstracta.
-   `crud-template.component.ts/html`: Motor de renderizado visual.
-   `crud-base-add-edit.component.ts`: Lógica compartida para formularios.

## Flujo de Trabajo

Para implementar una nueva entidad (ej. Departamento):

1.  Crear `departamento-crud.config.ts`.
2.  Definir la configuración implementando `CrudConfig<T>`.
3.  Utilizar `CrudTemplateComponent` en el componente de página pasando la configuración.

---

### Documentación Detallada
- [Configuración del Motor](./configuration.md)
- [Componentes y Lógica](./components.md)
- [Adaptador de API](./api-adapter.md)
- [Guía de Implementación](./implementation-guide.md)
