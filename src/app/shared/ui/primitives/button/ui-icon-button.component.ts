import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type UiIconButtonSize = 'sm' | 'md' | 'lg';
export type UiIconButtonVariant = 'ghost' | 'soft' | 'primary' | 'danger';

@Component({
  selector: 'ui-icon-button',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <button 
      type="button" 
      class="ui-icon-button"
      [class.ui-icon-button--sm]="size === 'sm'"
      [class.ui-icon-button--md]="size === 'md'"
      [class.ui-icon-button--lg]="size === 'lg'"
      [class.ui-icon-button--ghost]="variant === 'ghost'"
      [class.ui-icon-button--soft]="variant === 'soft'"
      [class.ui-icon-button--primary]="variant === 'primary'"
      [class.ui-icon-button--danger]="variant === 'danger'"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel"
      (click)="onClick($event)"
    >
      <mat-icon>{{ icon }}</mat-icon>
      <div class="ui-icon-button__ripple"></div>
    </button>
  `,
  styles: [`
    .ui-icon-button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 50%;
      cursor: pointer;
      color: currentColor;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      aspect-ratio: 1 / 1;
      overflow: hidden;
      outline: none;

      &--sm { 
        width: var(--ui-icon-button-size-sm); 
        height: var(--ui-icon-button-size-sm); 
        mat-icon { font-size: 18px; width: 18px; height: 18px; } 
      }
      &--md { 
        width: var(--ui-icon-button-size-md); 
        height: var(--ui-icon-button-size-md); 
        mat-icon { font-size: 24px; width: 24px; height: 24px; } 
      }
      &--lg { 
        width: var(--ui-icon-button-size-lg); 
        height: var(--ui-icon-button-size-lg); 
        mat-icon { font-size: 28px; width: 28px; height: 28px; } 
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      // VITALIA PREMIUM: Absolute Transparency to Circular Theme-colored Hover
      &--ghost {
        background: transparent !important;
        &:hover:not(:disabled) {
          background: rgba(0, 85, 164, 0.1) !important;
          transform: scale(1.08);
        }
        &:active:not(:disabled) {
          background: rgba(0, 85, 164, 0.15) !important;
          transform: scale(0.92);
        }
      }

      &--soft {
        background: transparent !important;
        color: var(--ui-color-primary, #0055A4);
        &:hover:not(:disabled) {
          background: rgba(0, 85, 164, 0.08) !important;
          transform: scale(1.08);
        }
      }

      &--primary {
        background: var(--ui-color-primary, #0055A4);
        color: white;
        box-shadow: 0 2px 4px rgba(var(--ui-color-primary-rgb, 0, 85, 164), 0.2);
        &:hover:not(:disabled) {
          background: #003366;
          box-shadow: 0 4px 8px rgba(0, 85, 164, 0.3);
          transform: translateY(-1px);
        }
      }

      &--danger {
        color: #ef4444;
        &:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.08);
          transform: scale(1.05);
        }
      }

      mat-icon {
        transition: transform 0.2s ease;
      }
    }

    :host-context(.theme-dark) {
      .ui-icon-button {
        &--ghost:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
        }
        &--soft {
            background: rgba(255, 255, 255, 0.05);
            color: var(--ui-color-primary-light, #60a5fa);
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UiIconButtonComponent {
  @Input() icon: string = '';
  @Input() size: UiIconButtonSize = 'md';
  @Input() variant: UiIconButtonVariant = 'ghost';
  @Input() disabled = false;
  @Input() ariaLabel: string = '';

  @Output() clicked = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
