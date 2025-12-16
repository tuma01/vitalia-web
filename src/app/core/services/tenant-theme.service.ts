import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ThemeDto } from '../../api/models/theme-dto';
import { ApiConfiguration } from '../../api/api-configuration';

/**
 * Default theme configuration when tenant hasn't configured their theme
 */
const DEFAULT_THEME: ThemeDto = {
    name: 'Vitalia Default Theme',
    logoUrl: '',
    faviconUrl: 'favicon.ico',
    primaryColor: '#667eea',
    accentColor: '#764ba2',
    warnColor: '#f44336',
    secondaryColor: '#424242',
    backgroundColor: '#fafafa',
    textColor: '#212121',
    linkColor: '#667eea',
    buttonTextColor: '#ffffff',
    fontFamily: 'Inter, Roboto, sans-serif',
    themeMode: 'LIGHT'
};

/**
 * Service for managing tenant-specific themes
 * Loads and applies theme configurations from the backend
 */
@Injectable({ providedIn: 'root' })
export class TenantThemeService {

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    /**
     * Load theme for a specific tenant
     * If tenant hasn't configured their theme, applies default theme
     * @param tenantCode The tenant code (e.g., "HOSPITAL_CENTRAL")
     * @returns Observable of ThemeDto
     */
    loadThemeForTenant(tenantCode: string): Observable<ThemeDto> {
        return this.http.get<ThemeDto>(
            `${this.config.rootUrl}/tenants/${tenantCode}/theme`
        ).pipe(
            tap(theme => this.applyTheme(theme)),
            catchError(error => {
                console.warn(`Theme not configured for tenant ${tenantCode}, using default theme`, error);
                this.applyTheme(DEFAULT_THEME);
                return of(DEFAULT_THEME);
            })
        );
    }

    /**
     * Apply theme to the application
     * Sets CSS custom properties and updates logo/favicon
     * @param theme The theme configuration to apply
     */
    applyTheme(theme: ThemeDto): void {
        if (!isPlatformBrowser(this.platformId)) return;

        // Save theme to localStorage for persistence
        localStorage.setItem('tenantTheme', JSON.stringify(theme));

        // Apply CSS custom properties
        const root = this.document.documentElement;
        if (theme.primaryColor) {
            root.style.setProperty('--primary-color', theme.primaryColor);
        }
        if (theme.accentColor) {
            root.style.setProperty('--accent-color', theme.accentColor);
        }
        if (theme.warnColor) {
            root.style.setProperty('--warn-color', theme.warnColor);
        }
        if (theme.secondaryColor) {
            root.style.setProperty('--secondary-color', theme.secondaryColor);
        }
        if (theme.backgroundColor) {
            root.style.setProperty('--background-color', theme.backgroundColor);
        }
        if (theme.textColor) {
            root.style.setProperty('--text-color', theme.textColor);
        }
        if (theme.linkColor) {
            root.style.setProperty('--link-color', theme.linkColor);
        }
        if (theme.buttonTextColor) {
            root.style.setProperty('--button-text-color', theme.buttonTextColor);
        }
        if (theme.fontFamily) {
            root.style.setProperty('--font-family', theme.fontFamily);
        }

        // Update tenant logo elements
        if (theme.logoUrl) {
            const logoElements = this.document.querySelectorAll('.tenant-logo');
            logoElements.forEach(el => {
                (el as HTMLImageElement).src = theme.logoUrl!;
            });
        }

        // Update favicon
        if (theme.faviconUrl) {
            const favicon = this.document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            if (favicon) {
                favicon.href = theme.faviconUrl;
            }
        }

        // Apply theme mode class (light/dark)
        this.document.body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        if (theme.themeMode) {
            this.document.body.classList.add(`theme-${theme.themeMode.toLowerCase()}`);
        }
    }

    /**
     * Get saved theme from localStorage
     * @returns The saved theme or null if not found
     */
    getSavedTheme(): ThemeDto | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        const saved = localStorage.getItem('tenantTheme');
        return saved ? JSON.parse(saved) : null;
    }

    /**
     * Clear saved theme from localStorage
     */
    clearTheme(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('tenantTheme');
        }
    }
}
