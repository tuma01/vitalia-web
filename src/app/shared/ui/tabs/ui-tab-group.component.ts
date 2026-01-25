import {
    Component,
    ContentChildren,
    QueryList,
    Input,
    Output,
    EventEmitter,
    AfterContentInit,
    inject,
    ChangeDetectionStrategy,
    signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiTabComponent } from './ui-tab.component';
import { UiTabChangeEvent, UiTabsVariant } from './ui-tabs.types';
import { UiConfigService } from '../../../core/services/ui-config.service';

@Component({
    selector: 'ui-tab-group',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ui-tab-group.component.html',
    styleUrls: ['./ui-tab-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.ui-tab-group]': 'true',
        '[class.ui-tab-group--line]': 'variant === "line"',
        '[class.ui-tab-group--pills]': 'variant === "pills"',
    }
})
export class UiTabGroupComponent implements AfterContentInit {
    private uiConfig = inject(UiConfigService);

    @ContentChildren(UiTabComponent) tabs!: QueryList<UiTabComponent>;

    @Input() selectedIndex = 0;
    @Input() variant: UiTabsVariant = 'line';

    @Output() selectedIndexChange = new EventEmitter<number>();
    @Output() selectionChange = new EventEmitter<UiTabChangeEvent>();

    activeTabIndex = signal(0);

    ngAfterContentInit(): void {
        // Set initial active tab
        if (this.selectedIndex < this.tabs.length) {
            this.activeTabIndex.set(this.selectedIndex);
        }
    }

    selectTab(index: number): void {
        const tab = this.tabs.toArray()[index];
        if (tab && !tab.disabled) {
            this.activeTabIndex.set(index);
            this.selectedIndexChange.emit(index);
            this.selectionChange.emit({ index, label: tab.label });
        }
    }
}
