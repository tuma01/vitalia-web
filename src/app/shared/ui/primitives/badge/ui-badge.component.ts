import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiBadgePosition, UiBadgeSize, UiBadgeVariant, UiBadgeAnimation } from './ui-badge.types';

@Component({
    selector: 'ui-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <ng-content></ng-content>
    <span *ngIf="!hidden && (dot || (content !== null && content !== ''))" 
        [class]="classes"
        [attr.aria-label]="i18n?.ariaLabel">
        {{ badgeContent }}
    </span>
  `,
    styles: [`
    :host {
      position: relative;
      display: inline-flex;
      vertical-align: middle;
    }

    .ui-badge-indicator {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      box-sizing: border-box;
      border-radius: 9999px;
      font-family: var(--ui-font-family-sans, sans-serif);
      font-weight: 700;
      color: #ffffff;
      border: 1.5px solid #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      background: var(--ui-badge-bg, #b91c1c);
    }

    // SIZES
    .ui-badge--sm { height: 16px; min-width: 16px; padding: 0 4px; font-size: 10px; }
    .ui-badge--md { height: 18px; min-width: 18px; padding: 0 5px; font-size: 11px; }
    .ui-badge--lg { height: 22px; min-width: 22px; padding: 0 6px; font-size: 13px; }
    .ui-badge--xs { height: 8px; min-width: 8px; font-size: 0; padding: 0; }

    .ui-badge--dot {
      &.ui-badge--sm { height: 8px; width: 8px; min-width: 8px; padding: 0; }
      &.ui-badge--md { height: 10px; width: 10px; min-width: 10px; padding: 0; }
    }

    // POSITIONS
    .ui-badge--top-right { top: 0; right: 0; transform: translate(15%, -15%); }
    .ui-badge--top-left { top: 0; left: 0; transform: translate(-15%, -15%); }
    .ui-badge--bottom-right { bottom: 0; right: 0; transform: translate(15%, 15%); }
    .ui-badge--bottom-left { bottom: 0; left: 0; transform: translate(-15%, 15%); }
    .ui-badge--center { top: 50%; left: 50%; transform: translate(-50%, -50%); }

    // VARIANTS
    .ui-badge--primary { --ui-badge-bg: var(--ui-color-primary, #3b82f6); }
    .ui-badge--success { --ui-badge-bg: #10b981; }
    .ui-badge--warning { --ui-badge-bg: #f59e0b; }
    .ui-badge--danger  { --ui-badge-bg: var(--ui-color-danger, #b91c1c); }
    .ui-badge--info    { --ui-badge-bg: #0ea5e9; }
    .ui-badge--neutral { --ui-badge-bg: #6b7280; }

    // DARK MODE
    :host-context(.theme-dark) .ui-badge-indicator {
      border-color: #1e1e1e;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiBadgeComponent {
    @Input() content: string | number | null = null;
    @Input() variant: UiBadgeVariant = 'danger';
    @Input() position: UiBadgePosition = 'top-right';
    @Input() size: UiBadgeSize = 'sm';
    @Input() dot = false;
    @Input() animation: UiBadgeAnimation = 'none';
    @Input() i18n?: import('../../config/ui-i18n.types').UiBadgeI18n;
    @Input() hidden = false;
    @Input() max = 99;

    get badgeContent(): string {
        if (this.dot) return '';
        if (typeof this.content === 'number' && this.content > this.max) {
            return `${this.max}+`;
        }
        return this.content?.toString() || '';
    }

    get classes(): string {
        return [
            'ui-badge-indicator',
            `ui-badge--${this.variant}`,
            `ui-badge--${this.position}`,
            `ui-badge--${this.size}`,
            this.animation !== 'none' ? `ui-badge--${this.animation}` : '',
            this.dot ? 'ui-badge--dot' : ''
        ].filter(Boolean).join(' ');
    }
}
