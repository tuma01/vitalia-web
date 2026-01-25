# Arquitectura Frontend Vitalia

**Widgets & Domain-Driven UI**

---

**Estado**: Activa  
**Alcance**: Frontend Angular – Vitalia  
**Relacionado**: [ADR-003: Arquitectura Frontend basada en Widgets y Dominios](../04-ADR/ADR-003-Widget-Based-Architecture.md)

---

## 1. Visión General

El frontend de Vitalia está diseñado como una **plataforma empresarial multi-tenant**, capaz de escalar en:

- Complejidad funcional
- Número de tenants
- Tamaño del equipo
- Variabilidad de UI por contexto, rol y plan

Para lograrlo, la arquitectura se basa en **tres pilares**:

1. **Domain-Driven Design (DDD)** aplicado al frontend
2. **UI compuesta por Widgets** reutilizables
3. **Composición dinámica** de pantallas mediante Zonas

> **Principio fundamental**:  
> La UI no es el centro del sistema: **el Dominio lo es**.  
> La UI solo representa su estado.

---

## 2. Principios Arquitectónicos

### 2.1 Dominio primero

- Toda lógica de negocio vive en `src/app/domain`
- Ningún componente UI hace llamadas HTTP directas
- El acceso al dominio se realiza exclusivamente mediante **Facades**

> ❝ Si una lógica es importante para el negocio, no pertenece a la UI ❞

**Ver**: [ADR-005: Domain-First Approach](../04-ADR/ADR-005-Domain-First-Approach.md)

---

### 2.2 Widgets como unidad funcional mínima

Un **Widget** es:

- ✅ Autónomo
- ✅ Configurable
- ✅ Reutilizable
- ❌ No conoce rutas, layouts ni otras pantallas
- ❌ Puede ser destruido sin afectar el resto del sistema

**Ver**: [Widget Design Rules](05-BEST-PRACTICES/Widget-Design-Rules.md)

---

### 2.3 Separación estricta de responsabilidades

| Capa | Responsabilidad |
|------|-----------------|
| **Core** | Infraestructura técnica (auth, interceptors, logging) |
| **Domain** | Lógica de negocio y estado |
| **Layout** | Composición visual (shell, zones, rendering) |
| **Widgets** | Smart components (configurables) |
| **Shared** | Dumb UI components (botones, cards, inputs) |
| **Pages** | Rutas y orquestación mínima |

---

## 3. Estructura del Proyecto

```
src/app/
├── core/               # ⚙️ Infraestructura (singleton)
│   ├── auth/
│   ├── guards/
│   ├── interceptors/
│   └── services/
│
├── domain/             # 🧠 Dominio (DDD)
│   ├── tenants/
│   │   ├── models/
│   │   │   └── tenant.model.ts
│   │   ├── tenants.api.ts
│   │   ├── tenants.store.ts
│   │   ├── tenants.facade.ts
│   │   └── index.ts
│   ├── patients/
│   ├── appointments/
│   └── billing/
│
├── layout/             # 🏗️ Infraestructura UI
│   ├── components/
│   │   ├── shell/
│   │   ├── zone-renderer/
│   │   ├── widget-host/
│   │   ├── header/
│   │   └── sidebar/
│   ├── zones/
│   │   └── zone-config.model.ts
│   └── services/
│       ├── ui-layout.service.ts
│       └── widget-registry.service.ts
│
├── widgets/            # 🧩 Widgets (Smart)
│   ├── tenant-stats/
│   │   ├── tenant-stats.component.ts
│   │   ├── tenant-stats.component.html
│   │   ├── tenant-stats.component.scss
│   │   └── tenant-stats.config.ts
│   ├── patient-stats/
│   └── kpi-chart/
│
├── shared/             # 🎨 UI Kit (Dumb)
│   └── ui/
│       ├── button/
│       ├── card/
│       ├── datagrid/
│       └── modal/
│
└── features/           # 📄 Páginas (Rutas)
    ├── admin/
    │   └── dashboard/
    ├── doctor/
    └── patient/
```

