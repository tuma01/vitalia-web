import { Component, ChangeDetectionStrategy, ViewChild, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatMenu } from '@angular/material/menu';

@Directive({
    selector: '[uiMenuItem]',
    standalone: true,
    host: { 'class': 'ui-menu-item' }
})
export class UiMenuItemDirective { }

@Component({
    selector: 'ui-menu',
    standalone: true,
    imports: [CommonModule, MatMenuModule],
    template: `
    <mat-menu #menu="matMenu" [overlapTrigger]="false" class="ui-menu">
      <ng-content></ng-content>
    </mat-menu>
  `,
    exportAs: 'uiMenu',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiMenuComponent {
    @ViewChild(MatMenu, { static: true }) matMenu!: MatMenu;
}
