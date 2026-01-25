import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, HostBinding, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'ui-checkbox',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule],
    templateUrl: './ui-checkbox.component.html',
    styleUrls: ['./ui-checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiCheckboxComponent),
            multi: true
        }
    ]
})
export class UiCheckboxComponent implements ControlValueAccessor, OnInit {
    private static nextId = 0;

    @Input() id = `ui-checkbox-${UiCheckboxComponent.nextId++}`;
    @Input() name = '';
    @Input() label = '';
    @Input() checked = false;
    @Input() disabled = false;
    @Input() required = false;

    @Output() toggle = new EventEmitter<boolean>();

    focused = false;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        if (!this.id) {
            this.id = `ui-checkbox-${UiCheckboxComponent.nextId++}`;
        }
    }

    // ControlValueAccessor API
    onChange: (value: any) => void = () => { };
    onTouched: () => void = () => { };

    writeValue(value: boolean): void {
        this.checked = !!value;
        this.cdr.markForCheck();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.cdr.markForCheck();
    }

    // Event Handlers
    onInputChange(event: Event): void {
        event.stopPropagation();
        const input = event.target as HTMLInputElement;
        if (input) {
            this.checked = input.checked;
            this.onChange(this.checked);
            this.onTouched();
            this.toggle.emit(this.checked);
        }
    }

    onInputBlur(): void {
        this.focused = false;
        this.onTouched();
    }

    onInputFocus(): void {
        this.focused = true;
    }

    // Host bindings for styling
    @HostBinding('class.ui-checkbox--checked') get isChecked() { return this.checked; }
    @HostBinding('class.ui-checkbox--disabled') get isDisabled() { return this.disabled; }
    @HostBinding('class.ui-checkbox--focused') get isFocused() { return this.focused; }
}
