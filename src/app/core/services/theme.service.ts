import { Injectable, Inject, PLATFORM_ID, signal, computed, effect, Signal, Provider, makeEnvironmentProviders, Injector, runInInjectionContext } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ThemeBackendAdapter } from './theme-backend-adapter';
import {
  UiTheme,
  UiColorMode,
  UiThemeDensity,
  DeepPartial,
  TenantThemeOverrides,
  BrandDesignTokens
} from './ui-theme.types';
import { PAL_DEFAULT_THEME } from './ui-theme.constants';
import { UiThemeRuntimeBuilder } from './theme-runtime-builder';
import { BRAND_PRESETS } from './ui-brand-presets';
import { mapThemeToCssVars } from './theme-mapper';
import { validateTheme } from './theme-validator';

/**
 * 🛠️ provideThemeService
 * Provider para el sistema de temas (Standalone friendly)
 */
export function provideThemeService(): Provider[] {
  return [
    ThemeService
  ];
}

/**
 * 🎨 ThemeService (Professional SaaS Engine)
 * 
 * Gestiona el estado reactivo del tema mediante Signals granulares.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'vitalia-theme-config';

  // 🧠 Granular Reactive Inputs
  private readonly _brandTokens = signal<BrandDesignTokens>(BRAND_PRESETS['vitalia']);
  private readonly _mode = signal<UiColorMode>('light');
  private readonly _density = signal<UiThemeDensity>('default');
  private readonly _tenantOverrides = signal<TenantThemeOverrides | null>(null);

  // 🚀 Resolved State (The Heart)
  private readonly _theme = signal<UiTheme>(PAL_DEFAULT_THEME);

  // 🔓 Public API (Read-only Signals)
  public readonly theme = this._theme.asReadonly();
  public readonly mode = computed(() => this._mode());
  public readonly density = computed(() => this._density());
  public readonly brandTokens = computed(() => this._brandTokens());

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector,
    private overlayContainer: OverlayContainer,
    private backendAdapter: ThemeBackendAdapter
  ) {
    /** 
     * 🔄 CORE ORCHESTRATOR 
     * Recalcula el tema cada vez que cambie brand, mode, density o tenant.
     * Wrapped in runInInjectionContext to support Storybook initialization.
     */
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const theme = UiThemeRuntimeBuilder.build({
          brandTokens: this._brandTokens(),
          mode: this._mode(),
          density: this._density(),
          tenant: this._tenantOverrides()
        });

        this.setTheme(theme);
        this.applyToDom(theme);
        this.persist();
      });
    });
  }

  /** 
   * CAMBIO DE MARCA (Sector)
   */
  public setBrand(brandId: string): void {
    const tokens = BRAND_PRESETS[brandId.toLowerCase()];
    if (tokens) {
      this._brandTokens.set(tokens);
    }
  }

  public setBrandTokens(tokens: BrandDesignTokens): void {
    this._brandTokens.set(tokens);
  }

  /**
   * CAMBIO DE MODO (Light/Dark Engine)
   */
  public setMode(mode: UiColorMode): void {
    this._mode.set(mode);
  }

  public toggleMode(): void {
    this.setMode(this._mode() === 'light' ? 'dark' : 'light');
  }

  /**
   * CAMBIO DE DENSIDAD
   */
  public setDensity(density: UiThemeDensity): void {
    this._density.set(density);
  }

  public toggleDensity(): void {
    const densities: UiThemeDensity[] = ['compact', 'default', 'comfortable'];
    const current = densities.indexOf(this._density());
    const next = (current + 1) % densities.length;
    this.setDensity(densities[next]);
  }

  /**
   * 🔌 CARGA DESDE BACKEND
   * Carga el theme de un tenant desde la API del backend.
   */
  public loadThemeFromBackend(tenantId: string): void {
    this.backendAdapter.loadThemeForTenant(tenantId).subscribe(partialTokens => {
      if (partialTokens) {
        // Merge con tokens existentes o crear nuevos
        const currentTokens = this._brandTokens();
        const mergedTokens = { ...currentTokens, ...partialTokens };
        this._brandTokens.set(mergedTokens as BrandDesignTokens);
      } else {
        // Fallback a default
        console.warn(`[ThemeService] No theme found for tenant "${tenantId}", using default`);
        this.setBrand('vitalia');
      }
    });
  }

  /**
   * CAMBIO DE OVERRIDES (Tenant Customization)
   */
  public setTenantOverrides(overrides: TenantThemeOverrides | null): void {
    this._tenantOverrides.set(overrides);
  }

  /**
   * API: Establece un tema completo resuelto (Runtime Engine)
   */
  public setTheme(theme: UiTheme): void {
    const errors = validateTheme(theme);
    if (errors.length > 0) {
      console.error('[ThemeService] Abortando inyección: Contrato Violado.', errors);
      return;
    }
    this._theme.set(theme);
  }

  /**
   * Inicialización desde persistencia
   */
  public initTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const config = JSON.parse(saved);
        if (config.brandId) this.setBrand(config.brandId);
        if (config.mode) this._mode.set(config.mode);
        if (config.density) this._density.set(config.density);
        if (config.overrides) this._tenantOverrides.set(config.overrides);
      } catch {
        this.setBrand('vitalia');
      }
    }
  }

  /**
   * 🏗️ RESOLUCIÓN BAJO DEMANDA (Sin afectar el estado global)
   * Útil para vistas previas masivas o el Editor de Temas.
   */
  public resolveTheme(brandId: string, mode: UiColorMode, density: UiThemeDensity = 'default', tenant: TenantThemeOverrides | null = null): UiTheme {
    const brandTokens = BRAND_PRESETS[brandId.toLowerCase()] || BRAND_PRESETS['vitalia'];
    return UiThemeRuntimeBuilder.build({
      brandTokens,
      mode,
      density,
      tenant
    });
  }

  /**
   * 🎯 INYECCIÓN LOCAL (Scoping)
   * Aplica un tema a un elemento específico en lugar del root.
   */
  public applyToElement(theme: UiTheme, element: HTMLElement): void {
    const vars = mapThemeToCssVars(theme);
    Object.entries(vars).forEach(([key, value]) => {
      element.style.setProperty(key, value);
    });

    this.applyLegacySemanticAliases(theme.tokens, element);

    element.setAttribute('data-theme', theme.meta.brand.toLowerCase());
    element.setAttribute('data-mode', theme.meta.mode);
    element.setAttribute('data-density', theme.meta.density);
  }

  private applyToDom(theme: UiTheme): void {
    const root = this.document.documentElement;

    // 1. Mapeo Genérico PAL (Capa de Compatibilidad --ui-*)
    const vars = mapThemeToCssVars(theme);
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 2. Mapeo Semántico Específico (Solicitado por el usuario --brand-*, etc.)
    this.applyLegacySemanticAliases(theme.tokens, root);

    // 3. Sincronizar atributos de metadata
    root.setAttribute('data-theme', theme.meta.brand.toLowerCase());
    root.setAttribute('data-mode', theme.meta.mode);
    root.setAttribute('data-density', theme.meta.density);
    root.setAttribute('dir', theme.meta.direction);

    const body = this.document.body;
    body.className = `theme-${theme.meta.mode} density-${theme.meta.density} mat-${theme.meta.mode}-theme`;

    // CDK Overlay Sync (Very important for Dialogs/Menus)
    const overlayElement = this.overlayContainer.getContainerElement();
    if (theme.meta.mode === 'dark') {
      overlayElement.classList.add('theme-dark', 'mat-dark-theme');
      overlayElement.classList.remove('theme-light', 'mat-light-theme');
    } else {
      overlayElement.classList.add('theme-light', 'mat-light-theme');
      overlayElement.classList.remove('theme-dark', 'mat-dark-theme');
    }

    // 4. Material 3 Dynamic Injection
    this.applyMaterial3Tokens(theme, root);

    // 5. Custom Properties (from propertiesJson)
    this.applyCustomProperties(theme.tokens.customProperties, root);

    // 6. Custom CSS injection
    this.injectCustomCss(theme.customCss, theme.meta.brand);

    console.log(`[ThemeEngine] Re-resolved Material 3: ${theme.meta.brand} (${theme.meta.mode}, ${theme.meta.density})`);
  }

  /**
   * Crea alias secundarios con nombres semánticos planos para máxima facilidad de uso.
   */
  private applyLegacySemanticAliases(tokens: any, root: HTMLElement): void {
    const { brand, surface, text, feedback, typography, radius } = tokens;

    // --brand-*
    root.style.setProperty('--brand-primary', brand.primary);
    root.style.setProperty('--brand-secondary', brand.secondary);
    root.style.setProperty('--brand-accent', brand.accent);

    // --surface-*
    root.style.setProperty('--surface-background', surface.background);
    root.style.setProperty('--surface-card', surface.card);
    root.style.setProperty('--surface-input', surface.input || surface.background);
    root.style.setProperty('--surface-border', surface.border || surface.background);

    // --text-*
    root.style.setProperty('--text-primary', text.primary);
    root.style.setProperty('--text-secondary', text.secondary);
    root.style.setProperty('--text-disabled', text.disabled);
    root.style.setProperty('--text-inverse', text.inverse);

    // --feedback-*
    root.style.setProperty('--feedback-success', feedback.success);
    root.style.setProperty('--feedback-warning', feedback.warning);
    root.style.setProperty('--feedback-error', feedback.error);
    root.style.setProperty('--feedback-info', feedback.info);

    // --font-*
    root.style.setProperty('--font-family', typography.fontFamily);

    // --radius-*
    root.style.setProperty('--radius-sm', radius.sm);
    root.style.setProperty('--radius-md', radius.md);
    root.style.setProperty('--radius-lg', radius.lg);
  }

  /**
   * 🎨 MATERIAL 3 DYNAMIC MAPPING
   * Inyecta los tokens oficiales de Material 3 para que los componentes nativos se actualicen.
   */
  private applyMaterial3Tokens(theme: UiTheme, root: HTMLElement): void {
    const { brand, surface, text, feedback } = theme.tokens;

    // 1. Core Colors (System Tokens)
    root.style.setProperty('--mat-sys-primary', brand.primary);
    root.style.setProperty('--mat-sys-secondary', brand.secondary);
    root.style.setProperty('--mat-sys-tertiary', brand.accent);
    root.style.setProperty('--mat-sys-error', feedback.error);

    // 2. Surfaces & Containers
    root.style.setProperty('--mat-sys-surface', surface.background);
    root.style.setProperty('--mat-sys-surface-container', surface.card);
    root.style.setProperty('--mat-sys-surface-container-low', surface.background);
    root.style.setProperty('--mat-sys-surface-container-high', surface.elevated || surface.card);
    root.style.setProperty('--mat-sys-outline', surface.border || 'rgba(0,0,0,0.12)');

    // 3. Foregrounds (On-Colors)
    root.style.setProperty('--mat-sys-on-surface', text.primary);
    root.style.setProperty('--mat-sys-on-surface-variant', text.secondary);
    root.style.setProperty('--mat-sys-on-primary', text.inverse || '#ffffff');
    root.style.setProperty('--mat-sys-on-secondary', text.inverse || '#ffffff');
    root.style.setProperty('--mat-sys-on-error', '#ffffff');

    // 4. Mode specific rescues
    if (theme.meta.mode === 'dark') {
      root.style.setProperty('--mat-sys-surface-dim', surface.background);
      root.style.setProperty('--mat-sys-surface-bright', surface.elevated);
    }
  }

  /**
   * 💉 CUSTOM CSS INJECTION
   * Permite inyectar CSS específico por tenant de forma segura.
   */
  /**
   * 🎨 CUSTOM PROPERTIES INJECTION
   * Aplica propiedades CSS adicionales desde propertiesJson del backend.
   */
  private applyCustomProperties(properties: Record<string, string> | undefined, root: HTMLElement): void {
    if (!properties) return;

    Object.entries(properties).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  /**
   * 💉 CUSTOM CSS INJECTION
   * Permite inyectar CSS específico por tenant de forma segura.
   */
  private injectCustomCss(css: string | undefined, tenantId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const styleId = 'vitalia-tenant-custom-css';
    let styleElement = this.document.getElementById(styleId) as HTMLStyleElement;

    if (!css) {
      if (styleElement) styleElement.remove();
      return;
    }

    if (!styleElement) {
      styleElement = this.document.createElement('style');
      styleElement.id = styleId;
      this.document.head.appendChild(styleElement);
    }

    styleElement.textContent = `/* Custom CSS for ${tenantId} */\n${css}`;
  }

  private persist(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Buscar el ID de la marca actual (inverso de BRAND_PRESETS)
    const currentTokens = this._brandTokens();
    const brandId = Object.keys(BRAND_PRESETS).find(key => BRAND_PRESETS[key] === currentTokens) || 'vitalia';

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      brandId,
      mode: this._mode(),
      overrides: this._tenantOverrides()
    }));
  }

  public getActiveTheme(): UiTheme {
    return this.theme();
  }
}
