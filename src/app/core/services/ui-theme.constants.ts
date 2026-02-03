import { UiTheme } from './ui-theme.types';

/**
 * 🧬 PAL_DEFAULT_THEME (ADN VISUAL DEL PAL)
 * 
 * Este objeto representa las leyes físicas y estéticas base del PAL.
 */
export const PAL_DEFAULT_THEME: UiTheme = {
    meta: {
        name: 'pal-default',
        version: '1.0.0',
        brand: 'PAL',
        mode: 'light',
        density: 'comfortable',
        direction: 'ltr'
    },

    tokens: {
        brand: {
            primary: '#2563EB',
            secondary: '#1D4ED8',
            accent: '#1E40AF'
        },
        surface: {
            background: '#F8FAFC',
            card: '#FFFFFF',
            elevated: '#FFFFFF',
            overlay: 'rgba(0,0,0,0.4)',
            input: '#FFFFFF',
            border: '#E2E8F0'
        },
        text: {
            primary: '#0F172A',
            secondary: '#475569',
            disabled: '#94A3B8',
            inverse: '#FFFFFF',
            link: '#2563EB'
        },
        feedback: {
            success: '#16A34A',
            warning: '#D97706',
            error: '#DC2626',
            info: '#0284C7'
        },
        typography: {
            fontFamily: 'Inter, sans-serif',
            scale: {
                xs: '12px',
                sm: '14px',
                md: '16px',
                lg: '18px',
                xl: '20px',
                '2xl': '24px'
            },
            weight: {
                regular: 400,
                medium: 500,
                bold: 700
            },
            lineHeight: {
                tight: 1.2,
                normal: 1.5,
                relaxed: 1.75
            }
        },
        radius: {
            sm: '4px',
            md: '8px',
            lg: '12px',
            pill: '999px'
        },
        spacing: {
            unit: 4,
            scale: [0, 1, 2, 3, 4, 6, 8, 12, 16]
        },
        elevation: {
            level0: 'none',
            level1: '0 1px 2px rgba(0,0,0,0.05)',
            level2: '0 4px 6px rgba(0,0,0,0.1)',
            level3: '0 10px 15px rgba(0,0,0,0.15)'
        },
        motion: {
            duration: { fast: '120ms', normal: '200ms', slow: '320ms' },
            easing: {
                standard: 'cubic-bezier(0.2, 0, 0, 1)',
                emphasized: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }
        },
        layout: {
            containerMaxWidth: '1280px',
            formFieldHeight: '56px',
            controlHeight: '40px'
        },
        zIndex: {
            dropdown: 1000,
            overlay: 1100,
            modal: 1200,
            toast: 1300,
            tooltip: 1400
        }
    },
    customCss: '',
    properties: {}
};
