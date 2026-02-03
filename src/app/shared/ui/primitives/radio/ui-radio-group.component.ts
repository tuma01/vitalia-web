import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, QueryList, forwardRef, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UiRadioButtonComponent } from './ui-radio.component';
import { UI_RADIO_GROUP } from './ui-radio-group.token';

@Component({
    selector: 'ui-radio-group',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    styleUrls: ['./ui-radio-group.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiRadioGroupComponent),
            multi: true
        },
        {
            provide: UI_RADIO_GROUP,
            useExisting: UiRadioGroupComponent
        }
    ],
    host: {
        '[class.ui-radio-group]': 'true',
        '[class.ui-radio-group--vertical]': 'orientation === "vertical"',
        '[class.ui-radio-group--horizontal]': 'orientation === "horizontal"'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiRadioGroupComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
    @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
    @Input() name: string = `ui-radio-group-${Math.random().toString(36).substr(2, 9)}`;
    @Input() set disabled(val: boolean) {
        this.setDisabledState(val);
    }

    @ContentChildren(UiRadioButtonComponent, { descendants: true }) radios!: QueryList<UiRadioButtonComponent>;

    private _value: any = null;
    private _disabled = false;
    private destroy$ = new Subject<void>();

    onChange: (value: any) => void = () => { };
    onTouched: () => void = () => { };

    ngAfterContentInit() {
        // Listen to changes in radios (dynamic addition/removal)
        this.radios.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.updateRadios();
        });

        // Initial update
        this.updateRadios();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    writeValue(value: any): void {
        this._value = value;
        this.updateRadios();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._disabled = isDisabled;
        if (this.radios) {
            this.radios.forEach(radio => {
                radio.disabled = isDisabled;
                radio.markForCheck();
            });
        }
    }

    private updateRadios() {
        if (!this.radios) return;

        this.radios.forEach(radio => {
            radio.name = this.name;
            radio.checked = radio.value === this._value;
            if (this._disabled) {
                radio.disabled = true;
            }

            // Subscribe to individual radio clicks
            // Note: This might create duplicate subscriptions if not managed carefully 
            // but simpler for now is to just re-subscribe or rely on template event bubbling/output?
            // Better: The radio emits 'changed'. We can subscribe to the Output? 
            // Programmatic subscription to component output:
            // We need to unsubscribe old ones? 
            // A cleaner way for the radio to notify the group is if we used DI injection of Group into Radio.
            // But let's stick to this orchestration for loose coupling.
            // Actually, DI is standard in Angular Material.

            // Re-thinking: DI is cleaner. "UiRadioButton" injects "UiRadioGroup" (Optional).
            // If group exists, radio calls `group.setValue(this.value)`.
            // Let's refactor UiRadioButton to inject Group.
        });
    }

    // Method called by children
    select(value: any) {
        if (this._disabled) return;
        this._value = value;
        this.onChange(value);
        this.onTouched();
        this.updateRadios(); // Refresh visual state of all radios
    }
}
