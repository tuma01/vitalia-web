import { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
    title: 'Foundations/Token Lab',
};

export default meta;
type Story = StoryObj;

export const ColorTokens: Story = {
    render: () => ({
        template: `
      <div style="padding: 24px; font-family: var(--ui-typography-font-family-base); background: var(--ui-background-default); min-height: 100vh;">
        <h2 style="color: var(--ui-color-text-primary); margin-bottom: 24px;">Semantic Color Tokens</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 24px;">
          
          <!-- Action Palette -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <h4 style="color: var(--ui-color-text-secondary);">Action Palette</h4>
            <div style="background: var(--ui-color-action-primary); padding: 16px; color: white; border-radius: var(--ui-radius-md);">Primary</div>
            <div style="background: var(--ui-color-action-secondary); padding: 16px; color: white; border-radius: var(--ui-radius-md);">Secondary</div>
            <div style="background: var(--ui-color-action-accent); padding: 16px; color: white; border-radius: var(--ui-radius-md);">Accent</div>
            <div style="background: var(--ui-color-action-error); padding: 16px; color: white; border-radius: var(--ui-radius-md);">Error / Warn</div>
          </div>

          <!-- Background Palette -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <h4 style="color: var(--ui-color-text-secondary);">Surfaces</h4>
            <div style="background: var(--ui-background-default); padding: 16px; color: var(--ui-color-text-primary); border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius-md);">Default BG</div>
            <div style="background: var(--ui-background-surface); padding: 16px; color: var(--ui-color-text-primary); border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius-md);">Surface</div>
            <div style="background: var(--ui-background-variant); padding: 16px; color: var(--ui-color-text-primary); border-radius: var(--ui-radius-md);">Variant</div>
          </div>

          <!-- Text Palette -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <h4 style="color: var(--ui-color-text-secondary);">Typography</h4>
            <div style="color: var(--ui-color-text-primary); font-size: 18px; font-weight: 600;">Primary Text</div>
            <div style="color: var(--ui-color-text-secondary);">Secondary Text</div>
            <div style="color: var(--ui-color-text-disabled);">Disabled Text</div>
            <div style="color: var(--ui-color-text-link); text-decoration: underline; cursor: pointer;">Interactive Link</div>
          </div>

        </div>

        <div style="margin-top: 48px; padding: 16px; background: var(--ui-background-variant); border-radius: var(--ui-radius-lg); border: 1px dashed var(--ui-color-border);">
          <h4 style="color: var(--ui-color-text-primary); margin-top: 0;">Code Reference</h4>
          <code style="display: block; padding: 12px; background: #1e1e1e; color: #d4d4d4; border-radius: 4px; font-size: 12px;">
            --ui-color-action-primary: var(--ui-color-action-primary);<br/>
            --ui-background-default: var(--ui-background-default);<br/>
            --ui-color-text-link: var(--ui-color-text-link);
          </code>
        </div>
      </div>
    `,
    }),
};
