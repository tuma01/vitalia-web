# Checklist de Code Review Arquitectónico

**Vitalia Frontend – Widgets & Domain-Driven UI**

---

## Propósito

Garantizar que todo el código nuevo respeta la arquitectura definida en:

- [ADR-003: Widget-Based Architecture](../../04-ADR/ADR-003-Widget-Based-Architecture.md)
- [Vitalia Frontend Architecture](../Vitalia-Frontend-Architecture.md)
- [Widget Template](../04-PATTERNS/widget-template.md)

**Este checklist NO evalúa estilo ni naming fino, solo arquitectura y diseño.**

---

## 1️⃣ Checklist General (aplica a TODO PR)

### Arquitectura

- [ ] ¿El cambio respeta las capas (`core`, `domain`, `layout`, `widgets`, `features`, `shared`)?
- [ ] ¿No se mezclan responsabilidades entre capas?
- [ ] ¿No se introduce lógica de negocio en la UI?
- [ ] ¿El código es consistente con el documento de arquitectura?

### Dependencias

- [ ] ¿Las dependencias van en una sola dirección?  
  `UI → Facade → Store/API`
- [ ] ¿No hay imports prohibidos (ej. UI → `*.api.ts`)?
- [ ] ¿No se accede a servicios de infraestructura desde widgets/pages?

---

## 2️⃣ Checklist de Dominio (`src/app/domain`)

### Estructura

- [ ] ¿El dominio tiene `models/`, `*.api.ts`, `*.store.ts`, `*.facade.ts`?
- [ ] ¿El facade es la única API pública?
- [ ] ¿La UI solo importa `*.facade.ts`?
- [ ] ¿El `index.ts` exporta solo Facade + models?

### Lógica

- [ ] ¿La lógica de negocio vive en el dominio?
- [ ] ¿No hay lógica duplicada en widgets/pages?
- [ ] ¿El estado está centralizado (signals)?

### HTTP / Infra

- [ ] ¿Las llamadas HTTP están solo en `*.api.ts`?
- [ ] ¿El Facade NO hace HTTP directamente?
- [ ] ¿El dominio es independiente de la UI?

### 🚨 Red flag inmediato

**Un componente UI importando `HttpClient` o `*.api.ts`**

```typescript
// ❌ BLOCKER
import { HttpClient } from '@angular/common/http';
import { PatientsApi } from '@app/domain/patients/patients.api';
```

---

## 3️⃣ Checklist de Widgets (`src/app/widgets`)

### Diseño del Widget

- [ ] ¿El widget tiene una sola responsabilidad clara?
- [ ] ¿Es reutilizable en otra Zona sin cambios?
- [ ] ¿Puede eliminarse sin romper otras pantallas?
- [ ] ¿Tiene <200 líneas de código?

### Configuración

- [ ] ¿Tiene un contrato `WidgetConfig` propio?
- [ ] ¿Recibe un solo objeto `config` (no múltiples `@Input()`)?
- [ ] ¿El config está tipado (no `any`)?

### Dependencias

- [ ] ¿El widget inyecta solo Facades?
- [ ] ¿NO hace llamadas HTTP?
- [ ] ¿NO accede al `Router` ni `ActivatedRoute`?
- [ ] ¿NO usa `localStorage` / `sessionStorage`?
- [ ] ¿Inyecta UN SOLO Facade (no múltiples)?

### Implementación

- [ ] ¿Usa `computed()` para derivar estado?
- [ ] ¿El HTML es solo presentación?
- [ ] ¿Usa componentes de `shared/ui`?
- [ ] ¿No tiene `subscribe()` manual (usa signals)?

### Registro

- [ ] ¿Está registrado en `WidgetRegistry`?
- [ ] ¿El registry key es kebab-case?

### 🚨 Red flags de Widget

- ❌ Widget >300 líneas
- ❌ Más de un Facade inyectado
- ❌ Lógica condicional compleja
- ❌ `subscribe()` manual en el componente
- ❌ Múltiples `@Input()` en lugar de un `config`

