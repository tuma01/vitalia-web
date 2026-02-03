import { Component, Input, effect, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { ThemeService } from '../../../core/services/theme.service';
import { UiColorMode, UiThemeDensity } from '../../../core/services/ui-theme.types';

@Component({
    selector: 'app-demo-theme-scope',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="theme-scope" style="padding: 12px; border: 1px solid var(--surface-border); background-color: var(--surface-background); border-radius: 4px;">
        <div style="font-size: 8px; color: var(--brand-primary); margin-bottom: 4px; font-weight: bold;">{{ brand }} | {{ mode }} | {{ density }}</div>
        <ng-content></ng-content>
    </div>
  `
})
export class DemoThemeScopeComponent {
    @Input() brand: string = 'vitalia';
    @Input() mode: UiColorMode = 'light';
    @Input() density: UiThemeDensity = 'default';

    private themeService = inject(ThemeService);
    private elementRef = inject(ElementRef);

    constructor() {
        effect(() => {
            const theme = this.themeService.resolveTheme(this.brand, this.mode, this.density);
            this.themeService.applyToElement(theme, this.elementRef.nativeElement);
        });
    }
}
