# Configuración del Motor (CrudConfig)

La interfaz `CrudConfig<T>` es el corazón del motor. Define qué datos mostrar, cómo pedirlos a la API y cómo capturarlos en un formulario.

## Interfaz `CrudConfig<T>`

```typescript
export interface CrudConfig<T> {
  entityName: string;              // Clave de traducción para el nombre singular (ej: 'entity.country')
  entityNamePlural: string;        // Clave de traducción para el plural (ej: 'entity.countries')

  getId: (entity: T) => number | string; // Función para extraer el ID de la entidad

  columns: CrudColumnConfig<T>[];  // Configuración de columnas del Grid
  formFields?: CrudFormFieldConfig<T>[]; // Configuración opcional para generación de formularios

  apiService: CrudApiService<T>;   // Servicio que implementa operaciones CRUD

  enableDelete?: boolean;          // Habilitar/Deshabilitar eliminación
  enableEdit?: boolean;            // Habilitar/Deshabilitar edición
  enableAdd?: boolean;             // Habilitar/Deshabilitar creación

  table?: TableConfig;             // Opciones de visualización de la tabla (pagination, hover, etc.)
}
```

## Propiedades Clave

### `getId`
Es fundamental para que el motor sea agnóstico al nombre de la propiedad ID del backend (algunos usan `id`, otros `_id`, otros `pk`).
```typescript
getId: (user) => user.id
```

### `columns` (`CrudColumnConfig`)
Define cómo se visualiza la data en el Grid.
- `field`: Nombre de la propiedad en el objeto.
- `header`: Clave de traducción para el encabezado.
- `type`: 'text', 'number', 'date', 'boolean', 'custom'.

### `formFields` (`CrudFormFieldConfig`)
(En desarrollo) Define la estructura del formulario reactivo para que el motor pueda generarlo dinámicamente o validar los campos.

### `apiService` (`CrudApiService`)
Interfaz que debe cumplir cualquier servicio que use el motor:
```typescript
export interface CrudApiService<T> {
  getAll(): Observable<T[]>;
  getById(id: any): Observable<T>;
  create(entity: T): Observable<T>;
  update(id: any, entity: T): Observable<T>;
  delete(id: any): Observable<void>;
}
```
