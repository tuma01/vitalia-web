import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { UiCheckboxComponent } from '../primitives/checkbox/ui-checkbox.component';
import { UiRadioButtonComponent } from '../primitives/radio/ui-radio.component';
import { UiRadioGroupComponent } from '../primitives/radio/ui-radio-group.component';
import { ThemeService } from '../../../core/services/theme.service';

const meta: Meta = {
    title: 'Visual Regression/Critical Atoms/Selection Matrix',
    tags: ['critical'],
    decorators: [
        applicationConfig({
            providers: [ThemeService]
        })
    ]
};

export default meta;
type Story = StoryObj;

export const SelectionStates: Story = {
    render: () => ({
        moduleMetadata: {
            imports: [UiCheckboxComponent, UiRadioButtonComponent, UiRadioGroupComponent],
        },
        template: `
      <div style="padding: 24px; background: var(--ui-background-default); min-height: 100vh; font-family: var(--ui-typography-font-family-base);">
        <h2 style="color: var(--ui-color-text-primary); margin-bottom: 32px;">Selection Matrix (Checkbox & Radio)</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px;">
          
          <!-- Checkbox Matrix -->
          <section>
            <h4 style="color: var(--ui-color-text-secondary); margin-bottom: 16px; border-bottom: 1px solid var(--ui-color-border); padding-bottom: 8px;">Checkboxes</h4>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <ui-checkbox [checked]="false">Unchecked State</ui-checkbox>
              <ui-checkbox [checked]="true">Checked State</ui-checkbox>
              <ui-checkbox [disabled]="true">Disabled Unchecked</ui-checkbox>
              <ui-checkbox [checked]="true" [disabled]="true">Disabled Checked</ui-checkbox>
            </div>
          </section>

          <!-- Radio Matrix -->
          <section>
            <h4 style="color: var(--ui-color-text-secondary); margin-bottom: 16px; border-bottom: 1px solid var(--ui-color-border); padding-bottom: 8px;">Radio Buttons</h4>
            <ui-radio-group name="matrix-group" value="selected">
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <ui-radio value="unselected">Unselected Radio</ui-radio>
                <ui-radio value="selected">Selected Radio</ui-radio>
                <ui-radio value="disabled" [disabled]="true">Disabled Unselected</ui-radio>
                <ui-radio value="disabled-selected" [disabled]="true" [checked]="true">Disabled Selected</ui-radio>
              </div>
            </ui-radio-group>
          </section>

        </div>
      </div>
    `,
    }),
};

/** Visual Matrix snapshots */
export const VitaliaLight = { parameters: { globals: { tenant: 'vitalia', mode: 'light' } }, ...SelectionStates };
export const VitaliaDark = { parameters: { globals: { tenant: 'vitalia', mode: 'dark' } }, ...SelectionStates };
export const SchoolLight = { parameters: { globals: { tenant: 'school', mode: 'light' } }, ...SelectionStates };
export const SchoolDark = { parameters: { globals: { tenant: 'school', mode: 'dark' } }, ...SelectionStates };
