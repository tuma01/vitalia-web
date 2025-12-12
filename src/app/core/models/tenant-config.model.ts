export interface TenantConfig {
    code: string;
    name: string;
    theme: 'theme-indigo-pink' | 'theme-teal-orange' | 'theme-blue-amber' | 'theme-purple-green';
    logoUrl?: string;
    // Others settings...
}
