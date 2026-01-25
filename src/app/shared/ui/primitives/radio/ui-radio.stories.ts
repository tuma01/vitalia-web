import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { UiRadioGroupComponent } from './ui-radio-group.component';
import { UiRadioButtonComponent } from './ui-radio.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

const meta: Meta<UiRadioGroupComponent> = {
    title: 'PAL/Form Field (Radio)',
    component: UiRadioGroupComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [UiRadioGroupComponent, UiRadioButtonComponent, ReactiveFormsModule, CommonModule],
        }),
    ],
    argTypes: {
        orientation: {
            control: 'radio',
            options: ['vertical', 'horizontal']
        }
    },
    parameters: {
        layout: 'centered'
    }
};

export default meta;
type Story = StoryObj<UiRadioGroupComponent>;

export const Default: Story = {
    render: (args) => ({
        props: args,
        template: `
      <ui-radio-group [orientation]="orientation" [name]="name">
        <ui-radio value="1">Option 1</ui-radio>
        <ui-radio value="2">Option 2</ui-radio>
        <ui-radio value="3">Option 3</ui-radio>
      </ui-radio-group>
    `,
    }),
    args: {
        orientation: 'vertical',
        name: 'default-group'
    },
};

export const Horizontal: Story = {
    args: {
        orientation: 'horizontal',
        name: 'horizontal-group'
    },
    render: (args) => ({
        props: args,
        template: `
          <ui-radio-group [orientation]="orientation" [name]="name">
            <ui-radio value="XS">XS</ui-radio>
            <ui-radio value="S">S</ui-radio>
            <ui-radio value="M">M</ui-radio>
            <ui-radio value="L">L</ui-radio>
            <ui-radio value="XL">XL</ui-radio>
          </ui-radio-group>
        `,
    }),
};

export const WithReactiveForms: Story = {
    render: (args) => {
        const control = new FormControl('2', Validators.required);
        return {
            props: {
                ...args,
                control,
                toggleDisable: () => control.disabled ? control.enable() : control.disable()
            },
            template: `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <ui-radio-group [formControl]="control" [orientation]="orientation">
            <ui-radio value="1">Basic Plan</ui-radio>
            <ui-radio value="2">Pro Plan</ui-radio>
            <ui-radio value="3">Enterprise Plan</ui-radio>
          </ui-radio-group>
          
          <div>
            Selected Value: <strong>{{ control.value }}</strong>
          </div>
           
          <button (click)="toggleDisable()">Toggle Disable</button>
        </div>
      `,
        };
    },
    args: {
        orientation: 'vertical',
    },
};
