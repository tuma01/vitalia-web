import { Decorator, applicationConfig } from '@storybook/angular';
import { APP_INITIALIZER } from '@angular/core';
import { ThemeService, provideThemeService } from '../../../core/services/theme.service';
import { UiThemeRuntimeBuilder } from '../../../core/services/theme-runtime-builder';
import { TENANTS_MOCK } from './tenants.mock';
import { UiColorMode, UiThemeDensity } from '../../../core/services/ui-theme.types';

/**
 * 🎨 withTenant
 * 
 * A powerful decorator that allows simulating:
 * 1. Branding (Tenant ID)
 * 2. Color Mode (Light/Dark)
 * 3. Density (Default/Comfortable/Compact)
 * 
 * This enables "Matrix Testing" directly in Storybook sidebar.
 */
// ALIAS for backward compatibility if needed, or just rename
export const withTenantTheme = (
    tenantKey: string,
    mode: UiColorMode = 'light',
    density: UiThemeDensity = 'default'
) => {
    return (storyFn: any, context: any) => {
        const overrides = TENANTS_MOCK[tenantKey];

        if (!overrides) {
            console.warn(`[Storybook] Tenant "${tenantKey}" not found in TENANTS_MOCK.`);
        }

        return applicationConfig({
            providers: [
                ...provideThemeService(),
                {
                    provide: APP_INITIALIZER,
                    useFactory: (themeService: ThemeService) => () => {
                        if (overrides) {
                            // 1. Apply Tenant Base
                            themeService.setTenantOverrides(overrides);

                            // 2. Apply Story Overrides (simulating user preference or config)
                            if (mode) themeService.setMode(mode);
                            if (density) themeService.setDensity(density);
                        }
                        return Promise.resolve();
                    },
                    deps: [ThemeService],
                    multi: true
                }
            ]
        })(storyFn, context);
    };
};
