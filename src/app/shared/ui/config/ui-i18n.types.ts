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
    itemsPerPageLabel?: string;
    nextPageLabel?: string;
    previousPageLabel?: string;
    firstPageLabel?: string;
    lastPageLabel?: string;
    rangeSeparatorLabel?: string; // the "of" in "1-10 of 100"
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

export interface UiAriaLabels {
    close?: string;
    open?: string;
    clear?: string;
    actions?: string;
    loading?: string;
    avatar?: string;
}

export interface UiCardI18n {
    ariaLabel?: string;
    headerAriaLabel?: string;
    contentAriaLabel?: string;
    footerAriaLabel?: string;
}

export interface UiBadgeI18n {
    ariaLabel?: string;
}

export interface UiInputI18n {
    ariaLabel?: string;
    clearAriaLabel?: string;
    showPasswordAriaLabel?: string;
    hidePasswordAriaLabel?: string;
}

export interface UiTagI18n {
    ariaLabel?: string;
}

export interface UiSliderI18n {
    ariaLabel?: string;
}

export interface UiRatingI18n {
    ariaLabel?: string;
    itemLabel?: string; // e.g. "Rate %d stars"
}

export interface UiAutocompleteI18n {
    ariaLabel?: string;
    noResultsMessage?: string;
}

export interface UiFileUploaderI18n {
    dragDropLabel?: string;
    browseLabel?: string;
    maxSizeHint?: string;
    removeLabel?: string;
    uploadingLabel?: string;
    errorMaxSize?: string;
    imageAlt?: string;
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
        itemsSelectedLabel: 'elementos seleccionados',
        itemsPerPageLabel: 'Elementos por página:',
        nextPageLabel: 'Siguiente',
        previousPageLabel: 'Anterior',
        firstPageLabel: 'Primera página',
        lastPageLabel: 'Última página',
        rangeSeparatorLabel: 'de'
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
    } as UiTimepickerI18n,
    badge: {
        ariaLabel: 'Contenedor de notificación'
    } as UiBadgeI18n,
    input: {
        ariaLabel: 'Campo de entrada',
        clearAriaLabel: 'Limpiar campo',
        showPasswordAriaLabel: 'Mostrar contraseña',
        hidePasswordAriaLabel: 'Ocultar contraseña'
    } as UiInputI18n,
    slider: {
        ariaLabel: 'Selector de rango'
    } as UiSliderI18n,
    rating: {
        ariaLabel: 'Calificación',
        itemLabel: 'Calificar con %d estrellas'
    } as UiRatingI18n,
    autocomplete: {
        ariaLabel: 'Búsqueda con autocompletado',
        noResultsMessage: 'No se encontraron resultados'
    } as UiAutocompleteI18n,
    fileUploader: {
        dragDropLabel: 'Arrastra y suelta tus archivos aquí o',
        browseLabel: 'explorar',
        maxSizeHint: 'Tamaño máximo: %dMB (%s)',
        removeLabel: 'Eliminar archivo',
        uploadingLabel: 'Subiendo...',
        errorMaxSize: 'El archivo excede el límite de %dMB.',
        imageAlt: 'Ilustración de subida de archivos'
    } as UiFileUploaderI18n
};
