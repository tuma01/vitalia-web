/**
 * i18n contracts for PAL components.
 * This ensures components remain decoupled from any specific translation library.
 */

export interface UiTableI18n {
    searchPlaceholder?: string;
    exportButton?: string;
    columnsButton?: string;
    columnsMenuTitle?: string;
    noDataMessage?: string;
    clearSelectionTooltip?: string;
    bulkDeleteTooltip?: string;
    bulkDeleteConfirmTitle?: string;
    bulkDeleteConfirmMessage?: string;
    bulkDeleteConfirmButton?: string;
    actionsHeader?: string;
    itemsSelectedLabel?: string;
}

export interface UiDialogI18n {
    confirmButton?: string;
    cancelButton?: string;
}

export interface UiSelectI18n {
    emptyPlaceholder?: string;
}

export interface UiDatepickerI18n {
    todayButton?: string;
    placeholder?: string;
    weekdays?: string[];
}

export interface UiTimepickerI18n {
    setButton?: string;
    placeholder?: string;
    amLabel?: string;
    pmLabel?: string;
}

/**
 * Default standard keys that follow the Vitalia i18n convention.
 */
export const DEFAULT_PAL_I18N = {
    table: {
        searchPlaceholder: 'Buscar...',
        exportButton: 'Exportar CSV',
        columnsButton: 'Columnas',
        columnsMenuTitle: 'Configurar Columnas',
        noDataMessage: 'No se encontraron datos coincidentes.',
        clearSelectionTooltip: 'Anular selección',
        bulkDeleteTooltip: 'Eliminar elementos seleccionados',
        bulkDeleteConfirmTitle: 'Eliminar elementos',
        bulkDeleteConfirmButton: 'Eliminar',
        actionsHeader: 'Acciones',
        itemsSelectedLabel: 'elementos seleccionados'
    } as UiTableI18n,
    dialog: {
        confirmButton: 'Confirmar',
        cancelButton: 'Cancelar'
    } as UiDialogI18n,
    select: {
        emptyPlaceholder: 'Seleccione una opción'
    } as UiSelectI18n,
    datepicker: {
        todayButton: 'Hoy',
        placeholder: 'DD/MM/YYYY',
        weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
    } as UiDatepickerI18n,
    timepicker: {
        setButton: 'Aceptar',
        placeholder: 'HH:MM',
        amLabel: 'AM',
        pmLabel: 'PM'
    } as UiTimepickerI18n
};
