import { Component, ChangeDetectorRef, inject } from '@angular/core';
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

// Theme Engine
import { TENANTS_MOCK } from './tenants.mock';
import { UiColorMode, UiThemeDensity } from '../../../core/services/ui-theme.types';
import { UiThemeRuntimeBuilder } from '../../../core/services/theme-runtime-builder';
import { mapThemeToCssVars } from '../../../core/services/theme-mapper';
import { BRAND_PRESETS } from '../../../core/services/ui-brand-presets';

@Component({
    selector: 'app-tenant-comparison-story',
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
    <div class="comparison-container" style="display:flex; gap: 2rem; padding: 2rem; align-items: flex-start; flex-wrap: wrap;">
      
      <!-- 🟢 PANEL A -->
      <div class="tenant-panel" [style]="getStyle('tenantA', modeA, densityA)" style="flex:1; min-width: 400px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid var(--ui-border-color);">
        <!-- Header Controls (Inside Panel to respect localized theme, or kept neutral?) -->
        <!-- We keep controls NEUTRAL (white/gray) so they are usable, but apply theme to BODY of panel -->
        <div class="panel-header" style="background: #fff; padding: 1.5rem; border-bottom: 1px solid #eee; color: #333;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
                <h3 style="margin:0; font-family: sans-serif;">{{ tenants['tenantA'].name }}</h3>
                <span style="font-size: 0.8rem; background: #eee; padding: 4px 8px; border-radius: 4px;">Tenant A</span>
            </div>
            
            <div style="display:flex; gap: 1rem;">
                <mat-form-field appearance="outline" subscriptSizing="dynamic">
                    <mat-label>Modo</mat-label>
                    <mat-select [(ngModel)]="modeA">
                        <mat-option value="light">Light</mat-option>
                        <mat-option value="dark">Dark</mat-option>
                    </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline" subscriptSizing="dynamic">
                    <mat-label>Densidad</mat-label>
                    <mat-select [(ngModel)]="densityA">
                        <mat-option value="default">Default</mat-option>
                        <mat-option value="comfortable">Comfortable</mat-option>
                        <mat-option value="compact">Compact</mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
        </div>

        <!-- THEMED CONTENT AREA -->
        <div class="panel-content" style="padding: 2rem; background: var(--ui-surface-background); color: var(--ui-text-primary); transition: all 0.3s ease;">
            <h4 style="margin-top:0; margin-bottom: 1.5rem; font-family: var(--ui-font-family-base);">Preview Content</h4>
            
            <div style="display:grid; gap: 1.5rem;">
                <ui-input label="Nombre" placeholder="Ej: Vitalia User"></ui-input>
                
                <ui-select label="Región" [options]="['Norte', 'Sur', 'Este', 'Oeste']" placeholder="Seleccione..."></ui-select>
                
                <div style="display:flex; gap: 1rem; flex-wrap: wrap;">
                    <ui-button variant="primary">Primary Action</ui-button>
                    <ui-button variant="secondary">Secondary</ui-button>
                    <ui-button variant="outline">Outline</ui-button>
                </div>

                <div style="margin-top: 1rem; padding: 1rem; border-radius: var(--ui-radius-md); background: var(--ui-surface-card); border: 1px solid var(--ui-border-color);">
                    <p style="margin:0; opacity: 0.8;">Card Component Surface</p>
                </div>
            </div>
        </div>
      </div>

      <!-- 🟣 PANEL B -->
      <div class="tenant-panel" [style]="getStyle('tenantB', modeB, densityB)" style="flex:1; min-width: 400px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid var(--ui-border-color);">
        <div class="panel-header" style="background: #fff; padding: 1.5rem; border-bottom: 1px solid #eee; color: #333;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
                <h3 style="margin:0; font-family: sans-serif;">{{ tenants['tenantB'].name }}</h3>
                <span style="font-size: 0.8rem; background: #eee; padding: 4px 8px; border-radius: 4px;">Tenant B</span>
            </div>
            
            <div style="display:flex; gap: 1rem;">
                <mat-form-field appearance="outline" subscriptSizing="dynamic">
                    <mat-label>Modo</mat-label>
                    <mat-select [(ngModel)]="modeB">
                        <mat-option value="light">Light</mat-option>
                        <mat-option value="dark">Dark</mat-option>
                    </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline" subscriptSizing="dynamic">
                    <mat-label>Densidad</mat-label>
                    <mat-select [(ngModel)]="densityB">
                        <mat-option value="default">Default</mat-option>
                        <mat-option value="comfortable">Comfortable</mat-option>
                        <mat-option value="compact">Compact</mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
        </div>

        <div class="panel-content" style="padding: 2rem; background: var(--ui-surface-background); color: var(--ui-text-primary); transition: all 0.3s ease;">
             <h4 style="margin-top:0; margin-bottom: 1.5rem; font-family: var(--ui-font-family-base);">Preview Content</h4>
            
            <div style="display:grid; gap: 1.5rem;">
                <ui-input label="Nombre" placeholder="Ej: Vitalia User"></ui-input>
                
                <ui-select label="Región" [options]="['Norte', 'Sur', 'Este', 'Oeste']" placeholder="Seleccione..."></ui-select>
                
                <div style="display:flex; gap: 1rem; flex-wrap: wrap;">
                    <ui-button variant="primary">Primary Action</ui-button>
                    <ui-button variant="secondary">Secondary</ui-button>
                    <ui-button variant="outline">Outline</ui-button>
                </div>

                 <div style="margin-top: 1rem; padding: 1rem; border-radius: var(--ui-radius-md); background: var(--ui-surface-card); border: 1px solid var(--ui-border-color);">
                    <p style="margin:0; opacity: 0.8;">Card Component Surface</p>
                </div>
            </div>
        </div>
      </div>

    </div>
  `
})
class TenantComparisonStoryComponent {
    tenants = TENANTS_MOCK;

    // Independent States
    modeA: UiColorMode = 'light';
    densityA: UiThemeDensity = 'default';

    modeB: UiColorMode = 'dark';
    densityB: UiThemeDensity = 'compact';

    constructor(private cdr: ChangeDetectorRef) { }

    /**
     * 🪄 Magic: Generates Scoped CSS Variables for a specific container
     */
    getStyle(tenantKey: string, mode: UiColorMode, density: UiThemeDensity): Record<string, string> {
        const tenantOverride = this.tenants[tenantKey];
        const brandTokens = BRAND_PRESETS['vitalia']; // Default brand base

        // 1. Build the full resolved theme object
        // using the same Logic as ThemeService, but stateless and local
        const resolvedTheme = UiThemeRuntimeBuilder.build({
            brandTokens,
            mode,
            density,
            tenant: tenantOverride
        });

        // 2. Map tokens to standard --ui-*, --mat-sys-* variables
        const cssVars = mapThemeToCssVars(resolvedTheme);

        // 3. Inject Custom CSS (Simulated via binding? No, we need a style tag ideally)
        // BUT for variables, returning the object works for [style].
        // For 'customCss' string (e.g. .mat-btn { radius: 10px }), we can't easily scope it via [style].
        // However, CSS vars handle colors/density. 
        // Custom CSS text sadly requires Shadow DOM or unique classes. 
        // For this Demo, we just return vars. Custom CSS text won't apply locally unless we inject a <style> into shadow root.
        // We will rely on Variables for 90% of the look.

        return cssVars;
    }
}

const meta: Meta<TenantComparisonStoryComponent> = {
    title: 'PAL/Demos/Final/Comparison Dashboard',
    component: TenantComparisonStoryComponent,
    decorators: [
        moduleMetadata({
            imports: [TenantComparisonStoryComponent]
        })
    ]
};

export default meta;

export const SideBySide: StoryObj<TenantComparisonStoryComponent> = {};
