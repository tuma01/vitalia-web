import { UiTheme } from './ui-theme.types';

type Primitive = string | number;

/**
 * 🛠️ mapThemeToCssVars
 * 
 * Convierte los tokens del sistema en variables CSS.
 * Incluye una Capa de Compatibilidad para no romper estilos existentes.
 */
export function mapThemeToCssVars(
    theme: UiTheme,
    prefix = '--ui'
): Record<string, string> {
    const result: Record<string, string> = {};

    // 1. Mapear Tokens (Semántica Nueva)
    walk(theme.tokens, [], result, prefix);

    // 2. Mapear Metadata
    result[`${prefix}-meta-mode`] = theme.meta.mode;
    result[`${prefix}-meta-brand`] = theme.meta.brand;

    return result;
}

function walk(
    obj: unknown,
    path: string[],
    result: Record<string, string>,
    prefix: string
) {
    if (obj == null) return;

    if (isPrimitive(obj)) {
        const varName = `${prefix}-${path.join('-')}`;
        result[varName] = String(obj);

        // 🔄 CAPA DE COMPATIBILIDAD (Legacy Aliases)
        // Mapea la nueva estructura a los nombres que los componentes ya usan.
        if (path[0] === 'brand') {
            const sub = path.slice(1).join('-');
            result[`${prefix}-color-action-${sub}`] = String(obj);
        }
        if (path[0] === 'surface' || path[0] === 'text') {
            result[`${prefix}-color-${path.join('-')}`] = String(obj);
        }
        if (path[0] === 'feedback') {
            const sub = path.slice(1).join('-');
            result[`${prefix}-color-state-${sub}`] = String(obj);
        }
        // Tipografía y otros
        if (path[0] === 'typography' && path[1] === 'fontFamily') {
            result[`${prefix}-typography-font-family-base`] = String(obj);
        }

        // Layout & Density layer (Legacy support)
        if (path[0] === 'layout') {
            if (path[1] === 'control-height') {
                result[`${prefix}-size-md`] = String(obj);
                result[`${prefix}-input-height-md`] = String(obj);
                result[`${prefix}-button-height-md`] = String(obj);
            }
            if (path[1] === 'form-field-height') {
                result[`${prefix}-size-lg`] = String(obj);
                result[`${prefix}-input-height-lg`] = String(obj);
                result[`${prefix}-button-height-lg`] = String(obj);
            }
        }

        if (path[0] === 'spacing' && path[1] === 'unit') {
            const unit = Number(obj);
            result[`${prefix}-space-xs`] = `${unit * 1}px`;
            result[`${prefix}-space-sm`] = `${unit * 2}px`;
            result[`${prefix}-space-md`] = `${unit * 4}px`;
            result[`${prefix}-space-lg`] = `${unit * 8}px`;
            result[`${prefix}-space-xl`] = `${unit * 12}px`;
        }

        // Auto-generación de canales RGB para efectos de opacidad
        if (typeof obj === 'string' && obj.startsWith('#')) {
            const rgb = hexToRgb(obj);
            if (rgb) {
                result[`${varName}-rgb`] = rgb;
                // También para el alias legacy
                if (path[0] === 'brand') result[`${prefix}-color-action-${path.slice(1).join('-')}-rgb`] = rgb;
            }
        }
        return;
    }

    if (typeof obj === 'object' && !Array.isArray(obj)) {
        Object.entries(obj).forEach(([key, value]) => {
            walk(value, [...path, normalizeKey(key)], result, prefix);
        });
    }
}

function normalizeKey(key: string): string {
    return key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function isPrimitive(value: unknown): value is Primitive {
    return typeof value === 'string' || typeof value === 'number';
}

function hexToRgb(hex: string): string | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : null;
}
