import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-tab',
    standalone: true,
    imports: [CommonModule],
    template: `
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class UiTabComponent {
    @Input() label = '';
    @Input() icon?: string;
    @Input() disabled = false;

    @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<any>;
}
