import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStepperOrientation, UiStepperI18n } from './ui-stepper.types';

@Component({
    selector: 'ui-stepper',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ui-stepper.component.html',
    styleUrls: ['./ui-stepper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiStepperComponent {
    @Input() orientation: UiStepperOrientation = 'horizontal';
    @Input() i18n?: UiStepperI18n;
}
