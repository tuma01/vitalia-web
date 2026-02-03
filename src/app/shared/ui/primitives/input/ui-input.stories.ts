import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiInputComponent } from './ui-input.component';

const meta: Meta<UiInputComponent> = {
    title: 'PAL/Primitives/Input',
    component: UiInputComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule],
        }),
    ],
    tags: ['autodocs'],
    argTypes: {
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
        type: { control: 'select', options: ['text', 'password', 'email', 'number'] },
        disabled: { control: 'boolean' },
        placeholder: { control: 'text' },
    },
};

export default meta;
type Story = StoryObj<UiInputComponent>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
        size: 'md',
    },
};

export const Sizes: Story = {
    render: () => ({
        template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <ui-input size="sm" placeholder="Small (sm)"></ui-input>
        <ui-input size="md" placeholder="Medium (md)"></ui-input>
        <ui-input size="lg" placeholder="Large (lg)"></ui-input>
      </div>
    `,
    }),
};

export const States: Story = {
    render: () => ({
        template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <ui-input placeholder="Default state"></ui-input>
        <ui-input [disabled]="true" placeholder="Disabled state"></ui-input>
        <ui-input [readonly]="true" value="Readonly value" placeholder="Readonly state"></ui-input>
      </div>
    `,
    }),
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter password...',
        value: 'secret123',
    },
};