**Ver**: [Project Structure Guide](04-PATTERNS/Project-Structure-Guide.md)

---

## 4. Arquitectura del Dominio (DDD)

### 4.1 Componentes del Dominio

Cada dominio debe contener:

| Archivo | Rol |
|---------|-----|
| `*.model.ts` | Interfaces y tipos TypeScript |
| `*.api.ts` | Cliente HTTP (solo llamadas HTTP) |
| `*.store.ts` | Estado (Signals, sin HTTP) |
| `*.facade.ts` | API pública (orquesta api + store) |
| `index.ts` | Exporta solo lo público |

### 4.2 Regla fundamental

> **La UI nunca importa `*.api.ts` ni `*.store.ts`.**  
> **Solo importa `*.facade.ts`.**

### 4.3 Ejemplo: Tenants Domain

```typescript
// models/tenant.model.ts
export interface Tenant {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// tenants.api.ts
@Injectable({ providedIn: 'root' })
export class TenantsApi {
  private http = inject(HttpClient);
  
  getAll(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>('/api/tenants');
  }
}

// tenants.store.ts
@Injectable({ providedIn: 'root' })
export class TenantsStore {
  private _tenants = signal<Tenant[]>([]);
  
  readonly allTenants = this._tenants.asReadonly();
  readonly count = computed(() => this._tenants().length);
  
  setTenants(tenants: Tenant[]) {
    this._tenants.set(tenants);
  }
}

// tenants.facade.ts
@Injectable({ providedIn: 'root' })
export class TenantsFacade {
  private api = inject(TenantsApi);
  private store = inject(TenantsStore);
  private loaded = signal(false);
  
  readonly allTenants = this.store.allTenants;
  readonly count = this.store.count;
  
  loadAll() {
    if (this.loaded()) return; // Evita duplicados
    
    this.api.getAll().subscribe(tenants => {
      this.store.setTenants(tenants);
      this.loaded.set(true);
    });
  }
}

// index.ts
export * from './models/tenant.model';
export { TenantsFacade } from './tenants.facade';
// ❌ NO exportar api ni store
```

**Ver**: [Domain Layer Architecture](00-CONCEPTS/Domain-Layer-Architecture.md) | [Creating a Domain](04-PATTERNS/Creating-A-Domain.md)

---

## 5. Arquitectura de Widgets

### 5.1 ¿Qué es un Widget?

Un **Widget** es un Smart Component que:

- ✅ Consume datos de un **Facade**
- ✅ Recibe configuración vía **WidgetConfig**
- ✅ Renderiza UI usando componentes **Shared**
- ❌ NO hace llamadas HTTP
- ❌ NO contiene lógica de negocio
- ❌ NO conoce rutas ni layouts

### 5.2 Contrato WidgetConfig

```typescript
export interface WidgetConfig<T = unknown> {
  type: string;
  id?: string;
  cols?: number;
  rows?: number;
  config?: T;
}
```

Cada Widget define su propio tipo de `config`:

```typescript
export interface TenantStatsConfig {
  title: string;
  metricType: 'total' | 'active' | 'inactive';
  showTrend?: boolean;
}
```

### 5.3 Ejemplo: Tenant Stats Widget

```typescript
// tenant-stats.config.ts
export interface TenantStatsConfig {
  title: string;
  metricType: 'total' | 'active' | 'inactive';
}

// tenant-stats.component.ts
@Component({
  selector: 'app-tenant-stats',
  standalone: true,
  templateUrl: './tenant-stats.component.html'
})
export class TenantStatsWidget {
  @Input() config!: TenantStatsConfig;
  
  private facade = inject(TenantsFacade);
  
  readonly value = computed(() => {
    switch (this.config.metricType) {
      case 'total': return this.facade.count();
      case 'active': return this.facade.allTenants()
        .filter(t => t.status === 'ACTIVE').length;
      case 'inactive': return this.facade.allTenants()
        .filter(t => t.status === 'INACTIVE').length;
      default: return 0;
    }
  });
  
  ngOnInit() {
    this.facade.loadAll();
  }
}
```

