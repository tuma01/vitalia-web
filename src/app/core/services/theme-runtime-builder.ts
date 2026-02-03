import {
    UiTheme,
    UiColorMode,
    UiThemeDensity,
    TenantThemeOverrides,
    BrandDesignTokens,
    DeepPartial
} from './ui-theme.types';
import { PAL_DEFAULT_THEME } from './ui-theme.constants';
import { BRAND_PRESETS } from './ui-brand-presets';

/**
 * 🧬 UiThemeRuntimeBuilder
 * 
 * Motor de resolución de temas de 3 capas:
 * 1. Base (PAL DNA)
 * 2. Brand Identity (Light/Dark Engine)
 * 3. Tenant Overrides (Safe Customization)
 */
export class UiThemeRuntimeBuilder {

    /**
     * Construye el tema final resuelto (Motor Puro).
     */
    static build(config: {
        brandTokens: BrandDesignTokens,
        mode: UiColorMode,
        density?: UiThemeDensity,
        tenant?: TenantThemeOverrides | null
    }): UiTheme {
        const { brandTokens, mode, density = 'default', tenant } = config;

        // 1. Aplicar Motor de Modo (Light/Dark Layer)
        const modeAdjusted = this.applyMode(brandTokens, mode);

        // 2. Aplicar Densidad (Layout & Spacing Layer)
        const densityAdjusted = this.applyDensity(modeAdjusted, density);

        // 3. Aplicar Overrides del Tenant (Safe Overrides)
        const withTenant = this.applyTenantOverrides(densityAdjusted, tenant || undefined);

        // 4. Fusionar con ADN Base de Infraestructura (Leyes físicas PAL)
        const resolvedTokens = this.deepMerge(PAL_DEFAULT_THEME.tokens, withTenant);

        return {
            meta: {
                ...PAL_DEFAULT_THEME.meta,
                name: `resolved-${mode}-${density}`,
                brand: 'RESOLVED',
                mode: mode,
                density: density
            },
            tokens: resolvedTokens,
            customCss: tenant?.customCss,
            properties: tenant?.propertiesJson
        };
    }

    /**
     * 📐 Density Engine
     * Ajusta las dimensiones físicas y el ritmo visual del sistema.
     */
    private static applyDensity(tokens: BrandDesignTokens, density: UiThemeDensity): BrandDesignTokens {
        const layout = tokens.layout || PAL_DEFAULT_THEME.tokens.layout;
        const spacing = tokens.spacing || PAL_DEFAULT_THEME.tokens.spacing;

        const densityMap: Record<UiThemeDensity, { unit: number, controlHeight: string, formFieldHeight: string }> = {
            'compact': { unit: 2, controlHeight: '32px', formFieldHeight: '48px' },
            'default': { unit: 4, controlHeight: '40px', formFieldHeight: '56px' },
            'comfortable': { unit: 6, controlHeight: '48px', formFieldHeight: '64px' }
        };

        const config = densityMap[density];

        return {
            ...tokens,
            spacing: {
                ...spacing!,
                unit: config.unit
            },
            layout: {
                ...layout!,
                controlHeight: config.controlHeight,
                formFieldHeight: config.formFieldHeight
            }
        };
    }

    /**
     * 🌗 Light/Dark Engine
     * Proyecta el estado visual sobre los tokens de marca.
     */
    private static applyMode(tokens: BrandDesignTokens, mode: UiColorMode): BrandDesignTokens {
        if (mode === 'light') return { ...tokens };

        // Proyección Dark Mode: No toca primary/secondary brand, solo superficies y texto.
        return {
            ...tokens,
            surface: {
                ...tokens.surface,
                background: '#0F172A',
                card: '#1E293B',
                elevated: '#334155',
                overlay: 'rgba(0,0,0,0.7)',
                input: '#0F172A',
                border: '#334155'
            },
            text: {
                ...tokens.text,
                primary: '#F8FAFC',
                secondary: '#94A3B8',
                disabled: '#475569',
                inverse: '#000000',
                link: '#38BDF8'
            }
        };
    }

    /**
     * 🏢 Tenant Override Layer
     * Aplica personalizaciones limitadas y seguras del cliente.
     */
    private static applyTenantOverrides(
        tokens: BrandDesignTokens,
        tenant?: TenantThemeOverrides
    ): BrandDesignTokens {
        if (!tenant) return tokens;

        return {
            ...tokens,
            brand: {
                ...tokens.brand,
                primary: tenant.primaryColor ?? tokens.brand.primary,
                secondary: tenant.secondaryColor ?? tokens.brand.secondary,
                accent: tenant.accentColor ?? tokens.brand.accent,
            },
            surface: {
                ...tokens.surface,
                background: tenant.backgroundColor ?? tokens.surface.background,
            },
            text: {
                ...tokens.text,
                primary: tenant.textColor ?? tokens.text.primary,
            },
            typography: {
                ...tokens.typography,
                fontFamily: tenant.fontFamily ?? tokens.typography.fontFamily,
            }
        };
    }

    /**
     * Utilitario de fusión profunda recursiva compatible con DeepPartial.
     */
    public static deepMerge(target: any, source: any): any {
        const result = { ...target };
        for (const key in source) {
            const sourceVal = source[key];
            if (sourceVal === undefined || sourceVal === null) continue;

            if (typeof sourceVal === 'object' && !Array.isArray(sourceVal)) {
                result[key] = this.deepMerge(target[key] || {}, sourceVal);
            } else {
                result[key] = sourceVal;
            }
        }
        return result;
    }
}
