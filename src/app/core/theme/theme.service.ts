import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { firstValueFrom, skip, merge, debounceTime, BehaviorSubject } from 'rxjs';
import { ThemeDto } from '../../api/models/theme-dto';
import { AppContextService } from '../services/app-context.service';
import { ContextStorageService } from '../services/context-storage.service';
import { AppConstants } from '../constants/app-constants';
import { SettingsResolver } from './settings-resolver.service';
import { SettingsService, ThemeSettings } from '../services/settings.service';

/**
 * 🎨 Platform Default Theme (Admin/SuperAdmin context)
 * Professional, neutral colors for administrative interface
 */
export const PLATFORM_DEFAULT_THEME: ThemeDto = {
  id: 0,
  code: AppConstants.Themes.DEFAULT_THEME_CODE,
  name: 'Standard Light',
  primaryColor: '#1976d2',      // Professional Blue
  secondaryColor: '#ffffff',
  accentColor: '#ff4081',
  backgroundColor: '#fafafa',
  textColor: '#212121',
  themeMode: 'LIGHT',
  active: true,
  allowCustomCss: false
};

/**
 * 🎨 Tenant Default Theme (Medical/Healthcare context)
 * Calming, healthcare-focused colors
 */
export const TENANT_DEFAULT_THEME: ThemeDto = {
  id: 0,
  code: AppConstants.Themes.DEFAULT_THEME_CODE,
  name: 'Standard Light',
  primaryColor: '#1976d2',
  secondaryColor: '#ffffff',
  accentColor: '#ff4081',
  backgroundColor: '#fafafa',
  textColor: '#212121',
  themeMode: 'LIGHT',
  active: true,
  allowCustomCss: false
};

/**
 * 🎨 Fallback Theme (when context is unknown)
 */
export const APP_DEFAULT_THEME: ThemeDto = TENANT_DEFAULT_THEME; // Default to tenant theme

