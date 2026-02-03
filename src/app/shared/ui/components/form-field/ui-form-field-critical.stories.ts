import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiFormFieldComponent } from './ui-form-field.component';
import { UiInputComponent } from '../../primitives/input/ui-input.component';

/**
 * 🛡️ UiFormField Critical Baseline
 * 
 * Este conjunto de historias representa el contrato visual MÍNIMO del PAL.
 * Bloquea PRs si se detectan regresiones en la matriz Marca x Modo.
 */
const meta: Meta<UiFormFieldComponent> = {
    title: 'PAL/Form/UiFormField/Critical Baseline',
    component: UiFormFieldComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule, UiInputComponent],
        }),
    ],
    tags: ['critical'], // 🛡️ Activador de validación visual Chromatic
};

export default meta;
type Story = StoryObj<UiFormFieldComponent>;

export const Default: Story = {
    render: (args) => ({
        props: args,
        template: `
      <ui-form-field label="Username" [required]="true" [error]="error">
        <ui-input placeholder="Enter your username"></ui-input>
      </ui-form-field>
    `,
    }),
    args: {
        error: null,
    },
};

export const WithError: Story = {
    render: (args) => ({
        props: args,
        template: `
      <ui-form-field label="Email Address" [required]="true" [error]="error">
        <ui-input placeholder="user@vitalia.com"></ui-input>
      </ui-form-field>
    `,
    }),
    args: {
        error: 'Invalid email format. Please check your data.',
    },
};

export const WithHint: Story = {
    render: (args) => ({
        props: args,
        template: `
      <ui-form-field label="Password" hint="At least 8 characters long" [required]="true">
        <ui-input type="password" placeholder="••••••••"></ui-input>
      </ui-form-field>
    `,
    }),
};
