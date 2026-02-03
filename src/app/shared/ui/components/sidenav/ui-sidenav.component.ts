import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { UiSidenavItem, UiSidenavMode, UiSidenavState, UiSidenavI18n } from './ui-sidenav.types';
import { SettingsService } from '../../../../core/services/settings.service';
import { inject, computed } from '@angular/core';

@Component({
    selector: 'ui-sidenav',
    standalone: true,
    imports: [CommonModule, RouterModule, MatSidenavModule, MatIconModule],
    templateUrl: './ui-sidenav.component.html',
    styleUrls: ['./ui-sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiSidenavComponent {
    @Input() items: UiSidenavItem[] = [];

    /** Internationalization configuration */
    @Input() i18n?: UiSidenavI18n;
    @Input() mode: UiSidenavMode = 'side';
    @Input() opened = true;
    @Input() state: UiSidenavState = 'expanded';
    @Input() activeItemId?: string;

    private settingsService = inject(SettingsService);
    sidenavColor = this.settingsService.sidenavColor;

    @Output() itemClick = new EventEmitter<UiSidenavItem>();
    @Output() closed = new EventEmitter<void>();

    @ViewChild('sidenav') sidenav!: MatSidenav;

    /** IDs of items with expanded submenus */
    expandedItemIds = new Set<string>();

    toggle(): void {
        this.sidenav.toggle();
    }

    open(): void {
        this.sidenav.open();
    }

    close(): void {
        this.sidenav.close();
    }

    onItemClick(item: UiSidenavItem): void {
        if (item.disabled) return;

        if (item.children && item.children.length > 0) {
            this.toggleSubmenu(item.id);
        } else {
            this.itemClick.emit(item);
        }
    }

    toggleSubmenu(itemId: string): void {
        if (this.expandedItemIds.has(itemId)) {
            this.expandedItemIds.delete(itemId);
        } else {
            this.expandedItemIds.add(itemId);
        }
    }

    isExpanded(itemId: string): boolean {
        return this.expandedItemIds.has(itemId);
    }

    onBackdropClick(): void {
        if (this.mode !== 'side') {
            this.closed.emit();
        }
    }

    onClosed(): void {
        this.closed.emit();
    }
}
