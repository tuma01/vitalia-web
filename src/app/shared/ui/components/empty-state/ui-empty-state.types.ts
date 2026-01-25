export type UiEmptyStateVariant = 'search' | 'no-data' | 'error' | 'maintenance' | 'generic';

export interface UiEmptyStateI18n {
    /** Alt text for the illustration. Defaults to title if not provided. */
    imageAlt?: string;
    /** ARIA label for the primary action button */
    actionAriaLabel?: string;
    /** ARIA label for the secondary action button */
    secondaryActionAriaLabel?: string;
}

export interface UiEmptyStateConfig {
    /** Variant of the empty state */
    variant?: UiEmptyStateVariant;
    /** Title text */
    title: string;
    /** Description text */
    description?: string;
    /** Path to an illustration image */
    imagePath?: string;
    /** Primary action button label */
    actionLabel?: string;
    /** Icon for the action button */
    actionIcon?: string;
    /** Secondary action button label */
    secondaryActionLabel?: string;
    /** Whether to show the card container */
    showCard?: boolean;
    /** Internationalization & Accessibility settings */
    i18n?: UiEmptyStateI18n;
}
