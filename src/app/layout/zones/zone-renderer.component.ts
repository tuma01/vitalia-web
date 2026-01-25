import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetRegistryService } from '../../core/services/widget-registry.service';

export interface WidgetConfig {
  type: string;
  config?: Record<string, unknown>;
}

@Component({
  selector: 'app-zone-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="zone-layout">
      @for (widget of widgets; track $index) {
        @if (getComponent(widget.type); as comp) {
          <div class="widget-wrapper">
            <ng-container *ngComponentOutlet="comp; inputs: widget.config"></ng-container>
          </div>
        } @else {
          <div class="widget-error">
            Widget '{{ widget.type }}' not registered.
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .zone-layout {
      display: flex;
      flex-direction: column;
      gap: var(--ui-space-lg, 24px);
    }
    
    .widget-wrapper {
      width: 100%;
    }

    .widget-error {
      padding: var(--ui-space-md);
      color: var(--ui-color-danger);
      border: 1px dashed var(--ui-color-danger);
      background: rgba(255, 0, 0, 0.05);
      border-radius: var(--ui-radius-md);
    }
  `]
})
export class ZoneRendererComponent implements OnInit {
  @Input() zoneName!: string;

  // In a real app, this would be fetched from a LayoutService/API based on zoneName.
  // For the pilot, we might set it manually or mock it here.
  @Input() widgets: WidgetConfig[] = []; // Allow direct input for testing

  private registry = inject(WidgetRegistryService);

  ngOnInit() {
    if (!this.widgets || this.widgets.length === 0) {
      // Fallback/Mock logic if no widgets provided directly
      console.log(`ZoneRenderer: Loading default widgets for zone '${this.zoneName}'`);
      // this.widgets = this.layoutService.getWidgetsForZone(this.zoneName);
    }
  }

  getComponent(type: string) {
    return this.registry.get(type);
  }
}