/**
 * 🎨 ThemeService - Context-Aware Multi-Tenant Theming
 * 
 * Applies themes to the DOM. Theme resolution is handled by SettingsResolver.
 * 
 * 🔥 CRITICAL: This service reacts to context changes via AppContextService.contextChanges$
 * 
 * Bootstrap order:
 * 1. APP_INITIALIZER #1 → AppContextService.initFromSession() (context ready)
 * 2. APP_INITIALIZER #2 → ThemeService.initTheme() ← YOU ARE HERE
 * 3. Angular creates root services
 * 4. Components render with correct theme
 * 
 * Responsibilities:
 * - Apply theme styles to DOM
 * - Listen to context changes
 * - Listen to background theme updates from SettingsResolver
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: ThemeDto | null = null;
  private themeAppliedSubject = new BehaviorSubject<ThemeDto | null>(null);

  /**
   * 📡 Observable que emite cuando se aplica un nuevo tema.
   * Útil para sincronizar estados UI (Settings Panel).
   */
  public readonly themeApplied$ = this.themeAppliedSubject.asObservable();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private appContext: AppContextService,
    private settingsResolver: SettingsResolver,
    private storage: ContextStorageService
  ) {
    // 🔄 Subscribe to context/tenant changes (skip initial value to avoid double-load)
    merge(
      this.appContext.contextChanges$,
      this.appContext.tenantChanges$
    ).pipe(
      debounceTime(50) 
    ).subscribe(async () => {
      console.log('[ThemeService] 🔄 Context or Tenant changed, reloading settings...');
      // 🛡️ REMOVED clearTheme() - Calling clearTheme() here causes the FOUC/Flicker
      // because it removes classes BEFORE the new theme is resolved and applied.
      await this.loadThemeForContext(); 
    });

    // 🔄 Subscribe to background theme updates from SettingsResolver
    this.settingsResolver.themeUpdates$
      .subscribe(theme => {
        console.log('[ThemeService] 🔄 Applying updated theme from backend');
        this.applyTheme(theme);
      });
  }

  /**
   * 🚀 Inicialización al arrancar (APP_INITIALIZER #2)
   * 
   * 🔥 CRITICAL: Context is already set by APP_INITIALIZER #1 (AppContextService.initFromSession)
   * 
   * Retorna Promise para APP_INITIALIZER (previene FOUC)
   */
  async initTheme(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    console.log('[ThemeService] 🚀 Initializing theme (context already set)...');

    // Load theme using resolver
    await this.loadThemeForContext();
  }

  /**
   * 🔄 Load theme for current context using SettingsResolver
   */
  private async loadThemeForContext(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const theme = await firstValueFrom(this.settingsResolver.resolveInitialTheme());
    this.applyTheme(theme);
  }

  /**
   * 🧹 Clear theme (prevents visual flash during context switch)
   */
  private clearTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = this.document.documentElement;
    const body = this.document.body;

    // Remove theme mode classes
    body.classList.remove('theme-light', 'theme-dark');

    // Remove sidebar classes
    body.classList.remove('sidebar-light', 'sidebar-dark');

    // Remove density classes
    body.classList.remove('density-compact', 'density-comfortable', 'density-default', 'density-expanded');

    // Clear data attribute
    root.removeAttribute('data-theme');

    console.log('[ThemeService] 🧹 Theme cleared');
  }

  /**
   * 🎨 Aplica theme al DOM usando variables CSS de Material 3
   * 
   * Implements "Elegant Merge" pattern:
   * 1. User preferences (localStorage) override backend theme
   * 2. Backend theme provides defaults
   * 3. Hardcoded fallbacks if both are missing
   */
  applyTheme(theme: ThemeDto): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // 🛡️ Guard: Evitar reaplicación redundante (Rompe bucles circulares con SettingsService)
    const themeSnapshot = JSON.stringify(theme);
    const currentSnapshot = JSON.stringify(this.currentTheme);
    
    const root = this.document.documentElement;
    const body = this.document.body;

    if (themeSnapshot === currentSnapshot && (body.classList.contains('theme-light') || body.classList.contains('theme-dark'))) {
      return;
    }

    console.log('[ThemeService] 🎨 Applying theme:', theme.name);
    this.currentTheme = theme;

    const userPref = this.storage.getItem('layout') as 'light' | 'dark' | null;

    // 🏷️ Extracción de defaults desde el JSON del tema para el modo efectivo
    let themeLayoutMode: 'light' | 'dark' | undefined;
    if (theme.propertiesJson) {
      try {
        const props = JSON.parse(theme.propertiesJson);
        themeLayoutMode = props.layoutMode;
      } catch (e) { }
    }

    // El modo efectivo es: Preferencia Usuario > Tema (propertiesJson) > Tema (themeMode) > Default (LIGHT)
    const themeMode = theme.themeMode === 'DARK' ? 'dark' : 'light';
    const effectiveMode = userPref || themeLayoutMode || themeMode;
    const isDark = effectiveMode === 'dark';

    // 🔥 Notificar aplicación de tema (Sincroniza SettingsService sin circularidad)
    this.themeAppliedSubject.next(theme);

    // 🎨 Determinar colores de marca (Prioridad: ContextStorage Overrides > Backend)
    const userPrimary = this.storage.getItem('brand-primary');
    const userAccent = this.storage.getItem('brand-accent');

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

    // 🌙 Dark Mode Tonal Variant: In M3, dark themes use a lighter (P-80) primary.
    // Ensures UI elements like focus borders are always visible on dark surfaces.
    // We mix 40% towards white to approximate the tonal role.
    const primaryTonal = isDark ? this.mix(primary, '#ffffff', 40) : primary;
    setVar('--color-primary-tonal', primaryTonal);

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
    // In dark mode: use tonal (lighter) primary so the focus border is visible on dark bg
    setVar('--input-border-focus', isDark ? primaryTonal : primary);
    setVar('--input-caret', isDark ? primaryTonal : primary);

    setVar('--link-color', 'var(--color-link)');
    setVar('--link-hover', 'var(--color-link-hover)');

    // 🔁 6. MAPEO A ANGULAR MATERIAL 3 (M3 System Variables)
    // In dark mode, Material 3 system primary should be the lighter tonal variant
    setVar('--mat-sys-primary', isDark ? primaryTonal : 'var(--color-primary)');
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

    // 🧱 9. SIDEBAR MODE (Restore missing logic)
    const userSidebar = this.storage.getItem('sidenav') as 'light' | 'dark' | null;
    const effectiveSidebar = userSidebar || effectiveMode; // Default sidebar to match layout
    body.classList.remove('sidebar-light', 'sidebar-dark');
    body.classList.add(`sidebar-${effectiveSidebar}`);

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

    // 🔧 Inject critical fixes that must override Angular Material compiled styles
    this.injectCriticalFixes(isDark, primaryTonal);

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
   * 🔧 Injects permanent UI fixes that must override Angular Material compiled styles.
   * This style tag is always appended last in <head>, giving it maximum cascade priority.
   */
  private injectCriticalFixes(isDark: boolean, focusColor: string): void {
    const styleId = 'vitalia-critical-fixes';
    let styleEl = this.document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = this.document.createElement('style');
      styleEl.id = styleId;
      this.document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      /* ── Suppress vertical line artifact on outlined form fields ── */
      .mat-mdc-form-field-focus-indicator { display: none !important; }
      .mat-focus-indicator::before,
      .mat-focus-indicator::after { display: none !important; }

      ${isDark ? `
      /* ── Dark Mode: Force focus border to be visible ── */
      body.theme-dark .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
      body.theme-dark .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
      body.theme-dark .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing {
        border-color: ${focusColor} !important;
        border-width: 2px !important;
      }
      body.theme-dark .mat-mdc-form-field.mat-focused .mdc-floating-label,
      body.theme-dark .mat-mdc-form-field.mat-focused .mat-mdc-floating-label {
        color: ${focusColor} !important;
      }
      ` : ''}
    `;
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
