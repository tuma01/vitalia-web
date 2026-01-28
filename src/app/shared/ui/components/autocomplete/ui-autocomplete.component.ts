import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { UiFormFieldComponent } from '../form-field/ui-form-field.component';
import { UiInputDirective } from '../form-field/ui-form-field.directives';
import { UiInputComponent } from '../../primitives/input/ui-input.component';
import { UiAutocompleteI18n, DEFAULT_PAL_I18N } from '../../config/ui-i18n.types';
import { Observable, startWith, map } from 'rxjs';

/**
 * UiAutocompleteComponent
 * Molecular component for advanced selection with dynamic filtering.
 * Bridges Material Autocomplete with PAL styling and UX.
 */
@Component({
  selector: 'ui-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    UiFormFieldComponent,
    UiInputDirective
  ],
  template: `
    <div class="ui-autocomplete" [class.ui-autocomplete--disabled]="disabled">
      <ui-form-field [label]="label" [error]="error" [id]="id">
        <input
          #input
          uiInput
          class="ui-autocomplete__input"
          [formControl]="control"
          [placeholder]="(isFocused() || hasValue()) ? placeholder : ''"
          [matAutocomplete]="auto"
          [attr.aria-label]="i18n.ariaLabel"
          (focus)="onFocus()"
          (blur)="onBlur()">
        
        <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" (optionSelected)="onSelected($event)">
          <mat-option *ngFor="let option of filteredOptions | async" [value]="option" class="ui-autocomplete__option">
            {{ getLabel(option) }}
          </mat-option>
          <mat-option *ngIf="options.length > 0 && (filteredOptions | async)?.length === 0" disabled>
            {{ i18n.noResultsMessage }}
          </mat-option>
        </mat-autocomplete>
      </ui-form-field>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .ui-autocomplete {
      width: 100%;
    }

    /* Naked input to blend with ui-form-field */
    .ui-autocomplete__input {
      width: 100%;
      border: none !important;
      background: transparent !important;
      padding: 0 !important;
      margin: 0 !important;
      font-size: 1rem;
      color: inherit;
      outline: none;
      height: 24px;
      line-height: 24px;
      box-shadow: none !important;
    }

    ::ng-deep .mat-mdc-autocomplete-panel {
      background: var(--ui-color-surface, #fff) !important;
      border-radius: 12px !important;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
      border: 1px solid var(--ui-color-border, #e5e7eb) !important;
      margin-top: 4px !important;
    }

    ::ng-deep .mat-mdc-option {
      transition: background 0.2s ease;
      
      &:hover:not(.mdc-list-item--disabled) {
        background: var(--ui-color-bg-hover, #f3f4f6) !important;
      }

      &.mdc-list-item--selected:not(.mdc-list-item--disabled) {
        background: var(--ui-color-bg-active, #e5e7eb) !important;
        .mdc-list-item__primary-text {
          color: var(--ui-color-primary, #0055A4);
          font-weight: 600;
        }
      }
    }

    :host-context(.theme-dark) ::ng-deep .mat-mdc-autocomplete-panel {
      background: var(--ui-background-surface, #1e1e1e) !important;
      border-color: var(--ui-color-border, #333) !important;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiAutocompleteComponent),
      multi: true
    },
    {
      provide: UiInputComponent,
      useExisting: forwardRef(() => UiAutocompleteComponent)
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiAutocompleteComponent implements OnInit, ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() options: Array<{ label: string, value: any }> = [];
  @Input() error = '';
  @Input() disabled = false;
  @Input() id = `ui-auto-${Math.random().toString(36).substr(2, 9)}`;
  @Input() i18n: UiAutocompleteI18n = DEFAULT_PAL_I18N.autocomplete;

  @Output() optionSelected = new EventEmitter<any>();

  control = new FormControl<any>('');
  filteredOptions!: Observable<Array<{ label: string, value: any }>>;

  // State Signals for UiFormField compatibility
  readonly focused = signal(false);
  readonly empty = signal(true);

  isFocused = computed(() => this.focused());
  hasValue = computed(() => !this.empty());

  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  ngOnInit() {
    // Initial state check
    this.empty.set(!this.control.value);

    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(this.control.value || ''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.label;
        const currentEmpty = !name;
        this.empty.set(currentEmpty);

        if (name) {
          return this._filter(name as string);
        } else {
          return this.options.slice();
        }
      })
    );
  }

  onFocus() {
    this.focused.set(true);
  }

  onBlur() {
    this.focused.set(false);
    this.onTouched();
  }

  getLabel(option: any): string {
    if (!option) return '';
    return typeof option === 'object' ? option.label : option;
  }

  private _filter(name: string): Array<{ label: string, value: any }> {
    const filterValue = name.toLowerCase();
    return this.options.filter(option =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: any): string {
    return option && option.label ? option.label : '';
  }

  onSelected(event: any): void {
    const option = event.option.value;
    this.onChange(option.value);
    this.optionSelected.emit(option.value);
  }

  writeValue(value: any): void {
    const option = this.options.find(o => o.value === value);
    this.control.setValue((option || value) as any, { emitEvent: false });
    this.empty.set(!value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }
}
