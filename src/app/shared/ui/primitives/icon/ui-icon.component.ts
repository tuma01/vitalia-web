import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'ui-icon',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    template: `
    <mat-icon 
      [inline]="inline" 
      [svgIcon]="svgIcon" 
      [fontSet]="fontSet" 
      [fontIcon]="fontIcon"
      [color]="color"
      [attr.aria-hidden]="!ariaLabel"
      [attr.aria-label]="ariaLabel">
      <ng-content></ng-content>
    </mat-icon>
  `,
    styles: [`
    :host {
      display: inline-flex;
      vertical-align: middle;
      line-height: 1;
    }
    
    mat-icon {
      width: var(--ui-icon-size, 24px);
      height: var(--ui-icon-size, 24px);
      font-size: var(--ui-icon-size, 24px);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiIconComponent {
    @Input() inline: boolean = false;
    @Input() svgIcon: string = '';
    @Input() fontSet: string = '';
    @Input() fontIcon: string = '';
    @Input() ariaLabel: string = '';
    @Input() color: string = '';
}
