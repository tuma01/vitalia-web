import { Directive } from '@angular/core';

@Directive({
    selector: '[uiInput]',
    standalone: true
})
export class UiInputDirective { }

@Directive({
    selector: '[uiPrefix]',
    standalone: true
})
export class UiPrefixDirective { }

@Directive({
    selector: '[uiSuffix]',
    standalone: true
})
export class UiSuffixDirective { }

@Directive({
    selector: '[uiError]',
    standalone: true
})
export class UiErrorDirective { }

@Directive({
    selector: '[uiHint]',
    standalone: true
})
export class UiHintDirective { }
