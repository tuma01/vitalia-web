import { Component, Input, ChangeDetectionStrategy, forwardRef, signal, computed, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { UiConfigService } from '../../config/ui-config.service';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UiSelectOption, UiSelectVariant } from './ui-select.types';
import { DEFAULT_PAL_I18N, UiSelectI18n } from '../../config/ui-i18n.types';

@Component({
    selector: 'ui-select',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule
    ],
    templateUrl: './ui-select.component.html',
    styleUrls: ['./ui-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None, // Essential for global form parity
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiSelectComponent),
            multi: true
        }
    ]
})
export class UiSelectComponent implements ControlValueAccessor, OnInit {
    private static nextId = 0;

    private uiConfig = inject(UiConfigService);

    @Input() id = `ui-select-${UiSelectComponent.nextId++}`;
    @Input() name = '';
    @Input() label = '';
    @Input() placeholder = '';
    @Input() options: UiSelectOption[] = [];
    @Input() disabled = false;
    @Input() required = false;
    @Input() error: string | null = null;
    @Input() hint: string | null = null;

    // Default variant comes from Global Config Signal
    private _variant?: UiSelectVariant;
    @Input() set variant(v: UiSelectVariant) { this._variant = v; }
    get variant(): UiSelectVariant {
        return this._variant || (this.uiConfig.inputAppearance() as UiSelectVariant);
    }
    @Input() set i18n(value: Partial<UiSelectI18n>) {
        this._i18n = { ...DEFAULT_PAL_I18N.select, ...value };
    }
    get i18n(): UiSelectI18n {
        return this._i18n;
    }

    private _i18n: UiSelectI18n = DEFAULT_PAL_I18N.select;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange = (v: any) => { };
    onTouched = () => { };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    writeValue(value: any): void { this.value = value; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerOnChange(fn: any): void { this.onChange = fn; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerOnTouched(fn: any): void { this.onTouched = fn; }
    ngOnInit(): void {
        if (!this.id) {
            this.id = `ui-select-${UiSelectComponent.nextId++}`;
        }
    }

    setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange(value: any) {
        this.value = value;
        this.onChange(value); // Material emits value directly
        this.onTouched();
        this.empty.set(!value);
    }

    get selectedOption(): UiSelectOption | undefined {
        return this.options.find(opt => opt.value === this.value);
    }

    // Atom Contract Signals
    focused = signal(false);
    empty = signal(true);

    // Bind to MatSelect events in template (openedChange -> focused?)
    // Or just use internal state. 
    // MatSelect doesn't exactly map 1:1 to input focus but 'opened' is close, or the trigger focus.
    onOpenedChange(opened: boolean) {
        this.focused.set(opened);
        if (!opened) this.onTouched();
    }
}
