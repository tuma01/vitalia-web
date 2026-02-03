import { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Visual Regression/Critical Foundations/Foundations Lab',
  tags: ['critical'],
  parameters: {
    chromatic: { disableSnapshot: false },
  }
};

export default meta;
type Story = StoryObj;

export const TypographyAndGeometry: Story = {
  render: () => ({
    template: `
      <div style="padding: 32px; background: var(--ui-background-default); min-height: 100vh; font-family: var(--ui-typography-font-family-base);">
        <h1 style="color: var(--ui-color-text-primary); margin-bottom: 48px; border-bottom: 2px solid var(--ui-color-action-primary); padding-bottom: 12px;">Visual Foundations Audit</h1>

        <!-- Typography Scale -->
        <section style="margin-bottom: 64px;">
          <h3 style="color: var(--ui-color-text-secondary); text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-bottom: 24px;">1. Typography Scale</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="font-size: 32px; font-weight: 700; color: var(--ui-color-text-primary);">Headline XL (32px / Bold)</div>
            <div style="font-size: 24px; font-weight: 600; color: var(--ui-color-text-primary);">Headline Large (24px / Semibold)</div>
            <div style="font-size: 16px; font-weight: 400; color: var(--ui-color-text-primary);">Body Standard (16px / Regular)</div>
            <div style="font-size: 14px; font-weight: 400; color: var(--ui-color-text-secondary);">Caption Small (14px / Regular)</div>
            <div style="font-size: 12px; font-weight: 500; color: var(--ui-color-text-disabled); text-transform: uppercase;">Overline XS (12px / Medium)</div>
          </div>
        </section>

        <!-- Spacing System -->
        <section style="margin-bottom: 64px;">
          <h3 style="color: var(--ui-color-text-secondary); text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-bottom: 24px;">2. Spacing System (Stack)</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="width: 100%; height: 4px; background: var(--ui-color-action-secondary); border-radius: 2px;" title="4px"></div>
            <div style="width: 100%; height: 8px; background: var(--ui-color-action-secondary); border-radius: 2px;" title="8px"></div>
            <div style="width: 100%; height: 16px; background: var(--ui-color-action-secondary); border-radius: 2px;" title="16px"></div>
            <div style="width: 100%; height: 24px; background: var(--ui-color-action-secondary); border-radius: 2px;" title="24px"></div>
            <div style="width: 100%; height: 32px; background: var(--ui-color-action-secondary); border-radius: 2px;" title="32px"></div>
          </div>
        </section>

        <!-- Radius System -->
        <section style="margin-bottom: 64px;">
          <h3 style="color: var(--ui-color-text-secondary); text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-bottom: 24px;">3. Radius & Geometry</h3>
          <div style="display: flex; gap: 24px; flex-wrap: wrap;">
            <div style="width: 80px; height: 80px; background: var(--ui-background-variant); border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius-sm); display: flex; align-items: center; justify-content: center; font-size: 10px;">Small</div>
            <div style="width: 80px; height: 80px; background: var(--ui-background-variant); border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius-md); display: flex; align-items: center; justify-content: center; font-size: 10px;">Medium</div>
            <div style="width: 80px; height: 80px; background: var(--ui-background-variant); border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius-lg); display: flex; align-items: center; justify-content: center; font-size: 10px;">Large</div>
            <div style="width: 80px; height: 80px; background: var(--ui-background-variant); border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius-full); display: flex; align-items: center; justify-content: center; font-size: 10px;">Full</div>
          </div>
        </section>

        <!-- Accessibility: Focus Ring -->
        <section>
          <h3 style="color: var(--ui-color-text-secondary); text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-bottom: 24px;">4. Interactive Focus DNA</h3>
          <div style="padding: 16px; border: 2px solid var(--ui-color-action-primary); border-radius: var(--ui-radius-md); display: inline-block; box-shadow: 0 0 0 4px rgba(var(--ui-color-action-primary-rgb), 0.2);">
            <span style="color: var(--ui-color-text-primary);">Focus State Representation</span>
          </div>
        </section>
      </div>
    `,
  }),
};

/** Matrix Snapshots */
export const VitaliaLight = { parameters: { globals: { baseline: 'vitalia-light' } }, ...TypographyAndGeometry };
export const VitaliaDark = { parameters: { globals: { baseline: 'vitalia-dark' } }, ...TypographyAndGeometry };
export const SchoolLight = { parameters: { globals: { baseline: 'school-light' } }, ...TypographyAndGeometry };
export const SchoolDark = { parameters: { globals: { baseline: 'school-dark' } }, ...TypographyAndGeometry };
