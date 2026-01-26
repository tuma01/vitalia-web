import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UiRatingI18n, DEFAULT_PAL_I18N } from '../../config/ui-i18n.types';

/**
 * UiRatingComponent
 * Professional star/icon rating component.
 * Supports customizable icons, read-only mode, and interactive selection.
 */
@Component({
  selector: 'ui-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div 
      class="ui-rating" 
      [class.ui-rating--disabled]="disabled"
      role="slider"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="max"
      [attr.aria-valuenow]="value"
      [attr.aria-label]="i18n.ariaLabel">
      
      <button 
        *ngFor="let star of stars; let i = index"
        type="button"
        class="ui-rating__star-btn"
        [disabled]="disabled"
        (click)="selectValue(i + 1)"
        (mouseenter)="hoverValue = i + 1"
        (mouseleave)="hoverValue = 0"
        [attr.aria-label]="getItemLabel(i + 1)">
        
        <mat-icon 
          class="ui-rating__icon"
          [class.ui-rating__icon--active]="(hoverValue || value) > i">
          {{ (hoverValue || value) > i ? icon : iconOutline }}
        </mat-icon>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .ui-rating {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .ui-rating__star-btn {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      color: var(--ui-color-text-secondary, #6b7280);
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      outline: none;

      &:hover:not(:disabled) {
        transform: scale(1.2);
      }

      &:disabled {
        cursor: default;
      }
    }

    .ui-rating__icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      transition: color 0.2s ease;
      
      &--active {
        color: var(--ui-color-warning, #f59e0b);
      }
    }

    .ui-rating--disabled {
      opacity: 0.6;
    }

    :host-context(.theme-dark) .ui-rating__icon--active {
      color: #fbbf24;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiRatingComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiRatingComponent implements ControlValueAccessor {
  @Input() max = 5;
  @Input() icon = 'star';
  @Input() iconOutline = 'star_outline';
  @Input() disabled = false;
  @Input() i18n: UiRatingI18n = DEFAULT_PAL_I18N.rating;

  @Output() valueChange = new EventEmitter<number>();

  value = 0;
  hoverValue = 0;
  stars: number[] = [];

  constructor() {
    this.stars = Array(this.max).fill(0);
  }

  ngOnChanges() {
    this.stars = Array(this.max).fill(0);
  }

  onChange: (value: number) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: number): void {
    this.value = value || 0;
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

  selectValue(val: number): void {
    if (!this.disabled) {
      this.value = val;
      this.onChange(val);
      this.onTouched();
      this.valueChange.emit(val);
    }
  }

  getItemLabel(index: number): string {
    return (this.i18n.itemLabel || '').replace('%d', index.toString());
  }
}
