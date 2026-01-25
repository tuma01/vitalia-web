import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'ui-toggle',
    standalone: true,
    imports: [CommonModule],
    template: `
    <label class="ui-toggle-label" [class.ui-toggle-label--disabled]="disabled" [attr.for]="id">
      <input type="checkbox"
             class="ui-toggle-input"
             [id]="id"
             [attr.name]="name || id"
             [checked]="checked"
             [disabled]="disabled"
             (change)="onInputChange($event)">
      <div class="ui-toggle-track">
        <div class="ui-toggle-thumb"></div>
      </div>
      <span class="ui-toggle-text">
        <ng-content></ng-content>
      </span>
    </label>
  `,
    styleUrls: ['./ui-toggle.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiToggleComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiToggleComponent implements ControlValueAccessor, OnInit {
    private static nextId = 0;

    @Input() id = `ui-toggle-${UiToggleComponent.nextId++}`;
    @Input() name = '';
    @Input() disabled = false;

    @Output() changed = new EventEmitter<boolean>();

    checked = false;

    onChange: (value: boolean) => void = () => { };
    onTouched: () => void = () => { };

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        if (!this.id) {
            this.id = `ui-toggle-${UiToggleComponent.nextId++}`;
        }
    }

    onInputChange(event: Event) {
        event.stopPropagation();
        this.checked = !this.checked;
        this.onChange(this.checked);
        this.onTouched();
        this.changed.emit(this.checked);
    }

    writeValue(value: boolean): void {
        this.checked = !!value;
        this.cdr.markForCheck();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.cdr.markForCheck();
    }
}
