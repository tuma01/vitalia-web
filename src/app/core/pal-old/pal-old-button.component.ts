import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'pal-old-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button [disabled]="disabled" class="pal-old-btn">
      {{ label }}
    </button>
  `,
    styles: [`
    .pal-old-btn {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-family: sans-serif;
      cursor: pointer;
      height: 40px;
      margin-top: 19px; /* Align with inputs roughly */
    }
    .pal-old-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .pal-old-btn:hover:not(:disabled) {
      background-color: #0056b3;
    }
  `]
})
export class PalOldButtonComponent {
    @Input() label = 'Button';
    @Input() disabled = false;
}
