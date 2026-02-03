import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { UiSelectComponent } from '../primitives/select/ui-select.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { withTenantTheme } from './tenant-theme.decorator';

const meta: Meta<UiSelectComponent> = {
    title: 'PAL/Demos/Final/Select',
    component: UiSelectComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                UiSelectComponent, // Using our wrapper directly as it wraps mat-form-field internally
                MatFormFieldModule,
                MatSelectModule
            ],
        })
    ],
    argTypes: {
        variant: {
            control: 'select',
            options: ['fill', 'outline']
        }
    }
};

export default meta;
type Story = StoryObj<UiSelectComponent & { optionsList: any[] }>;

export const TenantA_Light_Default: Story = {
    decorators: [withTenantTheme('tenantA', 'light', 'default')],
    render: (args) => ({
        props: {
            ...args,
            control: new FormControl('Ecuador')
        },
        template: `
      <div style="padding: 20px;">
        <ui-select 
            [label]="label" 
            [options]="options" 
            [placeholder]="placeholder"
            [formControl]="control"
            [variant]="variant">
        </ui-select>
      </div>
    `,
    }),
    args: {
        label: 'País de Residencia',
        placeholder: 'Seleccione...',
        variant: 'fill',
        options: [
            { value: 'Ecuador', label: 'Ecuador' },
            { value: 'Colombia', label: 'Colombia' },
            { value: 'Peru', label: 'Perú' }
        ]
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
      <div style="padding: 20px; background: var(--ui-surface-background); min-height: 200px;">
        <ui-select 
            [label]="label" 
            [options]="options" 
            [placeholder]="placeholder"
            [formControl]="control"
            variant="outline">
        </ui-select>
      </div>
    `,
    }),
    args: {
        label: 'Especialidad',
        placeholder: 'Filtar por...',
        variant: 'outline',
        options: [
            { value: 'cardio', label: 'Cardiología' },
            { value: 'neuro', label: 'Neurología' },
            { value: 'gen', label: 'Medicina General' }
        ]
    },
};
