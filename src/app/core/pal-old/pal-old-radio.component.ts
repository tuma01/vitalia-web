import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'pal-old-radio-group',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="pal-old-radio-group">
      <ng-content></ng-content>
    </div>
  `,
    styles: [`
    .pal-old-radio-group { font-family: sans-serif; display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
  `]
})
export class PalOldRadioGroupComponent {
    @Input() name = '';
    // Simplified for mock, assume individual radios handle themselves or we don't strictly enforce group logic in mock
}

@Component({
    selector: 'pal-old-radio',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <label class="pal-old-radio">
      <input type="radio" [name]="name" [value]="value" [checked]="checked">
      <span class="radio-visual"></span>
      <span class="label-text">{{ label }}</span>
    </label>
  `,
    styles: [`
    .pal-old-radio {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-family: sans-serif;
      font-size: 14px;
    }
    input { position: absolute; opacity: 0; }
    .radio-visual {
      height: 18px; width: 18px;
      border: 1px solid #ccc; border-radius: 50%;
      margin-right: 8px; position: relative;
    }
    input:checked ~ .radio-visual { border-color: #2196F3; }
    .radio-visual:after {
      content: ""; position: absolute; display: none;
      top: 4px; left: 4px; width: 8px; height: 8px;
      border-radius: 50%; background: #2196F3;
    }
    input:checked ~ .radio-visual:after { display: block; }
  `]
})
export class PalOldRadioComponent {
    @Input() name = '';
    @Input() value: any;
    @Input() label = '';
    @Input() checked = false;
}