```typescript
// ❌ BLOCKER
export class MyWidget {
  private http = inject(HttpClient);  // ❌ NO
  private router = inject(Router);    // ❌ NO
  
  @Input() title!: string;            // ❌ NO (usar config)
  @Input() type!: string;             // ❌ NO (usar config)
}
```

---

## 4️⃣ Checklist de Zonas & Layout (`src/app/layout`)

### ZoneRenderer

- [ ] ¿El ZoneRenderer solo renderiza?
- [ ] ¿No contiene lógica de permisos?
- [ ] ¿No contiene reglas de negocio?
- [ ] ¿No conoce dominios específicos?

### Layouts / Shells

- [ ] ¿El Shell solo define estructura?
- [ ] ¿Los datos de contexto se cargan una sola vez?
- [ ] ¿Las sub-rutas reutilizan el contexto?

### 🚨 Red flag

**ZoneRenderer con lógica de permisos**

```typescript
// ❌ BLOCKER
if (user.role === 'ADMIN') {
  renderWidget(config);
}
```

**El backend ya filtró. ZoneRenderer solo renderiza.**

---

## 5️⃣ Checklist de Pages (`src/app/features`)

### Responsabilidad

- [ ] ¿La Page representa solo una ruta?
- [ ] ¿No contiene lógica de negocio?
- [ ] ¿No hace llamadas HTTP?
- [ ] ¿No maneja estado complejo?

### Uso correcto

- [ ] ¿La Page delega la UI a Zonas?
- [ ] ¿No renderiza widgets directamente (salvo excepciones documentadas)?

### Ejemplo Correcto

```typescript
// ✅ GOOD
@Component({
  template: `<app-zone-renderer zone="admin-dashboard"></app-zone-renderer>`
})
export class AdminDashboardPage { }
```

### Ejemplo Incorrecto

```typescript
// ❌ BAD
@Component({
  template: `
    <app-patient-stats [config]="..."></app-patient-stats>
    <app-billing-summary [config]="..."></app-billing-summary>
  `
})
export class AdminDashboardPage {
  private http = inject(HttpClient);  // ❌ NO
  
  ngOnInit() {
    this.http.get('/api/data').subscribe(...);  // ❌ NO
  }
}
```

---

## 6️⃣ Checklist de Shared (`src/app/shared`)

### Componentes UI

- [ ] ¿Son Dumb Components?
- [ ] ¿Solo usan `@Input` / `@Output`?
- [ ] ¿No inyectan servicios de dominio?
- [ ] ¿No conocen dominio ni estado global?

### 🚨 Red flag

**Un componente shared que inyecta un Facade**

```typescript
// ❌ BLOCKER
@Component({
  selector: 'app-button'
})
export class ButtonComponent {
  private facade = inject(PatientsFacade);  // ❌ NO
}
```

---

## 7️⃣ Checklist de Evolución Arquitectónica

### Cambios grandes

- [ ] ¿Este PR introduce un nuevo patrón?
- [ ] ¿Rompe o modifica reglas arquitectónicas?
- [ ] ¿Debería documentarse en un ADR nuevo?

**👉 Si la respuesta es sí, bloquear merge hasta**:
1. Documentar decisión en nuevo ADR
2. Alinear con el equipo
3. Actualizar documentación de arquitectura

---

## 8️⃣ Decisión de Aprobación (Obligatoria)

Antes de aprobar el PR, el reviewer debe poder responder **SÍ** a esto:

- [ ] ¿Este código hace el sistema más claro?
- [ ] ¿Reduce o mantiene el acoplamiento?
- [ ] ¿Es consistente con la arquitectura Vitalia?
- [ ] ¿Un nuevo dev lo entendería leyendo los docs?

**Si alguna es NO, el PR requiere cambios.**

---

## 9️⃣ Regla Final (No negociable)

> **El código puede funcionar y aun así ser rechazado si rompe la arquitectura.**
> 
> La arquitectura es un activo del producto, no una preferencia.

