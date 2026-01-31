import { Injectable, inject, signal } from '@angular/core';
import { ThemeService } from './theme.service';

export type LayoutMode = 'light' | 'dark';
export type SidebarColor = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private themeService = inject(ThemeService);

    // Signals for reactive state
    layoutMode = signal<LayoutMode>('light');
    sidebarColor = signal<SidebarColor>('dark'); // Default to dark sidebar

    constructor() {
        // Load initial state if persisted
        const savedLayout = localStorage.getItem('vitalia-layout') as LayoutMode;
        if (savedLayout) this.layoutMode.set(savedLayout);

        const savedSidebar = localStorage.getItem('vitalia-sidebar') as SidebarColor;
        if (savedSidebar) this.sidebarColor.set(savedSidebar);

        // Ensure body has correct class
        this.updateBodyClass();
    }

    setLayoutMode(mode: LayoutMode) {
        this.layoutMode.set(mode);

        // Layout affects Sidebar (one-way sync)
        this.sidebarColor.set(mode);

        // Auto-select matching Color Theme
        const matchingTheme = mode === 'light' ? 'light-theme' : 'dark-theme';
        this.themeService.setTheme(matchingTheme);

        localStorage.setItem('vitalia-layout', mode);
        localStorage.setItem('vitalia-sidebar', mode);
        this.updateBodyClass();
    }

    setSidebarColor(color: SidebarColor) {
        // ONLY change sidebar color - DO NOT affect Layout, Theme, or Body
        this.sidebarColor.set(color);
        localStorage.setItem('vitalia-sidebar', color);
        // No updateBodyClass() - sidebar color doesn't affect body
        // No layoutMode.set() - sidebar doesn't affect layout
        // No theme change - sidebar doesn't affect theme
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
