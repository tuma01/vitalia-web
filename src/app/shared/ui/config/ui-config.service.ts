import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';
export type Density = 'default' | 'comfortable' | 'compact';
export type Brand = 'vitalia' | 'school';

export interface TenantTheme {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  warnColor?: string;
  linkColor?: string;
  buttonTextColor?: string;
  fontFamily?: string;
  themeMode?: 'LIGHT' | 'DARK' | 'AUTO' | 'light' | 'dark' | 'auto';
  logoUrl?: string;
  faviconUrl?: string;
  customCss?: string;
  allowCustomCss?: boolean;
  propertiesJson?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UiConfigService {
  theme = signal<Theme>('light');
  density = signal<Density>('default');
  brand = signal<Brand>('vitalia');
  inputAppearance = signal<'outline' | 'filled'>('outline');
  tenantTheme = signal<TenantTheme | null>(null);

  constructor() {
    // Apply theme effect (Light/Dark mode)
    effect(() => {
      const theme = this.theme();
      document.body.setAttribute('data-theme', theme);

      // Sync class for styles that use .theme-dark
      if (theme === 'dark') {
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light');
        // Force critical tokens for dark mode if not handled by CSS
        document.body.style.setProperty('--ui-color-text-primary', '#f8fafc');
        document.body.style.setProperty('--ui-color-text', '#f8fafc');
      } else {
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark');
        // Remove forced tokens to revert to CSS or Tenant defaults
        document.body.style.removeProperty('--ui-color-text-primary');
        document.body.style.removeProperty('--ui-color-text');
      }
    });

    // Apply density effect
    effect(() => {
      const density = this.density();
      // Clean previous classes
      document.body.classList.remove('density-default', 'density-compact', 'density-comfortable');
      // Add new class
      document.body.classList.add(`density-${density}`);
      // Also keep attribute for double safety and selector flexibility
      document.body.setAttribute('data-density', density);
    });

    // Apply Brand Theme (Vitalia vs School)
    effect(() => {
      // Clean previous classes
      document.body.classList.remove('theme-vitalia', 'theme-school');
      // Add new class
      document.body.classList.add(`theme-${this.brand()}`);
    });

    // Apply Dynamic Tenant Theme (CSS Variables)
    effect(() => {
      const theme = this.tenantTheme();
      const target = document.body; // Using body to ensure inline styles override class-based tokens

      if (!theme) {
        return;
      }

      if (theme.primaryColor) target.style.setProperty('--ui-color-primary', theme.primaryColor);
      if (theme.secondaryColor) target.style.setProperty('--ui-color-secondary', theme.secondaryColor);
      if (theme.backgroundColor) {
        target.style.setProperty('--ui-background-default', theme.backgroundColor);
        target.style.setProperty('--ui-background-surface', theme.backgroundColor);
      }
      if (theme.textColor) target.style.setProperty('--ui-color-text', theme.textColor);
      if (theme.accentColor) target.style.setProperty('--ui-color-secondary', theme.accentColor);
      if (theme.warnColor) target.style.setProperty('--ui-color-danger', theme.warnColor);
      if (theme.buttonTextColor) target.style.setProperty('--ui-color-on-primary', theme.buttonTextColor);
      if (theme.fontFamily) target.style.setProperty('--ui-font-family-sans', theme.fontFamily);

      if (theme.themeMode) {
        const mode = theme.themeMode.toLowerCase() as Theme;
        if (mode === 'light' || mode === 'dark') {
          this.theme.set(mode);
        }
      }

      // Handle Custom CSS Injection
      this.applyCustomCss(theme);
    });
  }

  private applyCustomCss(theme: TenantTheme) {
    let styleTag = document.getElementById('tenant-custom-css') as HTMLStyleElement;

    if (!theme.allowCustomCss || !theme.customCss) {
      if (styleTag) styleTag.remove();
      return;
    }

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'tenant-custom-css';
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = theme.customCss;
  }

  toggleTheme() {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  toggleBrand() {
    this.brand.update(current => current === 'vitalia' ? 'school' : 'vitalia');
  }

  setDensity(density: Density) {
    this.density.set(density);
  }
}
