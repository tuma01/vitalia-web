import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    UiButtonSize,
    UiButtonType,
    UiButtonVariant,
} from './ui-button.types';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'ui-button',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule],
    templateUrl: './ui-button.component.html',
    styleUrls: ['./ui-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.ui-button]': 'true',
        '[class.ui-button--primary]': 'variant === "primary"',
        '[class.ui-button--secondary]': 'variant === "secondary"',
        '[class.ui-button--outline]': 'variant === "outline"',
        '[class.ui-button--danger]': 'variant === "danger"',
        '[class.ui-button--ghost]': 'variant === "ghost"',
        '[class.ui-button--sm]': 'size === "sm"',
        '[class.ui-button--md]': 'size === "md"',
        '[class.ui-button--lg]': 'size === "lg"',
        '[class.ui-button--loading]': 'loading',
        '[class.ui-button--full-width]': 'fullWidth',
    }
})
export class UiButtonComponent {

    /* API pública */

    @Input() variant: UiButtonVariant = 'primary';
    @Input() size: UiButtonSize = 'md';
    @Input() type: UiButtonType = 'button';
    @Input() disabled = false;
    @Input() loading = false;
    @Input() fullWidth = false; // Layout utility
    @Input() ariaLabel: string = '';

    clicked = new EventEmitter<MouseEvent>();

    getMatColor(): 'primary' | 'accent' | 'warn' | undefined {
        if (this.variant === 'danger') return 'warn';
        if (this.variant === 'primary') return 'primary';
        if (this.variant === 'secondary') return 'accent';
        return undefined;
    }

    handleClick(event: MouseEvent): void {
        if (this.disabled || this.loading) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        // Add ripple effect logic here if manually implemented, 
        // or rely on CSS active states for performance.

        this.clicked.emit(event);
    }
}
