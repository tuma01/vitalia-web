import { Injectable, signal, computed } from '@angular/core';
import { UiNotification, UiNotificationType } from './ui-notification-drawer.types';

@Injectable({
    providedIn: 'root'
})
export class UiNotificationService {
    // Using Angular Signals for reactive state management
    private _notifications = signal<UiNotification[]>([]);

    readonly notifications = this._notifications.asReadonly();

    readonly unreadCount = computed(() =>
        this._notifications().filter(n => !n.read).length
    );

    add(notification: Omit<UiNotification, 'id' | 'timestamp' | 'read'>) {
        const newNotification: UiNotification = {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            read: false
        };

        this._notifications.update(current => [newNotification, ...current]);
    }

    markAsRead(id: string) {
        this._notifications.update(current =>
            current.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }

    markAllAsRead() {
        this._notifications.update(current =>
            current.map(n => ({ ...n, read: true }))
        );
    }

    remove(id: string) {
        this._notifications.update(current =>
            current.filter(n => n.id !== id)
        );
    }

    clearAll() {
        this._notifications.set([]);
    }
}
