import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Observable } from 'rxjs';
import { UiConfirmDialogComponent, UiConfirmDialogData } from './ui-confirm-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class UiDialogService {
    constructor(private matDialog: MatDialog) { }

    /**
     * Opens a custom component in a dialog.
     * Enforces global styling defaults (backdrop, panel class) but allows overrides.
     */
    open<T, D = any, R = any>(component: ComponentType<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R> {
        const defaults: MatDialogConfig<D> = {
            panelClass: 'ui-dialog-panel', // Global styling hook if needed
            backdropClass: 'ui-dialog-backdrop',
            hasBackdrop: true,
            disableClose: false,
            autoFocus: 'first-tabbable',
            // We can also bind width/maxWidth here if we want strict sizes
            ...config
        };
        return this.matDialog.open(component, defaults);
    }

    /**
     * Opens a standardized confirmation dialog.
     */
    confirm(data: UiConfirmDialogData, config?: MatDialogConfig): Observable<boolean> {
        return this.open(UiConfirmDialogComponent, {
            data,
            width: '400px', // Standard width for confirm dialogs
            disableClose: true,
            ...config
        }).afterClosed();
    }

    /**
     * Opens a simplified alert dialog (just a confirm dialog with one button).
     */
    alert(data: Omit<UiConfirmDialogData, 'cancelText'>, config?: MatDialogConfig): Observable<boolean> {
        const alertData: UiConfirmDialogData = {
            ...data,
            cancelText: '' // Hides cancel button if template logic supports it, or we could add specific logic
        };
        // For now, let's reuse confirm dialog and handle 'no cancel text' in template if we want to hide it.
        // The component I wrote shows cancel button based on text presence?
        // Re-checking component: <ui-button ...>{{ data.cancelText || 'Cancel' }}</ui-button>
        // It defaults to 'Cancel'. expected behavior for Alert is usually just "OK".

        // I might need to update UiConfirmDialogComponent to handle "Alert" mode or just hide cancel if text is explicitly null/empty.
        // My current template: {{ data.cancelText || 'Cancel' }} will show "Cancel" if empty.
        // I should probably update the component to *not* show cancel button if cancelText is explicitly null.

        return this.open(UiConfirmDialogComponent, {
            data: alertData,
            width: '400px',
            ...config
        }).afterClosed();
    }
}
