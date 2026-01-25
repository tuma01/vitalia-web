# Widget Design Rules

> **Living Document** - Updated as best practices evolve  
> **Last Updated**: 2026-01-22  
> **For**: All developers creating widgets

---

## Core Principles

1. **Single Responsibility**: One widget = one purpose
2. **Configuration over Code**: Behavior driven by config, not hardcoded
3. **Facade-Only Data Access**: Never inject HTTP services
4. **Reactive State**: Use `computed()` for derived values
5. **Small & Focused**: <200 lines of code

---

## ✅ DO

### 1. Use Single `@Input() config`

```typescript
// ✅ GOOD: Single typed config
export interface PatientStatsConfig {
  title: string;
  metricType: 'total' | 'active' | 'critical';
  showTrend?: boolean;
}

@Component({...})
export class PatientStatsWidget {
  @Input() config!: PatientStatsConfig;
}
```

**Why**: Compatible with metadata-driven UI, easy to validate, clear contract.

---

### 2. Inject Facades, Not Services

```typescript
// ✅ GOOD: Inject Facade
@Component({...})
export class PatientStatsWidget {
  private facade = inject(PatientsFacade);
  
  readonly count = computed(() => {
    switch (this.config.metricType) {
      case 'total': return this.facade.allPatients().length;
      case 'active': return this.facade.activePatients().length;
      case 'critical': return this.facade.criticalPatients().length;
    }
  });
}
```

**Why**: Decoupling, testability, reusable business logic.

---

### 3. Use `computed()` for Derived State

```typescript
// ✅ GOOD: Computed signals
readonly patients = this.facade.allPatients;
readonly count = computed(() => this.patients().length);
readonly hasPatients = computed(() => this.count() > 0);
```

**Why**: Automatic reactivity, no manual subscriptions, clean code.

---

### 4. Emit Events for User Actions

```typescript
// ✅ GOOD: Emit events
@Component({...})
export class PatientListWidget {
  @Output() patientSelected = new EventEmitter<Patient>();
  
  onPatientClick(patient: Patient) {
    this.patientSelected.emit(patient);
  }
}
```

**Why**: Widgets don't know what happens next, parent decides.

---

### 5. Keep Widgets Small

```typescript
// ✅ GOOD: Focused widget
@Component({...})
export class PatientCountWidget {
  @Input() config!: PatientCountConfig;
  private facade = inject(PatientsFacade);
  
  readonly count = computed(() => 
    this.facade.allPatients().length
  );
}
```

**Guideline**: <200 lines. If larger, split into multiple widgets.

---

### 6. Provide Default Config Values

```typescript
// ✅ GOOD: Defaults for optional properties
export interface KpiWidgetConfig {
  title: string;
  showIcon?: boolean;    // Optional
  refreshInterval?: number; // Optional
}

@Component({...})
export class KpiWidget {
  @Input() config!: KpiWidgetConfig;
  
  readonly showIcon = computed(() => this.config.showIcon ?? true);
  readonly refreshInterval = computed(() => this.config.refreshInterval ?? 30000);
}
```

---

## ❌ DON'T

### 1. Don't Use Multiple `@Input()` Properties

```typescript
// ❌ BAD: Multiple inputs
@Component({...})
export class PatientStatsWidget {
  @Input() title!: string;
  @Input() metricType!: string;
  @Input() showTrend?: boolean;
  @Input() refreshInterval?: number;
}
```

**Why**: Not compatible with metadata-driven UI, hard to validate, messy.

**Fix**: Use single `config` object.

---

### 2. Don't Inject HTTP Services

```typescript
// ❌ BAD: Direct HTTP
@Component({...})
export class PatientStatsWidget {
  private http = inject(HttpClient);
  
  ngOnInit() {
    this.http.get('/api/patients').subscribe(...);
  }
}
```

**Why**: Tight coupling, hard to test, duplicates logic.

**Fix**: Inject Facade instead.

---

### 3. Don't Put Business Logic in Widgets

```typescript
// ❌ BAD: Business logic in widget
@Component({...})
export class PatientStatsWidget {
  calculateRiskScore(patient: Patient): number {
    // Complex calculation
    return (patient.age * 0.3) + (patient.conditions.length * 2);
  }
}
```

**Why**: Logic should be in domain layer, reusable, testable.

**Fix**: Move to Facade or Store (computed signal).

---

### 4. Don't Inject Multiple Facades

