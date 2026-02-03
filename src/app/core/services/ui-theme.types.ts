export type UiThemeDensity = 'default' | 'comfortable' | 'compact';

/**
 * 🏷️ 1. META (Infraestructura)
 */
export interface UiThemeMeta {
    name: string;      // 'PAL_DEFAULT', 'VITALIA_HEALTH', etc.
    version: string;
    brand: string;     // 'VITALIA', 'SCHOOL', etc.
    mode: UiColorMode; // 'light' | 'dark'
    density: UiThemeDensity;
    direction: 'ltr' | 'rtl';
}

/**
 * 🎭 BrandDesignTokens (La Identidad Visual)
 * 
 * Este objeto agrupa los tokens que definen la "piel" de una marca.
 * Incluye dimensiones estéticas y funcionales.
 */
export interface BrandDesignTokens {
    // 🆕 Backend Integration Fields
    name?: string;          // Theme name from backend
    logoUrl?: string;       // Logo URL for tenant branding
    customCss?: string;     // Custom CSS from backend
    customProperties?: Record<string, string>; // Additional CSS variables from propertiesJson

    brand: {
        primary: string;
        secondary: string;
        accent: string;
    };

    surface: {
        background: string;
        card: string;
        elevated: string;
        overlay: string;
        input?: string; // Especializado para formularios
        border?: string; // Borde por defecto para superficies
    };

    text: {
        primary: string;
        secondary: string;
        disabled: string;
        inverse: string;
        link?: string;
    };

    feedback: {
        success: string;
        warning: string;
        error: string;
        info: string;
    };

    typography: {
        fontFamily: string;
        // Mantenemos soporte para escala PAL completa
        scale?: UiTypographySystem['scale'];
        weight?: UiTypographySystem['weight'];
        lineHeight?: UiTypographySystem['lineHeight'];
    };

    radius: {
        sm: string;
        md: string;
        lg: string;
        pill?: string;
    };

    // Dimensiones de Infraestructura PAL (Opcionales por preset)
    spacing?: UiSpacingSystem;
    elevation?: UiElevationSystem;
    motion?: UiMotionSystem;
    layout?: UiLayoutSystem;
    zIndex?: UiZIndexSystem;
}

/**
 * ✍️ 3. TYPOGRAPHY SYSTEM
 */
export interface UiTypographySystem {
    fontFamily: {
        base: string;
        mono: string;
    };

    scale: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
    };

    weight: {
        regular: number;
        medium: number;
        bold: number;
    };

    lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
    };
}

/**
 * 🧱 4. SPACING SYSTEM (Geométrico)
 */
export interface UiSpacingSystem {
    unit: number; // e.g., 4px grid
    scale: number[]; // e.g., [0,1,2,3,4,6,8,12,16]
}

/**
 * 🧩 5. RADIUS SYSTEM
 */
export interface UiRadiusSystem {
    none: string;
    sm: string;
    md: string;
    lg: string;
    pill: string;
}

/**
 * 🌫️ 6. ELEVATION SYSTEM
 */
export interface UiElevationSystem {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
}

/**
 * 🏃 7. MOTION SYSTEM
 */
export interface UiMotionSystem {
    duration: {
        fast: string;
        normal: string;
        slow: string;
    };

    easing: {
        standard: string;
        emphasized: string;
    };
}

/**
 * 📐 8. LAYOUT SYSTEM
 */
export interface UiLayoutSystem {
    containerMaxWidth: string;
    formFieldHeight: string;
    controlHeight: string;
}

/**
 * 🔝 9. Z-INDEX SYSTEM
 */
export interface UiZIndexSystem {
    dropdown: number;
    overlay: number;
    modal: number;
    toast: number;
    tooltip: number;
}

/**
 * 🧬 UiTheme (Contrato Maestro Resuelto)
 */
export interface UiTheme {
    meta: UiThemeMeta;
    tokens: BrandDesignTokens;
    customCss?: string;
    properties?: Record<string, any>;
}

/**
 * 🚀 UiThemeRuntime (Estado de Final de Ejecución)
 */
export interface UiThemeRuntime {
    mode: UiColorMode;
    brandId: string;
    tokens: BrandDesignTokens;
}

/**
 * 🏢 TenantThemeOverrides
 * 
 * Representa los ajustes finos que un administrador puede realizar
 * sobre el tema base de su tenant.
 */
export interface TenantThemeOverrides {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    warnColor?: string;
    linkColor?: string;
    buttonTextColor?: string;
    fontFamily?: string;
    themeMode?: UiColorMode;
    customCss?: string;
    propertiesJson?: Record<string, any>;
}

export type UiColorMode = 'light' | 'dark';

/**
 * Utilitario para actualizaciones parciales profundas
 */
export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
