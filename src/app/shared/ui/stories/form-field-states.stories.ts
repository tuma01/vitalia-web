import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { UiFormFieldComponent } from '../components/form-field/ui-form-field.component';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { ThemeService } from '../../../core/services/theme.service';

const meta: Meta = {
  title: 'Visual Regression/Critical Atoms/Form Field States',
  tags: ['critical'],
  decorators: [
    applicationConfig({
      providers: [ThemeService]
    })
  ]
};

export default meta;
type Story = StoryObj;

export const AllStates: Story = {
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  render: () => ({
    moduleMetadata: {
      imports: [UiFormFieldComponent, UiInputComponent],
    },
    template: `
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 32px; background: var(--ui-background-default); min-height: 100vh;">
        <h2 style="color: var(--ui-color-text-primary); font-family: var(--ui-typography-font-family-base);">Form Field State Matrix</h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px;">
          
          <!-- Standard State -->
          <ui-form-field label="Default Identity" hint="Normal state description">
            <ui-input placeholder="Brand identity active"></ui-input>
          </ui-form-field>

          <!-- Error State (High Priority) -->
          <ui-form-field label="Error Logic" error="This information is critical for diagnosis">
            <ui-input value="Invalid data"></ui-input>
          </ui-form-field>

          <!-- Required State -->
          <ui-form-field label="Patient Name" [required]="true">
            <ui-input placeholder="Required field identifier"></ui-input>
          </ui-form-field>

          <!-- Disabled State -->
          <ui-form-field label="Immutable System Data" [disabled]="true">
            <ui-input value="Locked value" [disabled]="true"></ui-input>
          </ui-form-field>

          <!-- Focus State Simulation (using auto-focus or distinct border highlighting) -->
          <ui-form-field label="Interaction Focus" hint="Border should reflect primary brand color">
            <ui-input placeholder="Focusing this field..."></ui-input>
          </ui-form-field>

        </div>
      </div>
    `,
  }),
};

/** Visual Matrix snapshots */
export const VitaliaLight = { parameters: { globals: { baseline: 'vitalia-light' } }, ...AllStates };
export const VitaliaDark = { parameters: { globals: { baseline: 'vitalia-dark' } }, ...AllStates };
export const SchoolLight = { parameters: { globals: { baseline: 'school-light' } }, ...AllStates };
export const SchoolDark = { parameters: { globals: { baseline: 'school-dark' } }, ...AllStates };
