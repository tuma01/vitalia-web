import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild, inject, ChangeDetectorRef, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { UI_RADIO_GROUP, UiRadioGroupContract } from './ui-radio-group.token';
import { MatRadioModule, MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'ui-radio',
  standalone: true,
  imports: [CommonModule, MatRadioModule],
  templateUrl: './ui-radio.component.html',
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
    @Optional() @Inject(UI_RADIO_GROUP) private group: UiRadioGroupContract | null
  ) { }

  onRadioChange(event: MatRadioChange) {
    // event.stopPropagation(); // MatRadio doesn't emit native event here, it emits MatRadioChange
    // But we need to stop bubbling if we don't want parent to see it? 
    // Actually MatRadioChange is not a DOM event.

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
