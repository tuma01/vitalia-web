export type UiExpansionState = 'collapsed' | 'expanded';

export interface UiExpansionPanelChangeEvent {
    expanded: boolean;
    id?: string;
}

export interface UiExpansionConfig {
    multi?: boolean; // If true, multiple panels can be open in an accordion
    hideToggle?: boolean;
}
