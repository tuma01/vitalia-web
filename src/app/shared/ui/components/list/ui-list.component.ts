import { Component, ChangeDetectionStrategy, Directive, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Directive({
  selector: '[uiListItemIcon]',
  standalone: true,
  host: {
    'class': 'ui-list-item-icon',
    'matListItemIcon': ''
  }
})
export class UiListItemIconDirective { }

@Directive({
  selector: '[uiListItemTitle]',
  standalone: true,
  host: {
    'class': 'ui-list-item-title',
    'matListItemTitle': ''
  }
})
export class UiListItemTitleDirective { }

@Directive({
  selector: '[uiListItemLine]',
  standalone: true,
  host: {
    'class': 'ui-list-item-line',
    'matListItemLine': ''
  }
})
export class UiListItemLineDirective { }

@Component({
  selector: 'ui-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-list" [class.ui-list--nav]="nav">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    .ui-list {
      display: flex;
      flex-direction: column;
      padding: var(--ui-space-xs, 4px) 0;
      background: transparent;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiListComponent {
  @Input() nav = false;
}

@Component({
  selector: 'ui-list-item, [ui-list-item]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="ui-list-item" 
      [class.ui-list-item--active]="active"
      [class.ui-list-item--disabled]="disabled"
      (click)="onClick($event)">
      
      <div class="ui-list-item__icon" *ngIf="hasIcon">
        <ng-content select="[uiListItemIcon]"></ng-content>
      </div>
      
      <div class="ui-list-item__content">
        <div class="ui-list-item__title">
          <ng-content select="[uiListItemTitle]"></ng-content>
        </div>
        <div class="ui-list-item__line">
          <ng-content select="[uiListItemLine]"></ng-content>
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .ui-list-item {
      display: flex;
      align-items: center;
      gap: var(--ui-space-md, 16px);
      padding: var(--ui-space-sm, 8px) var(--ui-space-md, 16px);
      border-radius: var(--ui-radius-md, 8px);
      transition: all 0.2s ease;
      cursor: pointer;
      color: var(--ui-color-text-primary, #ffffff);
      margin: 2px var(--ui-space-xs, 4px);

      &:hover:not(.ui-list-item--disabled) {
        background-color: var(--ui-color-bg-hover, rgba(255, 255, 255, 0.05));
      }
    }

    .ui-list-item--active {
      background-color: var(--ui-color-bg-active, rgba(255, 255, 255, 0.1)) !important;
      color: var(--ui-color-primary, #0055A4);
    }

    .ui-list-item--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ui-list-item__icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      color: var(--ui-color-primary, #4dabf7);
      
      ::ng-deep mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .ui-list-item__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
    }

    .ui-list-item__title {
      font-weight: 500;
      font-size: 1rem;
      color: var(--ui-color-text-primary, #ffffff);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ui-list-item__line {
      font-size: 0.875rem;
      color: var(--ui-color-text-secondary, #94a3b8);
      margin-top: 2px;
    }

    /* Support for Navigation appearance */
    :host-context(.ui-list--nav) .ui-list-item:hover:not(.ui-list-item--disabled) {
       background-color: var(--ui-color-bg-hover, rgba(0, 85, 164, 0.08));
       transform: translateX(4px);
    }

    /* Light Mode Overrides */
    :host-context([data-theme="light"]), :host-context(.theme-light) {
      .ui-list-item {
        color: var(--ui-color-text-primary, #1a1a1a);
        &:hover:not(.ui-list-item--disabled) {
          background-color: var(--ui-color-bg-hover, #f3f4f6);
        }
      }
      .ui-list-item__title { color: #1a1a1a; }
      .ui-list-item__line { color: #4b5563; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiListItemComponent {
  @Input() disabled = false;
  @Input() active = false;
  @Input() hasIcon = true;
  @Output() clicked = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
