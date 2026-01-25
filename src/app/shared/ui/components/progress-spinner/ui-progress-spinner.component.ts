import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UiProgressSpinnerColor, UiProgressSpinnerMode, UiProgressSpinnerSize } from './ui-progress-spinner.types';

@Component({
    selector: 'ui-progress-spinner',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    templateUrl: './ui-progress-spinner.component.html',
    styleUrls: ['./ui-progress-spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.ui-progress-spinner]': 'true',
        '[class.ui-progress-spinner--sm]': 'size === "sm"',
        '[class.ui-progress-spinner--md]': 'size === "md"',
        '[class.ui-progress-spinner--lg]': 'size === "lg"',
    }
})
export class UiProgressSpinnerComponent {
    @Input() value = 0;
    @Input() mode: UiProgressSpinnerMode = 'indeterminate';
    @Input() color: UiProgressSpinnerColor = 'primary';
    @Input() size: UiProgressSpinnerSize = 'md';

    get diameter(): number {
        switch (this.size) {
            case 'sm': return 20; // Margin for 24px area
            case 'lg': return 58; // Margin for 64px area
            default: return 34; // Margin for 40px area
        }
    }

    get strokeWidth(): number {
        switch (this.size) {
            case 'sm': return 2;
            case 'lg': return 6;
            default: return 4;
        }
    }
}
