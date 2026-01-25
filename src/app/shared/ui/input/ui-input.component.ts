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
    OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-input',
    standalone: true,
    imports: [],
    template: `
    <input
      #input
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
    ],
})
export class UiInputComponent implements ControlValueAccessor, OnInit {
    private static nextId = 0;

    @Input() id = `ui-input-${UiInputComponent.nextId++}`;
    @Input() name = '';
    @Input() type = 'text';
    @Input() placeholder = '';
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() set value(val: string) {
        this.writeValue(val);
    }

    // Expose state for orchestrator (ui-form-field)
    readonly focused = signal(false);
    readonly empty = signal(true);

    @ViewChild('input', { static: true }) inputElement!: ElementRef<HTMLInputElement>;

    onChange: any = () => { };
    onTouched: any = () => { };

    private renderer = inject(Renderer2);

    ngOnInit(): void {
        // Ensure id is set if it was reset by some logic (though default value should handle it)
        if (!this.id) {
            this.id = `ui-input-${UiInputComponent.nextId++}`;
        }
    }

    writeValue(value: any): void {
        const normalizeValue = value == null ? '' : value;
        this.renderer.setProperty(this.inputElement.nativeElement, 'value', normalizeValue);
        this.empty.set(normalizeValue === '');
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

    handleInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.onChange(value);
        this.empty.set(value === '');
    }

    handleFocus(): void {
        this.focused.set(true);
    }

    handleBlur(): void {
        this.focused.set(false);
        this.onTouched();
    }

    @HostBinding('class.ui-input') hostClass = true;
}
