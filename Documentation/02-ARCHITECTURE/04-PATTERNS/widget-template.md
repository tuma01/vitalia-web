# Plantilla Oficial de Widget – Vitalia Frontend

**Propósito**: Definir el estándar oficial para crear Widgets reutilizables, desacoplados y alineados con la arquitectura Widgets & Domain-Driven UI de Vitalia.

---

## 1. ¿Qué es un Widget en Vitalia?

Un **Widget** es un Smart Component autocontenido que:

- ✅ Representa una **sola responsabilidad funcional**
- ✅ Consume datos exclusivamente desde un **Facade**
- ✅ Se renderiza dinámicamente dentro de una **Zona**
- ❌ No conoce rutas, layouts ni páginas
- ❌ Puede eliminarse sin romper otras pantallas

> ❝ Un widget es una pieza reemplazable del sistema ❞

---

## 2. Estructura de Directorio (OBLIGATORIA)

Cada widget debe vivir en su propio directorio:

```
src/app/widgets/<widget-name>/
 ├── <widget-name>.component.ts
 ├── <widget-name>.component.html
 ├── <widget-name>.component.scss
 ├── <widget-name>.config.ts
 └── index.ts
```

**Ejemplo**:

```
tenant-stats-card/
 ├── tenant-stats-card.component.ts
 ├── tenant-stats-card.component.html
 ├── tenant-stats-card.component.scss
 ├── tenant-stats-card.config.ts
 └── index.ts
```

---

## 3. Naming Conventions

| Elemento | Regla | Ejemplo |
|----------|-------|---------|
| **Folder** | kebab-case | `tenant-stats-card` |
| **Component** | `<Name>Widget` | `TenantStatsCardWidget` |
| **Selector** | `app-<name>-widget` | `app-tenant-stats-card-widget` |
| **Config** | `<Name>WidgetConfig` | `TenantStatsCardWidgetConfig` |
| **Registry Key** | kebab-case | `tenant-stats-card` |

---

## 4. Contrato de Configuración (OBLIGATORIO)

Cada widget **DEBE** definir su propio contrato de configuración.

**`tenant-stats-card.config.ts`**:

```typescript
export interface TenantStatsCardWidgetConfig {
  title: string;
  metric: 'tenants' | 'users';
}
```

**👉 Reglas**:
- Un solo objeto `config`
- Tipado fuerte
- Sin lógica

---

## 5. Implementación del Widget

**`tenant-stats-card.component.ts`**:

```typescript
import { Component, Input, computed, inject } from '@angular/core';
import { TenantFacade } from '@app/domain/tenants';
import { TenantStatsCardWidgetConfig } from './tenant-stats-card.config';

@Component({
  selector: 'app-tenant-stats-card-widget',
  templateUrl: './tenant-stats-card.component.html',
  styleUrls: ['./tenant-stats-card.component.scss'],
  standalone: true
})
export class TenantStatsCardWidget {
  // ⭐ Single config input (required)
  @Input({ required: true })
  config!: TenantStatsCardWidgetConfig;

  // ⭐ Inject Facade (NOT HTTP services)
  private readonly tenantFacade = inject(TenantFacade);

  // ⭐ Computed signal for derived state
  readonly value = computed(() => {
    switch (this.config.metric) {
      case 'tenants':
        return this.tenantFacade.totalTenants();
      case 'users':
        return this.tenantFacade.totalUsers();
      default:
        return 0;
    }
  });

  ngOnInit() {
    // Load data from facade
    this.tenantFacade.loadAll();
  }
}
```

---

## 6. Template HTML (Reglas)

**`tenant-stats-card.component.html`**:

```html
<app-card>
  <app-card-header>
    {{ config.title }}
  </app-card-header>

  <app-card-content>
    <span class="metric-value">{{ value() }}</span>
  </app-card-content>
</app-card>
```

**Reglas HTML**:
- ✅ Solo presentación
- ✅ Usar Shared UI components
- ❌ No lógica compleja
- ❌ No `*ngIf` de permisos

---

## 7. SCSS (Reglas)

**`tenant-stats-card.component.scss`**:

```scss
:host {
  display: block;
}

.metric-value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
}
```

**Reglas**:
- ✅ Estilos locales
- ✅ Usar CSS variables
- ❌ Nada global
- ❌ Sin dependencias externas

