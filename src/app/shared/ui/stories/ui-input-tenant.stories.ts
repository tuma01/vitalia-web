import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiFormFieldComponent } from '../components/form-field/ui-form-field.component';
import { UiIconComponent } from '../primitives/icon/ui-icon.component';
import { withTenantTheme } from './tenant-theme.decorator';

/**
 * 📝 UiInput Multi-Tenant Showcase
 * 
 * Demonstrates how the input component adapts to different tenant themes
 * while maintaining its Material 3 core functionality.
 */
const meta: Meta<UiInputComponent> = {
    title: 'PAL/Demos/Multi-Tenant/Input',
    component: UiInputComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                UiFormFieldComponent,
                UiInputComponent,
                UiIconComponent
            ],
        })
    ],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'password', 'email', 'number'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
};

export default meta;
type Story = StoryObj<UiInputComponent & { label: string; hint: string }>;

export const VitaliaDefault: Story = {
    decorators: [withTenantTheme('vitalia')],
    render: (args) => ({
        props: {
            ...args,
            control: new FormControl('')
        },
        template: `
      <ui-form-field [label]="label" [hint]="hint">
        <ui-input [formControl]="control" [placeholder]="placeholder" [type]="type" [size]="size"></ui-input>
      </ui-form-field>
    `,
    }),
    args: {
        label: 'Nombre de Usuario',
        placeholder: 'Ej: Juan Pérez',
        hint: 'Mínimo 3 caracteres',
        type: 'text',
        size: 'md',
    },
};

export const ClinicaVerde: Story = {
    decorators: [withTenantTheme('clinica_verde')],
    render: (args) => ({
        props: {
            ...args,
            control: new FormControl('')
        },
        template: `
      <ui-form-field [label]="label" [hint]="hint">
        <ui-icon uiPrefix>person</ui-icon>
        <ui-input [formControl]="control" [placeholder]="placeholder" [type]="type" [size]="size"></ui-input>
      </ui-form-field>
    `,
    }),
    args: {
        ...VitaliaDefault.args,
        label: 'Paciente',
        placeholder: 'Buscar paciente...',
    },
};

export const HospitalModerno: Story = {
    decorators: [withTenantTheme('hospital_moderno')],
    render: (args) => ({
        props: {
            ...args,
            control: new FormControl('')
        },
        template: `
      <ui-form-field [label]="label" [hint]="hint" appearance="outline">
        <ui-input [formControl]="control" [placeholder]="placeholder" [type]="type" [size]="size"></ui-input>
      </ui-form-field>
    `,
    }),
    args: {
        ...VitaliaDefault.args,
        label: 'Identificación',
        placeholder: 'ID-000000',
    },
};

export const DarkPremium: Story = {
    decorators: [withTenantTheme('dark_premium')],
    render: (args) => ({
        props: {
            ...args,
            control: new FormControl('')
        },
        template: `
      <div style="padding: 24px; background: var(--ui-surface-background); min-height: 200px;">
        <ui-form-field [label]="label" [hint]="hint" appearance="outline">
          <ui-input [formControl]="control" [placeholder]="placeholder" [type]="type" [size]="size"></ui-input>
        </ui-form-field>
      </div>
    `,
    }),
    args: {
        ...VitaliaDefault.args,
        label: 'Premium Access',
        placeholder: 'API Key',
    },
};
