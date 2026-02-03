import { UiTheme } from './ui-theme.types';

export type ValidationError = {
    path: string;
    message: string;
};

/**
 * 🛡️ validateTheme
 * 
 * Asegura que el contrato de tokens y metadata sea válido.
 */
export function validateTheme(theme: UiTheme): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!theme) {
        errors.push({ path: 'root', message: 'Tema es nulo' });
        return errors;
    }

    // 1. Validar Metadata
    if (!theme.meta?.brand) errors.push({ path: 'meta.brand', message: 'Falta marca en metadata' });
    if (!['light', 'dark'].includes(theme.meta?.mode)) {
        errors.push({ path: 'meta.mode', message: 'Modo debe ser light o dark' });
    }

    // 2. Validar Tokens Críticos (Smoke Test)
    const tokens = theme.tokens;
    if (!tokens) {
        errors.push({ path: 'tokens', message: 'Faltan tokens en el tema' });
        return errors;
    }

    if (!tokens.brand?.primary) errors.push({ path: 'tokens.brand.primary', message: 'Falta color primario' });
    if (!tokens.surface?.background) errors.push({ path: 'tokens.surface.background', message: 'Falta color de fondo' });
    if (!tokens.text?.primary) errors.push({ path: 'tokens.text.primary', message: 'Falta color de texto primario' });

    return errors;
}
