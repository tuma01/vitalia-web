import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type VBadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
export type VBadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type VBadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

@Component({
    selector: 'v-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <ng-content></ng-content>
    <span *ngIf="!hidden && (dot || (content !== null && content !== ''))" [class]="classes">
        {{ badgeContent }}
    </span>
  `,
    styles: [`
    :host {
      position: relative;
      display: inline-flex;
      vertical-align: middle;
    }

    .v-badge-indicator {
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
      background: #b91c1c; // Default premium red
    }

    // SIZES (PRECISE MICRO SCALE)
    .v-badge--sm { height: 16px; min-width: 16px; padding: 0 4px; font-size: 10px; }
    .v-badge--md { height: 18px; min-width: 18px; padding: 0 5px; font-size: 11px; }
    .v-badge--lg { height: 22px; min-width: 22px; padding: 0 6px; font-size: 13px; }
    .v-badge--xs { height: 8px; min-width: 8px; font-size: 0; padding: 0; }

    .v-badge--dot {
      &.v-badge--sm { height: 8px; width: 8px; min-width: 8px; padding: 0; }
      &.v-badge--md { height: 10px; width: 10px; min-width: 10px; padding: 0; }
    }

    // POSITIONS (STRICT SNAP)
    .v-badge--top-right { top: 0; right: 0; transform: translate(15%, -15%); }
    .v-badge--top-left { top: 0; left: 0; transform: translate(-15%, -15%); }
    .v-badge--bottom-right { bottom: 0; right: 0; transform: translate(15%, 15%); }
    .v-badge--bottom-left { bottom: 0; left: 0; transform: translate(-15%, 15%); }
    .v-badge--center { top: 50%; left: 50%; transform: translate(-50%, -50%); }

    // VARIANTS
    .v-badge--primary { background: #3b82f6; }
    .v-badge--success { background: #10b981; }
    .v-badge--warning { background: #f59e0b; }
    .v-badge--danger  { background: #b91c1c; } // Reference Pure Red
    .v-badge--info    { background: #0ea5e9; }
    .v-badge--neutral { background: #6b7280; }

    // THEME DARKOVERRIDE
    :host-context(.theme-dark) .v-badge-indicator {
      border-color: #1e1e1e;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VitaliaBadgeComponent {
    @Input() content: string | number | null = null;
    @Input() variant: VBadgeVariant = 'danger';
    @Input() position: VBadgePosition = 'top-right';
    @Input() size: VBadgeSize = 'sm';
    @Input() dot = false;
    @Input() animation: 'none' | 'pulse' = 'none';
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
            'v-badge-indicator',
            `v-badge--${this.variant}`,
            `v-badge--${this.position}`,
            `v-badge--${this.size}`,
            this.animation === 'pulse' ? 'v-badge--pulse' : '',
            this.dot ? 'v-badge--dot' : ''
        ].filter(Boolean).join(' ');
    }
}
