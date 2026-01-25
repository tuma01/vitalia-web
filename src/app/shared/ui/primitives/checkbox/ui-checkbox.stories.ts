import { Meta, StoryObj } from '@storybook/angular';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { UiCheckboxComponent } from './ui-checkbox.component';

const meta: Meta = {
    title: 'PAL/Form Field (Checkbox)',
    component: UiCheckboxComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, ReactiveFormsModule, UiCheckboxComponent],
        }),
    ],
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        initialValue: { control: 'boolean' }
    },
};

export default meta;
type Story = StoryObj;

const renderStory = (args: any) => ({
    props: {
        ...args,
        control: new FormControl(args.initialValue || false, args.required ? Validators.requiredTrue : null)
    },
    template: `
        <div style="padding: 20px;">
            <ui-checkbox 
                [formControl]="control" 
                [label]="label" 
                [disabled]="disabled"
                [required]="required">
            </ui-checkbox>

            <div style="margin-top: 1rem; color: gray; font-size: 0.8em;">
                Value: {{ control.value }} <br>
                Valid: {{ control.valid }} <br>
                Touched: {{ control.touched }}
            </div>

            <div *ngIf="control.invalid && control.touched" style="color: red; margin-top: 5px;">
                Debes aceptar este campo.
            </div>
        </div>
    `
});

export const Default: Story = {
    render: renderStory,
    args: {
        label: 'Acepto términos y condiciones',
        disabled: false,
        required: false,
        initialValue: false,
    },
};

export const Checked: Story = {
    render: renderStory,
    args: {
        ...Default.args,
        initialValue: true
    }
};

export const Disabled: Story = {
    render: renderStory,
    args: {
        ...Default.args,
        disabled: true,
        label: 'Opción no disponible'
    }
};

export const DisabledChecked: Story = {
    render: renderStory,
    args: {
        ...Default.args,
        disabled: true,
        initialValue: true,
        label: 'Aceptado (Bloqueado)'
    }
};

export const Required: Story = {
    render: renderStory,
    args: {
        ...Default.args,
        required: true,
        label: 'Campo obligatorio (prueba hacer click y luego desmarcar)'
    }
};
