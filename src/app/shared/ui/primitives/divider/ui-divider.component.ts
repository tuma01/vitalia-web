import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-divider',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: [`
    :host {
      display: block;
      border-color: var(--ui-color-border, #e5e7eb);
      border-style: solid;
      margin: 0;
      opacity: 1; /* full opacity to ensure visibility */
    }

    :host.ui-divider--horizontal {
      width: 100%;
      border-width: 1px 0 0 0;
      margin: var(--ui-space-md, 1rem) 0;
    }

    :host.ui-divider--vertical {
      height: 1.5em;
      border-width: 0 0 0 1px;
      margin: 0 var(--ui-space-sm, 0.5rem);
      display: inline-block;
      vertical-align: middle;
    }

    :host.ui-divider--inset {
      margin-left: var(--ui-space-xl, 2rem);
    }

    /* Target both body.theme-dark and host-context */
    :host-context(.theme-dark), 
    :host-context([data-theme="dark"]) {
       border-color: rgba(255, 255, 255, 0.15) !important;
       opacity: 1 !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiDividerComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() inset = false;

  @HostBinding('class.ui-divider--horizontal') get isHorizontal() {
    return this.orientation === 'horizontal';
  }

  @HostBinding('class.ui-divider--vertical') get isVertical() {
    return this.orientation === 'vertical';
  }

  @HostBinding('class.ui-divider--inset') get isInset() {
    return this.inset;
  }
}
