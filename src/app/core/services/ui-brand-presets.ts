import { BrandDesignTokens } from './ui-theme.types';

/**
 * 🎭 BRAND_PRESETS
 * 
 * Contratos de identidad visual base por sector.
 */
export const BRAND_PRESETS: Record<string, BrandDesignTokens> = {
    'vitalia': {
        brand: {
            primary: '#0055A4',
            secondary: '#004482',
            accent: '#003361'
        },
        surface: {
            background: '#F8FAFC',
            card: '#FFFFFF',
            elevated: '#FFFFFF',
            overlay: 'rgba(0,0,0,0.4)',
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
            fontFamily: 'Inter, sans-serif'
        },
        radius: {
            sm: '4px',
            md: '8px',
            lg: '12px',
            pill: '999px'
        }
    },
    'school': {
        brand: {
            primary: '#E11D48',
            secondary: '#BE123C',
            accent: '#9F1239'
        },
        surface: {
            background: '#FFF1F2',
            card: '#FFFFFF',
            elevated: '#FFFFFF',
            overlay: 'rgba(0,0,0,0.3)',
            border: '#FFE4E6'
        },
        text: {
            primary: '#4C0519',
            secondary: '#9F1239',
            disabled: '#FDA4AF',
            inverse: '#FFFFFF',
            link: '#E11D48'
        },
        feedback: {
            success: '#16A34A',
            warning: '#F59E0B',
            error: '#E11D48',
            info: '#3B82F6'
        },
        typography: {
            fontFamily: 'Outfit, sans-serif'
        },
        radius: {
            sm: '8px',
            md: '16px',
            lg: '24px',
            pill: '999px'
        }
    }
};
