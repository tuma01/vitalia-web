import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { UiButtonComponent } from '../primitives/button/ui-button.component';
import { ThemeService } from '../../../core/services/theme.service';

const meta: Meta = {
  title: 'Visual Regression/Critical Atoms/Button Matrix',
  tags: ['critical'],
  decorators: [
    applicationConfig({
      providers: [ThemeService]
    })
  ]
};

export default meta;
type Story = StoryObj;

export const AllVariants: Story = {
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  render: () => ({
    moduleMetadata: {
      imports: [UiButtonComponent],
    },
    template: `
      <div style="padding: 24px; background: var(--ui-background-default); min-height: 100vh; font-family: var(--ui-typography-font-family-base);">
        <h2 style="color: var(--ui-color-text-primary); margin-bottom: 32px;">Button Variant Matrix</h2>

        <div style="display: grid; gap: 48px;">
          
          <!-- State: Normal -->
          <section>
            <h4 style="color: var(--ui-color-text-secondary); margin-bottom: 16px;">State: Normal</h4>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <ui-button variant="primary">Primary</ui-button>
              <ui-button variant="secondary">Secondary</ui-button>
              <ui-button variant="outline">Outline</ui-button>
              <ui-button variant="ghost">Ghost</ui-button>
              <ui-button variant="danger">Danger</ui-button>
            </div>
          </section>

          <!-- State: Loading -->
          <section>
            <h4 style="color: var(--ui-color-text-secondary); margin-bottom: 16px;">State: Loading</h4>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <ui-button variant="primary" [loading]="true">Primary</ui-button>
              <ui-button variant="secondary" [loading]="true">Secondary</ui-button>
              <ui-button variant="outline" [loading]="true">Outline</ui-button>
            </div>
          </section>

          <!-- State: Disabled -->
          <section>
            <h4 style="color: var(--ui-color-text-secondary); margin-bottom: 16px;">State: Disabled</h4>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <ui-button variant="primary" [disabled]="true">Primary</ui-button>
              <ui-button variant="secondary" [disabled]="true">Secondary</ui-button>
              <ui-button variant="outline" [disabled]="true">Outline</ui-button>
              <ui-button variant="ghost" [disabled]="true">Ghost</ui-button>
            </div>
          </section>

        </div>
      </div>
    `,
  }),
};

/** Visual Matrix snapshots */
export const VitaliaLight = { parameters: { globals: { baseline: 'vitalia-light' } }, ...AllVariants };
export const VitaliaDark = { parameters: { globals: { baseline: 'vitalia-dark' } }, ...AllVariants };
export const SchoolLight = { parameters: { globals: { baseline: 'school-light' } }, ...AllVariants };
export const SchoolDark = { parameters: { globals: { baseline: 'school-dark' } }, ...AllVariants };
export const CustomOverride = { parameters: { globals: { baseline: 'custom' } }, ...AllVariants };
