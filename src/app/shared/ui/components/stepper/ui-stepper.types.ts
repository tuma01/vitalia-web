export interface UiStepperI18n {
    ariaLabel?: string;
    nextLabel?: string;
    previousLabel?: string;
    resetLabel?: string;
}

export interface UiStep {
    id: string;
    label: string;
    description?: string;
    state?: 'default' | 'completed' | 'error';
    optional?: boolean;
    editable?: boolean;
}

export type UiStepperOrientation = 'horizontal' | 'vertical';
