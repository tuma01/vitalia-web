import { Meta, StoryObj } from '@storybook/angular';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata } from '@storybook/angular';
import { UiInputComponent } from './ui-input.component';
import { UiFormFieldComponent } from '../../components/form-field/ui-form-field.component';
import { UiErrorDirective, UiPrefixDirective, UiSuffixDirective } from '../../components/form-field/ui-form-field.directives';

const meta: Meta<UiFormFieldComponent> = {
    title: 'PAL/Form Field (Input)',
    component: UiFormFieldComponent,
    decorators: [
        moduleMetadata({
            imports: [
                ReactiveFormsModule,
                UiInputComponent,
                UiPrefixDirective,
                UiSuffixDirective,
                UiErrorDirective
            ],
        }),
    ],
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        required: { control: 'boolean' },
        disabled: { control: 'boolean' },
        error: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<UiFormFieldComponent>;

export const Default: Story = {
    render: (args) => ({
        props: {
            ...args,
            control: new FormControl('')
        },
        template: `
      <ui-form-field [label]="label" [required]="required" [disabled]="disabled" [error]="error">
        <ui-input uiInput [formControl]="control" placeholder="Escribe algo..."></ui-input>
        <ui-error uiError *ngIf="error || control.invalid">Mensaje de error</ui-error>
      </ui-form-field>
    `,
    }),
    args: {
        label: 'Nombre de Usuario',
        required: false,
        disabled: false,
        error: null,
    },
};

export const WithPrefixSuffix: Story = {
    render: (args) => ({
        props: {
            ...args,
            control: new FormControl('')
        },
        template: `
      <ui-form-field [label]="label" [required]="required">
        <span uiPrefix>👤</span>
        <ui-input uiInput [formControl]="control" placeholder="Usuario"></ui-input>
        <span uiSuffix>✅</span>
      </ui-form-field>
    `,
    }),
    args: {
        label: 'Usuario',
        required: true,
    },
};

export const InvalidState: Story = {
    render: (args) => ({
        props: {
            ...args,
            control: new FormControl('', Validators.required)
        },
        template: `
        <ui-form-field label="Email" required>
          <ui-input uiInput [formControl]="control" value="" placeholder="Email"></ui-input>
        </ui-form-field>
        <p style="margin-top: 1rem; color: #666; font-size: 0.8em;">Note: Touch the field and leave to see validation error.</p>
      `,
    }),
};
