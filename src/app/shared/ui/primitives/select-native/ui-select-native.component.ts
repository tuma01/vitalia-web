import {
    Component,
    Input,
    forwardRef,
    signal,
    computed,
    HostListener,
    ElementRef,
    ViewChild,
    inject,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    HostBinding,
    ChangeDetectorRef
} from '@angular/core';
import { UiFormFieldSize } from '../../components/form-field/ui-form-field.types';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiIconComponent } from '../icon/ui-icon.component';
import { UiSelectNativeOption } from './ui-select-native.types';

/**
 * UiSelectNativeComponent
 * 
 * Componente de selección personalizado con soporte nativo de búsqueda y teclado.
 */
@Component({
    selector: 'ui-select-native',
    standalone: true,
    imports: [CommonModule, UiIconComponent, FormsModule],
    templateUrl: './ui-select-native.component.html',
    styleUrls: ['./ui-select-native.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.ui-select-native-host--open]': 'isOpen()'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiSelectNativeComponent),
            multi: true
        }
    ]
})
export class UiSelectNativeComponent<T = any> implements ControlValueAccessor {
    private _options = signal<UiSelectNativeOption<T>[]>([]);
    @Input() set options(val: UiSelectNativeOption<T>[]) {
        this._options.set(val || []);
    }
    get options() { return this._options(); }

    @Input() set size(val: UiFormFieldSize) {
        this._size = val;
        this.cdr.markForCheck();
    }
    get size(): UiFormFieldSize {
        return this._size;
    }
    private _size: UiFormFieldSize = 'md';

    @Input() placeholder: string = 'Select an option';
    @Input() set value(val: T | null) {
        this.writeValue(val);
    }

    @HostBinding('class.ui-select-native-host--sm') get smClass() { return this.size === 'sm'; }
    @HostBinding('class.ui-select-native-host--md') get mdClass() { return this.size === 'md'; }
    @HostBinding('class.ui-select-native-host--lg') get lgClass() { return this.size === 'lg'; }
    @Input() disabled: boolean = false;
    @Input() searchable: boolean = false;
    @Input() hideArrow: boolean = false;

    private static nextId = 0;
    @Input() id = `ui-select-native-${UiSelectNativeComponent.nextId++}`;


    @ViewChild('panel') panelRef?: ElementRef;

    private elementRef = inject(ElementRef);
    private cdr = inject(ChangeDetectorRef);

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

    @Input() set ariaRequired(val: boolean | string) { this._ariaRequired.set(val); this.cdr.markForCheck(); }
    get ariaRequired(): boolean | string { return this._ariaRequired(); }
    _ariaRequired = signal<boolean | string>(false);

    // State
    readonly focused = signal(false);
    readonly empty = signal(true);
    isOpen = signal(false);
    searchTerm = signal('');
    selectedOption = signal<UiSelectNativeOption<T> | null>(null);
    focusedIndex = signal(-1);

    // Computed
    activeDescendant = computed(() => {
        const index = this.focusedIndex();
        return index >= 0 ? `${this.id}-opt-${index}` : '';
    });
    filteredOptions = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const opts = this._options();
        if (!term) return opts;
        return opts.filter(opt =>
            opt.label.toLowerCase().includes(term)
        );
    });

    selectedLabel = computed(() => {
        const selected = this.selectedOption();
        if (selected) return selected.label;

        if (this.focused() || this.isOpen()) {
            return this.placeholder;
        }

        return '';
    });

    // ControlValueAccessor
    private onChange: (value: T | null) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(value: T | null): void {
        const option = this.options.find(opt => opt.value === value);
        this.selectedOption.set(option || null);
        this.empty.set(!option);
        this.cdr.markForCheck();
    }

    registerOnChange(fn: (value: T | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.cdr.markForCheck();
    }

    // Methods
    toggle(): void {
        if (this.disabled) return;
        this.isOpen.update(v => !v);
        this.focused.set(this.isOpen());
        if (!this.isOpen()) {
            this.onTouched();
            this.searchTerm.set('');
        }
    }

    open(): void {
        if (this.disabled) return;
        this.isOpen.set(true);
        this.focused.set(true);
    }

    onFocus(): void {
        if (!this.disabled) this.focused.set(true);
    }

    onBlur(event: FocusEvent): void {
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (relatedTarget && this.elementRef.nativeElement.contains(relatedTarget)) {
            return;
        }

        if (!this.isOpen()) {
            this.focused.set(false);
            this.onTouched();
        }
    }

    close(): void {
        this.isOpen.set(false);
        this.focused.set(false);
        this.onTouched();
        this.searchTerm.set('');
        this.focusedIndex.set(-1);
    }

    selectOption(option: UiSelectNativeOption<T>): void {
        if (option.disabled) return;
        this.selectedOption.set(option);
        this.empty.set(false);
        this.onChange(option.value);
        this.close();
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboard(event: KeyboardEvent): void {
        if (!this.isOpen()) return;

        const filtered = this.filteredOptions();
        const currentIndex = this.focusedIndex();

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.focusedIndex.set(Math.min(currentIndex + 1, filtered.length - 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.focusedIndex.set(Math.max(currentIndex - 1, 0));
                break;
            case 'Enter':
                event.preventDefault();
                if (currentIndex >= 0 && currentIndex < filtered.length) {
                    this.selectOption(filtered[currentIndex]);
                }
                break;
            case 'Escape':
                event.preventDefault();
                this.close();
                break;
        }
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!this.elementRef.nativeElement.contains(target)) {
            this.close();
        }
    }
}
