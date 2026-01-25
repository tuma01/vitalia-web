import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild, forwardRef, inject, ChangeDetectorRef, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { UiRadioGroupComponent } from './ui-radio-group.component';

@Component({
    selector: 'ui-radio',
    standalone: true,
    imports: [CommonModule],
    template: `
    <label class="ui-radio-label" [class.ui-radio-label--disabled]="disabled">
      <div class="ui-radio-input-wrapper">
        <input type="radio" 
               [value]="value" 
               [name]="name" 
               [checked]="checked" 
               [disabled]="disabled" 
               (change)="onInputChange($event)"
               class="ui-radio-input-native">
        <div class="ui-radio-visual">
          <div class="ui-radio-dot"></div>
        </div>
      </div>
      <span class="ui-radio-text">
        <ng-content></ng-content>
      </span>
    </label>
  `,
    styleUrls: ['./ui-radio.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiRadioButtonComponent {
    @Input() value: any;
    @Input() name: string = '';
    @Input() disabled: boolean = false;
    @Input() checked: boolean = false; // Controlled by Group usually

    @Output() changed = new EventEmitter<any>();

    constructor(
        private cdr: ChangeDetectorRef,
        @Optional() @Inject(forwardRef(() => UiRadioGroupComponent)) private group: UiRadioGroupComponent
    ) { }

    onInputChange(event: Event) {
        event.stopPropagation();
        if (this.group) {
            this.group.select(this.value);
        } else {
            this.checked = true;
            this.changed.emit(this.value);
        }
    }

    // Helper to force update if needed by parent
    markForCheck() {
        this.cdr.markForCheck();
    }
}
