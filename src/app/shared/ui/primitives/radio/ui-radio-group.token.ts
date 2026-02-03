import { InjectionToken } from '@angular/core';

/**
 * Contract interface for UiRadioGroup
 * Allows UiRadioButton (atom) to communicate with UiRadioGroup (orchestrator)
 * without importing the concrete implementation.
 */
export interface UiRadioGroupContract {
    name: string;
    select(value: any): void;
}

/**
 * Injection token for UiRadioGroup
 * Breaks circular dependency between radio components.
 */
export const UI_RADIO_GROUP = new InjectionToken<UiRadioGroupContract>('UI_RADIO_GROUP');
