import { Meta, StoryObj } from '@storybook/angular';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { UiSelectComponent } from './ui-select.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const meta: Meta<UiSelectComponent> = {
    title: 'PAL/Form Field (Select)',
    component: UiSelectComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                UiSelectComponent,
                MatFormFieldModule,
                MatSelectModule,
                BrowserAnimationsModule
            ],
        }),
    ],
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
        placeholder: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<UiSelectComponent>;

// Helper to render the story structure
const renderStory = (args: any) => ({
    props: {
        ...args,
        // Create a control dynamically based on args
        control: new FormControl(args.value || '', args.required ? Validators.required : null)
    },
    template: `
      <div style="max-width: 400px; padding: 20px;">
        <!-- UiSelect is now a form field itself -->
        <ui-select 
            [formControl]="control" 
            [label]="label"
            [placeholder]="placeholder"
            [required]="required"
            [options]="options"
            [disabled]="disabled">
        </ui-select>
        <div *ngIf="control.invalid && control.touched" style="color: red; font-size: 0.8em; margin-top: 4px;">
            Este campo es requerido
        </div>
        
        <div style="margin-top: 20px; font-size: 0.8em; color: gray;">
           Value: {{ control.value | json }}
        </div>
      </div>
    `,
});

export const Default: Story = {
    render: renderStory,
    args: {
        label: 'Rol de Usuario',
        placeholder: 'Seleccione un rol...',
        required: true,
        disabled: false,
        options: [
            { value: 'ADMIN', label: 'Administrador', icon: 'admin_panel_settings' },
            { value: 'DOCTOR', label: 'Doctor', icon: 'medical_services' },
            { value: 'NURSE', label: 'Enfermera', icon: 'local_hospital' },
            { value: 'USER', label: 'Usuario Estándar', icon: 'person' },
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: null as any,
    },
};

export const Disabled: Story = {
    render: renderStory,
    args: {
        ...Default.args,
        disabled: true,
        label: 'Rol Deshabilitado'
    }
};

export const WithError: Story = {
    render: (args) => ({
        props: {
            ...args,
            // Pre-dirty control to show error
            roleControl: new FormControl('', Validators.required)
        },
        template: `
        <div style="max-width: 400px; padding: 20px;">
            <ui-select 
                [formControl]="roleControl" 
                label="Rol Requerido"
                [required]="true"
                placeholder="Seleccione..."
                [options]="options">
            </ui-select>
            <div *ngIf="roleControl.invalid && roleControl.touched" style="color: red; font-size: 0.8em; margin-top: 4px;">
                Debes seleccionar una opción
            </div>
             <p style="margin-top: 1rem; color: #666; font-size: 0.8em;">Note: Interact with the field and leave to trigger error.</p>
        </div>
      `,
    }),
    args: {
        ...Default.args,
        options: [{ value: 'A', label: 'Opción A' }]
    }
};
