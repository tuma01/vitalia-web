export type UiProgressSpinnerMode = 'determinate' | 'indeterminate';
export type UiProgressSpinnerColor = 'primary' | 'accent' | 'warn';
export type UiProgressSpinnerSize = 'sm' | 'md' | 'lg';

export interface UiProgressSpinnerConfig {
    mode: UiProgressSpinnerMode;
    color: UiProgressSpinnerColor;
    size: UiProgressSpinnerSize;
}
