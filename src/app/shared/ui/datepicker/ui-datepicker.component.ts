import { Component, Input, forwardRef, ChangeDetectionStrategy, signal, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { UiCalendarComponent } from './ui-calendar.component';
import { UiInputComponent } from '../input/ui-input.component';
import { UiFormFieldComponent } from '../form-field/ui-form-field.component';
import { UiPrefixDirective } from '../form-field/ui-form-field.directives';
import { MatIconModule } from '@angular/material/icon';
import { UiDatepickerI18n, DEFAULT_PAL_I18N } from '../ui-i18n.types';
import { format, isValid, parse } from 'date-fns';

@Component({
    selector: 'ui-datepicker',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        UiCalendarComponent,
        UiInputComponent,
        UiFormFieldComponent,
        UiPrefixDirective,
        MatIconModule
    ],
    templateUrl: './ui-datepicker.component.html',
    styles: [`
    .ui-datepicker {
      display: block;
      width: 100%;
    }
    .ui-datepicker__overlay-container {
      margin-top: 8px;
      animation: ui-datepicker-fade-in 0.2s cubic-bezier(0, 0, 0.2, 1);
      position: relative;
      z-index: 1000;
    }
    @keyframes ui-datepicker-fade-in {
      from { opacity: 0; transform: translateY(-10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiDatepickerComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class UiDatepickerComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() placeholder: string | undefined;
    @Input() disabled = false;
    @Input() locale: 'es' | 'en' = 'es';
    @Input() i18n: UiDatepickerI18n = DEFAULT_PAL_I18N.datepicker;

    value = signal<Date | null>(null);
    isOpen = signal(false);

    // Formatting strings for input
    displayValue = signal('');

    private onChange: (value: Date | null) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(val: Date | null): void {
        if (val && isValid(new Date(val))) {
            const date = new Date(val);
            this.value.set(date);
            this.displayValue.set(format(date, 'dd/MM/yyyy'));
        } else {
            this.value.set(null);
            this.displayValue.set('');
        }
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

    onSelect(date: Date): void {
        this.value.set(date);
        this.displayValue.set(format(date, 'dd/MM/yyyy'));
        this.onChange(date);
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
        // Logic to parse manually typed date could be added here
    }
}
