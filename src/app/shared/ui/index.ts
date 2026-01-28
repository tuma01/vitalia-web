/**
 * PAL (Presentation Abstraction Layer) - PUBLIC API
 * 
 * Este es el punto de entrada oficial para todos los componentes de la interfaz de usuario.
 * Sigue la arquitectura de Design System de Vitalia.
 */

// Config & Types
export * from './config/ui-config.service';
export * from './config/ui-i18n.types';
export * from './config/ui-i18n.service';

// Primitives
export * from './primitives/badge/ui-badge.component';
export * from './primitives/badge/ui-badge.types';
export * from './primitives/button/ui-button.component';
export * from './primitives/button/ui-button.types';
export * from './primitives/button/ui-icon-button.component';
export * from './primitives/checkbox/ui-checkbox.component';
export * from './primitives/divider/ui-divider.component';
export * from './primitives/input/ui-input.component';
export * from './primitives/input/ui-input.types';
export * from './primitives/radio/ui-radio.component';
export * from './primitives/radio/ui-radio-group.component';
export * from './primitives/rating/ui-rating.component';
export * from './primitives/icon/ui-icon.component';
export * from './primitives/select/ui-select.component';
export * from './primitives/select/ui-select.types';
export * from './primitives/select-native/ui-select-native.component';
export * from './primitives/select-native/ui-select-native.types';
export * from './primitives/slider/ui-slider.component';
export * from './primitives/tag/ui-tag.component';
export * from './primitives/tag/ui-tag.types';
export * from './primitives/skeleton/ui-skeleton.component';
export * from './primitives/tooltip/ui-tooltip.directive';
export * from './primitives/toggle/ui-toggle.component';

// Molecular Components
export * from './components/breadcrumbs/ui-breadcrumbs.component';
export * from './components/breadcrumbs/ui-breadcrumbs.types';
export * from './components/autocomplete/ui-autocomplete.component';
export * from './components/card/ui-card.component';
export * from './components/data-table/ui-data-table.component';
export * from './components/data-table/ui-data-table.types';
export * from './components/file-uploader/ui-file-uploader.component';
export * from './components/empty-state/ui-empty-state.component';
export * from './components/empty-state/ui-empty-state.types';
export * from './components/datepicker/ui-datepicker.component';
export * from './components/datepicker/ui-timepicker.component';
export * from './components/datepicker/ui-calendar.component';
export * from './components/datepicker/ui-time-selector.component';
export * from './components/dialog/ui-confirm-dialog.component';
export * from './components/dialog/ui-dialog.service';
export * from './components/sidenav/ui-sidenav.component';
export * from './components/sidenav/ui-sidenav.types';
export * from './components/list/ui-list.component';
export * from './components/menu/ui-menu.component';
export * from './components/notification-drawer/ui-notification-drawer.component';
export * from './components/notification-drawer/ui-notification.service';
export * from './components/notification-drawer/ui-notification-drawer.types';
export * from './components/expansion/ui-expansion-panel.component';
export * from './components/expansion/ui-accordion.component';
export * from './components/expansion/ui-expansion.types';
export * from './components/stepper/ui-stepper.component';
export * from './components/stepper/ui-stepper.types';
export * from './components/form-field/ui-form-field.component';
export * from './components/form-field/ui-form-field.directives';
export * from './components/progress-bar/ui-progress-bar.component';
export * from './components/progress-spinner/ui-progress-spinner.component';
export * from './components/tabs/ui-tab-group.component';
export * from './components/tabs/ui-tab.component';
export * from './components/toast/ui-toast.service';
export * from './components/toast/ui-toast.component';
export * from './components/toast/ui-toast.types';
export * from './components/toolbar/ui-toolbar.component';
