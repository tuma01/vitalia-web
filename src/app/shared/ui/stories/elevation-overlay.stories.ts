import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { UiCardComponent, UiCardContentComponent } from '../components/card/ui-card.component';
import { ThemeService } from '../../../core/services/theme.service';

const meta: Meta = {
  title: 'Visual Regression/Critical Patterns/Elevation & Overlays',
  tags: ['critical'],
  decorators: [
    applicationConfig({
      providers: [ThemeService]
    })
  ]
};

export default meta;
type Story = StoryObj;

export const ElevationAndShadows: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [UiCardComponent, UiCardContentComponent],
    },
    template: `
      <div style="padding: 48px; background: var(--ui-background-default); min-height: 100vh; font-family: var(--ui-typography-font-family-base);">
        <h2 style="color: var(--ui-color-text-primary); margin-bottom: 48px;">Depth & Elevation Audit</h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 48px;">
          
          <!-- Static Elevations -->
          <div style="display: flex; flex-direction: column; gap: 32px;">
             <h4 style="color: var(--ui-color-text-secondary); text-transform: uppercase; font-size: 11px;">1. Static Shadows</h4>
             <div style="width: 100%; height: 100px; background: var(--ui-background-surface); border-radius: var(--ui-radius-md); box-shadow: var(--ui-elevation-1); display: flex; align-items: center; justify-content: center; color: var(--ui-color-text-primary);">Elevation 1 (Base)</div>
             <div style="width: 100%; height: 100px; background: var(--ui-background-surface); border-radius: var(--ui-radius-md); box-shadow: var(--ui-elevation-2); display: flex; align-items: center; justify-content: center; color: var(--ui-color-text-primary);">Elevation 2 (Floating)</div>
             <div style="width: 100%; height: 100px; background: var(--ui-background-surface); border-radius: var(--ui-radius-md); box-shadow: var(--ui-elevation-3); display: flex; align-items: center; justify-content: center; color: var(--ui-color-text-primary);">Elevation 3 (Modal)</div>
          </div>

          <!-- Component Layering -->
          <div style="display: flex; flex-direction: column; gap: 32px;">
             <h4 style="color: var(--ui-color-text-secondary); text-transform: uppercase; font-size: 11px;">2. Overlay Mockups</h4>
             
             <!-- Tooltip Simulation -->
             <div style="position: relative; padding: 12px; border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius-sm); text-align: center;">
                Hover me (Simulation)
                <div style="position: absolute; top: -45px; left: 50%; transform: translateX(-50%); background: #1e1e1e; color: white; padding: 6px 12px; border-radius: 4px; font-size: 11px; white-space: nowrap; box-shadow: var(--ui-elevation-2);">
                  System Tooltip Overlay
                  <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid #1e1e1e;"></div>
                </div>
             </div>

             <!-- In-page Dialog Mockup -->
             <div style="background: var(--ui-background-surface); border: 1px solid var(--ui-color-border); border-radius: var(--ui-radius-lg); box-shadow: var(--ui-elevation-3); overflow: hidden;">
                <div style="padding: 16px; border-bottom: 1px solid var(--ui-color-border); font-weight: 600; color: var(--ui-color-text-primary);">Overlay Header</div>
                <div style="padding: 24px; color: var(--ui-color-text-secondary); font-size: 14px;">This simulates a dialog or heavy popup to test shadow contrast in dark vs light mode.</div>
             </div>
          </div>

        </div>
      </div>
    `,
  }),
};

/** Matrix Snapshots */
export const VitaliaLight = { parameters: { globals: { baseline: 'vitalia-light' } }, ...ElevationAndShadows };
export const VitaliaDark = { parameters: { globals: { baseline: 'vitalia-dark' } }, ...ElevationAndShadows };
export const SchoolLight = { parameters: { globals: { baseline: 'school-light' } }, ...ElevationAndShadows };
export const SchoolDark = { parameters: { globals: { baseline: 'school-dark' } }, ...ElevationAndShadows };
