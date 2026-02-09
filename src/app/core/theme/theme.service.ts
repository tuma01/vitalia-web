import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, of, firstValueFrom } from 'rxjs';
import { ThemeDto } from '../../api/models/theme-dto';
import { API_ROOT_URL } from '../../api/api-configuration';

/**
 * 🎨 Theme Default Fallback
 */
export const VITALIA_DEFAULT_THEME: ThemeDto = {
  id: 0,
  code: 'DEFAULT',
  name: 'Vitalia Default',
  primaryColor: '#3f51b5',
  secondaryColor: '#455a64',
  accentColor: '#3949ab', // ✅ Serious Indigo instead of Pink/Purple
  backgroundColor: '#ffffff',
  textColor: '#000000',
  themeMode: 'LIGHT',
  active: true,
  allowCustomCss: false
};

/**
 * 🎨 ThemeService - SIMPLE Multi-Tenant Theming
 * 
 * Gestiona theming dinámico por tenant desde backend.
 * Sin capas innecesarias ni sobreingeniería.
 * 
 * Flujo:
 * 1. Login → tenantId
 * 2. loadTheme(tenantId) → backend
 * 3. applyTheme(theme) → DOM
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'vitalia-theme-config';
  private currentTheme: ThemeDto | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(API_ROOT_URL) private apiRootUrl: string,
    private http: HttpClient
  ) { }

  /**
   * 🚀 Inicialización al arrancar
   * Prioridad: Backend > LocalStorage > Default
   * Retorna Promise para APP_INITIALIZER (previene FOUC)
   */
  async initTheme(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    // 1️⃣ Obtener preferencia de modo guardada (vitalia-layout)
    const userModePref = localStorage.getItem('vitalia-layout') as 'light' | 'dark' | null;

    // 2️⃣ Obtener theme guardado completo (para colores de marca previos)
    let savedTheme: ThemeDto | null = null;
    const savedJson = localStorage.getItem(this.STORAGE_KEY);
    if (savedJson) {
      try {
        savedTheme = JSON.parse(savedJson);
      } catch {
        savedTheme = null;
      }
    }

    // 3️⃣ Cargar theme del backend (tenant default: vitalia)
    try {
      // Intentamos cargar el tema del backend para tener colores actualizados
      const backendTheme = await firstValueFrom(this.loadTheme('vitalia'));
      console.log('[ThemeService] 🌐 Loaded theme from Backend');

      // Aplicamos jerarquía: Si backend es AUTO o null, usamos userModePref
      if (backendTheme.themeMode === 'AUTO' || !backendTheme.themeMode) {
        const finalMode = userModePref ? (userModePref.toUpperCase() as 'LIGHT' | 'DARK') : 'LIGHT';
        this.applyTheme({ ...backendTheme, themeMode: finalMode });
      } else {
        // El backend manda
        this.applyTheme(backendTheme);
      }
    } catch (error) {
      console.warn('[ThemeService] ⚠️ Backend init failed, using fallback', error);
      // Fallback a Storage o Default
      const fallback = savedTheme || VITALIA_DEFAULT_THEME;
      this.applyTheme(fallback);
    }
  }

  /**
   * 🔄 Carga theme desde backend con fallback de seguridad
   */
  loadTheme(tenantId: string): Observable<ThemeDto> {
    const url = `${this.apiRootUrl}/tenants/${tenantId}/theme`;
    return this.http.get<ThemeDto>(url).pipe(
      tap(theme => this.applyTheme(theme)),
      catchError((error: HttpErrorResponse) => {
        console.warn(`[ThemeService] ⚠️ Error loading theme for ${tenantId}, using default:`, error.message);
        this.applyTheme(VITALIA_DEFAULT_THEME);
        return of(VITALIA_DEFAULT_THEME);
      })
    );
  }

  /**
   * 🎨 Aplica theme al DOM usando variables CSS de Material 3
   */
  applyTheme(theme: ThemeDto): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentTheme = theme;

    // Persistir
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(theme));

    const root = this.document.documentElement;
    const body = this.document.body;
    // 🌓 Determinar el modo (Light/Dark) con el "Merge Elegante":
    // 1️⃣ Preferencia de Usuario en LocalStorage (Dispositivo manda)
    // 2️⃣ Preferencia del Tenant en Backend
    // 3️⃣ Default (LIGHT)
    const userPref = localStorage.getItem('vitalia-layout') as 'light' | 'dark' | null;
    let mode = userPref ? (userPref.toUpperCase() as 'LIGHT' | 'DARK') : theme.themeMode;

    // Si sigue siendo AUTO o null, forzamos LIGHT
    if (mode === 'AUTO' || !mode) {
      mode = 'LIGHT';
    }

    const isDark = mode === 'DARK';

    // 🎨 Determinar colores de marca (Prioridad: LocalStorage Overrides > Backend)
    const userPrimary = localStorage.getItem('vitalia-brand-primary');
    const userAccent = localStorage.getItem('vitalia-brand-accent');

    const primary = userPrimary || theme.primaryColor || '#3f51b5';
    const accent = userAccent || theme.accentColor || '#3949ab';

    // 🔹 Helper para aplicar variable
    const setVar = (name: string, value: string) => {
      root.style.setProperty(name, value);
    };

    // 🎨 1. BRAND TOKENS (base)
    const warn = '#f44336';
    const success = isDark ? '#81c784' : '#2e7d32';
    const info = isDark ? '#29b6f6' : '#0288d1';
    const warning = isDark ? '#ffb74d' : '#ed6c02';
    const link = theme.linkColor || primary;

    setVar('--brand-primary', primary);
    setVar('--brand-accent', accent);
    setVar('--brand-warn', warn);
    setVar('--brand-link', link);
    setVar('--brand-bg-base', theme.backgroundColor || '#ffffff');
    setVar('--brand-text-base', theme.textColor || '#000000');

    // 🔥 2. DERIVED BRAND TOKENS (motor de diseño)
    setVar('--color-primary', primary);
    const pRgb = this.hexToRgb(primary);
    setVar('--color-primary-rgb', `${pRgb.r},${pRgb.g},${pRgb.b}`);
    setVar('--color-primary-contrast', this.getContrastColor(primary));
    setVar('--color-primary-hover', this.mix(primary, '#000000', 8));
    setVar('--color-primary-container', this.mix(primary, '#ffffff', 85));
    setVar('--color-primary-container-contrast', this.getContrastColor(this.mix(primary, '#ffffff', 85)));

    setVar('--color-accent', accent);
    const aRgb = this.hexToRgb(accent);
    setVar('--color-accent-rgb', `${aRgb.r},${aRgb.g},${aRgb.b}`);
    setVar('--color-accent-contrast', this.getContrastColor(accent));
    setVar('--color-accent-container', this.mix(accent, '#ffffff', 85));

    setVar('--color-warn', warn);
    setVar('--color-warn-contrast', '#ffffff');
    setVar('--color-warn-hover', this.mix(warn, '#000000', 10));

    setVar('--color-link', link);
    setVar('--color-link-hover', this.mix(link, '#000000', 12));

    setVar('--color-success', success);
    setVar('--color-success-bg', this.mix(success, isDark ? '#000000' : '#ffffff', isDark ? 85 : 90));
    setVar('--color-info', info);
    setVar('--color-info-bg', this.mix(info, isDark ? '#000000' : '#ffffff', isDark ? 85 : 90));
    setVar('--color-warning', warning);
    setVar('--color-warning-bg', this.mix(warning, isDark ? '#000000' : '#ffffff', isDark ? 85 : 90));
    setVar('--color-error', warn);
    setVar('--color-error-bg', this.mix(warn, isDark ? '#000000' : '#ffffff', isDark ? 85 : 90));

    // 🌫 3. SYSTEM SURFACES (Neutral Tokens - Light/Dark)
    setVar('--sys-surface-0', isDark ? '#121212' : '#ffffff');
    setVar('--sys-surface-0-rgb', isDark ? '18,18,18' : '255,255,255');
    setVar('--sys-surface-1', isDark ? '#1e1e1e' : '#f8f9fa');
    setVar('--sys-surface-1-rgb', isDark ? '30,30,30' : '248,249,250');
    setVar('--sys-surface-2', isDark ? '#232323' : '#f1f3f5');
    setVar('--sys-surface-2-rgb', isDark ? '35,35,35' : '241,243,245');

    setVar('--sys-text-primary', isDark ? '#ffffff' : '#1a1a1a');
    setVar('--sys-text-secondary', isDark ? '#b0b3b8' : '#5f6368');
    setVar('--sys-border-subtle', isDark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.12)');
    setVar('--sys-disabled-bg', isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)');
    setVar('--sys-disabled-text', isDark ? 'rgba(255,255,255,.38)' : 'rgba(0,0,0,.38)');

    // 🎚 4. ESTADOS GLOBALES
    setVar('--state-hover-surface', this.mix('#000000', '#ffffff', isDark ? 12 : 95));
    setVar('--state-focus-ring', accent);
    setVar('--state-active-overlay', this.mix(primary, '#000000', 15));

    // 🧱 5. COMPONENT TOKENS (API para el CSS)
    setVar('--btn-primary-bg', 'var(--color-primary)');
    setVar('--btn-primary-text', 'var(--color-primary-contrast)');
    setVar('--btn-primary-hover', 'var(--color-primary-hover)');

    setVar('--btn-secondary-text', 'var(--color-primary)');
    setVar('--btn-secondary-border', 'var(--color-primary)');

    setVar('--toggle-selected-bg', 'var(--color-primary-container)');
    setVar('--toggle-selected-text', 'var(--color-primary)');
    setVar('--toggle-hover-bg', 'var(--state-hover-surface)');

    setVar('--input-text', 'var(--sys-text-primary)');
    setVar('--input-label', 'var(--sys-text-secondary)');
    setVar('--input-border-focus', 'var(--color-primary)');
    setVar('--input-caret', 'var(--color-primary)');

    setVar('--link-color', 'var(--color-link)');
    setVar('--link-hover', 'var(--color-link-hover)');

    // 🔁 6. MAPEO A ANGULAR MATERIAL 3 (M3 System Variables)
    setVar('--mat-sys-primary', 'var(--color-primary)');
    setVar('--mat-sys-on-primary', 'var(--color-primary-contrast)');
    setVar('--mat-sys-primary-container', 'var(--color-primary-container)');
    setVar('--mat-sys-on-primary-container', 'var(--color-primary)');

    setVar('--mat-sys-secondary', theme.secondaryColor || '#455a64');
    setVar('--mat-sys-tertiary', 'var(--color-accent)');

    // Surface system for components (Menus, Selects, Cards)
    setVar('--mat-sys-surface', 'var(--sys-surface-0)');
    setVar('--mat-sys-surface-container', 'var(--sys-surface-0)'); // Standard white/black background
    setVar('--mat-sys-surface-container-high', 'var(--sys-surface-2)');
    setVar('--mat-sys-on-surface', 'var(--sys-text-primary)');
    setVar('--mat-sys-on-surface-variant', 'var(--sys-text-secondary)');

    setVar('--mat-sys-background', 'var(--sys-surface-0)');
    setVar('--mat-sys-on-background', 'var(--sys-text-primary)');
    setVar('--mat-sys-outline', 'var(--sys-border-subtle)');
    setVar('--mat-sys-outline-variant', 'var(--sys-border-subtle)');

    // Error & Warn system (for Badges, validation)
    setVar('--mat-sys-error', 'var(--color-error)');
    setVar('--mat-sys-on-error', 'var(--color-warn-contrast)'); // Pure white for text on red
    setVar('--mat-sys-error-container', 'var(--color-error-bg)');
    setVar('--mat-sys-on-error-container', 'var(--color-error)');

    // Interaction states
    setVar('--mat-sys-hover-state-layer-color', 'var(--sys-text-primary)');
    setVar('--mat-sys-focus-state-layer-color', 'var(--color-primary)');

    // 🔤 7. TIPOGRAFÍA
    if (theme.fontFamily) {
      setVar('--app-font-family', theme.fontFamily);
      body.style.fontFamily = theme.fontFamily;
    } else {
      root.style.removeProperty('--app-font-family');
      body.style.fontFamily = '';
    }

    // 🌗 8. MODO LIGHT / DARK
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(isDark ? 'theme-dark' : 'theme-light');

    // 📏 9. DENSIDAD & CUSTOM PROPS
    if (theme.propertiesJson) {
      try {
        const props = JSON.parse(theme.propertiesJson);
        if (props.density) {
          body.classList.remove('density-compact', 'density-comfortable', 'density-default', 'density-expanded');
          const densityClass = props.density === 'comfortable' ? 'density-default' : `density-${props.density}`;
          body.classList.add(densityClass);
        }
        Object.entries(props).forEach(([key, value]) => {
          if (key.startsWith('--')) setVar(key, value as string);
        });
      } catch (e) {
        console.warn('[ThemeService] Error parsing propertiesJson:', e);
      }
    }

    // ✅ Layout Variables
    setVar('--app-header-height', '60px');
    setVar('--app-header-search-width', '260px');

    // 🎭 Custom CSS
    if (theme.customCss && theme.allowCustomCss) {
      this.injectCustomCss(theme.customCss);
    } else {
      this.injectCustomCss('');
    }

    console.log('[ThemeService] ✅ Design Token Engine applied');
  }


  /**
   * 💉 Inyección segura de CSS dinámico
   */
  private injectCustomCss(css: string): void {
    const styleId = 'tenant-custom-css';
    let styleEl = this.document.getElementById(styleId) as HTMLStyleElement;

    if (!styleEl) {
      styleEl = this.document.createElement('style');
      styleEl.id = styleId;
      this.document.head.appendChild(styleEl);
    }

    styleEl.textContent = css;
  }

  /**
   * 💡 Calcula color de contraste (blanco/negro) basado en luminosidad YIQ
   */
  private getContrastColor(hex: string): string {
    if (!hex) return '#ffffff';
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#ffffff';
  }

  getCurrentTheme(): ThemeDto | null {
    return this.currentTheme;
  }

  /**
   * 🎨 Color Mixing Utility (Sass-like)
   */
  private mix(color: string, mixWith: string, weight: number): string {
    if (!color.startsWith('#')) return color;
    const w = weight / 100;
    const c1 = this.hexToRgb(color);
    const c2 = this.hexToRgb(mixWith);
    const r = Math.round(c1.r * (1 - w) + c2.r * w);
    const g = Math.round(c1.g * (1 - w) + c2.g * w);
    const b = Math.round(c1.b * (1 - w) + c2.b * w);
    return this.rgbToHex(r, g, b);
  }

  private hexToRgb(hex: string) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}
