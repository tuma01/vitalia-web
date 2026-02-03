import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UiDirectionService } from '../../shared/ui/services/ui-direction.service';

/**
 * Supported languages
 */
export interface Language {
    code: string;
    name: string;
    flag?: string;
}

/**
 * Service to manage application language/locale
 */
@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private translate = inject(TranslateService);
    private directionService = inject(UiDirectionService);
    private _currentLanguage = signal<string>('es-ES');

    /** Signal of current language code */
    public readonly currentLanguage = this._currentLanguage.asReadonly();

    /** Available languages */
    public readonly availableLanguages: Language[] = [
        { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
        { code: 'en-US', name: 'English', flag: '🇺🇸' },
        { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
        { code: 'ar-SA', name: 'العربية (Arabic)', flag: '🇸🇦' }
    ];

    private readonly STORAGE_KEY = 'vitalia-language';

    constructor() {
        this.initLanguage();
    }

    /**
     * Initialize language from storage or default
     */
    private initLanguage(): void {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        const defaultLang = 'es-ES';

        // Set default and fallback
        this.translate.setDefaultLang(defaultLang);

        // Use stored language if valid, otherwise use default
        const langToUse = stored && this.isValidLanguage(stored) ? stored : defaultLang;
        this.setLanguage(langToUse);
    }

    /**
     * Set the current language
     * @param langCode Language code (e.g., 'es-ES', 'en-US')
     */
    setLanguage(langCode: string): void {
        if (!this.isValidLanguage(langCode)) {
            console.warn(`Invalid language code: ${langCode}`);
            return;
        }

        console.log('[LanguageService] Switching to language:', langCode);
        this.translate.use(langCode).subscribe({
            next: () => {
                console.log('[LanguageService] Language switched successfully to:', langCode);
                this._currentLanguage.set(langCode);
                localStorage.setItem(this.STORAGE_KEY, langCode);

                // Auto-sync direction based on language
                const direction = langCode.startsWith('ar') || langCode.startsWith('he') ? 'rtl' : 'ltr';
                this.directionService.setDirection(direction);
            },
            error: (err) => {
                console.error('[LanguageService] Error switching language:', err);
            }
        });
    }

    /**
     * Get current language code
     * @returns Current language code
     */
    getCurrentLanguage(): string {
        return this._currentLanguage();
    }

    /**
     * Check if language code is valid
     * @param langCode Language code to check
     * @returns True if valid
     */
    private isValidLanguage(langCode: string): boolean {
        return this.availableLanguages.some(lang => lang.code === langCode);
    }

    /**
     * Get language name by code
     * @param langCode Language code
     * @returns Language name or code if not found
     */
    getLanguageName(langCode: string): string {
        const lang = this.availableLanguages.find(l => l.code === langCode);
        return lang ? lang.name : langCode;
    }
}
