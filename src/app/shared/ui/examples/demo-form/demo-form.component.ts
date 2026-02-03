import { Component, Input, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Services
import { ThemeService } from '../../../../core/services/theme.service';
import { UiColorMode } from '../../../../core/services/ui-theme.types';

// PAL components
import { UiFormFieldComponent } from '../../components/form-field/ui-form-field.component';
import { UiInputComponent } from '../../primitives/input/ui-input.component';
import { UiSelectNativeComponent } from '../../primitives/select-native/ui-select-native.component';
import { UiCheckboxComponent } from '../../primitives/checkbox/ui-checkbox.component';
import { UiRadioButtonComponent } from '../../primitives/radio/ui-radio.component';
import { UiRadioGroupComponent } from '../../primitives/radio/ui-radio-group.component';

/**
 * DemoFormComponent
 * 
 * Sandbox real que integra los componentes críticos del PAL
 * y reacciona dinámicamente al motor de temas.
 */
@Component({
  selector: 'app-demo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldComponent,
    UiInputComponent,
    UiSelectNativeComponent,
    UiCheckboxComponent,
    UiRadioButtonComponent,
    UiRadioGroupComponent
  ],
  template: `
    <div class="demo-form-container" [style.padding.px]="24" [style.background]="'var(--surface-background)'" [style.borderRadius.px]="12" [style.border]="'1px solid var(--surface-border)'">
      <div style="margin-bottom: 24px; border-bottom: 1px solid var(--surface-border); padding-bottom: 16px;">
        <h2 style="color: var(--brand-primary); margin: 0;">{{ brandName }} Sandbox</h2>
        <p style="color: var(--text-secondary); font-size: 14px; margin: 4px 0 0 0;">Experience Engine v2.17 - {{ modeName }}</p>
      </div>

      <div style="display: grid; gap: 24px; max-width: 500px;">
        <!-- 1. Text Entry -->
        <ui-form-field label="Patient Name" [required]="true" hint="As registered in the clinical history">
          <ui-input placeholder="e.g. Elena Rodriguez"></ui-input>
        </ui-form-field>

        <!-- 2. Selection -->
        <ui-form-field label="Primary Department" [required]="true">
          <ui-select-native [options]="[
            { label: 'Internal Medicine', value: 'internal' },
            { label: 'Cardiology', value: 'cardio' },
            { label: 'Emergency', value: 'emergency' },
            { label: 'Pediatrics', value: 'peds' }
          ]"></ui-select-native>
        </ui-form-field>

        <!-- 3. Validation State -->
        <ui-form-field label="Emergency Contact Email" [error]="'Please provide a valid corporate email'">
          <ui-input value="invalid-email@example"></ui-input>
        </ui-form-field>

        <!-- 4. Binary Controls -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <label style="color: var(--text-primary); font-weight: 600; font-size: 14px;">Clinical Consents</label>
          <ui-checkbox [checked]="true">Informed consent for procedure</ui-checkbox>
          <ui-checkbox [checked]="false">Privacy policy accepted</ui-checkbox>
        </div>

        <!-- 5. Group Selection -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <label style="color: var(--text-primary); font-weight: 600; font-size: 14px;">Triage Priority</label>
          <ui-radio-group orientation="horizontal">
            <ui-radio value="red" [checked]="true">Red (Critical)</ui-radio>
            <ui-radio value="yellow">Yellow (Urgent)</ui-radio>
            <ui-radio value="green">Green (Normal)</ui-radio>
          </ui-radio-group>
        </div>
      </div>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--surface-border); display: flex; justify-content: flex-end;">
        <p style="color: var(--text-disabled); font-size: 12px; font-family: monospace;">BRAND_ID: {{ brand }} | MODE: {{ mode }}</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DemoFormComponent {
  @Input() brand: string = 'vitalia';
  @Input() mode: UiColorMode = 'light';

  private themeService = inject(ThemeService);

  get brandName(): string {
    return this.brand === 'vitalia' ? 'Vitalia Health' : 'Vitalia School';
  }

  get modeName(): string {
    return this.mode === 'light' ? 'Light Mode' : 'Dark Mode';
  }

  constructor() {
    // Orquestación reactiva: Al cambiar los inputs del componente, actualizamos el motor global
    effect(() => {
      this.themeService.setBrand(this.brand);
      this.themeService.setMode(this.mode);
    });
  }
}
