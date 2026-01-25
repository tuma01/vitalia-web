import { Component, Input, Directive, ChangeDetectionStrategy, HostBinding, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Directives for Card Sections
 * Allows separating content for Smart Layout
 */

@Directive({
    selector: 'ui-card-header, [uiCardHeader]',
    standalone: true,
    host: { class: 'ui-card-header' }
})
export class UiCardHeaderComponent { }

@Directive({
    selector: 'h3[uiCardTitle], [uiCardTitle]',
    standalone: true,
    host: { class: 'ui-card-title' }
})
export class UiCardTitleDirective { }

@Directive({
    selector: 'span[uiCardSubtitle], [uiCardSubtitle]',
    standalone: true,
    host: { class: 'ui-card-subtitle' }
})
export class UiCardSubtitleDirective { }

@Directive({
    selector: 'ui-card-content, [uiCardContent]',
    standalone: true,
    host: { class: 'ui-card-content' }
})
export class UiCardContentComponent { }

@Directive({
    selector: 'ui-card-footer, [uiCardFooter], [uiCardActions]',
    standalone: true,
    host: { class: 'ui-card-footer' }
})
export class UiCardFooterComponent { }

@Directive({
    selector: '[uiCardAvatar]',
    standalone: true,
    host: { class: 'ui-card-avatar' }
})
export class UiCardAvatarDirective { }

@Directive({
    selector: 'img[uiCardImage], [uiCardImage]',
    standalone: true,
    host: { class: 'ui-card-image' }
})
export class UiCardImageDirective { }

/**
 * Main Card Container
 * "Enterprise" Component:
 * - Smart Layout: Detects image and avatar presence
 * - Global Config: Uses CSS Variables
 * - Interaction: Hover states
 */
@Component({
    selector: 'ui-card',
    standalone: true,
    imports: [],
    templateUrl: './ui-card.component.html',
    styleUrls: ['./ui-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.ui-card]': 'true',
        '[class.ui-card--elevated]': 'variant === "elevated"',
        '[class.ui-card--outlined]': 'variant === "outlined"',
        '[class.ui-card--filled]': 'variant === "filled"',
        '[class.ui-card--hoverable]': 'hoverable',
        '[class.ui-card--has-avatar]': '!!hasAvatar',
        '[attr.aria-label]': 'i18n?.ariaLabel || null'
    }
})
export class UiCardComponent {
    @Input() variant: 'elevated' | 'outlined' | 'filled' = 'elevated';
    @Input() hoverable = false;
    @Input() i18n?: import('../../config/ui-i18n.types').UiCardI18n;

    @ContentChild(UiCardImageDirective) hasImage?: UiCardImageDirective;
    @ContentChild(UiCardAvatarDirective) hasAvatar?: UiCardAvatarDirective;
}
