import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'foundations-spacing',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="spacing-container">
      <table class="spacing-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Value (px)</th>
            <th>Visual Representation</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          @for (item of scale; track item.token) {
            <tr>
              <td><code>{{ item.token }}</code></td>
              <td>{{ item.value }}px</td>
              <td>
                <div class="spacing-box" [style.width.px]="item.value"></div>
              </td>
              <td>{{ item.usage }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
    styles: [`
    .spacing-container { padding: 24px; font-family: sans-serif; }
    .spacing-table { width: 100%; border-collapse: collapse; }
    .spacing-table th, .spacing-table td { 
      text-align: left; padding: 12px; border-bottom: 1px solid #eee; 
    }
    .spacing-table th { background: #f8f9fa; font-size: 13px; text-transform: uppercase; color: #666; }
    .spacing-box { height: 24px; background: var(--ui-primary, #3f51b5); border-radius: 2px; }
  `]
})
class SpacingScaleComponent {
    scale = [
        { token: '--ds-space-1', value: 4, usage: 'Micro spacing, internal padding' },
        { token: '--ds-space-2', value: 8, usage: 'Tight spacing, element grouping' },
        { token: '--ds-space-3', value: 12, usage: 'Standard form field spacing' },
        { token: '--ds-space-4', value: 16, usage: 'Card margins, section spacing' },
        { token: '--ds-space-6', value: 24, usage: 'Main layout gaps' },
        { token: '--ds-space-8', value: 32, usage: 'Large content separation' },
        { token: '--ds-space-12', value: 48, usage: 'Header/Footer margins' },
        { token: '--ds-space-16', value: 64, usage: 'Hero section padding' }
    ];
}

const meta: Meta<SpacingScaleComponent> = {
    title: 'Foundations/Spacing',
    component: SpacingScaleComponent,
    decorators: [
        moduleMetadata({ imports: [CommonModule] }),
    ],
};

export default meta;
type Story = StoryObj<SpacingScaleComponent>;

export const Scale: Story = {};
