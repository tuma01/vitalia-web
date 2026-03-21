# Amachi Platform — Module Implementation Guide
> [!IMPORTANT]
> **REPOSITORIO DEL BACKEND**: El código del servidor (Spring Boot) se encuentra en:  
> `F:\PROJECTOS\JAVA\VITALIA\workspace\amachi-platform`

> **LEER OBLIGATORIAMENTE antes de implementar cualquier nueva sección.**  
> Este documento define la arquitectura estándar que TODOS los módulos deben seguir sin excepción.

---

> [!CAUTION]
> ### 🛡️ GOLDEN PROTOCOL: REGLAS CRÍTICAS DE ESTABILIDAD
> 1. **ANÁLISIS GLOBAL OBLIGATORIO (CRÍTICO)**: Antes de realizar cualquier cambio, por pequeño que parezca (Frontend o Backend), es **ESTRICTAMENTE OBLIGATORIO** realizar un análisis profundo del impacto en todo el sistema. **Si se realiza una modificación en el Backend, es MANDATORIO analizar la regresión que puede crear en el Frontend (contratos, tipos, DTOs)**. No se permiten cambios "ad-hoc" sin verificar dependencias cruzadas.
> 2. **SINCRONIZACIÓN DE API (MANDATORIO)**: Si se crea, modifica (agregar/borrar campos) o elimina una entidad o endpoint en el Backend, es **OBLIGATORIO** sincronizar el contrato siguiendo este flujo:
>    - **Backend**: Ejecutar `mvn clean install` e iniciar la aplicación.
>    - **Swagger**: Acceder a `http://localhost:8088/api/v1/swagger-ui/index.html`, copiar el contenido JSON de la definición de la API.
>    - **Frontend**: Pegar el contenido en `src/openapi/openapi.json`.
>    - **Generación**: Ejecutar `npm run gen-api` para actualizar modelos y servicios de Angular.
>    - *Nota*: No realizar cambios manuales en los modelos del Frontend que deban ser sincronizados desde el servidor.
> 3. **REPOSITORIO BACKEND ÚNICO**: El código del servidor reside exclusivamente en `F:\PROJECTOS\JAVA\VITALIA\workspace\amachi-platform`.
> 4. **CERO REGRESIONES**: Se prohíbe modificar funcionalidades estables para "limpiar código" o "optimizar" sin justificación técnica y verificación exhaustiva de impacto global. La estabilidad es prioridad absoluta sobre la estética del código.
> 5. **POST-MORTEM DE ERRORES**: Cada regresión debe ser analizada para entender por qué falló el "Análisis Global" y documentar la lección aprendida en este protocolo.
>    - **CASO ROLES (16/03/2026)**: El cambio en la firma de `getAll` en el backend rompió el contrato de la interfaz `CrudApiService` en el frontend. **Lección**: Cualquier cambio en el Backend requiere verificación inmediata del impacto en el Frontend. El uso de subcarpetas en módulos causó fallos; se debe seguir el patrón plano de `allergies/`.
> 6. **VALIDACIÓN SINTÁCTICA DE i18n (MANDATORIO)**: Cualquier adición o modificación de claves en los archivos `es-ES.json`, `en-US.json` o `fr-FR.json` requiere una validación estructural estricta (balance de llaves `{}` y comas). Una regresión en estos archivos invalida la carga de recursos de la aplicación, mostrando claves crudas en lugar de textos. **Lección**: Validar siempre con `JSON.parse` o herramientas de linting antes de dar por cerrada la tarea.
> 7. **PROHIBICIÓN ABSOLUTA DE PARCHES (CRÍTICO)**: Está **ESTRICTAMENTE PROHIBIDO** realizar "parches" manuales (como scripts de post-procesamiento JSON o modificaciones manuales de archivos generados) para solucionar problemas de contrato o visibilidad. Si un campo no aparece en la API, se debe corregir la causa raíz en el código del Backend (ej. eliminando `@Hidden`). La arquitectura debe ser 100% automática y profesional. **Regla de Oro: NO PARCHES**.

---

