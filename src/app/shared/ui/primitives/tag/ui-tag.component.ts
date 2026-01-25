import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UiTagVariant, UiTagAppearance, UiTagSize } from './ui-tag.types';

@Component({
    selector: 'ui-tag',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './ui-tag.component.html',
    styleUrls: ['./ui-tag.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTagComponent {
    @Input() variant: UiTagVariant = 'neutral';
    @Input() appearance: UiTagAppearance = 'soft';
    @Input() size: UiTagSize = 'md';
    @Input() icon?: string;
    @Input() pill = false;
    @Input() i18n?: import('../../config/ui-i18n.types').UiTagI18n;

    get classes(): string {
        return [
            'ui-tag',
            `ui-tag--${this.variant}`,
            `ui-tag--${this.appearance}`,
            `ui-tag--${this.size}`,
            this.pill ? 'ui-tag--pill' : '',
            this.icon ? 'ui-tag--with-icon' : ''
        ].filter(Boolean).join(' ');
    }
}
