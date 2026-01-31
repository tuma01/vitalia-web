import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface Theme {
  name: string;
  className: string;
  displayName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'vitalia-theme';

  // Available themes matching files in src/assets/themes
  availableThemes: Theme[] = [
    { name: 'light-theme', className: 'light-theme', displayName: 'Light Mode' },
    { name: 'dark-theme', className: 'dark-theme', displayName: 'Dark Mode' },
    { name: 'indigo-pink', className: 'indigo-pink', displayName: 'Indigo & Pink' },
    { name: 'deeppurple-amber', className: 'deeppurple-amber', displayName: 'Deep Purple & Amber' },
    { name: 'pink-bluegrey', className: 'pink-bluegrey', displayName: 'Pink & Blue-Grey' },
    { name: 'purple-green', className: 'purple-green', displayName: 'Purple & Green' }
  ];

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object) { }

  initTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem(this.THEME_KEY);
      const themeToApply = savedTheme || 'indigo-pink';
      this.setTheme(themeToApply);
    }
  }

  private themeChangeSubject = new BehaviorSubject<string>(this.getCurrentTheme());
  themeChange$ = this.themeChangeSubject.asObservable();

  // Map of Prebuilt Themes to their Core Colors (Hex)
  // This bridges the gap between Material CSS and our PAL CSS Variables
  private readonly themeColors: Record<string, { primary: string; secondary: string }> = {
    'light-theme': { primary: '#3f51b5', secondary: '#ff4081' }, // Default (Indigo)
    'dark-theme': { primary: '#3f51b5', secondary: '#ff4081' },  // Default Dark
    'indigo-pink': { primary: '#3f51b5', secondary: '#ff4081' },
    'deeppurple-amber': { primary: '#673ab7', secondary: '#ffc107' },
    'pink-bluegrey': { primary: '#e91e63', secondary: '#607d8b' },
    'purple-green': { primary: '#9c27b0', secondary: '#4caf50' },
  };

  setTheme(themeName: string): void {
    // 1️⃣ Verifica que el tema exista en la lista
    const theme = this.availableThemes.find(t => t.className === themeName);
    if (!theme) {
      console.warn('[ThemeService] Theme not found:', themeName);
      return;
    }

    // 2️⃣ Solo ejecuta en navegador
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // 3️⃣ REMOVED: CSS File Swapping Logic
    // The previous logic for <link id="app-theme"> is removed.
    // We now rely on global SCSS classes for theme styling.

    // 4️⃣ Guarda el theme activo
    localStorage.setItem(this.THEME_KEY, themeName);

    // 5️⃣ Update Body Classes (Remove old, Add new)
    const body = this.document.body;
    // Remove all known theme classes first
    this.availableThemes.forEach(t => body.classList.remove(t.className));
    // Add new theme class
    body.classList.add(themeName);

    // 6️⃣ Notifica el cambio
    this.themeChangeSubject.next(themeName);

    // 7️⃣ Ajusta variables CSS GLOBALES para que PAL reaccione (Systemic Fix)
    const colors = this.themeColors[themeName];
    if (colors) {
      // Inject Primary/Secondary into PAL variables
      body.style.setProperty('--ui-color-primary', colors.primary);
      body.style.setProperty('--ui-color-secondary', colors.secondary);

      console.log(`[ThemeService] Updated PAL Variables: Primary=${colors.primary}`);
    }

    // 8️⃣ REMOVED: Layout Mode (theme-light/theme-dark) management from here.
    // These classes are now expected to be managed by a separate service (e.g., SettingsService)
    // and coexist with the color theme class added above.

    console.log('[ThemeService] Theme applied (Class-based):', themeName);
  }

  getCurrentTheme(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.THEME_KEY) || 'indigo-pink';
    }
    return 'indigo-pink';
  }
}
