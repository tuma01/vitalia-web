export interface StatCard {
    titleKey: string;
    value: string | number;
    icon: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'error';
    trend?: {
        value: number;
        isPositive: boolean;
    };
    // Future-proofing for permissions
    requiredPermission?: string;
}
