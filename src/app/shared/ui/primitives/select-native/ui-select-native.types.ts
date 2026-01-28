// ui-select-native.types.ts - Types for native PAL select component

export interface UiSelectNativeOption<T = any> {
    value: T;
    label: string;
    disabled?: boolean;
    icon?: string;
    image?: string;
}

export type UiSelectSize = 'sm' | 'md' | 'lg';
