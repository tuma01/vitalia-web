import { TenantThemeOverrides } from '../../../core/services/ui-theme.types';

export const TENANTS_MOCK: Record<string, TenantThemeOverrides & { name?: string }> = {
  tenantA: {
    name: 'Tenant A (Corporate)',
    primaryColor: '#6200ee',
    secondaryColor: '#03dac6',
    warnColor: '#b00020',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'Roboto, sans-serif',
    themeMode: 'light',
    customCss: `
      .mat-mdc-button-base { 
        border-radius: 12px !important; 
        font-weight: 500 !important; 
      }
    `
  },
  tenantB: {
    name: 'Tenant B (Tech)',
    primaryColor: '#ff5722',
    secondaryColor: '#ffc107',
    warnColor: '#f44336',
    backgroundColor: '#121212',
    textColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    themeMode: 'dark',
    customCss: `
      .mat-mdc-button-base { 
        text-transform: uppercase !important; 
        letter-spacing: 1px !important; 
      }
    `
  },
  clinica_verde: {
    name: 'Clínica Verde',
    primaryColor: '#2e7d32',
    secondaryColor: '#81c784',
    backgroundColor: '#f1f8e9',
    textColor: '#1b5e20',
    fontFamily: 'Roboto, sans-serif',
    themeMode: 'light',
    customCss: '.mat-mdc-button-base { border-radius: 4px !important; text-transform: uppercase; }'
  },
  hospital_moderno: {
    name: 'Hospital Moderno',
    primaryColor: '#673ab7',
    secondaryColor: '#ffd600',
    backgroundColor: '#fafafa',
    textColor: '#311b92',
    fontFamily: 'Outfit, sans-serif',
    themeMode: 'light',
    customCss: '.mat-mdc-form-field-appearance-outline .mat-mdc-text-field-wrapper { border-radius: 24px !important; }'
  },
  dark_premium: {
    name: 'Dark Premium',
    primaryColor: '#bb86fc',
    secondaryColor: '#03dac6',
    backgroundColor: '#121212',
    textColor: '#e0e0e0',
    fontFamily: 'Inter, sans-serif',
    themeMode: 'dark'
  }
};
