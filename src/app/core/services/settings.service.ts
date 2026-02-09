import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ThemeService } from '../theme/theme.service';

export type LayoutMode = 'light' | 'dark';
export type SidenavColor = 'light' | 'dark';
export type Density = 'compact' | 'default' | 'expanded';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private themeService = inject(ThemeService);
    private platformId = inject(PLATFORM_ID);
    private document = inject(DOCUMENT);

    // Signals para el estado visual de la app
    layoutMode = signal<LayoutMode>('light');
    sidenavColor = signal<SidenavColor>('light');
    density = signal<Density>('default');
    headerColor = signal<string>('#ffffff'); // ✅ Fixed default or tenant default

    constructor() {
        this.loadSettings();
    }

    setHeaderColor(color: string): void {
        this.headerColor.set(color);
        localStorage.setItem('vitalia-header-color', color);

        // Determinar el color de marca (Indigo si el header es blanco/default)
        const brandColor = (color.toLowerCase() === '#ffffff') ? '#3f51b5' : color;

        // ✅ Persistir Override de Marca si no es blanco
        if (color.toLowerCase() !== '#ffffff') {
            localStorage.setItem('vitalia-brand-primary', brandColor);
            localStorage.setItem('vitalia-brand-accent', brandColor);
        } else {
            // Si es blanco, eliminamos overrides para permitir que mande el branding del hospital
            localStorage.removeItem('vitalia-brand-primary');
            localStorage.removeItem('vitalia-brand-accent');
        }

        this.applyHeaderStyles(color);

        // ✅ Sincronización Global
        const current = this.themeService.getCurrentTheme();
        if (current) {
            this.themeService.applyTheme({
                ...current,
                primaryColor: brandColor,
                accentColor: brandColor
            });
        }
    }

    private applyHeaderStyles(color: string): void {
        if (!isPlatformBrowser(this.platformId)) return;
        const root = this.document.documentElement;
        const body = this.document.body;
        root.style.setProperty('--app-header-bg', color);

        // Calcular contraste (blanco o negro)
        const contrastColor = this.getContrastYIQ(color);
        root.style.setProperty('--app-header-text', contrastColor);

        // ✅ Aplicar clases estructurales al body para CSS robusto
        if (contrastColor === '#ffffff') {
            body.classList.add('header-dark'); // Fondo oscuro -> Header "Dark mode" (texto blanco)
            body.classList.remove('header-light');
        } else {
            body.classList.add('header-light'); // Fondo claro -> Header "Light mode" (texto negro)
            body.classList.remove('header-dark');
        }
    }

    private getContrastYIQ(hexcolor: string): string {
        hexcolor = hexcolor.replace("#", "");
        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(hex => hex + hex).join('');
        }
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 170) ? 'rgba(0,0,0,0.87)' : '#ffffff';
    }

    setLayoutMode(mode: LayoutMode): void {
        this.layoutMode.set(mode);
        localStorage.setItem('vitalia-layout', mode);

        // ✅ Sincronizar Sidebar Color con el Layout
        this.setSidenavColor(mode);

        // ✅ Sincronizar Color de Header automáticamente con el Layout
        const autoColor = mode === 'dark' ? '#111421' : '#ffffff';
        this.setHeaderColor(autoColor);

        // Sincronizar con el ThemeService
        const current = this.themeService.getCurrentTheme();
        if (current) {
            this.themeService.applyTheme({
                ...current,
                themeMode: mode.toUpperCase() as 'LIGHT' | 'DARK'
            });
        }
    }

    setSidenavColor(color: SidenavColor): void {
        this.sidenavColor.set(color);
        localStorage.setItem('vitalia-sidenav', color);

        if (!isPlatformBrowser(this.platformId)) return;
        const body = this.document.body;
        // La clase sidebar-* es independiente de theme-*, permitiendo sidebar oscuro en theme claro
        body.classList.remove('sidebar-light', 'sidebar-dark');
        body.classList.add(`sidebar-${color}`);
    }

    setDensity(density: Density): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.density.set(density);
        localStorage.setItem('vitalia-density', density);

        // Aplicar clase al body
        const body = this.document.body;
        body.classList.remove('density-compact', 'density-default', 'density-expanded');
        body.classList.add(`density-${density}`);
    }

    private loadSettings(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const layout = localStorage.getItem('vitalia-layout') as LayoutMode;
        const sidenav = localStorage.getItem('vitalia-sidenav') as SidenavColor;
        const density = localStorage.getItem('vitalia-density') as Density;
        const header = localStorage.getItem('vitalia-header-color');

        if (layout) {
            this.layoutMode.set(layout);
        }

        if (sidenav) {
            this.setSidenavColor(sidenav);
        }

        if (header) {
            this.headerColor.set(header);
            this.applyHeaderStyles(header);
        }

        if (density) {
            this.setDensity(density);
        }
    }
}
