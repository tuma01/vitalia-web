import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

// UI Components
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiButtonComponent } from '../primitives/button/ui-button.component';
import { UiSelectComponent } from '../primitives/select/ui-select.component';
import { UiCheckboxComponent } from '../primitives/checkbox/ui-checkbox.component';
import { UiRadioGroupComponent } from '../primitives/radio/ui-radio-group.component';
import { UiRadioButtonComponent } from '../primitives/radio/ui-radio.component';

// Legacy PAL Components
import { PalOldInputComponent } from '../../../core/pal-old/pal-old-input.component';
import { PalOldButtonComponent } from '../../../core/pal-old/pal-old-button.component';
import { PalOldSelectComponent } from '../../../core/pal-old/pal-old-select.component';
import { PalOldCheckboxComponent } from '../../../core/pal-old/pal-old-checkbox.component';
import { PalOldRadioGroupComponent, PalOldRadioComponent } from '../../../core/pal-old/pal-old-radio.component';

// Theme Engine
import { TENANTS_MOCK } from './tenants.mock';
import { UiColorMode, UiThemeDensity } from '../../../core/services/ui-theme.types';
import { UiThemeRuntimeBuilder } from '../../../core/services/theme-runtime-builder';
import { mapThemeToCssVars } from '../../../core/services/theme-mapper';
import { BRAND_PRESETS } from '../../../core/services/ui-brand-presets';

@Component({
    selector: 'app-tenant-comparison-pal-story',
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
        UiButtonComponent,
        UiCheckboxComponent,
        UiRadioGroupComponent,
        UiRadioButtonComponent,
        PalOldInputComponent,
        PalOldButtonComponent,
        PalOldSelectComponent,
        PalOldCheckboxComponent,
        PalOldRadioGroupComponent,
        PalOldRadioComponent
    ],
    template: `
    <div class="comparison-container" style="display:flex; gap: 2rem; padding: 2rem; align-items: flex-start; overflow-x: auto;">
      
      <!-- 🟢 PANEL A (Material 3) -->
      <div class="tenant-panel" [style]="getStyle('tenantA', modeA, densityA)" 
           style="flex:1; min-width: 350px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid var(--ui-border-color);">
        
        <div class="panel-header" style="background: #fff; padding: 1rem; border-bottom: 1px solid #eee;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; font-family: sans-serif; color: #333;">Tenant A (M3)</h3>
                <div style="display:flex; gap: 0.5rem;">
                    <select [(ngModel)]="modeA">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                    <select [(ngModel)]="densityA">
                        <option value="default">Default</option>
                        <option value="comfortable">Comfortable</option>
                        <option value="compact">Compact</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="panel-content" style="padding: 1.5rem; background: var(--ui-surface-background); color: var(--ui-text-primary); transition: all 0.3s ease;">
            <ui-input label="Nombre" placeholder="Ej: Vitalia User"></ui-input>
            <ui-select label="Región" [options]="['Norte', 'Sur']" placeholder="Seleccione..."></ui-select>
            <div style="margin: 1rem 0;">
                <ui-checkbox label="Acepto términos"></ui-checkbox>
            </div>

            <ui-radio-group name="optionsA">
                <ui-radio value="opt1">Opción 1</ui-radio>
                <ui-radio value="opt2">Opción 2</ui-radio>
            </ui-radio-group>

            <ui-button variant="primary" style="margin-top: 1rem;">Guardar</ui-button>
        </div>
      </div>

      <!-- 🟣 PANEL B (Material 3) -->
      <div class="tenant-panel" [style]="getStyle('tenantB', modeB, densityB)" 
           style="flex:1; min-width: 350px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid var(--ui-border-color);">
        
        <div class="panel-header" style="background: #fff; padding: 1rem; border-bottom: 1px solid #eee;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; font-family: sans-serif; color: #333;">Tenant B (M3)</h3>
                <div style="display:flex; gap: 0.5rem;">
                     <select [(ngModel)]="modeB">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                    <select [(ngModel)]="densityB">
                        <option value="default">Def</option>
                        <option value="compact">Cmp</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="panel-content" style="padding: 1.5rem; background: var(--ui-surface-background); color: var(--ui-text-primary); transition: all 0.3s ease;">
            <ui-input label="Nombre" placeholder="Ej: Vitalia User"></ui-input>
            <ui-select label="Región" [options]="['Norte', 'Sur']" placeholder="Seleccione..."></ui-select>
            <div style="margin: 1rem 0;">
                <ui-checkbox label="Acepto términos"></ui-checkbox>
            </div>

            <ui-radio-group name="optionsB">
                <ui-radio value="opt1">Opción 1</ui-radio>
                <ui-radio value="opt2">Opción 2</ui-radio>
            </ui-radio-group>

            <ui-button variant="primary" style="margin-top: 1rem;">Guardar</ui-button>
        </div>
      </div>

      <!-- 👴 PANEL C (Legacy PAL) -->
      <div class="legacy-panel" 
           style="flex:1; min-width: 350px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #ccc; background: #f9f9f9;">
        
        <div class="panel-header" style="background: #eaeaea; padding: 1rem; border-bottom: 1px solid #ccc;">
            <h3 style="margin:0; font-family: sans-serif; color: #555;">PAL Antiguo (Legacy)</h3>
            <small>Static CSS Reference</small>
        </div>

        <div class="panel-content" style="padding: 1.5rem;">
            <!-- Legacy Components -->
            <pal-old-input label="Nombre" placeholder="Ingrese su nombre" hint="Solo letras"></pal-old-input>
            <pal-old-select label="País" [options]="['Norte', 'Sur']" placeholder="Seleccione un país"></pal-old-select>
            <pal-old-checkbox label="Acepto términos y condiciones"></pal-old-checkbox>
            
            <pal-old-radio-group name="optionsOld">
                <pal-old-radio label="Opción 1" value="opt1" name="optionsOld"></pal-old-radio>
                <pal-old-radio label="Opción 2" value="opt2" name="optionsOld"></pal-old-radio>
            </pal-old-radio-group>

            <pal-old-button label="Guardar" style="margin-top: 1rem;"></pal-old-button>
        </div>
      </div>

    </div>
  `
})
class TenantComparisonPalStoryComponent {
    tenants = TENANTS_MOCK;

    modeA: UiColorMode = 'light';
    densityA: UiThemeDensity = 'default';

    modeB: UiColorMode = 'dark';
    densityB: UiThemeDensity = 'compact';

    constructor() { }

    getStyle(tenantKey: string, mode: UiColorMode, density: UiThemeDensity): Record<string, string> {
        const tenantOverride = this.tenants[tenantKey];
        const brandTokens = BRAND_PRESETS['vitalia'];
        const resolvedTheme = UiThemeRuntimeBuilder.build({
            brandTokens,
            mode,
            density,
            tenant: tenantOverride
        });
        return mapThemeToCssVars(resolvedTheme);
    }
}

const meta: Meta<TenantComparisonPalStoryComponent> = {
    title: 'PAL/Demos/Final/Comparison vs Legacy',
    component: TenantComparisonPalStoryComponent,
    decorators: [
        moduleMetadata({
            imports: [TenantComparisonPalStoryComponent]
        })
    ]
};

export default meta;

export const ThreeWayComparison: StoryObj<TenantComparisonPalStoryComponent> = {};
