import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'pal-old-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="pal-old-field">
      <label>{{ label }} <span *ngIf="required">*</span></label>
      <input type="text" [placeholder]="placeholder" [(ngModel)]="value">
      <span class="hint" *ngIf="hint">{{ hint }}</span>
      <span class="error" *ngIf="errorText">{{ errorText }}</span>
    </div>
  `,
    styles: [`
    .pal-old-field {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
      font-family: sans-serif;
    }
    label {
      font-weight: bold;
      margin-bottom: 4px;
      font-size: 14px;
      color: #333;
    }
    input {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      height: 40px;
      box-sizing: border-box;
    }
    input:focus {
      border-color: #007bff;
      outline: none;
    }
    .hint {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .error {
      font-size: 12px;
      color: red;
      margin-top: 2px;
    }
  `]
})
export class PalOldInputComponent {
    @Input() label = '';
    @Input() placeholder = '';
    @Input() hint = '';
    @Input() errorText = '';
    @Input() required = false;
    value = '';
}
