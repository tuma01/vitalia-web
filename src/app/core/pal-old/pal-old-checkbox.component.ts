import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'pal-old-checkbox',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <label class="pal-old-checkbox">
      <input type="checkbox" [(ngModel)]="value" [disabled]="disabled">
      <span class="checkmark"></span>
      <span class="label-text">{{ label }}</span>
    </label>
  `,
    styles: [`
    .pal-old-checkbox {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      cursor: pointer;
      font-family: sans-serif;
      font-size: 14px;
      user-select: none;
    }
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    .checkmark {
      height: 18px;
      width: 18px;
      background-color: #eee;
      border: 1px solid #ccc;
      border-radius: 3px;
      margin-right: 8px;
      position: relative;
    }
    input:checked ~ .checkmark {
      background-color: #2196F3;
      border-color: #2196F3;
    }
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    input:checked ~ .checkmark:after {
      display: block;
    }
    .pal-old-checkbox .checkmark:after {
      left: 6px;
      top: 2px;
      width: 4px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  `]
})
export class PalOldCheckboxComponent {
    @Input() label = '';
    @Input() disabled = false;
    value = false;
}
