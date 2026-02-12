import { Observable } from 'rxjs';

/* ====== Tipos Base ====== */

export type CrudMode = 'list' | 'add' | 'edit' | 'view';

export interface CrudActionEvent<T> {
    mode: CrudMode;
    entity?: T;
}

/* ====== Configuración del GRID (Lista) ====== */

export interface CrudColumnConfig<T = any> {
    field: keyof T | string;
    header: string;
    sortable?: boolean;
    width?: string;
    type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
    formatter?: (row: T) => string;
}

/* ====== Botones de acción ====== */

export interface CrudActionButton<T = any> {
    icon: string;
    tooltip: string;
    action: (row: T) => void;
    visible?: (row: T) => boolean;
    color?: string;
}

/* ====== Configuración del Formulario ====== */

export interface CrudFormFieldConfig<T = any> {
    name: keyof T | string;
    label: string;
    type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'textarea';
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    options?: { label: string; value: any }[]; // para selects
    validators?: any[]; // Angular Validators
    col?: string; // Ej: 'col-md-6'
}

/* ====== Servicio API genérico ====== */

export interface CrudApiService<T> {
    getAll(): Observable<T[]>;
    getById(id: any): Observable<T>;
    create(entity: T): Observable<T>;
    update(id: any, entity: T): Observable<T>;
    delete(id: any): Observable<void>;
}

/* ====== Configuración global del CRUD ====== */

export interface TableConfig {
    pageSize?: number;
    pageSizeOptions?: number[];
    showToolbar?: boolean;
    columnSortable?: boolean;
    columnResizable?: boolean;
    multiSelectable?: boolean;
    rowSelectable?: boolean;
    hideRowSelectionCheckbox?: boolean;
    rowHover?: boolean;
    rowStriped?: boolean;
    columnHideable?: boolean;
    columnPinnable?: boolean;
    expandable?: boolean;
    showPaginator?: boolean;
    multiSelectOnlyPage?: boolean;
    columnMenuButtonIcon?: string;
}

export interface CrudConfig<T> {
    entityName: string;              // "País"
    entityNamePlural: string;        // "Países"

    getId: (entity: T) => number | string; // Agnostic ID resolver

    columns: CrudColumnConfig<T>[];
    formFields?: CrudFormFieldConfig<T>[];

    apiService: CrudApiService<T>;

    enableDelete?: boolean;
    enableEdit?: boolean;
    enableAdd?: boolean;

    table?: TableConfig;
    pageSize?: number;
}
