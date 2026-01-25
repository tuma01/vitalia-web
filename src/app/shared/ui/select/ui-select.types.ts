export type UiSelectVariant = 'outline' | 'fill';

export interface UiSelectOption {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    label: string;
    icon?: string; // optional for icon prefix
    image?: string; // optional for image prefix (e.g. user avatar or flag)
}
