import { Component, Input, ChangeDetectionStrategy, HostBinding, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UiToolbarMode = 'fixed' | 'floating' | 'docked';

@Component({
  selector: 'ui-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ui-toolbar" [class.ui-toolbar--floating]="mode === 'floating'" [class.ui-toolbar--docked]="mode === 'docked'">
      <div class="ui-toolbar__start">
        <ng-content select="[start]"></ng-content>
      </div>
      
      <div class="ui-toolbar__center">
        <ng-content select="[center]"></ng-content>
      </div>
      
      <div class="ui-toolbar__end">
        <ng-content select="[end]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      z-index: 1000;
    }

    .ui-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 var(--ui-space-md);
      background: var(--ui-toolbar-bg, rgba(255, 255, 255, 0.8));
      backdrop-filter: blur(12px) saturate(180%);
      -webkit-backdrop-filter: blur(12px) saturate(180%);
      border-bottom: 1px solid var(--ui-color-border, rgba(0, 0, 0, 0.08));
      color: var(--ui-color-text, #1f2937);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;

      &--floating {
        margin: var(--ui-space-md);
        width: calc(100% - (var(--ui-space-md) * 2));
        border-radius: var(--ui-radius-lg, 16px);
        border: 1px solid var(--ui-color-border, rgba(255, 255, 255, 0.3));
        box-shadow: var(--ui-elevation-lg);
      }

      &--docked {
          height: 72px;
          border-bottom: none;
      }

      @media (max-width: 640px) {
        height: 56px;
        padding: 0 12px;
      }
    }

    .ui-toolbar__start, .ui-toolbar__end {
      display: flex;
      align-items: center;
      gap: 12px;

      @media (max-width: 480px) {
        gap: 8px;
      }
    }

    .ui-toolbar__center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 0 24px;

      @media (max-width: 768px) {
        display: none; // Auto-hide center on smaller tablets/phones
      }
    }

    :host-context(.theme-dark) {
      .ui-toolbar {
        background: var(--ui-background-default-transparent, rgba(15, 23, 42, 0.8));
        border-bottom-color: var(--ui-color-border, rgba(255, 255, 255, 0.08));
        color: var(--ui-color-text-primary, #f3f4f6);

        &--floating {
            border-color: rgba(255, 255, 255, 0.1);
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UiToolbarComponent {
  @Input() mode: UiToolbarMode = 'fixed';

  @HostBinding('style.position')
  get position() {
    return this.mode === 'fixed' ? 'sticky' : 'relative';
  }

  @HostBinding('style.top')
  get top() {
    return '0';
  }
}
