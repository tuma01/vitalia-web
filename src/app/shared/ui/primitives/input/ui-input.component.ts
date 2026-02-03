import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    Renderer2,
    ViewChild,
    forwardRef,
    inject,
    signal,
    OnInit,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { UiFormFieldSize } from '../../components/form-field/ui-form-field.types';

/**
 * UiInputComponent
 * 
 * Átomo fundamental del sistema de formularios.
 * Su responsabilidad es manejar la entrada de texto y el estado de foco/valor.
 */
@Component({
    selector: 'ui-input',
    standalone: true,
    imports: [CommonModule, MatInputModule],
    template: `
    <input
      #input
      matInput
      class="ui-input__native"
      [attr.id]="id"
      [attr.name]="name || id"
      [attr.type]="type"
      [attr.placeholder]="placeholder"
      [disabled]="disabled"
      [readonly]="readonly"
      (input)="handleInput($event)"
      (focus)="handleFocus()"
      (blur)="handleBlur()">
  `,
    styleUrls: ['./ui-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiInputComponent),
            multi: true,
        },
        {
            provide: MatFormFieldControl,
            useExisting: forwardRef(() => UiInputComponent),
        },
    ],
})
export class UiInputComponent implements ControlValueAccessor, OnInit, OnDestroy, MatFormFieldControl<string> {
    private static nextId = 0;

    stateChanges = new Subject<void>();
    controlType = 'ui-input';
    ngControl = inject(NgControl, { optional: true, self: true });

    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }

    @Input() id = `ui-input-${UiInputComponent.nextId++}`;
    @Input() name = '';
    @Input() type = 'text';
    @Input() placeholder = '';
    @Input() disabled = false;
    @Input() readonly = false;

    // Reactive ARIA properties with Getters for Testability
    @Input() set ariaLabel(val: string) { this._ariaLabel.set(val); this.cdr.markForCheck(); }
    get ariaLabel(): string { return this._ariaLabel(); }
    _ariaLabel = signal('');

    @Input() set ariaDescribedBy(val: string) { this._ariaDescribedBy.set(val); this.cdr.markForCheck(); }
    get ariaDescribedBy(): string { return this._ariaDescribedBy(); }
    _ariaDescribedBy = signal('');

    @Input() set ariaInvalid(val: boolean | string) { this._ariaInvalid.set(val); this.cdr.markForCheck(); }
    get ariaInvalid(): boolean | string { return this._ariaInvalid(); }
    _ariaInvalid = signal<boolean | string>(false);

    @Input() set ariaRequired(val: boolean | string) {
        this._ariaRequired.set(val);
        this._required = val === true || val === 'true';
        this.stateChanges.next();
    }
    get ariaRequired(): boolean | string { return this._ariaRequired(); }
    _ariaRequired = signal<boolean | string>(false);

    private _required = false;
    get required(): boolean { return this._required; }
    set required(value: boolean) {
        this._required = value;
        this.stateChanges.next();
    }

    get errorState(): boolean {
        return !!this._ariaInvalid();
    }

    @HostBinding('attr.aria-describedby') _describedBy = '';
    setDescribedByIds(ids: string[]) {
        this._describedBy = ids.join(' ');
    }

    onContainerClick(event: MouseEvent) {
        if ((event.target as Element).tagName.toLowerCase() !== 'input') {
            this.focus();
        }
    }

    @Input() set value(val: string) {
        this.writeValue(val);
    }

    @Input() set size(val: UiFormFieldSize) {
        this._size = val;
        this.cdr.markForCheck();
    }
    get size(): UiFormFieldSize {
        return this._size;
    }
    private _size: UiFormFieldSize = 'md';

    @HostBinding('class.ui-input-host--sm') get smClass() { return this.size === 'sm'; }
    @HostBinding('class.ui-input-host--md') get mdClass() { return this.size === 'md'; }
    @HostBinding('class.ui-input-host--lg') get lgClass() { return this.size === 'lg'; }

    // Expose state for orchestrator (ui-form-field) and MatFormFieldControl
    private _focused = signal(false);
    get focused(): boolean { return this._focused(); }

    private _empty = signal(true);
    get empty(): boolean { return this._empty(); }

    @ViewChild('input', { static: true }) inputElement!: ElementRef<HTMLInputElement>;

    onChange: any = () => { };
    onTouched: any = () => { };

    private renderer = inject(Renderer2);
    private cdr = inject(ChangeDetectorRef);

    ngOnDestroy(): void {
        this.stateChanges.complete();
    }

    ngOnInit(): void {
        if (!this.id) {
            this.id = `ui-input-${UiInputComponent.nextId++}`;
        }
    }

    writeValue(value: any): void {
        const normalizeValue = value == null ? '' : value;
        if (this.inputElement) {
            this.renderer.setProperty(this.inputElement.nativeElement, 'value', normalizeValue);
            this._empty.set(normalizeValue === '');
            this.cdr.markForCheck();
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
        this.cdr.markForCheck();
    }

    handleInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.onChange(value);
        this._empty.set(value === '');
        this.stateChanges.next();
    }

    handleFocus(): void {
        this._focused.set(true);
        this.stateChanges.next();
    }

    handleBlur(): void {
        this._focused.set(false);
        this.onTouched();
        this.stateChanges.next();
    }

    /**
     * Focuses the native input element.
     */
    focus(): void {
        this.inputElement.nativeElement.focus();
    }

    @HostBinding('class.ui-input') hostClass = true;

    @HostListener('click')
    handleHostClick(): void {
        this.focus();
    }
}
