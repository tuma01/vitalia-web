import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiSelectNativeComponent } from './ui-select-native.component';
import { UiIconComponent } from '../icon/ui-icon.component';

const meta: Meta<UiSelectNativeComponent> = {
    title: 'PAL/Primitives/Select Native',
    component: UiSelectNativeComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule, UiIconComponent],
        }),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UiSelectNativeComponent>;

const DEFAULT_OPTIONS = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
    { label: 'Option 4 (Disabled)', value: 4, disabled: true },
];

export const Default: Story = {
    args: {
        options: DEFAULT_OPTIONS,
        placeholder: 'Select a number...',
        size: 'md',
    },
};

export const Searchable: Story = {
    args: {
        options: DEFAULT_OPTIONS,
        searchable: true,
        placeholder: 'Type to filter...',
    },
};

export const CustomOptions: Story = {
    args: {
        options: [
            { label: 'Credit Card', value: 'cc', icon: 'credit_card' },
            { label: 'PayPal', value: 'pp', icon: 'payments' },
            { label: 'Wire Transfer', value: 'wt', icon: 'account_balance' },
        ],
        placeholder: 'Select payment method',
    },
};

export const WithImages: Story = {
    args: {
        options: [
            { label: 'United States', value: 'us', image: 'https://flagcdn.com/w40/us.png' },
            { label: 'Spain', value: 'es', image: 'https://flagcdn.com/w40/es.png' },
            { label: 'France', value: 'fr', image: 'https://flagcdn.com/w40/fr.png' },
        ],
        placeholder: 'Select country',
    },
};

export const KeyboardFlow: Story = {
    render: (args) => ({
        props: args,
        template: `
      <div style="max-width: 400px;">
        <p style="font-size: 13px; color: #666; margin-bottom: 16px;">
            💡 <strong>Keyboard Test:</strong> Focus the select, then use <code>ArrowDown/Up</code> to navigate and <code>Enter</code> to select.
        </p>
        <ui-select-native [options]="options" [placeholder]="placeholder"></ui-select-native>
      </div>
    `,
    }),
    args: {
        options: DEFAULT_OPTIONS,
        placeholder: 'Use keyboard now...',
    }
};
