import { ElementRef, Signal } from '@angular/core';

/** 
 * Niveles de severidad del estado de un campo 
 */
export type UiFormElementSeverity = 'info' | 'warning' | 'error';

/**
 * Representa el estado reactivo de un elemento del formulario
 */
export interface UiFormElementState {
    invalid: boolean;
    touched: boolean;
    severity: UiFormElementSeverity;
}

/**
 * Reglas de resolución de foco para el motor UX
 */
export type UiFocusRule = 'FIRST_INVALID' | 'HIGHEST_SEVERITY';

/**
 * UiFormElement
 * 
 * Interfaz que deben implementar todos los componentes que deseen ser
 * orquestados por el UX Behavior Engine.
 */
export interface UiFormElement {
    /** ID único del elemento */
    id: string;

    /** Estado reactivo del nodo */
    state: Signal<UiFormElementState>;

    /** Delega el foco al elemento interactivo interno */
    focus(): void;

    /** Retorna la referencia al elemento nativo para cálculos espaciales */
    getElementRef(): ElementRef;
}
