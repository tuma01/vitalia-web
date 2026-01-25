import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UiBreadcrumbItem, UiBreadcrumbSeparator, UiBreadcrumbsI18n } from './ui-breadcrumbs.types';

@Component({
    selector: 'ui-breadcrumbs',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './ui-breadcrumbs.component.html',
    styleUrls: ['./ui-breadcrumbs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiBreadcrumbsComponent {
    /** List of breadcrumb items to display */
    @Input() items: UiBreadcrumbItem[] = [];

    /** Internationalization configuration */
    @Input() i18n?: UiBreadcrumbsI18n;

    /** Separator type or custom string between items */
    @Input() separator: UiBreadcrumbSeparator = 'chevron';

    /** Emits when a breadcrumb link is clicked */
    @Output() itemClick = new EventEmitter<UiBreadcrumbItem>();

    onItemClick(item: UiBreadcrumbItem): void {
        if (item.link) {
            this.itemClick.emit(item);
        }
    }
}
