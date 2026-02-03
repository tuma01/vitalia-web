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

export type DemoUIState = 'default' | 'focused' | 'filled' | 'error' | 'disabled' | 'required';
export type DemoFormPattern = 'LoginForm' | 'MedicalFormSection' | 'DataTableFilters';

/**
 * DemoFormUltraComponent
 * 
 * Orquestador de validación 5D (Marca x Modo x Estado x Componente x Patrón).
 * Diseñado para capturas ultra-precisas en Chromatic.
 */
@Component({
  selector: 'app-demo-form-ultra',
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
    <div class="demo-form-ultra" [style.padding.px]="16" [style.background]="'var(--surface-background)'" [style.borderRadius.px]="8" [style.border]="'1px solid var(--surface-border)'">
      <div style="margin-bottom: 12px; border-bottom: 1px solid var(--surface-border); padding-bottom: 8px;">
        <span style="font-size: 9px; font-weight: 800; color: var(--brand-primary); text-transform: uppercase; letter-spacing: 0.5px;">
          {{ brand }} | {{ mode }} | {{ state }} | {{ pattern }}
        </span>
      </div>

      <ng-container [ngSwitch]="pattern">
        
        <!-- 1. LOGIN FORM PATTERN -->
        <div *ngSwitchCase="'LoginForm'" style="display: flex; flex-direction: column; gap: 12px;">
          <ui-form-field label="Username" [required]="isRequired" [disabled]="isDisabled" [error]="isError ? 'Invalid credentials' : null">
            <ui-input [placeholder]="isFocused ? 'FOCUS ACTIVE' : 'e.g. jdoe'" [value]="isFilled ? 'admin_test' : ''"></ui-input>
          </ui-form-field>
          <ui-form-field label="Password" [required]="isRequired" [disabled]="isDisabled">
            <ui-input type="password" [value]="isFilled ? '********' : ''"></ui-input>
          </ui-form-field>
        </div>

        <!-- 2. MEDICAL FORM PATTERN -->
        <div *ngSwitchCase="'MedicalFormSection'" style="display: flex; flex-direction: column; gap: 12px;">
          <ui-form-field label="Patient Full Name" [required]="isRequired" [disabled]="isDisabled">
            <ui-input [value]="isFilled ? 'Elena Rodriguez' : ''"></ui-input>
          </ui-form-field>
          <ui-form-field label="Blood Type" [required]="isRequired" [disabled]="isDisabled" [error]="isError ? 'Selection required' : null">
            <ui-select-native 
              [options]="[
                { label: 'O Positive (O+)', value: 'O+' },
                { label: 'A Negative (A-)', value: 'A-' }
              ]"
              [value]="isFilled ? 'O+' : null"
            ></ui-select-native>
          </ui-form-field>
        </div>

        <!-- 3. DATATABLE FILTERS PATTERN -->
        <div *ngSwitchCase="'DataTableFilters'" style="display: flex; flex-direction: column; gap: 12px;">
           <ui-form-field label="Quick Search" [disabled]="isDisabled">
            <ui-input placeholder="Filter by name..." [value]="isFilled ? 'Searching...' : ''"></ui-input>
          </ui-form-field>
          <div style="display: flex; gap: 12px; align-items: center;">
            <ui-checkbox [checked]="isFilled" [disabled]="isDisabled">Active only</ui-checkbox>
            <ui-radio-group [disabled]="isDisabled">
                <ui-radio value="all" [checked]="!isFilled">All</ui-radio>
                <ui-radio value="urgent" [checked]="isFilled">Urgent</ui-radio>
            </ui-radio-group>
          </div>
        </div>

      </ng-container>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class DemoFormUltraComponent {
  @Input() brand: string = 'vitalia';
  @Input() mode: UiColorMode = 'light';
  @Input() state: DemoUIState = 'default';
  @Input() pattern: DemoFormPattern = 'LoginForm';
  @Input() componentName: string = ''; // Opcional para filtros específicos

  private themeService = inject(ThemeService);

  isFocused = false;
  isFilled = false;
  isError = false;
  isDisabled = false;
  isRequired = false;

  constructor() {
    effect(() => {
      // Sincronizar motor de temas
      this.themeService.setBrand(this.brand);
      this.themeService.setMode(this.mode);

      // Sincronizar estados de UI
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
