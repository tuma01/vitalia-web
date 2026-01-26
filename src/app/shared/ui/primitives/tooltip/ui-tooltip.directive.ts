import { Directive, Input } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';

@Directive({
    selector: '[uiTooltip]',
    standalone: true,
    hostDirectives: [
        {
            directive: MatTooltip,
            inputs: ['matTooltip:uiTooltip', 'matTooltipPosition:uiTooltipPosition']
        }
    ]
})
export class UiTooltipDirective {
    @Input('uiTooltip') tooltipContent: string = '';
    @Input('uiTooltipPosition') tooltipPosition: TooltipPosition = 'above';
}
