import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';

// Services & Primitives
import { ThemeService } from '../../../core/services/theme.service';
import { UiFormFieldComponent } from '../components/form-field/ui-form-field.component';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiSelectNativeComponent } from '../primitives/select-native/ui-select-native.component';
import { UiCheckboxComponent } from '../primitives/checkbox/ui-checkbox.component';
import { UiRadioButtonComponent } from '../primitives/radio/ui-radio.component';
import { UiRadioGroupComponent } from '../primitives/radio/ui-radio-group.component';

/**
 * 🛡️ PAL Critical Matrix v2.0 (Granular Baselines)
 * 
 * Este archivo genera historias independientes por cada componente crítico.
 * Permite detectar EXACTAMENTE qué átomo falla en qué marca y modo.
 */
const meta: Meta = {
    title: 'PAL/Critical Matrix v2.0/Granular Baselines',
    parameters: {
        chromatic: { delay: 600, viewports: [320, 1024] },
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

// --- Helper Factory for Granular Stories ---
const createGranularStory = (brandId: string, mode: 'light' | 'dark', componentName: string, template: string): Story => ({
    name: `${brandId.toUpperCase()} | ${mode.toUpperCase()} | ${componentName}`,
    render: () => ({
        template: `
            <div style="padding: 32px; background: var(--surface-background); min-height: 150px; border: 1px solid var(--surface-border); border-radius: var(--radius-md);">
                <h4 style="color: var(--text-secondary); margin-bottom: 24px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                    ${brandId} / ${mode} / ${componentName}
                </h4>
                ${template}
            </div>
        `,
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

// --- Component Registry Templates ---
const TEMPLATES = {
    Input: `<ui-form-field label="Baseline Input"><ui-input placeholder="Validation..."></ui-input></ui-form-field>`,
    Select: `<ui-form-field label="Baseline Select"><ui-select-native [options]="['Option A', 'Option B']"></ui-select-native></ui-form-field>`,
    Checkbox: `<ui-checkbox [checked]="true">Baseline Checkbox</ui-checkbox>`,
    Radio: `<ui-radio-group><ui-radio value="1" [checked]="true">Radio A</ui-radio><ui-radio value="2">Radio B</ui-radio></ui-radio-group>`,
    Error: `<ui-form-field label="Error State" error="Critical validation failure"><ui-input value="Invalid Data"></ui-input></ui-form-field>`
};

// --- Exporting Granular Matrix (Explicit Exports for ESM/Standard Storybook) ---

// VITALIA HEALTH
export const Vitalia_Light_Input = createGranularStory('vitalia', 'light', 'Input', TEMPLATES.Input);
export const Vitalia_Light_Select = createGranularStory('vitalia', 'light', 'Select', TEMPLATES.Select);
export const Vitalia_Light_Checkbox = createGranularStory('vitalia', 'light', 'Checkbox', TEMPLATES.Checkbox);
export const Vitalia_Light_Error = createGranularStory('vitalia', 'light', 'Error', TEMPLATES.Error);

export const Vitalia_Dark_Input = createGranularStory('vitalia', 'dark', 'Input', TEMPLATES.Input);
export const Vitalia_Dark_Select = createGranularStory('vitalia', 'dark', 'Select', TEMPLATES.Select);
export const Vitalia_Dark_Checkbox = createGranularStory('vitalia', 'dark', 'Checkbox', TEMPLATES.Checkbox);
export const Vitalia_Dark_Error = createGranularStory('vitalia', 'dark', 'Error', TEMPLATES.Error);

// VITALIA SCHOOL
export const School_Light_Input = createGranularStory('school', 'light', 'Input', TEMPLATES.Input);
export const School_Light_Select = createGranularStory('school', 'light', 'Select', TEMPLATES.Select);
export const School_Light_Checkbox = createGranularStory('school', 'light', 'Checkbox', TEMPLATES.Checkbox);
export const School_Light_Error = createGranularStory('school', 'light', 'Error', TEMPLATES.Error);

export const School_Dark_Input = createGranularStory('school', 'dark', 'Input', TEMPLATES.Input);
export const School_Dark_Select = createGranularStory('school', 'dark', 'Select', TEMPLATES.Select);
export const School_Dark_Checkbox = createGranularStory('school', 'dark', 'Checkbox', TEMPLATES.Checkbox);
export const School_Dark_Error = createGranularStory('school', 'dark', 'Error', TEMPLATES.Error);
