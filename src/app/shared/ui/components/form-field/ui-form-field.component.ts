import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    input,
    computed,
    ViewEncapsulation,
    effect,
    inject,
    Injector,
    OnDestroy,
    signal,
    HostBinding,
    HostListener,
    contentChild,
    ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import { UiConfigService } from '../../config/ui-config.service';
import { UiInputComponent } from '../../primitives/input/ui-input.component';
import { UiSelectComponent } from '../../primitives/select/ui-select.component';
import { UiSelectNativeComponent } from '../../primitives/select-native/ui-select-native.component';
import { UiFormFieldAppearance, UiFormFieldSize } from './ui-form-field.types';
import { UiErrorDirective, UiPrefixDirective, UiSuffixDirective } from './ui-form-field.directives';
import { UiFormManagerService } from '../../services/ui-form-manager.service';
import { UiDirectionService } from '../../services/ui-direction.service';
import { UiFormElement } from '../../services/ui-form-manager.types';

/**
 * UiFormFieldComponent
 * 
 * El orquestador central del sistema de formularios PAL.
 * Implementa el "Reactive Accessibility Engine" mediante Angular Signals.
 * 
 * Su responsabilidad es doble:
 * 1. **Visual**: Manejar el layout, label flotante, borde y subscripts (hint/error).
 * 2. **Inteligencia (Fused Pattern)**: Sincronización semántica de IDs y estados ARIA 
 *    (invalid, required, describedby) en tiempo real.
 */
@Component({
    selector: 'ui-form-field',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatInputModule],
    templateUrl: './ui-form-field.component.html',
    styleUrls: ['./ui-form-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class UiFormFieldComponent implements AfterContentInit, OnDestroy, UiFormElement {
    @HostBinding('class.ui-form-field-host') hostClass = true;
    @HostBinding('class.ui-form-field-host--sm') get smClass() { return this.size() === 'sm'; }
    @HostBinding('class.ui-form-field--no-label') get noLabelClass() { return !this.label(); }
    @HostBinding('class.ui-form-field-host--no-margin') get noMarginClass() { return this.noMargin(); }
    @HostBinding('attr.dir') get dir() { return this.directionService?.dir(); }

    // Modern Signal Inputs
    label = input<string | undefined>();
    hint = input<string | undefined>();
    error = input<string | null>(null);
    appearance = input<UiFormFieldAppearance | undefined>();
    size = input<UiFormFieldSize>('md');
    required = input(false);
    disabled = input(false);
    hideSubscript = input(false);
    noMargin = input(false);

    private uiConfig = inject(UiConfigService);
    private cd = inject(ChangeDetectorRef);
    private injector = inject(Injector);
    private elementRef = inject(ElementRef);
    private formManager = inject(UiFormManagerService, { optional: true });
    private directionService = inject(UiDirectionService, { optional: true }) as UiDirectionService | null;
    private destroy$ = new Subject<void>();

    /** Identificador único para el UX Behavior Engine */
    public id = Math.random().toString(36).substring(2, 9);

    // Computed Properties for Reactivity
    effectiveAppearance = computed(() => this.appearance() ?? this.uiConfig.inputAppearance());

    // State managed by forms integration
    private hasControlError = signal(false);

    /**
     * Estado reactivo agregado del nodo.
     * Requerido por la interfaz UiFormElement para el motor de comportamiento.
     */
    state = computed(() => ({
        invalid: !!this.error() || !!this.errorSlot() || this.hasControlError(),
        touched: this.hasControlError(), // Touched ya disparó el error del control si existe
        severity: (this.error() || this.errorSlot()) ? 'error' : 'info' as any
    }));

    // Modern Signal Queries
    inputComponent = contentChild<UiInputComponent>(UiInputComponent, { descendants: true });
    selectComponent = contentChild<UiSelectComponent>(UiSelectComponent, { descendants: true });
    selectNativeComponent = contentChild<UiSelectNativeComponent>(UiSelectNativeComponent, { descendants: true });
    ngControl = contentChild<NgControl>(NgControl, { descendants: true });

    prefix = contentChild<UiPrefixDirective>(UiPrefixDirective, { descendants: true });
    suffix = contentChild<UiSuffixDirective>(UiSuffixDirective, { descendants: true });
    errorSlot = contentChild<UiErrorDirective>(UiErrorDirective, { descendants: true });

    private injectedInput = inject(UiInputComponent, { optional: true, skipSelf: true });

    // Internal UI State
    isFocused = signal(false);
    hasValue = signal(false);
    fieldId = signal<string | null>(null);

    ngAfterContentInit(): void {
        // 1. REACTIVE ACCESSIBILITY ENGINE: Automatic synchronization of semantic states
        effect(() => {
            const atom = this.inputComponent() || this.selectComponent() || this.selectNativeComponent() || this.injectedInput;
            const size = this.size();
            const error = this.error();
            const hint = this.hint();
            const required = this.required();
            const hasError = this.state().invalid;
            const fieldId = this.fieldId();

            if (atom) {
                // Set the ID baseline
                this.fieldId.set(atom.id);

                // Sync internal signals for backwards compatibility with any surviving custom CSS
                this.isFocused.set(typeof (atom as any).focused === 'function' ? (atom as any).focused() : (atom as any).focused);
                this.hasValue.set(typeof (atom as any).empty === 'function' ? !(atom as any).empty() : !(atom as any).empty);

                // Material handles most of the rest, but we keep the size sync
                (atom as any).size = size;

                this.cd.markForCheck();
            }
        }, { injector: this.injector, allowSignalWrites: true });


        // 2. Forms Integration Logic
        effect(() => {
            const control = this.ngControl()?.control;
            if (control) {
                this.updateControlState();
                control.statusChanges?.pipe(takeUntil(this.destroy$)).subscribe(() => {
                    this.updateControlState();
                });
            }
        }, { injector: this.injector });

        // 3. SMART AUTO-SCROLL REGISTRATION
        if (this.formManager) {
            this.formManager.register(this.id, this);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.formManager) {
            this.formManager.unregister(this.id);
        }
    }

    private updateControlState(): void {
        const control = this.ngControl()?.control;
        if (!control) return;

        const newErrorState = !!(control.invalid && (control.touched || control.dirty));
        if (this.hasControlError() !== newErrorState) {
            this.hasControlError.set(newErrorState);
            this.cd.markForCheck();
        }
    }

    /**
     * Delegates focus to the underlying interactive atom.
     */
    focus(): void {
        const atom = this.inputComponent() || this.selectComponent() || this.selectNativeComponent() || this.injectedInput;
        if (atom && typeof (atom as any).focus === 'function') {
            (atom as any).focus();
        }
    }

    @HostListener('click', ['$event'])
    handleHostClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (target.closest('button') || target.closest('a')) {
            return;
        }
        this.focus();
    }

    /**
     * Exposes the ElementRef for the Form Manager.
     */
    getElementRef(): ElementRef {
        return this.elementRef;
    }
}
