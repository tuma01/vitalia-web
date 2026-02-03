import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Primitives & Components
import { UiFormFieldComponent } from '../components/form-field/ui-form-field.component';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiSelectNativeComponent } from '../primitives/select-native/ui-select-native.component';
import { UiCheckboxComponent } from '../primitives/checkbox/ui-checkbox.component';
import { UiRadioButtonComponent } from '../primitives/radio/ui-radio.component';
import { UiRadioGroupComponent } from '../primitives/radio/ui-radio-group.component';

/**
 * 🛡️ PAL Critical Matrix: Multi-Brand & Multi-Mode
 * 
 * Esta historia centraliza la validación de los componentes más críticos del sistema.
 * Sirve como el baseline visual definitivo para Chromatic.
 * 
 * 💡 Usa la barra superior (Brand / Theme Mode) para alternar entre experiencias.
 */
const meta: Meta = {
    title: 'PAL/Critical Matrix/All Primitives',
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
                UiFormFieldComponent,
                UiInputComponent,
                UiSelectNativeComponent,
                UiCheckboxComponent,
                UiRadioButtonComponent,
                UiRadioGroupComponent
            ],
        }),
    ],
    tags: ['critical'], // 🛡️ Activador de validación visual Chromatic
};

export default meta;
type Story = StoryObj;

export const AllAtoms: Story = {
    name: 'Unified Matrix Baseline',
    render: (args) => ({
        props: args,
        template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; max-width: 600px; background: var(--surface-background); border: 1px solid var(--surface-border); border-radius: var(--radius-lg);">
        
        <header>
            <h2 style="color: var(--text-primary); margin-bottom: 8px;">Baseline Validation Matrix</h2>
            <p style="color: var(--text-secondary); font-size: 14px;">Validating Brand x Mode consistency.</p>
        </header>

        <!-- 1. TEXT INPUT -->
        <ui-form-field label="Full Name" [required]="true" hint="As it appears on your ID">
          <ui-input placeholder="John Doe"></ui-input>
        </ui-form-field>

        <!-- 2. SELECT NATIVE -->
        <ui-form-field label="Country of Residence" [required]="true">
          <ui-select-native [options]="args.options"></ui-select-native>
        </ui-form-field>

        <!-- 3. ERROR STATE -->
        <ui-form-field label="Email Address" error="Invalid clinical email format">
          <ui-input value="invalid-email@"></ui-input>
        </ui-form-field>

        <!-- 4. CHECKBOXES -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="color: var(--text-primary); font-weight: 600; font-size: 14px;">Preferences</label>
            <ui-checkbox [checked]="true">I accept the clinical terms and conditions</ui-checkbox>
            <ui-checkbox [checked]="false">Subscribe to healthcare newsletter</ui-checkbox>
        </div>

        <!-- 5. RADIOS -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="color: var(--text-primary); font-weight: 600; font-size: 14px;">Patient Gender</label>
            <ui-radio-group>
                <ui-radio value="M" [checked]="true">Male</ui-radio>
                <ui-radio value="F">Female</ui-radio>
                <ui-radio value="O">Other</ui-radio>
            </ui-radio-group>
        </div>

      </div>
    `,
    }),
    args: {
        options: ['United States', 'Ecuador', 'Colombia', 'Spain', 'Mexico'],
    },
};
