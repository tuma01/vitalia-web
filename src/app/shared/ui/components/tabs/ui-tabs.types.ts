export type UiTabsVariant = 'line' | 'pills';

export interface UiTabChangeEvent {
    index: number;
    label: string;
}

export interface UiTabConfig {
    variant: UiTabsVariant;
    animated: boolean;
}
