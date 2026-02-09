import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
    private _currentLanguage = signal<string>('es-ES');

    /** Signal of current language code */
    public readonly currentLanguage = this._currentLanguage.asReadonly();

    /** Available languages */
    public readonly availableLanguages: Language[] = [
        { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
        { code: 'en-US', name: 'English', flag: '🇺🇸' },
        { code: 'fr-FR', name: 'Français', flag: '🇫🇷' }
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

        this.translate.setDefaultLang(defaultLang);
        const langToUse = stored && this.isValidLanguage(stored) ? stored : defaultLang;
        this.setLanguage(langToUse);
    }

    /**
     * Set the current language
     */
    setLanguage(langCode: string): void {
        if (!this.isValidLanguage(langCode)) return;

        this.translate.use(langCode).subscribe({
            next: () => {
                this._currentLanguage.set(langCode);
                localStorage.setItem(this.STORAGE_KEY, langCode);

                // Auto-sync direction based on language
                const direction = langCode.startsWith('ar') || langCode.startsWith('he') ? 'rtl' : 'ltr';
                document.documentElement.dir = direction;
            },
            error: (err) => console.error('[LanguageService] Error switching language:', err)
        });
    }

    getCurrentLanguage(): string {
        return this._currentLanguage();
    }

    private isValidLanguage(langCode: string): boolean {
        return this.availableLanguages.some(lang => lang.code === langCode);
    }
}