### 5.4 Reglas de diseño de Widgets (Do / Don't)

| ✅ DO | ❌ DON'T |
|-------|----------|
| Inyectar Facades | Llamadas HTTP directas |
| Usar `computed()` | Lógica de negocio |
| Mantenerlos pequeños (<200 líneas) | Acceso a Router |
| Pensarlos como reemplazables | Conocer otras páginas |
| Single `@Input() config` | Múltiples `@Input()` |
| Emitir eventos | Múltiples Facades |

**Ver**: [Widget Design Rules](05-BEST-PRACTICES/Widget-Design-Rules.md)

---

## 6. Sistema de Zonas (Zone System)

### 6.1 ZoneRenderer

El **ZoneRenderer** es el motor de composición dinámica.

**Responsabilidades**:
- ✅ Recibir un `zoneId`
- ✅ Obtener la configuración (`WidgetConfig[]`)
- ✅ Instanciar Widgets dinámicamente

**NO decide**:
- ❌ Permisos (backend ya filtró)
- ❌ Lógica de negocio
- ❌ Reglas de visualización

### 6.2 Flujo de renderizado

```
Page
 └── ZoneRenderer (zone="admin-dashboard")
      └── UiLayoutService.getLayout('admin-dashboard')
           └── Backend API (filtra por tenant + permisos)
                └── WidgetRegistry (mapea 'tenant-stats' → TenantStatsWidget)
                     └── Widget Instance
                          └── DomainFacade
```

### 6.3 Ejemplo: ZoneRenderer

```typescript
@Component({
  selector: 'app-zone-renderer',
  template: `
    @for (widgetConfig of widgets(); track widgetConfig.id) {
      <ng-container 
        *ngComponentOutlet="getComponent(widgetConfig.type); 
                            inputs: { config: widgetConfig.config }">
      </ng-container>
    }
  `
})
export class ZoneRendererComponent {
  @Input() zone!: string;
  
  private uiService = inject(UiLayoutService);
  private registry = inject(WidgetRegistryService);
  
  widgets = signal<WidgetConfig[]>([]);
  
  ngOnInit() {
    this.uiService.getLayout(this.zone).subscribe(layout => {
      this.widgets.set(layout.widgets);
    });
  }
  
  getComponent(type: string): Type<any> {
    return this.registry.get(type);
  }
}
```

**Ver**: [ADR-004: Metadata-Driven UI](../04-ADR/ADR-004-Metadata-Driven-UI.md)

---

## 7. Pages y Rutas

### 7.1 Pages

Las **Pages**:
- Representan una URL
- **No contienen lógica**
- Delegan todo a Zonas

**Ejemplo**:

```typescript
// admin-dashboard.component.ts
@Component({
  template: `
    <app-zone-renderer zone="admin-dashboard-main"></app-zone-renderer>
  `
})
export class AdminDashboardComponent { }
```

### 7.2 Location Groups (Layouts Contextuales)

Para contextos persistentes (ej. `/tenants/:id`):

- Se usa un **Layout intermedio**
- Se cargan datos **una sola vez**
- Las sub-rutas **reutilizan el contexto**

**Ejemplo**:

```
/tenants/:id
 ├── /overview    → ZoneRenderer(zone="tenant-overview")
 ├── /users       → ZoneRenderer(zone="tenant-users")
 └── /settings    → ZoneRenderer(zone="tenant-settings")
```

