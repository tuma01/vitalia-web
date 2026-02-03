import { ThemeDto } from '../src/app/api/models/theme-dto';

/**
 * 🎭 Mock Backend para Storybook
 * 
 * Simula la API de themes del backend para desarrollo y testing en Storybook.
 * Permite probar diferentes configuraciones de tenants sin necesidad del backend real.
 * Usa el ThemeDto oficial generado por ng-openapi-gen.
 */

export const MOCK_THEMES: Record<string, ThemeDto> = {
    vitalia: {
        id: 1,
        code: 'VITALIA_DEFAULT',
        name: 'Vitalia Health Theme',
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
        accentColor: '#9c27b0',
        logoUrl: 'https://via.placeholder.com/150x50/1976d2/ffffff?text=Vitalia',
        themeMode: 'LIGHT',
        active: true,
        allowCustomCss: false
    },

    school: {
        id: 2,
        code: 'SCHOOL_DEFAULT',
        name: 'School Management Theme',
        primaryColor: '#4caf50',
        secondaryColor: '#ff9800',
        accentColor: '#2196f3',
        logoUrl: 'https://via.placeholder.com/150x50/4caf50/ffffff?text=School',
        customCss: `
      .mat-mdc-button {
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    `,
        propertiesJson: JSON.stringify({
            '--custom-header-height': '72px',
            '--custom-sidebar-width': '260px',
            '--custom-font-brand': '"Roboto", sans-serif'
        }),
        themeMode: 'LIGHT',
        active: true,
        allowCustomCss: true
    },

    clinic: {
        id: 3,
        code: 'CLINIC_DEFAULT',
        name: 'Clinic Pro Theme',
        primaryColor: '#9c27b0',
        secondaryColor: '#00bcd4',
        accentColor: '#ff5722',
        backgroundColor: '#fafafa',
        textColor: '#212121',
        logoUrl: 'https://via.placeholder.com/150x50/9c27b0/ffffff?text=Clinic',
        fontFamily: '"Montserrat", sans-serif',
        customCss: `
      .mat-mdc-card {
        border-radius: 16px;
      }
      .mat-mdc-form-field {
        --mat-form-field-container-height: 56px;
      }
    `,
        propertiesJson: JSON.stringify({
            '--custom-header-height': '80px',
            '--custom-sidebar-width': '280px',
            '--custom-font-brand': '"Montserrat", sans-serif',
            '--custom-card-shadow': '0 4px 12px rgba(0,0,0,0.1)'
        }),
        themeMode: 'LIGHT',
        active: true,
        allowCustomCss: true
    },

    'vitalia-dark': {
        id: 4,
        code: 'VITALIA_DARK',
        name: 'Vitalia Health Dark Theme',
        primaryColor: '#64b5f6',
        secondaryColor: '#f48fb1',
        accentColor: '#ce93d8',
        backgroundColor: '#121212',
        textColor: '#ffffff',
        logoUrl: 'https://via.placeholder.com/150x50/64b5f6/000000?text=Vitalia',
        themeMode: 'DARK',
        active: true,
        allowCustomCss: false
    }
};

/**
 * Simula una llamada HTTP GET al endpoint de themes
 */
export function getMockTheme(tenantId: string): ThemeDto | null {
    return MOCK_THEMES[tenantId] || null;
}

/**
 * Obtiene lista de todos los tenants disponibles
 */
export function getMockTenantList(): string[] {
    return Object.keys(MOCK_THEMES);
}