> [!IMPORTANT]
> **ALINEACIÓN BACKEND OBLIGATORIA**  
> Aunque esta guía se enfoca en el Frontend, es **REQUISITO CRÍTICO** que la implementación del Backend (Spring Boot) siga estrictamente la arquitectura del módulo `core-geography`.  
> Esto incluye el uso consistente de:
> - **DTOs y SearchDTOs**: Para la transferencia de datos y criterios de búsqueda.
> - **Mappers (MapStruct)**: Para la conversión entre Entidades y DTOs.
> - **Services (GenericService)**: Implementación de la lógica de negocio siguiendo el patrón estándar.
> - **Specifications (Criteria API)**: Para el filtrado dinámico y paginación.
> - **Controllers y APIs**: Definición homogeneous de endpoints y uso de `BaseController`.
> - **Soft Delete**: Aplicación obligatoria del filtrado de registros eliminados lógicamente.

---

## Índice
1. [Principio fundamental: convención plural](#1-principio-fundamental-convención-plural)
2. [Estructura de directorios](#2-estructura-de-directorios)
3. [Archivos obligatorios por módulo](#3-archivos-obligatorios-por-módulo)
4. [Convención de nombres](#4-convención-de-nombres)
5. [Implementación del CRUD Config](#5-implementación-del-crud-config)
6. [Implementación de componentes](#6-implementación-de-componentes)
7. [Rutas del módulo](#7-rutas-del-módulo)
8. [Registro en catalog.routes.ts](#8-registro-en-catalogroutests)
9. [Claves i18n — sincronización obligatoria](#9-claves-i18n--sincronización-obligatoria)
10. [Configuración del menú (super-admin-menu.json)](#10-configuración-del-menú-super-admin-menujson)
11. [Checklist de implementación](#11-checklist-de-implementación)

---

## 1. Principio fundamental: convención plural

**REGLA DE ORO**: Todo nombre de carpeta, archivo, clase y ruta usa la forma **plural** del recurso.

| ❌ INCORRECTO | ✅ CORRECTO |
|---|---|
| `allergy/` | `allergies/` |
| `medication-list.component.ts` | `medications-list.component.ts` |
| `AllergyListComponent` | `AllergiesListComponent` |
| `allergy.routes.ts` | `allergies.routes.ts` |
| `/platform/catalog/allergy/list` | `/platform/catalog/allergies/list` |

---

## 2. Estructura de directorios

El módulo de catálogo vive en:
```
src/app/platform/pages/catalog/
```

Cada sección tiene su propia subcarpeta en plural:
```
catalog/
├── catalog.routes.ts              ← Router principal del catálogo
├── allergies/                     ← Ejemplo de módulo simple
│   ├── allergies.routes.ts
│   ├── allergies-crud.config.ts
│   ├── allergies-list.component.ts
│   ├── allergies-add.component.ts
│   └── allergies-edit.component.ts
├── medications/
│   ├── medications.routes.ts
│   ├── medications-crud.config.ts
│   ├── medications-list.component.ts
│   ├── medications-add.component.ts
│   └── medications-edit.component.ts
└── demographics/                  ← Ejemplo de módulo agrupador (con sub-módulos)
    ├── demographics.routes.ts
    ├── civil-statuses/
    │   ├── civil-statuses.routes.ts
    │   ├── civil-statuses-crud.config.ts
    │   ├── civil-statuses-list.component.ts
    │   ├── civil-statuses-add.component.ts
    │   └── civil-statuses-edit.component.ts
    └── genders/
        ├── genders.routes.ts
        ├── genders-crud.config.ts
        ├── genders-list.component.ts
        ├── genders-add.component.ts
        └── genders-edit.component.ts
```

---

## 3. Archivos obligatorios por módulo

Cada módulo (ej. `{module}`) tiene exactamente **5 archivos**:

| Archivo | Responsabilidad |
|---|---|
| `{modules}.routes.ts` | Define las rutas `list`, `add`, `edit` |
| `{modules}-crud.config.ts` | Función de configuración de columnas y formulario |
| `{modules}-list.component.ts` | Componente de lista con operaciones CRUD |
| `{modules}-add.component.ts` | Componente de creación |
| `{modules}-edit.component.ts` | Componente de edición |

---

## 4. Convención de nombres

### Carpetas y archivos
- Kebab-case, siempre plural
- Ejemplo: `blood-types/`, `healthcare-providers/`, `identification-types/`

### Clases TypeScript
- PascalCase, siempre plural
- Patrón: `{Modules}ListComponent`, `{Modules}AddComponent`, `{Modules}EditComponent`
- Ejemplo: `BloodTypesListComponent`, `HealthcareProvidersAddComponent`

### Constantes de configuración CRUD
- SCREAMING_SNAKE_CASE, plural
- Patrón: `{MODULES}_CRUD_CONFIG`
- Ejemplo: `BLOOD_TYPES_CRUD_CONFIG`, `IDENTIFICATION_TYPES_CRUD_CONFIG`

---

## 5. Implementación del CRUD Config

**Archivo:** `{modules}-crud.config.ts`

```typescript
import { inject } from '@angular/core';
import { {Entity} } from 'app/api/models/{entity}';
import { {Entity}Service } from 'app/api/services/{entity}.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const {MODULES}_CRUD_CONFIG = (): CrudConfig<{Entity}> => {
    const service = inject({Entity}Service);

    return {
        // ⚠️ Las claves i18n SIEMPRE con prefijo 'menu.catalog.'
        entityName: 'menu.catalog.{module}.singular',
        entityNamePlural: 'menu.catalog.{module}.plural',

        getId: (entity: {Entity}) => entity.id!,

        apiService: new OpenApiCrudAdapter<{Entity}>(service, {
            getAll: 'getAll{Entities}',
            getById: 'get{Entity}ById',
            create: 'create{Entity}',
            update: 'update{Entity}',
            delete: 'delete{Entity}'
        }),

        columns: [
            { field: 'id', header: 'menu.catalog.{module}.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'menu.catalog.{module}.fields.code', sortable: true, width: '120px' },
            { field: 'name', header: 'menu.catalog.{module}.fields.name', sortable: true },
            {
                field: 'active',
                header: 'menu.catalog.{module}.fields.active',
                sortable: true,
                width: '120px',
                type: 'tag',
                tag: {
                    'true': { text: 'common.active', color: '#4caf50' },
                    'false': { text: 'common.inactive', color: '#f44336' }
                }
            }
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                { name: 'code', label: 'menu.catalog.{module}.fields.code', type: 'text', required: true, colSpan: 1, maxLength: 20, icon: 'qr_code' },
                { name: 'name', label: 'menu.catalog.{module}.fields.name', type: 'text', required: true, colSpan: 1, maxLength: 100, icon: 'badge' },
                { name: 'active', label: 'menu.catalog.{module}.fields.active', type: 'radio', colSpan: 1,
                    options: [
                        { label: 'common.active', value: true },
                        { label: 'common.inactive', value: false }
                    ]
                }
            ]
        },

        enableAdd: true,
        enableEdit: true,
        enableDelete: true,

        table: {
            pageSize: 10,
            rowStriped: true,
            showToolbar: true,
            columnResizable: true,
            multiSelectable: true,
            rowSelectable: true,
            hideRowSelectionCheckbox: false
        }
    };
};
```

> **CRÍTICO:** Las claves i18n en el CRUD config **siempre** usan el prefijo `menu.catalog.{module}.` porque el `CrudTemplate` hace `translate` directo (sin prefijo automático), y los datos de catálogo están anidados bajo `menu.catalog` en los JSONs.

---

## 6. Implementación de componentes

### List Component

```typescript
// {modules}-list.component.ts
import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { {MODULES}_CRUD_CONFIG } from './{modules}-crud.config';
import { {Entity} } from 'app/api/models/{entity}';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

@Component({
    selector: 'app-{modules}-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class {Modules}ListComponent {
    @ViewChild('crud') private crud!: CrudTemplateComponent<{Entity}>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);

    config = {MODULES}_CRUD_CONFIG();

    constructor() {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: {Entity}) => this.edit(record),
                    deleteHandler: (record: {Entity}) => this.delete{Entity}(record),
                    entityType: 'menu.catalog.{module}.singular',
                    fieldForMessage: 'name'
                },
                this.confirmDialog
            ) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/catalog/{modules}/add']);
    }

    edit(record: {Entity}): void {
        this.router.navigate(['/platform/catalog/{modules}/edit'], {
            queryParams: { id: record.id },
        });
    }

    private delete{Entity}(record: {Entity}): void {
        this.config.apiService.delete(record.id!).subscribe({
            next: () => {
                this.snackBar.open(
                    this.translate.instant('common.delete_success'),
                    undefined, { duration: 3000, panelClass: 'success-snackbar' }
                );
                this.crud.loadData();
            },
            error: () => this.snackBar.open(
                this.translate.instant('common.delete_error'),
                this.translate.instant('common.close'),
                { duration: 5000, panelClass: 'error-snackbar' }
            )
        });
    }
}
```

### Add Component

```typescript
// {modules}-add.component.ts
@Component({
    selector: 'app-{modules}-add',
    standalone: true,
    imports: [CrudTemplateComponent, TranslateModule],
    template: `
        <app-crud-template
            mode="add"
            [config]="config"
            [formGroup]="form"
            (save)="onSubmit()"
            (cancel)="onCancel()">
        </app-crud-template>
    `
})
export class {Modules}AddComponent extends CrudBaseAddEditComponent<{Entity}> implements OnInit {
    protected override entityNameKey = 'menu.catalog.{module}.singular';
    public readonly config = {MODULES}_CRUD_CONFIG();

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void { }

    protected override getSuccessRoute(): any[] {
        return ['/platform/catalog/{modules}/list'];
    }

    protected override saveEntity(formData: {Entity}): Observable<{Entity}> {
        return this.config.apiService.create(formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
```

### Edit Component

```typescript
// {modules}-edit.component.ts
// Mismo patrón que Add pero con saveEntity usando update y cargando datos en ngOnInit
protected override getSuccessRoute(): any[] {
    return ['/platform/catalog/{modules}/list'];
}

protected override saveEntity(formData: {Entity}): Observable<{Entity}> {
    return this.config.apiService.update(this.entityId!, formData);
}
```

---

## 7. Rutas del módulo

**Archivo:** `{modules}.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { {Modules}ListComponent } from './{modules}-list.component';
import { {Modules}AddComponent } from './{modules}-add.component';
import { {Modules}EditComponent } from './{modules}-edit.component';

export const routes: Routes = [
    { path: 'list', component: {Modules}ListComponent },
    { path: 'add', component: {Modules}AddComponent },
    { path: 'edit', component: {Modules}EditComponent },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
];
```

---

## 8. Registro en catalog.routes.ts

Agregar la nueva ruta en `catalog/catalog.routes.ts`:

```typescript
{
    path: '{modules}',
    loadChildren: () => import('./{modules}/{modules}.routes').then(m => m.routes)
},
```

---

## 9. Claves i18n — sincronización obligatoria

> ⚠️ **REGLA ABSOLUTA — NUNCA IGNORAR**

### Los 3 archivos deben ser siempre idénticos en estructura

El proyecto usa 3 archivos de traducción que **deben evolucionar juntos en todo momento**:

| Archivo | Idioma |
|---|---|
| `src/assets/i18n/es-ES.json` | Español (idioma principal) |
| `src/assets/i18n/en-US.json` | Inglés |
| `src/assets/i18n/fr-FR.json` | Francés |

**OBLIGATORIO:** Cada vez que se agrega, modifica o elimina una clave en uno de los archivos, se debe hacer exactamente lo mismo en los otros dos. **Ninguna clave puede existir en un archivo y faltar en los otros.** Una clave faltante provoca que la app muestre la clave cruda en lugar de la traducción (ej. `menu.catalog.kinship.title`).

### ❌ Situación INCORRECTA (causa bugs)

```
es-ES.json  →  menu.catalog.kinship.title = "Parentescos"
en-US.json  →  ❌ FALTA la clave
fr-FR.json  →  menu.catalog.kinship.title = "Parentés"
```

### ✅ Situación CORRECTA

```
es-ES.json  →  menu.catalog.kinship.title = "Parentescos"
en-US.json  →  menu.catalog.kinship.title = "Kinships"
fr-FR.json  →  menu.catalog.kinship.title = "Parentés"
```

### Flujo de trabajo al agregar un nuevo módulo

1. Escribe primero las claves completas en `es-ES.json`
2. Copia exactamente **la misma estructura** a `en-US.json` y traduce los valores
3. Copia exactamente **la misma estructura** a `fr-FR.json` y traduce los valores
4. Verifica que los 3 archivos tengan el **mismo número de claves** en el bloque del módulo nuevo

---

### Regla crítica de anidamiento

```
SidemenuComponent → agrega prefijo "menu." automáticamente
CrudTemplate/Componentes → usan la clave completa directamente
```

Por tanto, la estructura correcta en los JSON es:

```json
{
    "menu": {
        "catalog": {
            "{module}": {
                "title": "Nombre del Módulo (plural)",
                "singular": "Nombre en singular",
                "plural": "Nombre en plural",
                "list": "Lista de ...",
                "add": "Agregar ...",
                "edit": "Editar ...",
                "fields": {
                    "id": "ID",
                    "code": "Código",
                    "name": "Nombre",
                    "active": "Activo"
                }
            }
        }
    },
    "dashboard": { ... }
}
```

> - El **sidemenu** usa `"name": "{module}.title"` en el JSON del menú → se resuelve como `menu.catalog.{module}.title` ✅  
> - Los **componentes y CRUD configs** usan `'menu.catalog.{module}.singular'` directamente ✅

---

## 10. Configuración del menú (super-admin-menu.json)

Agregar dentro del grupo correspondiente (ej. `medical_catalog`, `tenant_governance`, etc.):

```json
{
    "id": "{modules}",
    "name": "{group}.{module}.title",
    "type": "sub",
    "icon": "icon_name",
    "children": [
        {
            "id": "{module}-list",
            "name": "{group}.{module}.list",
            "type": "link",
            "route": "/platform/{path}/{modules}/list",
            "visible": true
        },
        {
            "id": "{module}-add",
            "name": "{group}.{module}.add",
            "type": "link",
            "route": "/platform/{path}/{modules}/add",
            "visible": true
        },
        {
            "id": "{module}-edit",
            "name": "{group}.{module}.edit",
            "type": "link",
            "route": "/platform/{path}/{modules}/edit",
            "visible": false
        }
    ]
}
```

> **Nota:** El `edit` siempre `"visible": false` porque se accede desde la fila del listado, no desde el menú.
> 
> [!IMPORTANT]
> **Regla de Iconografía en Menús**: Es obligatorio asignar un Material Icon pertinente a cada nivel principal y a todos sus subperfiles para garantizar una navegación visual rápida y profesional (ej: `personal_injury` para Pacientes, `medication` para Farmacia, `bed` para Hospitalización).

---

## 11. Checklist de implementación

Antes de considerar un módulo completo, verificar cada punto:

### Archivos
- [ ] Carpeta creada en plural (ej. `blood-types/`)
- [ ] `{modules}-crud.config.ts` creado con constante en SCREAMING_SNAKE_CASE plural
- [ ] `{modules}-list.component.ts` con clase plural
- [ ] `{modules}-add.component.ts` con clase plural
- [ ] `{modules}-edit.component.ts` con clase plural
- [ ] `{modules}.routes.ts` importando las 3 clases plurales

### UI/UX
- [ ] Inputs pertinentes tienen **iconos** configurados (Material Icons)
- [ ] Títulos de sección con barra de acento vertical
- [ ] Action Bar en estilo "Pill" (automático por `CrudTemplate`)

### Rutas
- [ ] Registrado en `catalog.routes.ts` con `path: '{modules}'`
- [ ] URLs correctas: `/platform/catalog/{modules}/list`, `/add`, `/edit`

### i18n (los 3 archivos — OBLIGATORIO sincronizar los 3)
- [ ] Clave `menu.catalog.{module}.title` con nombre plural — **en es-ES, en-US y fr-FR**
- [ ] Clave `menu.catalog.{module}.singular` — **en es-ES, en-US y fr-FR**
- [ ] Clave `menu.catalog.{module}.plural` — **en es-ES, en-US y fr-FR**
- [ ] Clave `menu.catalog.{module}.list` — **en es-ES, en-US y fr-FR**
- [ ] Clave `menu.catalog.{module}.add` — **en es-ES, en-US y fr-FR**
- [ ] Clave `menu.catalog.{module}.edit` — **en es-ES, en-US y fr-FR**
- [ ] Claves `menu.catalog.{module}.fields.*` para cada campo — **en es-ES, en-US y fr-FR**
- [ ] Verificar que los 3 archivos tienen el **mismo número de claves** en el bloque del módulo

### Menú
- [ ] Entrada en `super-admin-menu.json` dentro del grupo correspondiente
- [ ] Los 3 items: `list` (visible: true), `add` (visible: true), `edit` (visible: false)

### Código
- [ ] Todas las referencias i18n en TS usan el prefijo `menu.catalog.{module}.`
- [ ] Rutas de navegación en plural (ej. `'/platform/catalog/blood-types/list'`)
- [ ] `entityNameKey` en Add/Edit también con `menu.catalog.{module}.singular`

---

## Módulos existentes como referencia

| Módulo | Carpeta | Clase base |
|---|---|---|
| Alergias | `allergies/` | `AllergiesListComponent` |
| Grupos Sanguíneos | `blood-types/` | `BloodTypesListComponent` |
| Proveedores | `healthcare-providers/` | `HealthcareProvidersListComponent` |
| ICD-10 | `icd10/` | `Icd10ListComponent` |
| Tipos de Identificación | `identification-types/` | `IdentificationTypesListComponent` |
| Parentescos | `kinships/` | `KinshipsListComponent` |
| Medicamentos | `medications/` | `MedicationsListComponent` |
| Procedimientos | `procedures/` | `ProceduresListComponent` |
| Especialidades | `specialties/` | `SpecialtiesListComponent` |
| Vacunas | `vaccines/` | `VaccinesListComponent` |
| Estados Civiles | `demographics/civil-statuses/` | `CivilStatusesListComponent` |
| Géneros | `demographics/genders/` | `GendersListComponent` |
---

## 12. Reglas de Multi-tenencia (Best Practices)

Al implementar módulos de gestión para organizaciones (Tenants):

1.  **Filtrado de Global Tenant**: En selectores de organizaciones destinadas a clientes finales, **SIEMPRE** filtrar el inquilino con `type: 'GLOBAL'`. Este inquilino es exclusivo para infraestructura y SuperAdmin.
2.  **Aislamiento de Datos**: Validar que un administrador solo pueda ser asignado a una organización que no esté en conflicto con su identidad previa.
3.  **Consistencia de Menú**: Mantener siempre la estructura de "Lista" y "Agregar" como sub-items para garantizar una navegación homogénea.

---

## 13. Detalles de UI/UX (Formularios)

Para mantener una interfaz profesional y moderna:

1.  **Iconos en Inputs**: Es obligatorio añadir iconos representativos al crear componentes de formulario (páginas *Agregar* / *Editar*). Para mantener uniformidad en el sistema, respeta el siguiente estándar:
    - `code` (Código): `icon: 'qr_code'`
    - `name` (Nombre): `icon: 'badge'`
    - `email` (Correo electrónico): `icon: 'email'`
    - `phone` (Teléfono): `icon: 'phone'`
    - Uso general: Añadir la propiedad `icon: 'icon_name'` en la configuración de cada campo del `CRUD_CONFIG`.
    - **Excepción**: Los componentes de tipo `textarea` (empleados para Descripciones, Configuraciones Extra como JSON, Notas, etc.) **NO deben llevar icono**, ya que no son necesarios visualmente.
2.  **Agrupación Visual**: Evitar el uso de bordes pesados. El `CrudTemplate` ya gestiona el estilo "Ultra-Clean" sin bordes ni sombras internas.
3.  **Action Bar**: El sistema de botones Guardar/Cancelar flota automáticamente en la parte inferior. Asegurarse de que el contenido del formulario tenga suficiente padding inferior para no quedar oculto detrás de la barra (gestionado por `.form-page`).
