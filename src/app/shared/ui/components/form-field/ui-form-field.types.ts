export type UiFormFieldAppearance = 'outline' | 'filled';
export type UiFormFieldSize = 'sm' | 'md' | 'lg';

export interface UiFormFieldConfig {
    label?: string;
    hint?: string;
    appearance?: UiFormFieldAppearance;
    size?: UiFormFieldSize;
    required?: boolean;
    disabled?: boolean;
}
