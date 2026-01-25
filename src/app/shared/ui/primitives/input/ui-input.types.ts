/**
 * Tipos de input soportados
 */
export type UiInputType =
    | 'text'      // Texto general
    | 'email'     // Email
    | 'password'  // Contraseña
    | 'number'    // Número
    | 'search';   // Búsqueda

/**
 * Tamaños del input
 */
export type UiInputSize =
    | 'sm'   // 32px altura
    | 'md'   // 40px altura (default)
    | 'lg';  // 48px altura

/**
 * Configuración del input
 */
export interface UiInputConfig {
    type?: UiInputType;
    size?: UiInputSize;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    autocomplete?: 'on' | 'off';
    maxlength?: number;
}
