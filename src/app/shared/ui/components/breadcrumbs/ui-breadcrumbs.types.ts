export interface UiBreadcrumbsI18n {
    ariaLabel?: string;
}

export interface UiBreadcrumbItem {
    label: string;
    link?: string | any[];
    icon?: string;
    params?: { [key: string]: any };
}

export type UiBreadcrumbSeparator = 'chevron' | 'slash' | 'arrow' | string;
