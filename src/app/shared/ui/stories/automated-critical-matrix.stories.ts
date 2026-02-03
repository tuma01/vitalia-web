import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';

// Services & Types
import { ThemeService } from '../../../core/services/theme.service';
import { UiColorMode } from '../../../core/services/ui-theme.types';

// Primitives & Components
import { UiFormFieldComponent } from '../components/form-field/ui-form-field.component';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiSelectNativeComponent } from '../primitives/select-native/ui-select-native.component';
import { UiCheckboxComponent } from '../primitives/checkbox/ui-checkbox.component';
import { UiRadioButtonComponent } from '../primitives/radio/ui-radio.component';
import { UiRadioGroupComponent } from '../primitives/radio/ui-radio-group.component';

/**
 * 🛡️ PAL Industrial Critical Matrix
 * 
 * Estación de pruebas de regresión visual automatizada para CI/CD.
 * Valida Brand x Mode x Viewport (320, 768, 1024).
 */
const meta: Meta = {
    title: 'PAL/Critical Matrix/Industrial Baselines',
    parameters: {
        // Configuraciones para Chromatic (Gobernanza Visual)
        chromatic: {
            delay: 500,
            viewports: [320, 768, 1024]
        },
    },
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                UiFormFieldComponent,
                UiInputComponent,
                UiSelectNativeComponent,
                UiCheckboxComponent,
                UiRadioButtonComponent,
                UiRadioGroupComponent
            ],
        }),
    ],
    tags: ['critical'],
};

export default meta;
type Story = StoryObj;

// --- Template Industrial ---
const MatrixTemplate = `
<div style="display: flex; flex-direction: column; gap: 32px; padding: 24px; min-height: 100vh; background: var(--surface-background); transition: background 0.3s ease;">
    
    <header style="border-bottom: 2px solid var(--brand-primary); padding-bottom: 16px;">
        <h2 style="color: var(--brand-primary); margin: 0; font-family: var(--font-family);">{{ brandName }}</h2>
        <span style="color: var(--text-secondary); font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Baseline: {{ modeName }}</span>
    </header>

    <div style="display: grid; gap: 24px; max-width: 600px;">
        
        <!-- SECTION 1: FORMS INTEGRITY -->
        <section style="display: flex; flex-direction: column; gap: 16px;">
            <label style="color: var(--text-primary); font-weight: 700; font-size: 12px; text-transform: uppercase;">Forms & Validation</label>
            
            <ui-form-field label="Patient Full Name" [required]="true">
              <ui-input placeholder="John Doe"></ui-input>
            </ui-form-field>

            <ui-form-field label="Medical Specialty" hint="Select the primary department">
              <ui-select-native [options]="['General Medicine', 'Pediatrics', 'Cardiology', 'Oncology']"></ui-select-native>
            </ui-form-field>

            <ui-form-field label="Critical Alert" error="This field requires immediate attention">
              <ui-input value="Action Required"></ui-input>
            </ui-form-field>
        </section>

        <!-- SECTION 2: SELECTION CONTROLS -->
        <section style="display: flex; flex-direction: column; gap: 16px;">
            <label style="color: var(--text-primary); font-weight: 700; font-size: 12px; text-transform: uppercase;">Selection Primitives</label>
            
            <div style="display: flex; flex-wrap: wrap; gap: 24px; padding: 16px; border: 1px dashed var(--surface-border); border-radius: var(--radius-md);">
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <ui-checkbox [checked]="true">Consent Given</ui-checkbox>
                    <ui-checkbox [checked]="false">Telemedicine Opt-in</ui-checkbox>
                    <ui-checkbox [checked]="true" [disabled]="true">Immutable State</ui-checkbox>
                </div>

                <ui-radio-group orientation="vertical">
                    <ui-radio value="A" [checked]="true">Priority High</ui-radio>
                    <ui-radio value="B">Priority Normal</ui-radio>
                    <ui-radio value="C" [disabled]="true">Priority Low</ui-radio>
                </ui-radio-group>
            </div>
        </section>

        <!-- SECTION 3: TYPOGRAPHY & CONTRAST -->
        <section style="display: flex; flex-direction: column; gap: 8px;">
            <label style="color: var(--text-primary); font-weight: 700; font-size: 12px; text-transform: uppercase;">Contrast & Typography</label>
            <p style="color: var(--text-primary); margin: 0; font-size: 18px; font-weight: 500;">Heavy contrast heading (Primary Text)</p>
            <p style="color: var(--text-secondary); margin: 0; font-size: 14px;">Supporting descriptive metadata (Secondary Text)</p>
            <p style="color: var(--text-disabled); margin: 0; font-size: 12px;">Hidden or non-interactive context (Disabled Text)</p>
        </section>

    </div>

    <footer style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--surface-border);">
        <p style="color: var(--text-disabled); font-size: 10px; margin: 0;">Vitalia PAL v2.19 - Programmatic Industrial Baseline</p>
    </footer>
</div>
`;

// --- Industrial Story Factory ---
const createIndustrialStory = (brandId: string, mode: UiColorMode, brandName: string): Story => ({
    name: `${brandName} (${mode.toUpperCase()})`,
    render: (args) => ({
        props: {
            ...args,
            brandName,
            modeName: mode === 'light' ? 'Light Mode' : 'Dark Mode'
        },
        template: MatrixTemplate,
    }),
    decorators: [
        (storyFunc) => {
            const service = inject(ThemeService);
            service.setBrand(brandId);
            service.setMode(mode);
            return storyFunc();
        }
    ]
});

// --- Industrial Baseline Exports ---

export const Vitalia_Light = createIndustrialStory('vitalia', 'light', 'Vitalia Health');
export const Vitalia_Dark = createIndustrialStory('vitalia', 'dark', 'Vitalia Health');
export const School_Light = createIndustrialStory('school', 'light', 'Vitalia School');
export const School_Dark = createIndustrialStory('school', 'dark', 'Vitalia School');
