import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { UiToggleComponent } from './ui-toggle.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

const meta: Meta<UiToggleComponent> = {
    title: 'PAL/Form Field (Toggle)',
    component: UiToggleComponent,
    tags: ['autodocs'],
    decorators: [
        moduleMetadata({
            imports: [UiToggleComponent, ReactiveFormsModule, CommonModule],
        }),
    ],
    parameters: {
        layout: 'centered'
    }
};

export default meta;
type Story = StoryObj<UiToggleComponent>;

export const Default: Story = {
    render: (args) => ({
        props: args,
        template: `
      <ui-toggle [disabled]="disabled">
        Enable Notifications
      </ui-toggle>
    `,
    }),
    args: {
        disabled: false
    },
};

export const Disabled: Story = {
    args: {
        disabled: true
    },
    render: (args) => ({
        props: args,
        template: `
          <ui-toggle [disabled]="disabled">
            Cannot change this
          </ui-toggle>
        `,
    }),
};

export const WithReactiveForms: Story = {
    render: (args) => {
        const control = new FormControl(true);
        return {
            props: {
                ...args,
                control,
                toggleDisable: () => control.disabled ? control.enable() : control.disable()
            },
            template: `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <ui-toggle [formControl]="control">
             Dark Mode
          </ui-toggle>
          
          <div>
            Current State: <strong>{{ control.value }}</strong>
          </div>
           
          <button (click)="toggleDisable()">Toggle Disable</button>
        </div>
      `,
        };
    },
};
