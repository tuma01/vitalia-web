import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'foundations-typography',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="typo-container">
      <section class="typo-section">
        <h3>Font Families</h3>
        <div class="font-preview" style="font-family: 'Outfit', sans-serif;">
          <strong>Outfit:</strong> The quick brown fox jumps over the lazy dog (Display/Headers)
        </div>
        <div class="font-preview" style="font-family: 'Inter', sans-serif;">
          <strong>Inter:</strong> The quick brown fox jumps over the lazy dog (UI/Body)
        </div>
      </section>

      <section class="typo-section">
        <h3>Heading Scale</h3>
        <h1 class="preview">Heading 1 (h1) - 32px</h1>
        <h2 class="preview">Heading 2 (h2) - 24px</h2>
        <h3 class="preview">Heading 3 (h3) - 20px</h3>
        <h4 class="preview">Heading 4 (h4) - 16px</h4>
      </section>

      <section class="typo-section">
        <h3>UI/Body Scale</h3>
        <div class="typo-row">
          <span class="label">Body Large</span>
          <span class="preview" style="font-size: 16px;">The quick brown fox (16px)</span>
        </div>
        <div class="typo-row">
          <span class="label">Body Medium (Default)</span>
          <span class="preview" style="font-size: 14px;">The quick brown fox (14px)</span>
        </div>
        <div class="typo-row">
          <span class="label">Body Small (Hints/Labels)</span>
          <span class="preview" style="font-size: 12px;">The quick brown fox (12px)</span>
        </div>
        <div class="typo-row">
          <span class="label">Micro (Captions)</span>
          <span class="preview" style="font-size: 10px;">The quick brown fox (10px)</span>
        </div>
      </section>
    </div>
  `,
    styles: [`
    .typo-container { padding: 24px; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; gap: 40px; }
    .typo-section h3 { margin-bottom: 24px; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .font-preview { padding: 16px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 12px; font-size: 18px; }
    .typo-row { display: flex; align-items: baseline; gap: 24px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
    .label { width: 180px; font-size: 12px; color: #999; text-transform: uppercase; }
    .preview { margin: 0; color: #1a1a1a; }
  `]
})
class TypographyScaleComponent { }

const meta: Meta<TypographyScaleComponent> = {
    title: 'Foundations/Typography',
    component: TypographyScaleComponent,
    decorators: [
        moduleMetadata({ imports: [CommonModule] }),
    ],
};

export default meta;
type Story = StoryObj<TypographyScaleComponent>;

export const Scale: Story = {};