---

## 8. Registro del Widget (OBLIGATORIO)

**`layout/services/widget-registry.service.ts`**:

```typescript
import { TenantStatsCardWidget } from '@app/widgets/tenant-stats-card';

const WIDGET_REGISTRY = {
  'tenant-stats-card': TenantStatsCardWidget,
  // ... otros widgets
};
```

**👉 Sin registro, el widget no existe.**

---

## 9. Reglas DO / DON'T (CRÍTICO)

### ✅ DO

- ✅ Inyectar **Facades**
- ✅ Usar `computed()` o streams
- ✅ Mantener una **sola responsabilidad**
- ✅ Pensar el widget como **reutilizable**
- ✅ Emitir eventos con `@Output()`
- ✅ Mantener <200 líneas

### ❌ DON'T

- ❌ HTTP directo (`HttpClient`)
- ❌ Acceso a `Router`
- ❌ Acceso a `ActivatedRoute`
- ❌ Uso de `localStorage`
- ❌ Lógica de negocio
- ❌ Comunicación directa con otros widgets
- ❌ Múltiples Facades

---

## 10. Checklist antes de hacer merge ✅

Antes de aprobar un Widget, verifica:

- [ ] ¿Tiene contrato `WidgetConfig`?
- [ ] ¿Consume solo Facades?
- [ ] ¿No hace HTTP?
- [ ] ¿No accede a rutas?
- [ ] ¿Es pequeño y claro (<200 líneas)?
- [ ] ¿Está registrado en `WidgetRegistry`?
- [ ] ¿Puede reutilizarse en otra Zona?
- [ ] ¿Tiene tests unitarios?

**Si alguna respuesta es NO, el widget no cumple el estándar.**

---

## 11. Ejemplo de Configuración (JSON)

Así se ve el widget cuando el backend lo configura:

```json
{
  "type": "tenant-stats-card",
  "config": {
    "title": "Hospitales Activos",
    "metric": "tenants"
  }
}
```

---

## 12. Ejemplo Completo: Patient Stats Widget

### Config (`patient-stats.config.ts`)

```typescript
export interface PatientStatsWidgetConfig {
  title: string;
  filterType: 'all' | 'active' | 'critical';
  showTrend?: boolean;
}
```

### Component (`patient-stats.component.ts`)

```typescript
@Component({
  selector: 'app-patient-stats-widget',
  templateUrl: './patient-stats.component.html',
  styleUrls: ['./patient-stats.component.scss'],
  standalone: true,
  imports: [CommonModule, CardComponent]
})
export class PatientStatsWidget {
  @Input({ required: true })
  config!: PatientStatsWidgetConfig;

  private readonly patientsFacade = inject(PatientsFacade);

  readonly patients = computed(() => {
    const all = this.patientsFacade.allPatients();
    switch (this.config.filterType) {
      case 'active': return all.filter(p => p.status === 'ACTIVE');
      case 'critical': return all.filter(p => p.riskLevel > 7);
      default: return all;
    }
  });

  readonly count = computed(() => this.patients().length);
  readonly showTrend = computed(() => this.config.showTrend ?? false);

  ngOnInit() {
    this.patientsFacade.loadAll();
  }
}
```

### Template (`patient-stats.component.html`)

```html
<app-card>
  <app-card-header>
    <h3>{{ config.title }}</h3>
  </app-card-header>

  <app-card-content>
    <div class="stats-container">
      <span class="count">{{ count() }}</span>
      
      @if (showTrend()) {
        <span class="trend">↑ 12%</span>
      }
    </div>
  </app-card-content>
</app-card>
```

---

## 13. Testing Template

