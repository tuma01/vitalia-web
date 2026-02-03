import { Component, Signal, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Core Services
import { UiThemeRuntimeBuilder } from '../../../../core/services/theme-runtime-builder';
import { ThemeService as UiThemeService } from '../../../../core/services/theme.service';
import { BRAND_PRESETS } from '../../../../core/services/ui-brand-presets';
import { UiColorMode, UiThemeDensity } from '../../../../core/services/ui-theme.types';

// UI Primitives for Sandbox
import { UiInputComponent } from '../../primitives/input/ui-input.component';
import { UiSelectNativeComponent } from '../../primitives/select-native/ui-select-native.component';
import { UiCheckboxComponent } from '../../primitives/checkbox/ui-checkbox.component';
import { UiRadioGroupComponent } from '../../primitives/radio/ui-radio-group.component';
import { UiRadioButtonComponent } from '../../primitives/radio/ui-radio.component';
import { UiFormFieldComponent } from '../../components/form-field/ui-form-field.component';

@Component({
    selector: 'ui-theme-editor-admin',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        UiInputComponent,
        UiSelectNativeComponent,
        UiCheckboxComponent,
        UiRadioGroupComponent,
        UiRadioButtonComponent,
        UiFormFieldComponent
    ],
    templateUrl: './theme-editor-admin.component.html',
    styleUrls: ['./theme-editor-admin.component.scss'],
})
export class ThemeEditorAdminComponent {
    // Signals para la configuración en vivo
    brand = signal<string>('vitalia');
    mode = signal<UiColorMode>('light');
    density = signal<UiThemeDensity>('default');

    // Overrides Individuales
    primaryColor = signal('#0055A4');
    secondaryColor = signal('#004482');
    backgroundColor = signal('#F8FAFC');
    textColor = signal('#0F172A');
    fontFamily = signal('Inter, sans-serif');

    constructor(private themeService: UiThemeService) {
        // Al iniciar, sincronizar valores con el preset por defecto
        this.resetToBrandPreset();
    }

    // Computed Theme combinando Brand + Mode + Overrides
    // Este es el "Live Preview Object" que se pasará al style del sandbox
    currentTheme = computed(() => {
        // Buscar los tokens base (Vitalia o School)
        const brandKey = this.brand();
        const baseTokens = BRAND_PRESETS[brandKey] || BRAND_PRESETS['vitalia'];

        return UiThemeRuntimeBuilder.build({
            brandTokens: baseTokens,
            mode: this.mode(),
            density: this.density(),
            tenant: {
                primaryColor: this.primaryColor(),
                secondaryColor: this.secondaryColor(),
                backgroundColor: this.backgroundColor(),
                textColor: this.textColor(),
                fontFamily: this.fontFamily(),
            }
        });
    });

    // Helper para keys en el template
    get availableBrands() {
        return Object.keys(BRAND_PRESETS);
    }

    // Reset a la marca base cuando cambia el selector
    resetToBrandPreset() {
        const brandKey = this.brand();
        const preset = BRAND_PRESETS[brandKey] || BRAND_PRESETS['vitalia'];

        // Reset Overrides signals to the brand defaults
        // Note: BrandDesignTokens stores these in sub-objects, need to extract safely
        this.primaryColor.set(preset.brand.primary);
        this.secondaryColor.set(preset.brand.secondary);
        this.backgroundColor.set(preset.surface.background);
        this.textColor.set(preset.text.primary);
        this.fontFamily.set(preset.typography.fontFamily);
    }

    // Simulación de "Guardar"
    saveTheme() {
        console.log('💾 Saving Theme Configuration:', {
            brand: this.brand(),
            mode: this.mode(),
            density: this.density(),
            overrides: {
                primary: this.primaryColor(),
                secondary: this.secondaryColor(),
                text: this.textColor(),
                bg: this.backgroundColor()
            }
        });
        alert('Theme Configuration Saved! (Simulated)');
    }
}
