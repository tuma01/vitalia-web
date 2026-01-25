import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    Input,
    ViewEncapsulation,
    effect,
    inject,
    Injector,
    OnDestroy,
    signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UiConfigService } from '../../config/ui-config.service';
import { UiInputComponent } from '../../primitives/input/ui-input.component';
import { UiSelectComponent } from '../../primitives/select/ui-select.component';
import { UiFormFieldAppearance, UiFormFieldSize } from './ui-form-field.types';
import { UiErrorDirective, UiPrefixDirective, UiSuffixDirective } from './ui-form-field.directives';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'ui-form-field',
    standalone: true,
    imports: [],
    templateUrl: './ui-form-field.component.html',
    styleUrls: ['./ui-form-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'style': 'display: block;'
    }
})
export class UiFormFieldComponent implements AfterContentInit, OnDestroy {
    @Input() label?: string;
    @Input() hint?: string;
    @Input() error?: string | null;

    private uiConfig = inject(UiConfigService);

    // Default appearance comes from Global Config, can be overridden by input
    @Input() appearance: UiFormFieldAppearance = this.uiConfig.inputAppearance();
    @Input() size: UiFormFieldSize = 'md';
    @Input() required = false;
    @Input() disabled = false;

    // Queries
    @ContentChild(UiInputComponent) inputComponent?: UiInputComponent;
    @ContentChild(UiSelectComponent) selectComponent?: UiSelectComponent;
    @ContentChild(NgControl) ngControl?: NgControl;

    @ContentChild(UiPrefixDirective) prefix?: UiPrefixDirective;
    @ContentChild(UiSuffixDirective) suffix?: UiSuffixDirective;

    // ... (rest of query section)

    @ContentChild(UiErrorDirective) errorSlot?: UiErrorDirective;

    // State
    isFocused = false;
    hasValue = false;
    hasControlError = false;

    // Reactive State for Layout
    hasPrefix = signal(false);
    hasSuffix = signal(false);
    fieldId = signal<string | null>(null);

    private cd = inject(ChangeDetectorRef);
    private destroy$ = new Subject<void>();

    get hasError(): boolean {
        return !!this.error || !!this.errorSlot || this.hasControlError;
    }

    private injector = inject(Injector); // Injector needed for effect() in lifecycle hook

    ngAfterContentInit(): void {
        // 0. Update Layout Signals
        this.hasPrefix.set(!!this.prefix);
        this.hasSuffix.set(!!this.suffix);

        // 1. Wire up Atom State (Visuals: Focus, Empty)
        const atom = this.inputComponent || this.selectComponent;

        if (atom) {
            // Wait for next tick to ensure atom has its ID generated if it's new
            setTimeout(() => {
                this.fieldId.set(atom.id);
                this.cd.markForCheck();
            });

            effect(() => {
                this.isFocused = atom.focused();
                // For select, empty means unselected. For input, empty string.
                this.hasValue = !atom.empty();
                this.cd.markForCheck();
            }, { injector: this.injector });
        }

        // 2. Wire up Forms State (Validation, Disabled)
        if (this.ngControl) {
            const control = this.ngControl.control;
            if (control) {
                this.updateControlState();
                control.statusChanges?.pipe(takeUntil(this.destroy$)).subscribe(() => {
                    this.updateControlState();
                });
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateControlState(): void {
        const control = this.ngControl?.control;
        if (!control) return;

        if (control.disabled !== this.disabled) {
            // Sync logic if needed
        }

        const newErrorState = !!(control.invalid && (control.touched || control.dirty));

        if (this.hasControlError !== newErrorState) {
            this.hasControlError = newErrorState;
            this.cd.markForCheck();
        }
    }
}