---

## Niveles de Severidad

Usa estos labels en PR reviews:

| Label | Significado | Acción |
|-------|-------------|--------|
| 🔴 **BLOCKER** | Violación arquitectónica grave | Debe corregirse antes de merge |
| 🟡 **IMPORTANTE** | Violación de best practice | Debería corregirse |
| 🟢 **MINOR** | Sugerencia de mejora | Opcional |
| 💡 **SUGERENCIA** | Mejora no crítica | Opcional |

---

## Ejemplos de Comentarios de Review

### Para Violaciones

```markdown
🔴 **BLOCKER**: Widget inyectando HttpClient directamente

**Issue**: Los widgets no deben hacer llamadas HTTP. Deben usar Facades.

**Fix**:
1. Remover `HttpClient` injection
2. Inyectar `PatientsFacade` en su lugar
3. Llamar `facade.loadPatients()` en lugar de HTTP

**Reference**: [Widget Design Rules](../05-BEST-PRACTICES/Widget-Design-Rules.md)
```

### Para Sugerencias

```markdown
💡 **SUGERENCIA**: Usar computed signal

**Current**:
\`\`\`typescript
get count(): number {
  return this.patients().length;
}
\`\`\`

**Better**:
\`\`\`typescript
readonly count = computed(() => this.patients().length);
\`\`\`

**Why**: Computed signals son más eficientes y reactivos.
```

---

## Quick Reference: Imports Prohibidos

### ❌ NUNCA en Widgets/Pages

```typescript
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientsApi } from '@app/domain/patients/patients.api';
import { PatientsStore } from '@app/domain/patients/patients.store';
```

### ✅ PERMITIDO en Widgets/Pages

```typescript
import { PatientsFacade } from '@app/domain/patients';
import { Patient } from '@app/domain/patients';
import { ButtonComponent } from '@app/shared/ui/button';
```

---

## Quick Reference: Estructura de Archivos

### ✅ Estructura Correcta

```
widgets/patient-stats/
├── patient-stats.component.ts
├── patient-stats.component.html
├── patient-stats.component.scss
├── patient-stats.config.ts
└── index.ts

domain/patients/
├── models/
│   └── patient.model.ts
├── patients.api.ts
├── patients.store.ts
├── patients.facade.ts
└── index.ts
```

### ❌ Estructura Incorrecta

```
widgets/patient-stats/
├── patient-stats.component.ts
├── patient-stats.service.ts      # ❌ NO services en widgets
└── patient-stats.api.ts           # ❌ NO api en widgets

domain/patients/
├── patients.component.ts          # ❌ NO components en domain
└── patients.service.ts            # ❌ Usar api/store/facade
```

---

## Checklist Rápido (1 minuto)

Para PRs pequeños, usa esta versión ultra-rápida:

- [ ] ¿Respeta las capas?
- [ ] ¿Widgets solo usan Facades?
- [ ] ¿No hay HTTP en UI?
- [ ] ¿No hay lógica de negocio en UI?
- [ ] ¿Código consistente con arquitectura?

**Si todas son ✅ → Aprobar**  
**Si alguna es ❌ → Revisar en detalle**

---

## Referencias

- [Vitalia Frontend Architecture](../Vitalia-Frontend-Architecture.md)
- [Widget Design Rules](Widget-Design-Rules.md)
- [Widget Template](../04-PATTERNS/widget-template.md)
- [Domain Layer Architecture](../00-CONCEPTS/Domain-Layer-Architecture.md)
- [When NOT to Use Widgets](when-not-to-use-widgets.md)
- [ADR-003](../../04-ADR/ADR-003-Widget-Based-Architecture.md)
- [ADR-004](../../04-ADR/ADR-004-Metadata-Driven-UI.md)
- [ADR-005](../../04-ADR/ADR-005-Domain-First-Approach.md)

---

**Última actualización**: 2026-01-22  
**Mantenido por**: Equipo Frontend Vitalia  
**Estado**: Obligatorio para todos los PRs