```typescript
// ❌ BAD: Multiple facades (code smell)
@Component({...})
export class DashboardWidget {
  private patientsFacade = inject(PatientsFacade);
  private appointmentsFacade = inject(AppointmentsFacade);
  private billingFacade = inject(BillingFacade);
}
```

**Why**: Widget doing too much, violates Single Responsibility.

**Fix**: Split into 3 separate widgets.

---

### 5. Don't Access Router or Route Params

```typescript
// ❌ BAD: Widget knows about routing
@Component({...})
export class PatientDetailWidget {
  private route = inject(ActivatedRoute);
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadPatient(params['id']);
    });
  }
}
```

**Why**: Widgets should be route-agnostic, reusable anywhere.

**Fix**: Pass patient ID via config, or use Location Group pattern.

---

### 6. Don't Mutate Config Input

```typescript
// ❌ BAD: Mutating input
@Component({...})
export class KpiWidget {
  @Input() config!: KpiWidgetConfig;
  
  ngOnInit() {
    this.config.title = 'Modified'; // ❌ Don't mutate
  }
}
```

**Why**: Breaks change detection, unexpected behavior.

**Fix**: Treat config as readonly.

---

## Widget Complexity Threshold

### When to Split a Widget

Split if widget has:
- \>200 lines of code
- Multiple facades
- \>5 computed signals
- \>3 event emitters
- Complex template logic

### Example: Splitting a Widget

```typescript
// ❌ BAD: One widget doing too much
@Component({...})
export class PatientDashboardWidget {
  // Stats, appointments, billing, alerts...
}

// ✅ GOOD: Split into focused widgets
@Component({...})
export class PatientStatsWidget { }

@Component({...})
export class PatientAppointmentsWidget { }

@Component({...})
export class PatientBillingWidget { }

@Component({...})
export class PatientAlertsWidget { }
```

---

## Testing Requirements

Every widget MUST have:

### 1. Unit Tests

```typescript
describe('PatientStatsWidget', () => {
  it('should display patient count', () => {
    const facade = jasmine.createSpyObj('PatientsFacade', [], {
      allPatients: signal([patient1, patient2])
    });
    
    const fixture = TestBed.createComponent(PatientStatsWidget);
    (fixture.componentInstance as any).facade = facade;
    fixture.detectChanges();
    
    expect(fixture.nativeElement.textContent).toContain('2');
  });
});
```

### 2. Config Validation Tests

```typescript
it('should handle missing optional config', () => {
  const config: PatientStatsConfig = {
    title: 'Test',
    metricType: 'total'
    // showTrend is optional
  };
  
  component.config = config;
  expect(component.showIcon()).toBe(true); // Default
});
```

---

## Code Review Checklist

Before merging a widget PR, verify:

- [ ] Single `@Input() config` with typed interface
- [ ] Uses Facade, not HTTP services
- [ ] No business logic in component
- [ ] Computed signals for derived state
- [ ] <200 lines of code
- [ ] Unit tests present
- [ ] Registered in WidgetRegistry
- [ ] No multiple facades
- [ ] No router/route dependencies

---

## Examples

### ✅ Perfect Widget

```typescript
// patient-count.config.ts
export interface PatientCountConfig {
  title: string;
  filter?: 'all' | 'active' | 'critical';
}

// patient-count.component.ts
@Component({
  selector: 'app-patient-count',
  standalone: true,
  template: `
    <div class="widget-card">
      <h3>{{ config.title }}</h3>
      <p class="count">{{ count() }}</p>
    </div>
  `
})
export class PatientCountWidget {
  @Input() config!: PatientCountConfig;
  
  private facade = inject(PatientsFacade);
  
  readonly count = computed(() => {
    const filter = this.config.filter ?? 'all';
    switch (filter) {
      case 'all': return this.facade.allPatients().length;
      case 'active': return this.facade.activePatients().length;
      case 'critical': return this.facade.criticalPatients().length;
    }
  });
  
  ngOnInit() {
    this.facade.loadAll();
  }
}
```

**Why it's perfect**:
- ✅ Single config input
- ✅ Uses Facade
- ✅ Computed signal
- ✅ Small & focused
- ✅ No business logic

---

## References

- [Creating a Widget](../04-PATTERNS/Creating-A-Widget.md)
- [Widget Boilerplate](../04-PATTERNS/Widget-Boilerplate.md)
- [Code Review Checklist](Code-Review-Checklist.md)
- [When NOT to Use Widgets](When-NOT-To-Use-Widgets.md)
