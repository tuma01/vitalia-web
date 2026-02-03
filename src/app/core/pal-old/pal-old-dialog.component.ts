import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'pal-old-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule],
    template: `
    <div class="pal-old-dialog-container">
      <div class="pal-old-dialog-header">
        <span class="pal-title">{{ data.title }}</span>
        <button class="close-btn" (click)="close()">×</button>
      </div>
      <div class="pal-old-dialog-body">
         <p>{{ data.message }}</p>
      </div>
      <div class="pal-old-dialog-footer">
        <button class="pal-btn pal-btn-secondary" (click)="close()">{{ data.cancelText || 'Cancel' }}</button>
        <button class="pal-btn pal-btn-primary" (click)="confirm()">{{ data.confirmText || 'OK' }}</button>
      </div>
    </div>
  `,
    styles: [`
    .pal-old-dialog-container {
      font-family: Arial, sans-serif;
      background: white;
      border-radius: 4px;
      overflow: hidden;
      min-width: 400px;
    }
    .pal-old-dialog-header {
      background: #f1f1f1;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ddd;
    }
    .pal-title { font-weight: bold; font-size: 16px; color: #333; }
    .close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #999; }
    .pal-old-dialog-body { padding: 20px; font-size: 14px; color: #555; }
    .pal-old-dialog-footer {
      padding: 10px 15px;
      background: #f9f9f9;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .pal-btn {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .pal-btn-primary { background: #007bff; color: white; border-color: #007bff; }
    .pal-btn-secondary { background: white; color: #333; border-color: #ccc; }
  `]
})
export class PalOldDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<PalOldDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    close() { this.dialogRef.close(false); }
    confirm() { this.dialogRef.close(true); }
}
