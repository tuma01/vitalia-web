import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UiProgressBarColor, UiProgressBarMode } from './ui-progress-bar.types';

@Component({
    selector: 'ui-progress-bar',
    standalone: true,
    imports: [CommonModule, MatProgressBarModule],
    templateUrl: './ui-progress-bar.component.html',
    styleUrls: ['./ui-progress-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.ui-progress-bar]': 'true',
    }
})
export class UiProgressBarComponent {
    @Input() value = 0;
    @Input() bufferValue = 0;
    @Input() mode: UiProgressBarMode = 'indeterminate';
    @Input() color: UiProgressBarColor = 'primary';
}
