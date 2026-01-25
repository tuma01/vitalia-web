# Project Structure Guide

> **Living Document** - Updated as structure evolves  
> **Last Updated**: 2026-01-22  
> **For**: All developers

---

## Complete Folder Structure

```
src/app/
├── core/                          # ⚙️ Infrastructure (UI-agnostic)
│   ├── auth/
│   ├── guards/
│   ├── interceptors/
│   ├── services/
│   └── token/
│
├── shared/                        # 🎨 UI Kit (Dumb Components)
│   └── ui/
│       ├── button/
│       ├── card/
│       ├── datagrid/
│       ├── input/
│       └── modal/
│
├── domain/                        # 🧠 Business Logic (DDD)
│   ├── patients/
│   │   ├── models/
│   │   │   └── patient.model.ts
│   │   ├── patients.api.ts
│   │   ├── patients.store.ts
│   │   ├── patients.facade.ts
│   │   └── index.ts
│   ├── appointments/
│   ├── billing/
│   └── tenants/
│
├── widgets/                       # 🧩 Smart Components (Configurable)
│   ├── patient-stats/
│   │   ├── patient-stats.component.ts
│   │   ├── patient-stats.component.html
│   │   ├── patient-stats.component.scss
│   │   └── patient-stats.config.ts
│   ├── appointment-list/
│   ├── billing-summary/
│   └── kpi-chart/
│
├── layout/                        # 🏗️ Shell & Zones
│   ├── components/
│   │   ├── zone-renderer/
│   │   │   ├── zone-renderer.component.ts
│   │   │   ├── zone-renderer.component.html
│   │   │   └── zone-renderer.component.scss
│   │   ├── widget-host/
│   │   ├── shell/
│   │   ├── header/
│   │   └── sidebar/
│   ├── zones/
│   │   └── zone-config.model.ts
│   └── services/
│       ├── ui-layout.service.ts
│       └── widget-registry.service.ts
│
└── features/                      # 📄 Pages (Routes)
    ├── admin/
    │   └── dashboard/
    │       └── admin-dashboard.component.ts
    ├── doctor/
    ├── patient/
    └── auth/
        └── login/
```

---

## Naming Conventions

### Domain Files

| File Type | Naming Pattern | Example |
|-----------|----------------|---------|
| Model | `<entity>.model.ts` | `patient.model.ts` |
| API | `<domain>.api.ts` | `patients.api.ts` |
| Store | `<domain>.store.ts` | `patients.store.ts` |
| Facade | `<domain>.facade.ts` | `patients.facade.ts` |
| Index | `index.ts` | `index.ts` |

### Widget Files

| File Type | Naming Pattern | Example |
|-----------|----------------|---------|
| Component | `<widget-name>.component.ts` | `patient-stats.component.ts` |
| Template | `<widget-name>.component.html` | `patient-stats.component.html` |
| Styles | `<widget-name>.component.scss` | `patient-stats.component.scss` |
| Config | `<widget-name>.config.ts` | `patient-stats.config.ts` |

### Shared Components

Use descriptive names: `button`, `card`, `datagrid`, `input`, `modal`

---

## Where Each Type of File Belongs

### `core/` - UI-Agnostic Infrastructure

**What goes here**:
- ✅ Authentication services
- ✅ HTTP interceptors
- ✅ Route guards
- ✅ Logging services
- ✅ Configuration services

**What does NOT go here**:
- ❌ Visual components
- ❌ Business logic
- ❌ Domain-specific code

**Rule**: If it has a template, it doesn't belong in `core/`.

---

### `shared/ui/` - Dumb UI Components

**What goes here**:
- ✅ Buttons, cards, inputs
- ✅ Tables, modals, dialogs
- ✅ Pure presentation components
- ✅ Reusable UI utilities

**Characteristics**:
- No domain knowledge
- Receive data via `@Input()`
- Emit events via `@Output()`
- No HTTP calls
- No Facades

---

