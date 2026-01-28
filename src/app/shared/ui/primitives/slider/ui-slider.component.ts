import { Component, Input, forwardRef, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { UiSliderI18n, DEFAULT_PAL_I18N } from '../../config/ui-i18n.types';

/**
 * UiSliderComponent
 * Professional wrapper for MatSlider following PAL architectural standards.
 * Supports discrete, continuous, and theme-compliant styling.
 */
@Component({
  selector: 'ui-slider',
  standalone: true,
  imports: [CommonModule, MatSliderModule, FormsModule],
  template: `
    <div class="ui-slider-container" [class.ui-slider--disabled]="disabled">
      <mat-slider
        [min]="min"
        [max]="max"
        [step]="step"
        [discrete]="discrete"
        [showTickMarks]="showTicks"
        [disabled]="disabled"
        [attr.aria-label]="i18n.ariaLabel">
        <input 
          matSliderThumb 
          [(ngModel)]="value" 
          (ngModelChange)="onValueChange($event)"
          (blur)="onTouched()">
      </mat-slider>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .ui-slider-container {
      padding: 8px 0;
    }

    /* GDS Custom Styling */
    ::ng-deep .mat-mdc-slider {
      --mdc-slider-active-track-color: var(--ui-color-primary, #0055A4);
      --mdc-slider-inactive-track-color: var(--ui-color-border, rgba(0, 0, 0, 0.12));
      --mdc-slider-handle-color: var(--ui-color-primary, #0055A4);
      --mdc-slider-handle-hover-ripple-color: var(--ui-color-primary-transparent, rgba(0, 85, 164, 0.1));
      --mdc-slider-handle-focus-ripple-color: var(--ui-color-primary-transparent, rgba(0, 85, 164, 0.2));
      --mdc-slider-with-tick-marks-active-container-color: var(--ui-color-surface, #fff);
      --mdc-slider-with-tick-marks-inactive-container-color: var(--ui-color-primary, #0055A4);
    }

    :host-context(.theme-dark) ::ng-deep .mat-mdc-slider {
      --mdc-slider-active-track-color: var(--ui-color-primary-light, #4dabf7);
      --mdc-slider-handle-color: var(--ui-color-primary-light, #4dabf7);
      --mdc-slider-inactive-track-color: rgba(255, 255, 255, 0.15);
      --mdc-slider-with-tick-marks-active-container-color: var(--ui-background-default, #000);
      --mdc-slider-with-tick-marks-inactive-container-color: var(--ui-color-primary, #0055A4);
    }

    .ui-slider--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSliderComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiSliderComponent implements ControlValueAccessor {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() discrete = false;
  @Input() showTicks = false;
  @Input() disabled = false;
  @Input() i18n: UiSliderI18n = DEFAULT_PAL_I18N.slider;

  private _value: number = 0;

  get value(): number {
    return this._value;
  }

  set value(val: number) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
    }
  }

  onChange: (value: number) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: number): void {
    this._value = value || 0;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(val: number): void {
    this.value = val;
  }
}
