import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; // For icons if needed
import { UiButtonComponent } from '../../primitives/button/ui-button.component';
import { DEFAULT_PAL_I18N, UiDialogI18n } from '../../config/ui-i18n.types';

export interface UiConfirmDialogData {
  title: string;
  message: string;
  icon?: string;
  confirmText?: string;
  cancelText?: string | null;
  confirmColor?: 'primary' | 'danger'; // Map to button variants
  i18n?: UiDialogI18n;
}

@Component({
  selector: 'ui-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, UiButtonComponent, MatIconModule],
  template: `
    <div class="ui-confirm-dialog">
      @if (data.icon || data.title) {
      <div class="ui-confirm-dialog__header">
        @if (data.icon) {
        <mat-icon class="ui-confirm-dialog__icon">{{ data.icon }}</mat-icon>
        }
        <h2 mat-dialog-title class="ui-confirm-dialog__title">{{ data.title }}</h2>
      </div>
      }
      
      <div mat-dialog-content class="ui-confirm-dialog__content">
        <p>{{ data.message }}</p>
      </div>

      <div mat-dialog-actions class="ui-confirm-dialog__actions">
        @if (data.cancelText !== null) {
        <ui-button variant="ghost" (clicked)="onCancel()">
          {{ data.cancelText || data.i18n?.cancelButton || defaultI18n.cancelButton }}
        </ui-button>
        }
        <ui-button [variant]="data.confirmColor === 'danger' ? 'danger' : 'primary'"
                   (clicked)="onConfirm()">
          {{ data.confirmText || data.i18n?.confirmButton || defaultI18n.confirmButton }}
        </ui-button>
      </div>
    </div>
  `,
  styles: [`
    .ui-confirm-dialog {
      padding: var(--ui-space-lg, 24px);
      background: var(--mat-sys-surface-container-high, #fff);
      border-radius: var(--mat-sys-corner-large, 12px);
      box-shadow: var(--mat-sys-elevation-3);
      display: flex;
      flex-direction: column;
      gap: var(--ui-space-md, 16px);
      max-width: 100vw;
      color: var(--mat-sys-on-surface);

      @media (max-width: 640px) {
        padding: var(--ui-space-md, 16px);
      }
    }

    .ui-confirm-dialog__header {
      display: flex;
      align-items: center;
      gap: var(--ui-space-sm, 8px);
    }

    .ui-confirm-dialog__icon {
      color: var(--ui-color-warning, #f59e0b);
    }

    .ui-confirm-dialog__title {
      margin: 0;
      font-size: var(--ui-font-size-lg, 18px);
      font-weight: var(--ui-font-weight-bold, 700);
    }

    .ui-confirm-dialog__content {
      color: var(--mat-sys-on-surface-variant);
      font-size: var(--ui-font-size-md, 16px);
      margin: 0;
      padding: 0;
    }

    .ui-confirm-dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--ui-space-sm, 12px);
      padding: 0;
      margin-top: var(--ui-space-sm, 8px);

      @media (max-width: 480px) {
        flex-direction: column-reverse;
        align-items: stretch;
        
        ui-button {
          width: 100%;
        }
      }
    }
  `]
})
export class UiConfirmDialogComponent {
  defaultI18n = DEFAULT_PAL_I18N.dialog;

  constructor(
    public dialogRef: MatDialogRef<UiConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UiConfirmDialogData
  ) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