```typescript
// tenant-location-group.component.ts
@Component({
  template: `
    <div class="tenant-layout">
      <app-tenant-sidebar [tenant]="tenant()"></app-tenant-sidebar>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class TenantLocationGroupComponent {
  private route = inject(ActivatedRoute);
  private facade = inject(TenantsFacade);
  
  tenant = signal<Tenant | null>(null);
  
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.facade.loadById(id);
    this.tenant.set(this.facade.selectedTenant());
  }
}
```

---

## 8. Wizards y Flujos

Un **Wizard** es:

- Un componente contenedor
- Estado local del proceso
- Renderiza distintas **Zonas** por paso

**Cada paso**:
- Es una Zona distinta
- Usa Widgets normales
- Consume el Dominio existente

**Ejemplo**:

```typescript
@Component({
  template: `
    <app-zone-renderer [zone]="currentZone()"></app-zone-renderer>
    
    <button (click)="next()">Siguiente</button>
  `
})
export class PatientRegistrationWizard {
  step = signal(1);
  
  currentZone = computed(() => `patient-registration-step-${this.step()}`);
  
  next() {
    this.step.update(s => s + 1);
  }
}
```

---

## 9. Evolución y Escalabilidad

Esta arquitectura permite:

- ✅ Dashboards dinámicos
- ✅ Configuración por tenant
- ✅ Feature flags
- ✅ Lazy loading de widgets
- ✅ Evolución futura a **micro-frontends**

**Sin refactor estructural.**

---

## 10. Reglas de Oro (Resumen)

1. **Dominio antes que UI**
2. **Widget pequeño o no es widget**
3. **Pages no contienen lógica**
4. **Facade es la única API**
5. **La UI nunca decide reglas de negocio**

---

## 11. Relación con ADRs

Este documento implementa y operacionaliza:

- [ADR-003: Widget-Based Architecture](../04-ADR/ADR-003-Widget-Based-Architecture.md)
- [ADR-004: Metadata-Driven UI](../04-ADR/ADR-004-Metadata-Driven-UI.md)
- [ADR-005: Domain-First Approach](../04-ADR/ADR-005-Domain-First-Approach.md)

**Cualquier cambio estructural deberá**:
1. Discutirse con el equipo
2. Registrarse en un nuevo ADR
3. Reflejarse en este documento

---

## 12. Recursos Adicionales

### Conceptos Core
- [Frontend Architecture Overview](00-CONCEPTS/Frontend-Architecture-Overview.md)
- [Domain Layer Architecture](00-CONCEPTS/Domain-Layer-Architecture.md)
- [Widget System Architecture](00-CONCEPTS/Widget-System-Architecture.md)
- [Metadata-Driven UI System](00-CONCEPTS/Metadata-Driven-UI-System.md)

### Guías de Implementación
- [Project Structure Guide](04-PATTERNS/Project-Structure-Guide.md)
- [Creating a Domain](04-PATTERNS/Creating-A-Domain.md)
- [Creating a Widget](04-PATTERNS/Creating-A-Widget.md)
- [Zone Renderer Implementation](04-PATTERNS/Zone-Renderer-Implementation.md)

### Best Practices
- [Widget Design Rules](05-BEST-PRACTICES/Widget-Design-Rules.md)
- [When NOT to Use Widgets](05-BEST-PRACTICES/When-NOT-To-Use-Widgets.md)
- [Code Review Checklist](05-BEST-PRACTICES/Code-Review-Checklist.md)

### Templates
- [Domain Boilerplate](04-PATTERNS/Domain-Boilerplate.md)
- [Widget Boilerplate](04-PATTERNS/Widget-Boilerplate.md)
- [TypeScript Contracts](04-PATTERNS/TypeScript-Contracts.md)

---

## 13. Onboarding para Nuevos Desarrolladores

### Orden de lectura recomendado:

1. **Este documento** (visión general)
2. **ADRs** (entender el "por qué")
3. **Domain Layer Architecture** (entender DDD)
4. **Widget Design Rules** (reglas prácticas)
5. **Crear tu primer widget** (hands-on)

### Primera tarea práctica:

1. Elige un dominio simple (ej: `patients`)
2. Crea la estructura de dominio (API, Store, Facade)
3. Crea un widget simple (ej: `patient-count-widget`)
4. Regístralo en `WidgetRegistry`
5. Úsalo en una zona de prueba

---

**Última actualización**: 2026-01-22  
**Mantenido por**: Equipo Frontend Vitalia
