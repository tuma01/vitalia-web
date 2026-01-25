import { Component, Input, forwardRef, ChangeDetectionStrategy, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { UiTimeSelectorComponent } from './ui-time-selector.component';
import { UiInputComponent } from '../input/ui-input.component';
import { UiFormFieldComponent } from '../form-field/ui-form-field.component';
import { UiPrefixDirective } from '../form-field/ui-form-field.directives';
import { MatIconModule } from '@angular/material/icon';
import { UiTimepickerI18n, DEFAULT_PAL_I18N } from '../ui-i18n.types';

@Component({
    selector: 'ui-timepicker',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        UiTimeSelectorComponent,
        UiInputComponent,
        UiFormFieldComponent,
        UiPrefixDirective,
        MatIconModule
    ],
    templateUrl: './ui-timepicker.component.html',
    styles: [`
    .ui-timepicker {
      display: block;
      width: 100%;
    }
    .ui-timepicker__overlay-container {
      margin-top: 8px;
      animation: ui-timepicker-fade-in 0.2s cubic-bezier(0, 0, 0.2, 1);
      position: relative;
      z-index: 1000;
    }
    @keyframes ui-timepicker-fade-in {
      from { opacity: 0; transform: translateY(-10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiTimepickerComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class UiTimepickerComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() placeholder: string | undefined;
    @Input() disabled = false;
    @Input() format: '12h' | '24h' = '24h';
    @Input() i18n: UiTimepickerI18n = DEFAULT_PAL_I18N.timepicker;

    value = signal<string | null>(null);
    isOpen = signal(false);

    private onChange: (value: string | null) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(val: string | null): void {
        this.value.set(val);
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

    onSelect(time: string): void {
        this.value.set(time);
        this.onChange(time);
        this.onTouched();
        this.isOpen.set(false);
    }

    toggleOverlay(): void {
        if (!this.disabled) {
            this.isOpen.update(o => !o);
        }
    }

    onInputBlur(): void {
        this.onTouched();
    }
}
