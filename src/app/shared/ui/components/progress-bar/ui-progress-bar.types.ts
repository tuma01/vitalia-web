export type UiProgressBarMode = 'determinate' | 'indeterminate' | 'buffer' | 'query';
export type UiProgressBarColor = 'primary' | 'accent' | 'warn';

export interface UiProgressBarConfig {
    mode: UiProgressBarMode;
    color: UiProgressBarColor;
}
