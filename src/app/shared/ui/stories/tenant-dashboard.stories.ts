import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiButtonComponent } from '../primitives/button/ui-button.component';
import { UiSelectComponent } from '../primitives/select/ui-select.component';
import { ThemeService, provideThemeService } from '../../../core/services/theme.service';
import { TENANTS_MOCK } from './tenants.mock';
import { UiColorMode, UiThemeDensity } from '../../../core/services/ui-theme.types';

@Component({
    selector: 'app-tenant-dashboard-story',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        UiInputComponent,
        UiSelectComponent,
        UiButtonComponent
    ],
    template: `
    <div class="dashboard-container" style="display:flex; gap: 2rem; padding: 2rem; flex-wrap: wrap;">
      
      <!-- CONTROLS PANEL -->
      <div class="controls-panel" style="flex: 1; min-width: 300px; padding: 1.5rem; background: var(--ui-surface-card, #fff); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h2 style="margin-bottom: 1.5rem; font-family: var(--ui-font-family-sans); color: var(--ui-text-primary);">
            🎛️ Tenant Controls
        </h2>

        <div style="display:flex; flex-direction:column; gap: 1rem;">
            <mat-form-field appearance="outline">
            <mat-label>Seleccionar Tenant</mat-label>
            <mat-select [(ngModel)]="selectedTenant" (selectionChange)="updateTheme()">
                <mat-option *ngFor="let key of tenantKeys" [value]="key">
                    {{ tenants[key].name || key }}
                </mat-option>
            </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
            <mat-label>Modo de Color</mat-label>
            <mat-select [(ngModel)]="themeMode" (selectionChange)="updateTheme()">
                <mat-option value="light">☀️ Light</mat-option>
                <mat-option value="dark">🌑 Dark</mat-option>
            </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
            <mat-label>Densidad</mat-label>
            <mat-select [(ngModel)]="density" (selectionChange)="updateTheme()">
                <mat-option value="default">Default</mat-option>
                <mat-option value="comfortable">Comfortable</mat-option>
                <mat-option value="compact">Compact</mat-option>
            </mat-select>
            </mat-form-field>
        </div>
      </div>

      <!-- PREVIEW PANEL -->
      <div class="preview-panel" style="flex: 2; min-width: 350px; padding: 2rem; background: var(--ui-surface-background, #fafafa); border-radius: 12px; border: 1px solid var(--ui-border-color, #eee);">
        <h3 style="margin-bottom: 2rem; color: var(--ui-text-primary); font-family: var(--ui-font-family-sans);">
            👁️ Live Preview: {{ tenants[selectedTenant].name }}
        </h3>

        <div style="display:grid; grid-template-columns: 1fr; gap: 1.5rem;">
            <!-- INPUTS -->
            <ui-input 
                label="Nombre del Paciente" 
                placeholder="Ej: Juan Pérez" 
                hint="Nombre completo"
                [(ngModel)]="demoData.name">
            </ui-input>

            <!-- SELECT -->
            <ui-select 
                label="Especialidad Médica" 
                [options]="[
                    {value: 'cardio', label: 'Cardiología'},
                    {value: 'pediatria', label: 'Pediatría'},
                    {value: 'derma', label: 'Dermatología'}
                ]"
                placeholder="Seleccione..."
                [(ngModel)]="demoData.specialty">
            </ui-select>

            <!-- BUTTONS -->
            <div style="display:flex; gap: 1rem; align-items: center; margin-top: 1rem;">
                <ui-button variant="primary" (clicked)="log('Saved')">Guardar</ui-button>
                <ui-button variant="secondary" (clicked)="log('Next')">Siguiente</ui-button>
                <ui-button variant="ghost" (clicked)="log('Cancel')">Cancelar</ui-button>
            </div>
        </div>
      </div>

    </div>
  `
})
class TenantDashboardStoryComponent implements OnInit {
    private themeService = inject(ThemeService);

    tenants = TENANTS_MOCK;
    tenantKeys = Object.keys(TENANTS_MOCK);

    selectedTenant = 'tenantA';
    themeMode: UiColorMode = 'light';
    density: UiThemeDensity = 'default';

    demoData = {
        name: '',
        specialty: ''
    };

    ngOnInit() {
        this.updateTheme();
    }

    updateTheme() {
        const baseTenant = this.tenants[this.selectedTenant];

        // Merge base tenant with overrides from local controls
        const resolvedTheme = {
            ...baseTenant,
            themeMode: this.themeMode,
            // Density logic is handled by global service, but we can override it via TenantOverride or directly if ThemeService supports it.
            // For now, ThemeService density is separate from TenantOverride density property usually, 
            // but let's assume setting it via overrides works or use setDensity directly.
        };

        // 1. Apply Tenant Base
        (this.themeService as any).setTenantOverrides(resolvedTheme);

        // Apply Mode
        (this.themeService as any).setMode(this.themeMode);
        (this.themeService as any).setDensity(this.density);
    }

    log(msg: string) {
        console.log('[Dashboard Action]', msg);
    }
}

const meta: Meta<TenantDashboardStoryComponent> = {
    title: 'PAL/Demos/Final/Dashboard',
    component: TenantDashboardStoryComponent,
    decorators: [
        moduleMetadata({
            imports: [TenantDashboardStoryComponent],
            providers: [
                ...provideThemeService()
            ]
        })
    ]
};

export default meta;

export const Interactive: StoryObj<TenantDashboardStoryComponent> = {};
