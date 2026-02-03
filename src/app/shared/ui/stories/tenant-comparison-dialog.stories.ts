import { Component, Input, Inject, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UiButtonComponent } from '../primitives/button/ui-button.component';
import { UiDialogService } from '../components/dialog/ui-dialog.service';
import { PalOldDialogComponent } from '../../../core/pal-old/pal-old-dialog.component';

// Mock Data
import { TENANTS_MOCK } from './tenants.mock';
import { UiThemeRuntimeBuilder } from '../../../core/services/theme-runtime-builder';
import { mapThemeToCssVars } from '../../../core/services/theme-mapper';
import { BRAND_PRESETS } from '../../../core/services/ui-brand-presets';

@Component({
    selector: 'dialog-comparison-wrapper',
    standalone: true,
    imports: [CommonModule, UiButtonComponent],
    template: `
    <div style="display:flex; gap: 2rem; padding: 2rem; overflow-x: auto;">

      <!-- Tenant A -->
      <div class="tenant-panel" [style]="getStyle('tenantA')" 
           style="flex:1; min-width: 300px; padding: 20px; border: 1px solid #ccc; background: var(--ui-background-default); color: var(--ui-text-primary);">
        <h3>Tenant A (M3)</h3>
        <ui-button (click)="openDialog('theme-tenant-A')">Open Dialog</ui-button>
        <p *ngIf="resultA !== undefined">Result: {{resultA}}</p>
      </div>

       <!-- Tenant B -->
       <div class="tenant-panel" [style]="getStyle('tenantB')" 
           style="flex:1; min-width: 300px; padding: 20px; border: 1px solid #ccc; background: var(--ui-background-default); color: var(--ui-text-primary);">
        <h3>Tenant B (M3)</h3>
        <ui-button (click)="openDialog('theme-tenant-B')">Open Dialog</ui-button>
        <p *ngIf="resultB !== undefined">Result: {{resultB}}</p>
      </div>

      <!-- Legacy -->
      <div class="legacy-panel" style="flex:1; min-width: 300px; padding: 20px; border: 1px solid #ccc; background: #f5f5f5;">
        <h3>PAL Old</h3>
        <button (click)="openLegacy()" style="padding: 8px 16px; cursor: pointer;">Open Legacy Dialog</button>
        <p *ngIf="resultOld !== undefined">Result: {{resultOld}}</p>
      </div>

    </div>
  `
})
class DialogComparisonWrapperComponent {
    resultA?: boolean;
    resultB?: boolean;
    resultOld?: boolean;

    constructor(private dialogService: UiDialogService, private matDialog: MatDialog) {
        this.injectTenantStyles();
    }

    getStyle(tenant: string) {
        // Only used for the dashboard panels themselves
        return this.getTenantVars(tenant);
    }

    getTenantVars(tenant: string) {
        const theme = UiThemeRuntimeBuilder.build({
            brandTokens: BRAND_PRESETS['vitalia'],
            mode: tenant === 'tenantB' ? 'dark' : 'light',
            density: 'default', // Density on dialogs is usually handled via global class, but we can try
            tenant: TENANTS_MOCK[tenant]
        });
        return mapThemeToCssVars(theme);
    }

    injectTenantStyles() {
        const styleId = 'storybook-dialog-comparison-styles';
        if (document.getElementById(styleId)) return;

        const tenantA = this.getTenantVars('tenantA');
        const tenantB = this.getTenantVars('tenantB');

        let css = `
            .theme-tenant-A {
                ${Object.entries(tenantA).map(([k, v]) => `${k}: ${v};`).join('\n')}
                --ui-dialog-bg: var(--mat-sys-surface-container-high); /* Ensure mapping */
            }
            .theme-tenant-B {
                color-scheme: dark;
                ${Object.entries(tenantB).map(([k, v]) => `${k}: ${v};`).join('\n')}
                --ui-dialog-bg: var(--mat-sys-surface-container-high);
            }
            /* Ensure overlays inherit tokens */
            .theme-tenant-A .mat-mdc-dialog-container,
            .theme-tenant-B .mat-mdc-dialog-container {
                /* background-color: var(--mat-sys-surface-container-high) !important; */
                /* Color handling is inside the component now, but we need tokens available */
            }
        `;

        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    openDialog(themeClass: string) {
        // Pass the generated theme class to the dialog panel
        this.dialogService.confirm({
            title: 'Confirmation',
            message: `This uses the standard M3 implementation with ${themeClass}.`,
            confirmText: 'Yes, Proceed'
        }, {
            panelClass: ['ui-dialog-panel', themeClass]
        }).subscribe(r => {
            if (themeClass.includes('tenantA')) this.resultA = r;
            else this.resultB = r;
        });
    }

    openLegacy() {
        this.matDialog.open(PalOldDialogComponent, {
            data: {
                title: 'Legacy Confirmation',
                message: 'This is the old PAL dialog style.',
                confirmText: 'OK'
            }
        }).afterClosed().subscribe(r => this.resultOld = r);
    }
}

const meta: Meta<DialogComparisonWrapperComponent> = {
    title: 'PAL/Demos/Final/Dialog Comparison',
    component: DialogComparisonWrapperComponent,
    decorators: [
        applicationConfig({
            providers: [
                importProvidersFrom(MatDialogModule, BrowserAnimationsModule),
                UiDialogService
            ]
        })
    ]
};
export default meta;

export const Comparison: StoryObj<DialogComparisonWrapperComponent> = {};
