import { Injectable, inject, signal } from '@angular/core';
import { ThemeService } from './theme.service';

export type LayoutMode = 'light' | 'dark';
export type SidenavColor = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private themeService = inject(ThemeService);

    // Signals for reactive state
    layoutMode = signal<LayoutMode>('light');
    sidenavColor = signal<SidenavColor>('light'); // Default to light sidenav

    constructor() {
        // Load initial state if persisted
        const savedLayout = localStorage.getItem('vitalia-layout') as LayoutMode;
        if (savedLayout) this.layoutMode.set(savedLayout);

        const savedSidenav = localStorage.getItem('vitalia-sidenav') as SidenavColor;
        if (savedSidenav) this.sidenavColor.set(savedSidenav);

        // Ensure body has correct class
        this.updateBodyClass();
    }

    setLayoutMode(mode: LayoutMode) {
        this.layoutMode.set(mode);

        // Layout affects Sidenav (one-way sync)
        this.sidenavColor.set(mode);

        // Auto-select matching Color Theme (IDs from ThemeService)
        this.themeService.setTheme(mode === 'light' ? 'light-theme' : 'dark-theme');

        localStorage.setItem('vitalia-layout', mode);
        localStorage.setItem('vitalia-sidenav', mode);
        this.updateBodyClass();
    }

    setSidenavColor(color: SidenavColor) {
        // ONLY change sidenav color - DO NOT affect Layout, Theme, or Body
        this.sidenavColor.set(color);
        localStorage.setItem('vitalia-sidenav', color);
    }

    setTheme(themeName: string) {
        this.themeService.setTheme(themeName);
    }

    getCurrentTheme() {
        return this.themeService.getCurrentTheme();
    }

    get availableThemes() {
        return this.themeService.availableThemes;
    }

    private updateBodyClass() {
        // This handles the global light/dark mode for BODY only
        const body = document.body;
        if (this.layoutMode() === 'dark') {
            body.classList.add('theme-dark');
            body.classList.remove('theme-light');
        } else {
            body.classList.add('theme-light');
            body.classList.remove('theme-dark');
        }
    }
}
