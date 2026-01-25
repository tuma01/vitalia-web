import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSelectComponent } from '../../shared/ui/select/ui-select.component';
import { UiButtonComponent } from '../../shared/ui/button/ui-button.component';
import { PilotFormWidgetConfig } from './pilot-form-widget.types';
import { UiConfigService } from '../../core/services/ui-config.service';
import { WidgetRegistryService } from '../../core/services/widget-registry.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { UiDatepickerComponent } from '../../shared/ui/datepicker/ui-datepicker.component';
import { UiTimepickerComponent } from '../../shared/ui/datepicker/ui-timepicker.component';

@Component({
    selector: 'app-pilot-form-widget',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UiSelectComponent,
        UiButtonComponent,
        UiDatepickerComponent,
        UiTimepickerComponent
    ],
    templateUrl: './pilot-form-widget.component.html',
    styleUrls: ['./pilot-form-widget.component.scss']
})
export class PilotFormWidgetComponent {
    roleOptions = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'USER', label: 'User' },
        { value: 'GUEST', label: 'Guest' }
    ];

    private widgetRegistry = inject(WidgetRegistryService); // Added
    uiConfig = inject(UiConfigService);

    form = new FormGroup({
        role: new FormControl(''),
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
