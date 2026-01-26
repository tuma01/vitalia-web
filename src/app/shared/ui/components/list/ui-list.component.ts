import { Component, ChangeDetectionStrategy, Directive, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Directive({
    selector: '[uiListItemIcon]',
    standalone: true,
    host: { 'class': 'ui-list-item-icon' }
})
export class UiListItemIconDirective { }

@Directive({
    selector: '[uiListItemTitle]',
    standalone: true,
    host: { 'class': 'ui-list-item-title' }
})
export class UiListItemTitleDirective { }

@Directive({
    selector: '[uiListItemLine]',
    standalone: true,
    host: { 'class': 'ui-list-item-line' }
})
export class UiListItemLineDirective { }

@Component({
    selector: 'ui-list',
    standalone: true,
    imports: [CommonModule, MatListModule],
    template: `
    <mat-nav-list *ngIf="nav; else standardList" class="ui-list">
      <ng-content></ng-content>
    </mat-nav-list>
    <ng-template #standardList>
      <mat-list class="ui-list">
        <ng-content></ng-content>
      </mat-list>
    </ng-template>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    .ui-list {
      padding: 0;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiListComponent {
    @Input() nav = false;
}

@Component({
    selector: 'ui-list-item',
    standalone: true,
    imports: [CommonModule, MatListModule],
    template: `
    <mat-list-item 
      [disabled]="disabled" 
      [activated]="active"
      (click)="onClick($event)">
      <div matListItemIcon>
        <ng-content select="[uiListItemIcon]"></ng-content>
      </div>
      <div matListItemTitle>
        <ng-content select="[uiListItemTitle]"></ng-content>
      </div>
      <div matListItemLine>
        <ng-content select="[uiListItemLine]"></ng-content>
      </div>
      <ng-content></ng-content>
    </mat-list-item>
  `,
    styles: [`
    :host {
      display: block;
    }
    
    ::ng-deep .mat-mdc-list-item-icon {
      color: var(--ui-color-primary, #2563eb);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiListItemComponent {
    @Input() disabled = false;
    @Input() active = false;
    @Output() clicked = new EventEmitter<MouseEvent>();

    onClick(event: MouseEvent) {
        if (!this.disabled) {
            this.clicked.emit(event);
        }
    }
}
