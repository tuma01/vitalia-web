export type UiNotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

export interface UiNotificationAction {
    label: string;
    action: () => void;
}

export interface UiNotification {
    id: string;
    title: string;
    message: string;
    type: UiNotificationType;
    timestamp: Date;
    read: boolean;
    actions?: UiNotificationAction[];
    /** Optional link to navigate to */
    link?: string;
    /** Icon override */
    icon?: string;
}

export interface UiNotificationState {
    notifications: UiNotification[];
    unreadCount: number;
}
