import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';
export type Density = 'default' | 'comfortable' | 'compact';

export type Brand = 'vitalia' | 'school';

@Injectable({
  providedIn: 'root'
})
export class UiConfigService {
  theme = signal<Theme>('light');
  density = signal<Density>('default');
  brand = signal<Brand>('vitalia');
  inputAppearance = signal<'outline' | 'filled'>('outline');

  constructor() {
    // Apply theme effect (Light/Dark mode)
    effect(() => {
      const theme = this.theme();
      document.body.setAttribute('data-theme', theme);

      // Sync class for styles that use .theme-dark
      if (theme === 'dark') {
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light');
      } else {
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark');
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
