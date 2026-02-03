import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'foundations-colors',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="color-grid">
      @for (color of colors; track color.name) {
        <div class="color-card">
          <div class="color-swatch" [style.background-color]="color.value"></div>
          <div class="color-info">
            <span class="color-name">{{ color.name }}</span>
            <span class="color-token">{{ color.token }}</span>
            <span class="color-usage">{{ color.usage }}</span>
          </div>
        </div>
      }
    </div>
  `,
    styles: [`
    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 24px;
      padding: 24px;
      font-family: 'Inter', sans-serif;
    }
    .color-card {
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .color-swatch {
      height: 120px;
      width: 100%;
    }
    .color-info {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .color-name { font-weight: 600; color: #1a1a1a; }
    .color-token { font-family: monospace; font-size: 12px; color: #666; }
    .color-usage { font-size: 12px; color: #888; margin-top: 8px; }
  `]
})
class ColorGridComponent {
    colors = [
        { name: 'Primary', token: 'var(--ui-primary)', value: '#3f51b5', usage: 'Main brand color, CVA active states.' },
        { name: 'Primary Dark', token: 'var(--ui-primary-dark)', value: '#303f9f', usage: 'Hover/Focus on buttons.' },
        { name: 'Error', token: 'var(--ui-error)', value: '#f44336', usage: 'Invalid states, error hints.' },
        { name: 'Surface', token: 'var(--ui-surface)', value: '#ffffff', usage: 'Input backgrounds.' },
        { name: 'Border', token: 'var(--ui-border)', value: '#e0e0e0', usage: 'Inactive input borders.' },
        { name: 'Text Global', token: 'var(--ui-text)', value: '#212121', usage: 'Input value, labels.' },
        { name: 'Text Muted', token: 'var(--ui-text-muted)', value: '#757575', usage: 'Placeholders, hints.' }
    ];
}

const meta: Meta<ColorGridComponent> = {
    title: 'Foundations/Colors',
    component: ColorGridComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule],
        }),
    ],
};

export default meta;
type Story = StoryObj<ColorGridComponent>;

export const Palette: Story = {};
