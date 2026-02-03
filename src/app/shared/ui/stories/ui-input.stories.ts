import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiFormFieldComponent } from '../components/form-field/ui-form-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { withTenantTheme } from './tenant-theme.decorator';

const meta: Meta<UiInputComponent> = {
    title: 'PAL/Demos/Final/Input',
    component: UiInputComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                UiFormFieldComponent, // Our wrapper
                UiInputComponent,
                MatFormFieldModule,
                MatInputModule
            ],
        })
    ],
    argTypes: {
        type: { control: 'select', options: ['text', 'password', 'email'] },
    }
};

export default meta;
type Story = StoryObj<UiInputComponent & { label: string; hint: string }>;

export const TenantA_Light_Default: Story = {
    decorators: [withTenantTheme('tenantA', 'light', 'default')],
    render: (args) => ({
        props: {
            ...args,
            control: new FormControl('')
        },
        template: `
      <div style="padding: 20px;">
          <ui-form-field [label]="label" [hint]="hint">
            <ui-input [formControl]="control" [placeholder]="placeholder" [type]="type"></ui-input>
          </ui-form-field>
      </div>
    `,
    }),
    args: {
        label: 'Nombre de Usuario',
        placeholder: 'Ingrese su nombre',
        hint: 'Solo letras y números',
        type: 'text',
    },
};

export const TenantB_Dark_Compact: Story = {
    decorators: [withTenantTheme('tenantB', 'dark', 'compact')],
    render: (args) => ({
        props: {
            ...args,
            control: new FormControl('')
        },
        template: `
      <div style="padding: 20px; background: var(--ui-surface-background); min-height: 150px;">
          <ui-form-field [label]="label" [hint]="hint" appearance="outline">
            <ui-input [formControl]="control" [placeholder]="placeholder" [type]="type"></ui-input>
          </ui-form-field>
      </div>
    `,
    }),
    args: {
        label: 'ID de Agente',
        placeholder: 'AGT-000',
        hint: 'Código requerido',
        type: 'text',
    },
};
