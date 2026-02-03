import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { UiButtonComponent } from '../primitives/button/ui-button.component';
import { UiCardComponent, UiCardHeaderComponent, UiCardContentComponent, UiCardTitleDirective, UiCardSubtitleDirective } from '../components/card/ui-card.component';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiFormFieldComponent } from '../components/form-field/ui-form-field.component';
import { UiDatepickerComponent } from '../components/datepicker/ui-datepicker.component';

@Component({
  selector: 'ui-theme-showcase',
  standalone: true,
  imports: [
    CommonModule,
    UiButtonComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardContentComponent,
    UiCardTitleDirective,
    UiCardSubtitleDirective,
    UiInputComponent,
    UiFormFieldComponent,
    UiDatepickerComponent
  ],
  template: `
    <div class="showcase-container" [style.padding.px]="24">
      <header [style.margin-bottom.px]="32">
        <h1 [style.color]="'var(--ui-color-text-primary)'">PAL Design Platform Showcase</h1>
        <p [style.color]="'var(--ui-color-text-secondary)'">Active Identity: <strong>{{ service.theme().meta.brand }}</strong> | Mode: <strong>{{ service.mode() }}</strong></p>
      </header>

      <div class="showcase-grid" [style.display]="'grid'" [style.grid-template-columns]="'repeat(auto-fill, minmax(400px, 1fr))'" [style.gap.px]="24">
        
        <!-- Action Symbols -->
        <ui-card>
          <ui-card-header>
            <h3 uiCardTitle>Action Matrix</h3>
            <span uiCardSubtitle>Primary, Secondary and Palette Overrides</span>
          </ui-card-header>
          <ui-card-content>
            <div [style.display]="'flex'" [style.gap.px]="12" [style.flex-wrap]="'wrap'">
              <ui-button variant="primary">Primary Action</ui-button>
              <ui-button variant="secondary">Secondary</ui-button>
              <ui-button variant="outline">Outline</ui-button>
              <ui-button variant="ghost">Ghost</ui-button>
            </div>
            <div [style.margin-top.px]="16" [style.color]="'var(--ui-color-text-link)'">
              <a href="#" (click)="$event.preventDefault()">Interactive Link (SaaS override)</a>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Form Elements -->
        <ui-card>
          <ui-card-header>
            <h3 uiCardTitle>Data Entry</h3>
            <span uiCardSubtitle>Inputs and Complex Components</span>
          </ui-card-header>
          <ui-card-content>
            <ui-form-field label="Brand Input" hint="Uses action-primary for focus border">
              <ui-input placeholder="Type something..."></ui-input>
            </ui-form-field>
            
            <div [style.margin-top.px]="16">
              <ui-datepicker label="Event Date" placeholder="Choose a date"></ui-datepicker>
            </div>
          </ui-card-content>
        </ui-card>

        <!-- Typography & Spacing -->
        <ui-card>
          <ui-card-header>
            <h3 uiCardTitle>Structural DNA</h3>
            <span uiCardSubtitle>Typography and Geometry</span>
          </ui-card-header>
          <ui-card-content>
            <div [style.font-family]="'var(--ui-typography-font-family-base)'">
               <p [style.font-size.px]="16">Body text using base font family.</p>
               <p [style.font-weight]="'600'">Semibold body text.</p>
            </div>
            <div [style.margin-top.px]="16" [style.display]="'flex'" [style.gap.px]="8">
              <div [style.width.px]="40" [style.height.px]="40" [style.background]="'var(--ui-color-action-primary)'" [style.border-radius]="'var(--ui-radius-md)'"></div>
              <div [style.width.px]="40" [style.height.px]="40" [style.background]="'var(--ui-color-action-secondary)'" [style.border-radius]="'var(--ui-radius-lg)'"></div>
              <div [style.width.px]="40" [style.height.px]="40" [style.background]="'var(--ui-color-action-accent)'" [style.border-radius]="'var(--ui-radius-full)'"></div>
            </div>
          </ui-card-content>
        </ui-card>

      </div>

      <footer [style.margin-top.px]="48" [style.padding.px]="16" [style.border-top]="'1px solid var(--ui-color-border)'">
        <p [style.font-size.px]="12" [style.color]="'var(--ui-color-text-disabled)'">
          PAL Design System v2.8 | Enterprise Multi-tenant Architecture
        </p>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: var(--ui-background-default);
      min-height: 100vh;
      transition: background 0.3s ease;
    }
  `]
})
export class ThemeShowcaseComponent {
  public service = inject(ThemeService);

  // Input para Storybook
  @Input() set themeConfig(config: { brand: string, overrides: any, mode: string }) {
    if (config) {
      this.service.setBrand(config.brand);
      this.service.setTenantOverrides(config.overrides);
      this.service.setMode(config.mode as any);
    }
  }
}
