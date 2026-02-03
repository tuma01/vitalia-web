import { Component, Input, effect, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Services
// Services
import { ThemeService } from '../../../../core/services/theme.service';
import { UiColorMode, UiThemeDensity } from '../../../../core/services/ui-theme.types';

// PAL components
import { UiFormFieldComponent } from '../../components/form-field/ui-form-field.component';
import { UiInputComponent } from '../../primitives/input/ui-input.component';
import { UiSelectNativeComponent } from '../../primitives/select-native/ui-select-native.component';
import { UiCheckboxComponent } from '../../primitives/checkbox/ui-checkbox.component';
import { UiRadioButtonComponent } from '../../primitives/radio/ui-radio.component';
import { UiRadioGroupComponent } from '../../primitives/radio/ui-radio-group.component';

export type DemoUIState = 'default' | 'focused' | 'filled' | 'error' | 'disabled' | 'required';

@Component({
  selector: 'app-demo-form-extended',
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
    <div style="display: flex; flex-direction: column; gap: calc(var(--ui-spacing-unit) * 4px); padding: 20px; border-radius: var(--ui-radius-md); border: 1px solid var(--surface-border); background-color: var(--surface-background);">
      <span style="font-size: 10px; font-weight: bold; color: var(--brand-primary); text-transform: uppercase;">{{ brand }} - {{ mode }} - {{ density }} - {{ state }}</span>
      
      <div style="display: flex; flex-direction: column; gap: calc(var(--ui-spacing-unit) * 3px);">
        <ui-form-field label="Input Text" [required]="isRequired" [disabled]="isDisabled" [error]="isError ? 'Error message' : null">
          <ui-input placeholder="Placeholder..." [value]="isFilled ? 'Filled text' : ''"></ui-input>
        </ui-form-field>

        <ui-form-field label="Select Native" [required]="isRequired" [disabled]="isDisabled" [error]="isError ? 'Error message' : null">
          <ui-select-native 
            [options]="[{label: 'Option A', value: 'A'}, {label: 'Option B', value: 'B'}]" 
            [value]="isFilled ? 'A' : null"
          ></ui-select-native>
        </ui-form-field>

        <div style="display: flex; gap: 16px; align-items: center;">
            <ui-checkbox [checked]="isFilled" [disabled]="isDisabled">Checkbox</ui-checkbox>
            <ui-radio-group [disabled]="isDisabled">
                <ui-radio value="A" [checked]="isFilled">A</ui-radio>
                <ui-radio value="B" [checked]="!isFilled">B</ui-radio>
            </ui-radio-group>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class DemoFormExtendedComponent {
  @Input() brand: string = 'vitalia';
  @Input() mode: UiColorMode = 'light';
  @Input() density: UiThemeDensity = 'default';
  @Input() state: DemoUIState = 'default';

  private themeService = inject(ThemeService);
  private elementRef = inject(ElementRef);

  isFocused = false;
  isFilled = false;
  isError = false;
  isDisabled = false;
  isRequired = false;

  constructor() {
    effect(() => {
      // 1. Resolver el tema sin afectar el estado global
      const theme = this.themeService.resolveTheme(this.brand, this.mode, this.density);

      // 2. Aplicar el tema al elemento host de este componente (Scoping)
      this.themeService.applyToElement(theme, this.elementRef.nativeElement);

      // 3. Resolver Estados de UI
      this.resolveState(this.state);
    });
  }

  private resolveState(state: DemoUIState) {
    this.isFocused = state === 'focused';
    this.isFilled = state === 'filled';
    this.isError = state === 'error';
    this.isDisabled = state === 'disabled';
    this.isRequired = state === 'required';
  }
}
