# Widget Boilerplate

> **Template** - Copy-paste ready code for creating new widgets  
> **Last Updated**: 2026-01-22

---

## Complete Widget Template

Use this template when creating a new widget. Replace `MyWidget` with your actual widget name.

---

## File Structure

```
src/app/widgets/my-widget/
├── my-widget.component.ts
├── my-widget.component.html
├── my-widget.component.scss
└── my-widget.config.ts
```

---

## 1. Config Interface (`my-widget.config.ts`)

```typescript
/**
 * Configuration interface for MyWidget
 */
export interface MyWidgetConfig {
  /**
   * Widget title
   */
  title: string;

  /**
   * Optional subtitle
   */
  subtitle?: string;

  /**
   * Show/hide specific elements
   */
  showIcon?: boolean;

  /**
   * Refresh interval in milliseconds
   */
  refreshInterval?: number;

  // Add your custom config properties here
}
```

---

## 2. Component (`my-widget.component.ts`)

```typescript
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyWidgetConfig } from './my-widget.config';
// Import your domain facade
// import { MyDomainFacade } from '@app/domain/my-domain';

/**
 * MyWidget Component
 * 
 * Description: Brief description of what this widget does
 * 
 * @example
 * <app-my-widget [config]="config"></app-my-widget>
 */
@Component({
  selector: 'app-my-widget',
  standalone: true,
  imports: [
    CommonModule,
    // Add other imports (shared components, etc.)
  ],
  templateUrl: './my-widget.component.html',
  styleUrl: './my-widget.component.scss'
})
export class MyWidget implements OnInit, OnDestroy {
  /**
   * Widget configuration
   */
  @Input() config!: MyWidgetConfig;

  /**
   * Event emitted when user performs an action
   */
  @Output() actionPerformed = new EventEmitter<any>();

  // Inject facade (not HTTP services!)
  // private facade = inject(MyDomainFacade);

  // Computed signals for derived state
  readonly title = computed(() => this.config.title);
  readonly showIcon = computed(() => this.config.showIcon ?? true);
  readonly refreshInterval = computed(() => this.config.refreshInterval ?? 30000);

  // Add your computed signals here
  // readonly data = computed(() => this.facade.someData());

  ngOnInit() {
    // Load data from facade
    // this.facade.loadData();

    // Setup refresh interval if needed
    // this.setupRefresh();
  }

  ngOnDestroy() {
    // Cleanup subscriptions, intervals, etc.
  }

  /**
   * Handle user action
   */
  onAction() {
    this.actionPerformed.emit({ /* your data */ });
  }

  // Add your methods here
}
```

---

## 3. Template (`my-widget.component.html`)

```html
<div class="widget-container">
  <div class="widget-header">
    @if (showIcon()) {
      <span class="widget-icon">📊</span>
    }
    <h3 class="widget-title">{{ title() }}</h3>
    
    @if (config.subtitle) {
      <p class="widget-subtitle">{{ config.subtitle }}</p>
    }
  </div>

  <div class="widget-content">
    <!-- Loading state -->
    @if (loading()) {
      <div class="loading-spinner">Loading...</div>
    }

    <!-- Error state -->
    @if (error()) {
      <div class="error-message">{{ error() }}</div>
    }

    <!-- Content -->
    @if (!loading() && !error()) {
      <div class="widget-body">
        <!-- Your widget content here -->
        <p>Widget content goes here</p>
      </div>
    }
  </div>

  <div class="widget-footer">
    <button (click)="onAction()">Action</button>
  </div>
</div>
```

---

## 4. Styles (`my-widget.component.scss`)

```scss
.widget-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--widget-bg, #ffffff);
  border-radius: var(--widget-radius, 8px);
  box-shadow: var(--widget-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
  overflow: hidden;
}

.widget-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .widget-icon {
    font-size: 1.5rem;
  }

  .widget-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary, #333);
  }

  .widget-subtitle {
    margin: 0.25rem 0 0 0;
    font-size: 0.875rem;
    color: var(--text-secondary, #666);
  }
}

.widget-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;

  .loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary, #666);
  }

  .error-message {
    padding: 1rem;
    background: var(--error-bg, #fee);
    color: var(--error-text, #c00);
    border-radius: 4px;
  }

  .widget-body {
    // Your widget-specific styles
  }
}

.widget-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color, #e0e0e0);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: var(--primary-color, #007bff);
    color: white;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: var(--primary-hover, #0056b3);
    }
  }
}
```

