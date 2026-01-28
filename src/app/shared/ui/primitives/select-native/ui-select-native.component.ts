import { Component, Input, forwardRef, signal, computed, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiIconComponent } from '../icon/ui-icon.component';
import { UiSelectNativeOption } from './ui-select-native.types';

@Component({
    selector: 'ui-select-native',
    standalone: true,
    imports: [CommonModule, UiIconComponent, FormsModule],
    templateUrl: './ui-select-native.component.html',
    styleUrls: ['./ui-select-native.component.scss'],
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

    @Input() placeholder: string = 'Select an option';
    @Input() disabled: boolean = false;
    @Input() searchable: boolean = false;
    @Input() hideArrow: boolean = false;

    private static nextId = 0;
    @Input() id = `ui-select-native-${UiSelectNativeComponent.nextId++}`;

    @ViewChild('panel') panelRef?: ElementRef;

    // State
    readonly focused = signal(false);
    readonly empty = signal(true);
    isOpen = signal(false);
    searchTerm = signal('');
    selectedOption = signal<UiSelectNativeOption<T> | null>(null);
    focusedIndex = signal(-1);

    // Computed
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
        if (this.focused() || this.isOpen()) return this.placeholder;
        return '';
    });

    // ControlValueAccessor
    private onChange: (value: T | null) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(value: T | null): void {
        const option = this.options.find(opt => opt.value === value);
        this.selectedOption.set(option || null);
        this.empty.set(!option);
    }

    registerOnChange(fn: (value: T | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
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

    // Keyboard navigation
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

    // Click outside to close
    @HostListener('document:click', ['$event'])
    handleClickOutside(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!this.elementRef.nativeElement.contains(target)) {
            this.close();
        }
    }

    constructor(private elementRef: ElementRef) { }
}
