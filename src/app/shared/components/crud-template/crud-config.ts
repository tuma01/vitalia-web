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
    minWidth?: number;
    maxWidth?: number;
    type?: 'text' | 'number' | 'date' | 'boolean' | 'tag' | 'custom';
    formatter?: (row: T) => string;
    tag?: { [key: string]: { text: string; color: string } };
    showTooltip?: boolean;
    class?: string;
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
    type: 'text' | 'number' | 'select' | 'date' | 'checkbox' | 'textarea' | 'password' | 'radio' | 'address';
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
    options?: { label: string; value: any }[]; // para selects
    validators?: any[];  // Angular Validators (extra, raw)
    colSpan?: number;    // How many columns to span in the grid
    hint?: string;       // Small help text below the field
    showPasswordToggle?: boolean; // Show eye icon for password fields
    groupWithNext?: boolean;      // Render this field and the next one in the same grid cell
    // Declarative validator shortcuts
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string | RegExp;
    value?: any;         // Default/Initial value for the field
    icon?: string;        // Material icon name (optional)
    sectionTitle?: string; // Optional title to display before this field
    sectionIcon?: string;  // Optional material icon for the section header
}

export interface CrudFormConfig<T = any> {
    layout: {
        columns: number;
        mode?: 'sections' | 'tabs'; // Premium navigation: sections (default) or mat-tabs
    };
    fields: CrudFormFieldConfig<T>[];
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
    showColumnMenuButton?: boolean;
}

export interface CrudConfig<T> {
    entityName: string;              // "País"
    entityNamePlural: string;        // "Países"

    getId: (entity: T) => number | string; // Agnostic ID resolver

    columns: CrudColumnConfig<T>[];
    form?: CrudFormConfig<T>;

    apiService: CrudApiService<T>;

    enableDelete?: boolean;
    enableEdit?: boolean;
    enableAdd?: boolean;

    table?: TableConfig;
    pageSize?: number;
}
