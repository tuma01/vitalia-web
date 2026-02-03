import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { UiButtonComponent } from '../primitives/button/ui-button.component';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiFormFieldComponent } from '../components/form-field/ui-form-field.component';
import { ThemeService } from '../../../core/services/theme.service';

const meta: Meta = {
  title: 'Foundations/Theme Playground',
  decorators: [
    applicationConfig({
      providers: [ThemeService]
    })
  ]
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [UiButtonComponent, UiInputComponent, UiFormFieldComponent],
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:24px; max-width:400px; padding: 24px;">
        <h2 style="color: var(--ui-color-text-primary); font-family: var(--ui-typography-font-family-base);">Interactive Laboratory</h2>
        
        <ui-form-field label="Email Address" required hint="Enter your corporate email">
          <ui-input placeholder="user@vitalia.com"></ui-input>
        </ui-form-field>

        <ui-form-field label="Password" error="This field is mandatory">
          <ui-input type="password" value="secret"></ui-input>
        </ui-form-field>

        <div style="display:flex; gap:12px">
          <ui-button variant="primary">Primary Action</ui-button>
          <ui-button variant="secondary">Secondary</ui-button>
        </div>
        
        <div style="display:flex; gap:12px">
          <ui-button variant="outline">Outline</ui-button>
          <ui-button variant="ghost">Ghost Button</ui-button>
        </div>
      </div>
    `,
  }),
};

/** Matrix: Vitalia Health - Light vs Dark */
export const VitaliaLight: Story = {
  parameters: { globals: { baseline: 'vitalia-light' } },
  ...Playground
};

export const VitaliaDark: Story = {
  parameters: { globals: { baseline: 'vitalia-dark' } },
  ...Playground
};

/** Matrix: Educational Settings (School) - Light vs Dark */
export const SchoolLight: Story = {
  parameters: { globals: { baseline: 'school-light' } },
  ...Playground
};

export const SchoolDark: Story = {
  parameters: { globals: { baseline: 'school-dark' } },
  ...Playground
};

/** Matrix: Custom Tenant (Branding Override) */
export const CustomBrandLight: Story = {
  parameters: { globals: { baseline: 'custom' } },
  ...Playground
};
