import { Component, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UiButtonComponent } from '../primitives/button/ui-button.component';
import { UiToastService } from '../components/toast/ui-toast.service';
import { PalOldToastComponent } from '../../../core/pal-old/pal-old-toast.component';
import { UiThemeRuntimeBuilder } from '../../../core/services/theme-runtime-builder';
import { mapThemeToCssVars } from '../../../core/services/theme-mapper';
import { BRAND_PRESETS } from '../../../core/services/ui-brand-presets';
import { TENANTS_MOCK } from './tenants.mock';

@Component({
    selector: 'toast-comparison-wrapper',
    standalone: true,
    imports: [CommonModule, UiButtonComponent, MatSnackBarModule, PalOldToastComponent],
    template: `
    <div style="display:flex; gap: 2rem; padding: 2rem; overflow-x: auto;">
      <!-- Tenant A -->
      <div class="tenant-panel" [style]="getTenantVars('tenantA')" 
           style="flex:1; min-width: 300px; padding: 20px; border: 1px solid #ccc; background: var(--ui-background-default); color: var(--ui-text-primary);">
        <h3>Tenant A (M3)</h3>
        <div style="display:flex; gap: 8px; flex-wrap: wrap;">
             <ui-button (click)="openToast('success', 'tenantA')">Success</ui-button>
             <ui-button variant="danger" (click)="openToast('error', 'tenantA')">Error</ui-button>
             <ui-button variant="secondary" (click)="openToast('info', 'tenantA')">Info</ui-button>
        </div>
      </div>

       <!-- Tenant B -->
       <div class="tenant-panel" [style]="getTenantVars('tenantB')" 
           style="flex:1; min-width: 300px; padding: 20px; border: 1px solid #ccc; background: var(--ui-background-default); color: var(--ui-text-primary);">
        <h3>Tenant B (M3)</h3>
         <div style="display:flex; gap: 8px; flex-wrap: wrap;">
             <ui-button (click)="openToast('success', 'tenantB')">Success</ui-button>
             <ui-button variant="danger" (click)="openToast('error', 'tenantB')">Error</ui-button>
             <ui-button variant="secondary" (click)="openToast('info', 'tenantB')">Info</ui-button>
        </div>
      </div>

      <!-- Legacy -->
      <div class="legacy-panel" style="flex:1; min-width: 300px; padding: 20px; border: 1px solid #ccc; background: #f5f5f5;">
        <h3>PAL Old</h3>
        <div style="display:flex; gap: 8px; flex-wrap: wrap;">
            <button (click)="showLegacy('success')">Legacy Success</button>
            <button (click)="showLegacy('error')">Legacy Error</button>
        </div>
        <div *ngIf="legacyToast" style="margin-top: 20px;">
            <pal-old-toast [data]="legacyToast"></pal-old-toast>
            <small>(Normally appears top-right)</small>
        </div>
      </div>
    </div>
  `
})
class ToastComparisonWrapperComponent {
    legacyToast: any = null;

    constructor(private toastService: UiToastService) {
        this.injectTenantStyles();
    }

    getTenantVars(tenant: string) {
        const theme = UiThemeRuntimeBuilder.build({
            brandTokens: BRAND_PRESETS['vitalia'],
            mode: tenant === 'tenantB' ? 'dark' : 'light',
            density: 'default',
            tenant: TENANTS_MOCK[tenant]
        });
        return mapThemeToCssVars(theme);
    }

    injectTenantStyles() {
        const styleId = 'storybook-toast-comparison-styles';
        if (document.getElementById(styleId)) return;

        const tenantA = this.getTenantVars('tenantA');
        const tenantB = this.getTenantVars('tenantB');

        let css = `
      .theme-tenant-A {
        ${Object.entries(tenantA).map(([k, v]) => `${k}: ${v};`).join('\n')}
      }
      .theme-tenant-B {
        color-scheme: dark;
        ${Object.entries(tenantB).map(([k, v]) => `${k}: ${v};`).join('\n')}
      }
      /* Ensure overlays inherit tokens by panelClass context? 
         MatSnackBar is global. We need to style it uniquely.
         Wait, passing 'panelClass' to SnackBar puts the class on the container.
         We can use that class to scope the variables!
      */
      .mat-mdc-snack-bar-container.theme-tenant-A {
         ${Object.entries(tenantA).map(([k, v]) => `${k}: ${v};`).join('\n')}
      }
      .mat-mdc-snack-bar-container.theme-tenant-B {
         ${Object.entries(tenantB).map(([k, v]) => `${k}: ${v};`).join('\n')}
      }
    `;

        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    openToast(type: 'success' | 'error' | 'info', tenant: string) {
        // We need to inject the tenant theme class into the SnackBar config
        // UiToastService handles 'panelClass' internally but exposes config.
        // But we mapped 'type' to a panel class.
        // We need to modify UiToastService to allow merging panelClasses or handle it here?
        // UiToastService.show takes config: UiToastConfig which doesn't expose panelClass directly?
        // Wait, let's check UiToastService.show...
        // It sets panelClass: ['ui-toast-panel', `ui-toast-${config.type}`].
        // It DOES NOT allow us to append extra panel classes via standard config unless we add a property.

        // FIX: The refactor of UiToastService should probably accept 'panelClass' override or we assume 
        // the OverlayContainer (Storybook) context. 
        // But SnackBar is global.

        // Let's modify UiToastService to allow extraneous config or panelClass pass-through.
        // OR, since this is a demo, we can just hope the service exposes something.
        // The current refactor didn't expose 'panelClass' in UiToastConfig.
        // I should update UiToastConfig to include 'panelClass'?

        // For now, I will assume I can't easily scope it without modifying the service.
        // I will Modify UiToastService on the fly? No.

        // Let's rely on the service to support 'panelClass' in config?
        // UiToastConfig is: { type, message, title, etc... }
        // I can add `extraPanelClass` to UiToastConfig?

        // Actually, let's stick to the plan: The service manages the toast.
        // In a real app, the theme is global. In this story, it's problematic.

        // Strategy: Toggle the document body class? No, that messes up the comparison.
        // Strategy: Update UiToastService to accept `panelClass` in `config`.

        this.toastService.show({
            type,
            message: `This is a ${type} toast for ${tenant}`,
            title: type.toUpperCase(),
            panelClass: `theme-${tenant}`
        });

        // I need to update UiToastService to merge extra panel classes.
    }

    showLegacy(type: 'success' | 'error') {
        this.legacyToast = {
            type,
            title: type === 'success' ? 'Success' : 'Error',
            message: 'Legacy PAL toast message.'
        };
        setTimeout(() => this.legacyToast = null, 3000);
    }
}

const meta: Meta<ToastComparisonWrapperComponent> = {
    title: 'Shared/UI/Toast Comparison',
    component: ToastComparisonWrapperComponent,
    decorators: [
        applicationConfig({
            providers: [
                importProvidersFrom(MatSnackBarModule, BrowserAnimationsModule),
                UiToastService
            ]
        })
    ]
};
export default meta;

export const Comparison: StoryObj<ToastComparisonWrapperComponent> = {};
