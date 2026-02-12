export interface SidenavItem {
    id: string;
    label: string;
    icon?: string;
    route?: string;
    type?: string;
    badge?: string | number;
    badgeColor?: string;
    children?: SidenavItem[];
}
