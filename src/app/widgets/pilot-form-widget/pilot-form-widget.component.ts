import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    UiSelectNativeComponent,
    UiFormFieldComponent,
    UiButtonComponent,
    UiConfigService,
    UiDatepickerComponent,
    UiTimepickerComponent
} from '@ui';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { WidgetRegistryService } from '../../core/services/widget-registry.service';

@Component({
    selector: 'app-pilot-form-widget',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UiSelectNativeComponent,
        UiFormFieldComponent,
        UiButtonComponent,
        UiDatepickerComponent,
        UiTimepickerComponent
    ],
    templateUrl: './pilot-form-widget.component.html',
    styleUrls: ['./pilot-form-widget.component.scss']
})
export class PilotFormWidgetComponent {
    priorityOptions = [
        { value: 'high', label: 'High Priority', icon: 'priority_high' },
        { value: 'medium', label: 'Medium Priority', icon: 'medium' },
        { value: 'low', label: 'Low Priority', icon: 'low_priority' }
    ];

    private widgetRegistry = inject(WidgetRegistryService); // Added
    uiConfig = inject(UiConfigService);

    form = new FormGroup({
        priority: new FormControl('medium'),
        birthDate: new FormControl(null),
        targetTime: new FormControl('09:00')
    });

    constructor() { }
    @Input() fields: string[] = ['Default Field'];
    @Input() variant: 'compact' | 'default' = 'default';
    @Input() title = 'Dynamic Widget';


    onSubmit(event: Event) {
        event.preventDefault();
        console.log(`Widget '${this.title}' submitted! Current Theme: ${this.uiConfig.theme()}`);
        alert(`Widget '${this.title}' submitted! Theme: ${this.uiConfig.theme()}`);
    }
}
