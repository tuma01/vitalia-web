import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiFormFieldComponent } from './ui-form-field.component';
import { UiInputComponent } from '../../primitives/input/ui-input.component';
import { UiIconComponent } from '../../primitives/icon/ui-icon.component';

/**
 * UiFormField Reactive Accessibility Stories
 * 
 * Estas historias demuestran el "Reactive Accessibility Engine" del PAL.
 * No son solo visuales; validan la sincronización de señales y ARIA en tiempo real.
 */
const meta: Meta<UiFormFieldComponent> = {
    title: 'PAL/Form/UiFormField/Reactive Accessibility',
    component: UiFormFieldComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule, UiInputComponent, UiIconComponent],
        }),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<UiFormFieldComponent>;

// --- Story 1: Default ---
export const Default: Story = {
    render: () => ({
        template: `
      <ui-form-field label="First Name">
        <ui-input placeholder="Enter your name"></ui-input>
      </ui-form-field>
    `,
    }),
};

// --- Story 2: Error Reactivo (Signals LIVE) ---
export const ReactiveError: Story = {
    render: () => {
        const errorMsg = signal<string | null>(null);

        return {
            template: `
        <div style="margin-bottom: 24px;">
            <button class="sb-button" (click)="toggleError()">
                {{ errorMsg() ? '✅ Resolve Error' : '❌ Trigger Error' }}
            </button>
        </div>

        <ui-form-field
          label="Email Address"
          [error]="errorMsg()"
          required
        >
          <ui-input placeholder="user@example.com"></ui-input>
        </ui-form-field>

        <style>
            .sb-button {
                padding: 8px 16px;
                border-radius: 4px;
                border: 1px solid var(--ui-primary);
                background: white;
                color: var(--ui-primary);
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }
            .sb-button:hover { background: #f0f0ff; }
        </style>
      `,
            props: {
                errorMsg,
                toggleError: () =>
                    errorMsg.update(v => (v ? null : 'Invalid email format. Please check your input.')),
            },
        };
    },
};

// --- Story 3: Required Dinámico ---
export const ReactiveRequired: Story = {
    render: () => {
        const isRequired = signal(false);

        return {
            template: `
        <div style="margin-bottom: 24px;">
            <button class="sb-button" (click)="toggle()">
                {{ isRequired() ? 'Make Optional' : 'Make Required' }}
            </button>
        </div>

        <ui-form-field
          label="Phone Number"
          [required]="isRequired()"
        >
          <ui-input placeholder="+1 (555) 000-0000"></ui-input>
        </ui-form-field>

        <style>
            .sb-button {
                padding: 8px 16px;
                border-radius: 4px;
                border: 1px solid #ccc;
                background: white;
                cursor: pointer;
            }
        </style>
      `,
            props: {
                isRequired,
                toggle: () => isRequired.update(v => !v),
            },
        };
    },
};

// --- Story 4: Full Semantic Chain ---
export const FullSemanticChain: Story = {
    render: () => ({
        template: `
      <ui-form-field
        label="Password"
        hint="Must contain at least 8 characters and one symbol"
        error="Password is too weak"
        required
      >
        <ui-input type="password" placeholder="••••••••"></ui-input>
      </ui-form-field>
    `,
    }),
};

// --- Story 5: ARIA Inspector (A11y Debugger) ---
export const AriaInspector: Story = {
    render: () => {
        const error = signal<string | null>('Invalid value detected');
        const required = signal(true);

        return {
            template: `
        <div style="display: flex; gap: 40px; align-items: start;">
            <div style="flex: 1;">
                <ui-form-field
                  label="Username"
                  [error]="error()"
                  [required]="required()"
                >
                  <ui-input #inputComp placeholder="jdoe_vitalia"></ui-input>
                </ui-form-field>
                
                <div style="margin-top: 24px; display: flex; gap: 8px;">
                     <button (click)="error.set(error() ? null : 'Field required')">Toggle Error</button>
                     <button (click)="required.set(!required())">Toggle Required</button>
                </div>
            </div>

            <div class="inspector-panel">
              <div class="inspector-header">
                <ui-icon style="font-size: 18px;">visibility</ui-icon>
                <strong>Accessibility Inspector</strong>
              </div>
              <div class="inspector-content">
                <div class="attribute">
                    <span class="attr-name">aria-invalid</span>
                    <span class="attr-value" [class.val-true]="inputComp.ariaInvalid">{{ inputComp.ariaInvalid }}</span>
                </div>
                <div class="attribute">
                    <span class="attr-name">aria-required</span>
                    <span class="attr-value" [class.val-true]="inputComp.ariaRequired">{{ inputComp.ariaRequired }}</span>
                </div>
                <div class="attribute" title="Linked to hint/error IDs">
                    <span class="attr-name">aria-describedby</span>
                    <span class="attr-value">{{ inputComp.ariaDescribedBy }}</span>
                </div>
                <div class="attribute">
                    <span class="attr-name">active-descendant</span>
                    <span class="attr-value">{{ inputComp.activeDescendant || 'N/A' }}</span>
                </div>
              </div>
            </div>
        </div>

        <style>
            .inspector-panel {
                width: 320px;
                background: #f8f9fa;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
            }
            .inspector-header {
                padding: 12px;
                background: #eee;
                display: flex;
                align-items: center;
                gap: 8px;
                border-bottom: 1px solid #ddd;
            }
            .inspector-content { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
            .attribute { display: flex; justify-content: space-between; font-family: monospace; font-size: 13px; }
            .attr-name { color: #555; }
            .attr-value { color: #d32f2f; font-weight: 600; }
            .attr-value.val-true { color: #2e7d32; }
        </style>
      `,
            props: { error, required },
        };
    },
};
