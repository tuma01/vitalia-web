import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UiButtonComponent } from '../../primitives/button/ui-button.component';
import { UiIconButtonComponent } from '../../primitives/button/ui-icon-button.component';
import { UiNotificationService } from './ui-notification.service';
import { UiNotification } from './ui-notification-drawer.types';
import { animate, style, transition, trigger } from '@angular/animations';

export interface UiNotificationDrawerI18n {
    title: string;
    markAllRead: string;
    emptyState: string;
    closeAriaLabel: string;
}

@Component({
    selector: 'ui-notification-drawer',
    standalone: true,
    imports: [CommonModule, MatIconModule, UiButtonComponent, UiIconButtonComponent],
    templateUrl: './ui-notification-drawer.component.html',
    styleUrls: ['./ui-notification-drawer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0)' }))
            ]),
            transition(':leave', [
                animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(100%)' }))
            ])
        ])
    ]
})
export class UiNotificationDrawerComponent {
    @Input() isOpen = false;
    @Input() i18n: UiNotificationDrawerI18n = {
        title: 'Notifications',
        markAllRead: 'Mark all as read',
        emptyState: 'No new notifications',
        closeAriaLabel: 'Close notifications'
    };

    @Output() close = new EventEmitter<void>();

    service = inject(UiNotificationService);
    notifications = this.service.notifications;

    onClose() {
        this.close.emit();
    }

    markAsRead(id: string, event: Event) {
        event.stopPropagation();
        this.service.markAsRead(id);
    }

    markAllRead() {
        this.service.markAllAsRead();
    }

    remove(id: string, event: Event) {
        event.stopPropagation();
        this.service.remove(id);
    }
}
