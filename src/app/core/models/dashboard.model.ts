export type StatColor =
    | 'primary-container'
    | 'secondary-container'
    | 'tertiary-container'
    | 'error-container'
    | 'surface-container-high';

export interface StatCardConfig {
    id: string;
    titleKey: string;        // i18n key
    value: number | string;  // dinámico
    icon: string;            // material icon
    color: StatColor;        // token M3
    route?: string;          // navegación opcional
    requiredPermission?: string; // para futuro control por rol
}

export interface ActivityConfig {
    id: string;
    titleKey: string;
    timeKey: string;
    timeParams?: { [key: string]: string | number };
    icon: string;
    variant: 'primary' | 'secondary' | 'tertiary';
    requiredPermission?: string;
}

export interface QuickActionConfig {
    id: string;
    labelKey: string;
    icon: string;
    route?: string;
    actionType?: 'route' | 'dialog';
    requiredPermission?: string;
}

export interface DashboardConfig {
    version: 1;
    stats: StatCardConfig[];
    activities?: ActivityConfig[];
    quickActions?: QuickActionConfig[];
}