```typescript
describe('PatientStatsWidget', () => {
  let component: PatientStatsWidget;
  let fixture: ComponentFixture<PatientStatsWidget>;
  let facadeSpy: jasmine.SpyObj<PatientsFacade>;

  beforeEach(() => {
    facadeSpy = jasmine.createSpyObj('PatientsFacade', ['loadAll'], {
      allPatients: signal([
        { id: '1', status: 'ACTIVE', riskLevel: 5 },
        { id: '2', status: 'ACTIVE', riskLevel: 8 }
      ])
    });

    TestBed.configureTestingModule({
      imports: [PatientStatsWidget],
      providers: [
        { provide: PatientsFacade, useValue: facadeSpy }
      ]
    });

    fixture = TestBed.createComponent(PatientStatsWidget);
    component = fixture.componentInstance;
  });

  it('should filter critical patients', () => {
    component.config = {
      title: 'Critical Patients',
      filterType: 'critical'
    };
    fixture.detectChanges();

    expect(component.count()).toBe(1); // Only patient with riskLevel > 7
  });

  it('should call facade on init', () => {
    component.config = { title: 'Test', filterType: 'all' };
    component.ngOnInit();

    expect(facadeSpy.loadAll).toHaveBeenCalled();
  });
});
```

---

## 14. Common Patterns

### Pattern: Refresh Interval

```typescript
private refreshInterval?: number;

ngOnInit() {
  this.facade.loadData();
  
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

### Pattern: Loading & Error States

```typescript
readonly loading = this.facade.loading;
readonly error = this.facade.error;
readonly data = this.facade.data;
```

```html
@if (loading()) {
  <div class="loading">Loading...</div>
}

@if (error()) {
  <div class="error">{{ error() }}</div>
}

@if (!loading() && !error()) {
  <div class="content">{{ data() }}</div>
}
```

### Pattern: Event Emission

```typescript
@Output() itemSelected = new EventEmitter<Patient>();

onItemClick(patient: Patient) {
  this.itemSelected.emit(patient);
}
```

---

## 15. Anti-Patterns (NO HACER)

### ❌ Multiple Inputs

```typescript
// ❌ BAD
@Input() title!: string;
@Input() metric!: string;
@Input() showIcon?: boolean;

// ✅ GOOD
@Input() config!: MyWidgetConfig;
```

### ❌ Direct HTTP

```typescript
// ❌ BAD
private http = inject(HttpClient);

ngOnInit() {
  this.http.get('/api/data').subscribe(...);
}

// ✅ GOOD
private facade = inject(MyFacade);

ngOnInit() {
  this.facade.loadData();
}
```

### ❌ Business Logic

```typescript
// ❌ BAD
calculateRiskScore(patient: Patient): number {
  return patient.age * 0.3 + patient.conditions.length * 2;
}

// ✅ GOOD - Logic in Facade/Store
readonly riskScore = computed(() => 
  this.facade.calculateRiskScore(this.patient())
);
```

---

## 16. Relación con la Arquitectura

Este documento implementa:

- [ADR-003: Widget-Based Architecture](../../04-ADR/ADR-003-Widget-Based-Architecture.md)
- [Vitalia Frontend Architecture](../Vitalia-Frontend-Architecture.md)

**Es obligatorio para todos los widgets nuevos.**

---

## 17. Quick Reference

### Create New Widget (Commands)

```bash
# Create widget directory
mkdir -p src/app/widgets/my-widget

# Create files
touch src/app/widgets/my-widget/my-widget.component.ts
touch src/app/widgets/my-widget/my-widget.component.html
touch src/app/widgets/my-widget/my-widget.component.scss
touch src/app/widgets/my-widget/my-widget.config.ts
touch src/app/widgets/my-widget/index.ts
```

### Minimal Widget Template

```typescript
// my-widget.config.ts
export interface MyWidgetConfig {
  title: string;
}

// my-widget.component.ts
@Component({
  selector: 'app-my-widget',
  standalone: true,
  template: `<div>{{ config.title }}</div>`
})
export class MyWidget {
  @Input({ required: true }) config!: MyWidgetConfig;
}

// index.ts
export { MyWidget } from './my-widget.component';
export { MyWidgetConfig } from './my-widget.config';
```

---

## ✅ Resultado

Con esta plantilla, el equipo tiene:

- ✅ Estándar claro y obligatorio
- ✅ Ejemplos copy-paste listos
- ✅ Reglas explícitas (DO/DON'T)
- ✅ Checklist de calidad
- ✅ Evita deuda técnica
- ✅ Facilita onboarding
- ✅ Garantiza coherencia arquitectónica

---

**Última actualización**: 2026-01-22  
**Mantenido por**: Equipo Frontend Vitalia  
**Estado**: Obligatorio para todos los widgets nuevos
