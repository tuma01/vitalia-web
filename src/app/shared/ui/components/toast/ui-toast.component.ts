import { Component, Inject, Injector, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { UiToastConfig } from './ui-toast.types';

@Component({
    selector: 'ui-toast',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './ui-toast.component.html',
    styleUrls: ['./ui-toast.component.scss']
})
export class UiToastComponent {
    config: UiToastConfig;

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: UiToastConfig,
        private snackBarRef: MatSnackBarRef<UiToastComponent>
    ) {
        this.config = data;
    }

    getIcon(): string {
        if (this.config.icon) return this.config.icon;

        switch (this.config.type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'warning': return 'warning';
            default: return 'info';
        }
    }

    dismiss(): void {
        this.snackBarRef.dismiss();
    }
}
