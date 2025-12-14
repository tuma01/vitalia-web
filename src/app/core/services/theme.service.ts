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

    // 3️⃣ Obtiene el <link> del theme principal
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement | null;

    if (!themeLink) {
      console.error('[ThemeService] <link id="app-theme"> not found in index.html');
      return;
    }

    // 4️⃣ Cambia el CSS del theme (Material prebuilt)
    themeLink.href = `assets/themes/${themeName}.css`;

    // 5️⃣ Guarda el theme activo
    localStorage.setItem(this.THEME_KEY, themeName);

    // 6️⃣ Notifica el cambio
    this.themeChangeSubject.next(themeName);

    // 7️⃣ Ajusta clases del body (layout / overrides globales)
    const body = this.document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-colored');

    if (themeName === 'light-theme') {
      body.classList.add('theme-light');
    } else if (themeName === 'dark-theme') {
      body.classList.add('theme-dark');
    } else {
      body.classList.add('theme-colored');
    }

    console.log('[ThemeService] Theme applied:', themeName);
  }

  getCurrentTheme(): string {
      if (isPlatformBrowser(this.platformId)) {
          return localStorage.getItem(this.THEME_KEY) || 'indigo-pink';
      }
      return 'indigo-pink';
  }
}
