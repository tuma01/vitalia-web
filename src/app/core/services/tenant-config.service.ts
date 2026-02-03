import { Injectable, inject } from '@angular/core';
import { SettingsService, LayoutMode, SidenavColor } from './settings.service';
import { UiConfigService, Brand, Density, Theme } from '../../shared/ui/config/ui-config.service';
import { ThemeService } from './theme.service';

@Injectable({
    providedIn: 'root'
})
export class TenantConfigService {
    private settingsService = inject(SettingsService);
    private uiConfigService = inject(UiConfigService);
    private themeService = inject(ThemeService);

    /**
     * Main Initialization Logic
     * Execution Order:
     * 1. Check LocalStorage (User Preference).
     * 2. Check Generic Defaults (Vitalia / Light / Default).
     * 3. Apply to Services.
     */
    loadConfiguration(): Promise<void> {
        return new Promise((resolve) => {
            console.log('[TenantConfig] Initializing Application Context...');

            // 1. Resolve Layout (Light/Dark)
            // SettingsService handles LocalStorage internally in constructor, 
            // but we want to ensure it's synced with UiConfigService.
            const storedLayout = localStorage.getItem('vitalia-layout') as LayoutMode;
            const effectiveLayout = storedLayout || 'light';

            // Apply Layout
            this.settingsService.setLayoutMode(effectiveLayout);
            this.uiConfigService.setTheme(effectiveLayout);

            // 2. Resolve Sidenav
            const storedSidenav = localStorage.getItem('vitalia-sidenav') as SidenavColor;
            const effectiveSidenav = storedSidenav || effectiveLayout; // Default to matching layout
            this.settingsService.setSidenavColor(effectiveSidenav);

            // 3. Resolve Color Theme (e.g., 'purple-green')
            const storedTheme = localStorage.getItem('vitalia-theme');
            const effectiveTheme = storedTheme || (effectiveLayout === 'light' ? 'light-theme' : 'dark-theme'); // Logical default
            this.themeService.setTheme(effectiveTheme);

            // 4. Resolve Branding (Vitalia vs School)
            // Assuming we might store this in future? For now, Default = Vitalia
            // Or check URL? "school.vitalia.com"?
            // For now, straightforward default.
            const storedBrand = localStorage.getItem('vitalia-brand') as Brand;
            const effectiveBrand = storedBrand || 'vitalia';
            this.uiConfigService.setBrand(effectiveBrand);

            // 5. Resolve Density
            const storedDensity = localStorage.getItem('vitalia-density') as Density;
            const effectiveDensity = storedDensity || 'default';
            this.uiConfigService.setDensity(effectiveDensity);

            console.log(`[TenantConfig] Context Loaded: ${effectiveBrand} | ${effectiveLayout} | ${effectiveTheme} | ${effectiveDensity}`);
            resolve();
        });
    }
}
