# Guía de Implementación

Sigue estos pasos para crear una nueva gestión (ejemplo: `Departments`) en 5 minutos.

## Paso 1: Definir la Configuración
Crea `departamento-crud.config.ts`.

```typescript
export const DEPARTAMENTO_CRUD_CONFIG = (): CrudConfig<Departamento> => ({
  entityName: 'entity.department',
  entityNamePlural: 'entity.departments',
  getId: (d) => d.id!,
  apiService: new OpenApiCrudAdapter<Departamento>(inject(DepartmentService), {
    getAll: 'getDepartments',
    getById: 'getDepartment',
    create: 'createDepartment',
    update: 'updateDepartment',
    delete: 'deleteDepartment'
  }),
  columns: [
    { field: 'name', header: 'common.name', sortable: true },
    { field: 'code', header: 'common.code', sortable: true }
  ],
  enableAdd: true,
  enableEdit: true,
  enableDelete: true
});
```

## Paso 2: Crear el Componente de Lista
Casi todo el código es decorativo.

```typescript
@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CrudTemplateComponent],
  template: `
    <app-crud-template #crud
      [config]="config"
      (create)="navToAdd()"
      (edit)="navToEdit($event)"
      (delete)="crud.onDelete($event)">
    </app-crud-template>
  `
})
export class DepartmentsComponent {
  config = DEPARTAMENTO_CRUD_CONFIG();
  // ... métodos de navegación
}
```

## Paso 3: Crear el Formulario (Add/Edit)
Extiende de `CrudBaseAddEditComponent` para heredar la lógica de guardado y validación. Solo define el `FormGroup` específico de la entidad.

## Paso 4: Registrar Rutas
En el archivo de rutas correspondiente al dominio (Platform o Tenant).

```typescript
{ path: 'departments', component: DepartmentsComponent }
```

¡Listo! El motor se encarga de las tablas, búsqueda, loading y borrado.
