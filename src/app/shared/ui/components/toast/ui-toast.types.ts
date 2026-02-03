export type UiToastType = 'success' | 'error' | 'info' | 'warning';
export type UiToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface UiToastConfig {
    /** Toast type/variant */
    type?: UiToastType;
    /** Title of the toast */
    title?: string;
    /** Message body */
    message: string;
    /** Duration in ms before auto-dismiss (0 for persistent) */
    duration?: number;
    /** Show close button */
    showClose?: boolean;
    /** Position on screen */
    position?: UiToastPosition;
    /** Custom icon to override the default for the type */
    icon?: string;
    /** Custom data for extensions */
    data?: any;
    /** Component-specific i18n */
    i18n?: {
        closeAriaLabel?: string;
    };
    /** Optional custom panel class(es) */
    panelClass?: string | string[];
}
