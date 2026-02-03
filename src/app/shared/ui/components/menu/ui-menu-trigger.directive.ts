import { Directive } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

/**
 * PAL Directive to trigger a menu.
 * Uses Angular hostDirectives to wrap MatMenuTrigger.
 */
@Directive({
    selector: '[uiMenuTriggerFor]',
    standalone: true,
    hostDirectives: [
        {
            directive: MatMenuTrigger,
            inputs: ['matMenuTriggerFor: uiMenuTriggerFor', 'matMenuTriggerData: uiMenuTriggerData']
        }
    ]
})
export class UiMenuTriggerDirective { }