### `domain/<domain-name>/` - Business Logic

**What goes here**:
- ✅ TypeScript interfaces (models)
- ✅ HTTP clients (`*.api.ts`)
- ✅ State management (`*.store.ts`)
- ✅ Public API (`*.facade.ts`)

**Structure**:
```
domain/<domain-name>/
├── models/           # Interfaces
├── *.api.ts         # HTTP layer
├── *.store.ts       # State layer
├── *.facade.ts      # Orchestration layer
└── index.ts         # Public exports
```

**See**: [Creating a Domain](Creating-A-Domain.md)

---

### `widgets/<widget-name>/` - Configurable Components

**What goes here**:
- ✅ Smart components that use Facades
- ✅ Configurable via `WidgetConfig`
- ✅ Reusable across multiple pages/zones

**Structure**:
```
widgets/<widget-name>/
├── <widget-name>.component.ts
├── <widget-name>.component.html
├── <widget-name>.component.scss
└── <widget-name>.config.ts
```

**See**: [Creating a Widget](Creating-A-Widget.md)

---

### `layout/` - Rendering Engine & Shell

**What goes here**:
- ✅ ZoneRenderer (dynamic widget instantiation)
- ✅ WidgetRegistry (widget type mapping)
- ✅ UiLayoutService (backend communication)
- ✅ Shell components (header, sidebar, footer)

**Why here and not `core/`**:
- Layout is **UI infrastructure**, not business-agnostic
- Contains visual components
- Specific to application structure

---

### `features/<feature-name>/` - Routed Pages

**What goes here**:
- ✅ Page components (routed)
- ✅ Feature-specific components
- ✅ Route definitions

**Characteristics**:
- Tied to specific routes
- May use widgets or traditional components
- Minimal logic (delegate to domain/widgets)

---

## Module Organization

### Standalone Components

All components should be **standalone**:

```typescript
@Component({
  selector: 'app-patient-stats',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './patient-stats.component.html'
})
export class PatientStatsWidget { }
```

### Lazy Loading Strategy

Features should be lazy-loaded:

```typescript
// app.routes.ts
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.routes')
}
```

Widgets are loaded on-demand by ZoneRenderer.

---

## Path Aliases

Configure TypeScript path aliases for clean imports:

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["src/app/*"],
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@domain/*": ["src/app/domain/*"],
      "@widgets/*": ["src/app/widgets/*"],
      "@layout/*": ["src/app/layout/*"],
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

**Usage**:

```typescript
import { PatientsFacade } from '@domain/patients';
import { Button } from '@shared/ui/button';
import { ZoneRenderer } from '@layout/components/zone-renderer';
```

---

## File Size Guidelines

| File Type | Max Lines | Recommendation |
|-----------|-----------|----------------|
| Component | 200 | Split if larger |
| Service | 300 | Split into multiple services |
| Facade | 250 | Too many methods = poor design |
| Widget | 150 | Keep focused on one thing |

---

## Quick Reference

### Creating a New Domain

```bash
mkdir -p src/app/domain/my-domain/models
touch src/app/domain/my-domain/models/my-entity.model.ts
touch src/app/domain/my-domain/my-domain.api.ts
touch src/app/domain/my-domain/my-domain.store.ts
touch src/app/domain/my-domain/my-domain.facade.ts
touch src/app/domain/my-domain/index.ts
```

### Creating a New Widget

```bash
mkdir -p src/app/widgets/my-widget
touch src/app/widgets/my-widget/my-widget.component.ts
touch src/app/widgets/my-widget/my-widget.component.html
touch src/app/widgets/my-widget/my-widget.component.scss
touch src/app/widgets/my-widget/my-widget.config.ts
```

---

## References

- [Creating a Domain](Creating-A-Domain.md)
- [Creating a Widget](Creating-A-Widget.md)
- [Domain Boilerplate](Domain-Boilerplate.md)
- [Widget Boilerplate](Widget-Boilerplate.md)
