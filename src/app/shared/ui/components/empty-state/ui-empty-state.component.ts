import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UiButtonComponent } from '../../primitives/button/ui-button.component';
import { UiEmptyStateConfig } from './ui-empty-state.types';

@Component({
    selector: 'ui-empty-state',
    standalone: true,
    imports: [CommonModule, MatIconModule, UiButtonComponent],
    templateUrl: './ui-empty-state.component.html',
    styleUrls: ['./ui-empty-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiEmptyStateComponent {
    @Input() config!: UiEmptyStateConfig;

    @Output() primaryAction = new EventEmitter<void>();
    @Output() secondaryAction = new EventEmitter<void>();

    onPrimaryAction(): void {
        this.primaryAction.emit();
    }

    onSecondaryAction(): void {
        this.secondaryAction.emit();
    }
}
