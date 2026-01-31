import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ThemeDto } from '../../api/models/theme-dto';
import { ApiConfiguration } from '../../api/api-configuration';
import { UiConfigService, TenantTheme, Theme } from '../../shared/ui/config/ui-config.service';

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
        private uiConfig: UiConfigService,
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
     * Apply theme to the application using UiConfigService
     * @param theme The theme configuration to apply
     */
    applyTheme(theme: ThemeDto): void {
        if (!isPlatformBrowser(this.platformId)) return;

        // Save theme to localStorage for persistence
        localStorage.setItem('tenantTheme', JSON.stringify(theme));

        // Map ThemeDto (API) to TenantTheme (UI Config)
        const tenantTheme: TenantTheme = {
            primaryColor: theme.primaryColor,
            accentColor: theme.accentColor,
            warnColor: theme.warnColor,
            secondaryColor: theme.secondaryColor,
            backgroundColor: theme.backgroundColor,
            textColor: theme.textColor,
            linkColor: theme.linkColor,
            buttonTextColor: theme.buttonTextColor,
            fontFamily: theme.fontFamily,
            themeMode: theme.themeMode as any,
            logoUrl: theme.logoUrl,
            faviconUrl: theme.faviconUrl,
            customCss: theme.customCss,
            allowCustomCss: theme.allowCustomCss
        };

        // Update UI Config Service (Signal Logic handles CSS vars)
        this.uiConfig.tenantTheme.set(tenantTheme);

        // Update Theme Mode (Light/Dark)
        if (theme.themeMode) {
            const rawMode = theme.themeMode.toLowerCase();
            if (rawMode === 'light' || rawMode === 'dark') {
                this.uiConfig.theme.set(rawMode as Theme);
            } else if (rawMode === 'auto') {
                this.uiConfig.theme.set('system');
            }
        }

        // Handle Favicon & Logo (that are not CSS vars)
        this.updateAssets(theme);
    }

    private updateAssets(theme: ThemeDto): void {
        // Update tenant logo elements (if any exist outside of header components that bind to this)
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
            this.uiConfig.tenantTheme.set(null);
        }
    }
}