---

## 5. Widget Registry

Register your widget in `WidgetRegistryService`:

```typescript
// layout/services/widget-registry.service.ts
import { MyWidget } from '@app/widgets/my-widget/my-widget.component';

const WIDGET_REGISTRY = {
  'my-widget': MyWidget,
  // ... other widgets
};
```

---

## Usage Example

### In a Zone

```typescript
// Backend returns this configuration
{
  "widgets": [
    {
      "type": "my-widget",
      "id": "widget-1",
      "config": {
        "title": "My Custom Widget",
        "subtitle": "Showing important data",
        "showIcon": true,
        "refreshInterval": 60000
      }
    }
  ]
}
```

### Standalone Usage

```typescript
@Component({
  template: `
    <app-my-widget 
      [config]="widgetConfig"
      (actionPerformed)="onAction($event)">
    </app-my-widget>
  `
})
export class SomePage {
  widgetConfig: MyWidgetConfig = {
    title: 'Test Widget',
    showIcon: true
  };

  onAction(data: any) {
    console.log('Action performed:', data);
  }
}
```

---

## Testing Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyWidget } from './my-widget.component';
import { MyWidgetConfig } from './my-widget.config';

describe('MyWidget', () => {
  let component: MyWidget;
  let fixture: ComponentFixture<MyWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyWidget]
    }).compileComponents();

    fixture = TestBed.createComponent(MyWidget);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title from config', () => {
    const config: MyWidgetConfig = {
      title: 'Test Title'
    };
    component.config = config;
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.widget-title');
    expect(titleElement.textContent).toContain('Test Title');
  });

  it('should use default values for optional config', () => {
    const config: MyWidgetConfig = {
      title: 'Test'
    };
    component.config = config;
    fixture.detectChanges();

    expect(component.showIcon()).toBe(true); // Default
    expect(component.refreshInterval()).toBe(30000); // Default
  });

  it('should emit action event', () => {
    const config: MyWidgetConfig = { title: 'Test' };
    component.config = config;

    spyOn(component.actionPerformed, 'emit');
    component.onAction();

    expect(component.actionPerformed.emit).toHaveBeenCalled();
  });
});
```

---

## Checklist

When creating a new widget, verify:

- [ ] Created config interface with typed properties
- [ ] Component uses single `@Input() config`
- [ ] Injects Facade (not HTTP services)
- [ ] Uses `computed()` for derived state
- [ ] Template handles loading/error states
- [ ] Styles use CSS variables for theming
- [ ] Widget registered in `WidgetRegistry`
- [ ] Unit tests created
- [ ] Widget is <200 lines of code
- [ ] No business logic in component
- [ ] No router/route dependencies

---

## Common Patterns

### With Loading State

```typescript
readonly loading = this.facade.loading;
readonly error = this.facade.error;
readonly data = this.facade.data;
```

### With Refresh

```typescript
private refreshInterval?: number;

ngOnInit() {
  this.facade.loadData();
  this.setupRefresh();
}

private setupRefresh() {
  if (this.config.refreshInterval) {
    this.refreshInterval = window.setInterval(() => {
      this.facade.refresh();
    }, this.config.refreshInterval);
  }
}

ngOnDestroy() {
  if (this.refreshInterval) {
    clearInterval(this.refreshInterval);
  }
}
```

### With Filtering

```typescript
readonly filterType = computed(() => this.config.filterType ?? 'all');

readonly filteredData = computed(() => {
  const data = this.facade.allData();
  const filter = this.filterType();
  
  switch (filter) {
    case 'active': return data.filter(d => d.status === 'ACTIVE');
    case 'inactive': return data.filter(d => d.status === 'INACTIVE');
    default: return data;
  }
});
```

---

## References

- [Widget Design Rules](../05-BEST-PRACTICES/Widget-Design-Rules.md)
- [Creating a Widget](Creating-A-Widget.md)
- [TypeScript Contracts](TypeScript-Contracts.md)
- [ADR-003: Widget-Based Architecture](../../04-ADR/ADR-003-Widget-Based-Architecture.md)
