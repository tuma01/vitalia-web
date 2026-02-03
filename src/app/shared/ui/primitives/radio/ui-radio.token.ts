import { InjectionToken } from '@angular/core';

/**
 * Injection token for UiRadioButtonComponent to avoid circular dependency
 */
export const UI_RADIO_BUTTON = new InjectionToken<any>('UI_RADIO_BUTTON');
