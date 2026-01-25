export interface UiSidenavI18n {
    ariaLabel?: string;
    expandLabel?: string;
    collapseLabel?: string;
}

export interface UiSidenavItem {
    id: string;
    label: string;
    icon: string;
    route?: string | any[];
    badge?: string | number;
    badgeColor?: 'primary' | 'warn' | 'accent';
    children?: UiSidenavItem[];
    disabled?: boolean;
}

export type UiSidenavMode = 'side' | 'over' | 'push';
export type UiSidenavState = 'expanded' | 'collapsed';
