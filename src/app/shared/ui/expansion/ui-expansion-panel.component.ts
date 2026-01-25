import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'ui-expansion-panel',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './ui-expansion-panel.component.html',
    styleUrls: ['./ui-expansion-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.ui-expansion-panel]': 'true',
        '[class.ui-expansion-panel--expanded]': 'isExpanded()',
    }
})
export class UiExpansionPanelComponent {
    @Input() title = '';
    @Input() description?: string;
    @Input() icon?: string;
    @Input() disabled = false;

    @Input() set expanded(val: boolean) {
        this.isExpanded.set(val);
    }

    @Output() expandedChange = new EventEmitter<boolean>();

    isExpanded = signal(false);

    toggle(): void {
        if (this.disabled) return;
        this.isExpanded.update(v => !v);
        this.expandedChange.emit(this.isExpanded());
    }

    expand(): void {
        if (this.disabled) return;
        this.isExpanded.set(true);
        this.expandedChange.emit(true);
    }

    collapse(): void {
        if (this.disabled) return;
        this.isExpanded.set(false);
        this.expandedChange.emit(false);
    }
}
