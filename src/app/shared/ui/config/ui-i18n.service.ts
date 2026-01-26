import { Injectable, signal } from '@angular/core';
import { DEFAULT_PAL_I18N, UiTableI18n, UiBadgeI18n, UiInputI18n } from './ui-i18n.types';

@Injectable({
    providedIn: 'root'
})
export class UiI18nService {
    // Signals for dynamic translation updates
    table = signal<UiTableI18n>(DEFAULT_PAL_I18N.table);
    badge = signal<UiBadgeI18n>(DEFAULT_PAL_I18N.badge);
    input = signal<UiInputI18n>(DEFAULT_PAL_I18N.input);

    /**
     * Update translations for a specific component type
     */
    setTranslations(type: 'table' | 'badge' | 'input', translations: any) {
        if (type === 'table') {
            this.table.set({ ...DEFAULT_PAL_I18N.table, ...translations });
        } else if (type === 'badge') {
            this.badge.set({ ...DEFAULT_PAL_I18N.badge, ...translations });
        } else if (type === 'input') {
            this.input.set({ ...DEFAULT_PAL_I18N.input, ...translations });
        }
    }
}
