import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * UiSkeletonComponent
 * Primitive component to show a shimmer loading state.
 */
@Component({
  selector: 'ui-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: [`
    :host {
      display: block;
      background-color: var(--ui-skeleton-bg, #e5e7eb);
      position: relative;
      overflow: hidden;
      
      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background-image: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0.2) 20%,
          rgba(255, 255, 255, 0.5) 60%,
          rgba(255, 255, 255, 0)
        );
        animation: ui-shimmer 2s infinite;
      }
    }

    @keyframes ui-shimmer {
      100% {
        transform: translateX(100%);
      }
    }

    :host(.ui-skeleton--circle) {
      border-radius: 50%;
    }

    :host(.ui-skeleton--rect) {
      border-radius: var(--ui-radius-md, 8px);
    }

    :host(.ui-skeleton--text) {
      height: 0.8em;
      margin: 0.2em 0;
      border-radius: var(--ui-radius-sm, 4px);
    }

    :host-context(.theme-dark) {
      background-color: var(--ui-background-variant, #27272a);
      &::after {
        background-image: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0.05) 20%,
          rgba(255, 255, 255, 0.1) 60%,
          rgba(255, 255, 255, 0)
        );
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiSkeletonComponent {
  @Input() width?: string;
  @Input() height?: string;
  @Input() variant: 'text' | 'rect' | 'circle' = 'text';

  @HostBinding('style.width') get w() { return this.width; }
  @HostBinding('style.height') get h() { return this.height; }
  @HostBinding('class.ui-skeleton--text') get isText() { return this.variant === 'text'; }
  @HostBinding('class.ui-skeleton--rect') get isRect() { return this.variant === 'rect'; }
  @HostBinding('class.ui-skeleton--circle') get isCircle() { return this.variant === 'circle'; }
}
