import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UiToastComponent } from './ui-toast.component';
import { UiToastConfig, UiToastPosition } from './ui-toast.types';

@Injectable({
    providedIn: 'root'
})
export class UiToastService {
    constructor(private snackBar: MatSnackBar) { }

    /** Display a success toast */
    success(message: string, title?: string, config?: Partial<UiToastConfig>) {
        this.show({ ...config, type: 'success', message, title });
    }

    /** Display an error toast */
    error(message: string, title?: string, config?: Partial<UiToastConfig>) {
        this.show({ ...config, type: 'error', message, title });
    }

    /** Display an info toast */
    info(message: string, title?: string, config?: Partial<UiToastConfig>) {
        this.show({ ...config, type: 'info', message, title });
    }

    /** Display a warning toast */
    warning(message: string, title?: string, config?: Partial<UiToastConfig>) {
        this.show({ ...config, type: 'warning', message, title });
    }

    /** Core method to show a toast */
    show(config: UiToastConfig): void {
        const { horizontal, vertical } = this.mapPosition(config.position || 'top-right');

        const snackBarConfig: MatSnackBarConfig = {
            duration: config.duration ?? 5000,
            horizontalPosition: horizontal,
            verticalPosition: vertical,
            data: config,
            panelClass: [
                'ui-toast-panel',
                `ui-toast-${config.type}`,
                ...(Array.isArray(config.panelClass) ? config.panelClass : [config.panelClass || ''])
            ].filter(Boolean)
        };

        this.snackBar.openFromComponent(UiToastComponent, snackBarConfig);
    }

    private mapPosition(position: UiToastPosition): { horizontal: MatSnackBarHorizontalPosition, vertical: MatSnackBarVerticalPosition } {
        let horizontal: MatSnackBarHorizontalPosition = 'right';
        let vertical: MatSnackBarVerticalPosition = 'top';

        if (position.includes('left')) horizontal = 'left';
        if (position.includes('center')) horizontal = 'center';
        if (position.includes('right')) horizontal = 'right';

        if (position.includes('top')) vertical = 'top';
        if (position.includes('bottom')) vertical = 'bottom';

        return { horizontal, vertical };
    }
}
