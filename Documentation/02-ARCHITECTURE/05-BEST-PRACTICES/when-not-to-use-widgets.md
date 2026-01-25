# Guía: Cuándo NO usar Widgets

> **Living Document** - Decisiones arquitectónicas pragmáticas  
> **Last Updated**: 2026-01-22  
> **For**: Arquitectos y desarrolladores tomando decisiones de diseño

---

## Propósito

La arquitectura Widget-Domain es poderosa, pero **no es para todo**. Esta guía te ayuda a decidir cuándo usar widgets y cuándo usar componentes tradicionales.

> ❝ No todo debe ser un widget. El over-engineering es tan malo como el under-engineering. ❞

---

## Regla de Oro

**Usa widgets cuando**:
- La UI varía por tenant o rol
- El componente se reutiliza en múltiples contextos
- Necesitas configuración dinámica desde backend
- Es parte de un dashboard configurable

**NO uses widgets cuando**:
- Es una página simple de una sola vez
- No hay variabilidad
- No se reutiliza
- Es más simple hacerlo tradicional

---

## Árbol de Decisión

```
¿Es un dashboard o pantalla configurable?
├─ SÍ → ✅ Usa Widgets
└─ NO → ¿Se reutiliza en múltiples lugares?
    ├─ SÍ → ¿Varía por tenant/rol?
    │   ├─ SÍ → ✅ Usa Widgets
    │   └─ NO → ⚠️ Considera componente compartido
    └─ NO → ¿Es complejo (>3 fuentes de datos)?
        ├─ SÍ → ✅ Usa Widgets (para aislar complejidad)
        └─ NO → ❌ Usa componente tradicional
```

---

## ✅ Casos de Uso BUENOS para Widgets

### 1. Dashboards Configurables

```typescript
// ✅ PERFECTO para widgets
// Admin Dashboard con KPIs configurables por tenant
<app-zone-renderer zone="admin-dashboard"></app-zone-renderer>
```

**Por qué**: 
- Tenant A ve widgets de facturación
- Tenant B no los ve
- Configuración dinámica desde backend

---

### 2. Componentes Reutilizables con Variaciones

```typescript
// ✅ BUENO para widgets
// Widget de estadísticas usado en 5 dashboards diferentes
{
  "type": "stats-card",
  "config": {
    "metric": "patients",
    "period": "monthly"
  }
}
```

**Por qué**:
- Se usa en múltiples contextos
- Configuración varía por uso
- Aislado y testeable

---

### 3. Features con Permisos Complejos

```typescript
// ✅ BUENO para widgets
// Widget de facturación solo para roles finance
{
  "type": "billing-summary",
  "permissions": ["FINANCE_ADMIN", "BILLING_MANAGER"]
}
```

**Por qué**:
- Backend filtra por permisos
- No hay lógica de permisos en frontend
- Fácil de auditar

---

### 4. Componentes que Cambian Frecuentemente

```typescript
// ✅ BUENO para widgets
// Promociones que cambian cada semana
{
  "type": "promo-banner",
  "config": {
    "message": "Nueva funcionalidad disponible",
    "link": "/features/new"
  }
}
```

**Por qué**:
- Cambios sin deploy frontend
- Configuración centralizada
- A/B testing fácil

---

## ❌ Casos de Uso MALOS para Widgets

### 1. Páginas de Login/Auth

```typescript
// ❌ MAL - No usar widgets
// Login es estático, no varía, no se reutiliza
@Component({
  template: `
    <form (submit)="login()">
      <input type="email" [(ngModel)]="email">
      <input type="password" [(ngModel)]="password">
      <button>Login</button>
    </form>
  `
})
export class LoginComponent { }
```

**Por qué NO widget**:
- No varía por tenant
- No se reutiliza
- No necesita configuración
- Más simple como componente tradicional

---

### 2. Páginas Estáticas (About, Terms, Privacy)

```typescript
// ❌ MAL - No usar widgets
@Component({
  template: `
    <div class="static-page">
      <h1>Acerca de Vitalia</h1>
      <p>Contenido estático...</p>
    </div>
  `
})
export class AboutPageComponent { }
```

**Por qué NO widget**:
- Contenido fijo
- No hay lógica de negocio
- No se reutiliza
- Over-engineering innecesario

---

### 3. Formularios Simples

```typescript
// ❌ MAL - No usar widgets
// Formulario de creación de usuario (usado en un solo lugar)
@Component({
  template: `
    <form [formGroup]="userForm" (submit)="save()">
      <input formControlName="name">
      <input formControlName="email">
      <button>Guardar</button>
    </form>
  `
})
export class CreateUserFormComponent { }
```

**Por qué NO widget**:
- Usado en un solo lugar
- No necesita configuración dinámica
- Formularios son mejor con Reactive Forms tradicional
- Widgets añaden complejidad innecesaria

---

### 4. Componentes de Una Sola Vez

```typescript
// ❌ MAL - No usar widgets
// Header específico de una landing page
@Component({
  template: `
    <header class="landing-header">
      <img src="logo.png">
      <nav>...</nav>
    </header>
  `
})
export class LandingHeaderComponent { }
```

**Por qué NO widget**:
- Usado en un solo lugar
- No se reutiliza
- No varía
- Componente tradicional es más simple

---

### 5. Modals/Dialogs Simples

```typescript
// ❌ MAL - No usar widgets
// Modal de confirmación genérico
@Component({
  template: `
    <div class="modal">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button (click)="confirm()">Confirmar</button>
      <button (click)="cancel()">Cancelar</button>
    </div>
  `
})
export class ConfirmDialogComponent { }
```

**Por qué NO widget**:
- Componente de infraestructura UI
- No tiene lógica de negocio
- No necesita Facade
- Mejor como componente compartido en `shared/ui/`

---

## ⚠️ Casos Grises (Depende del Contexto)

### 1. Tablas de Datos

**✅ Usa Widget SI**:
- La tabla se usa en múltiples dashboards
- Columnas varían por tenant
- Filtros configurables desde backend

**❌ NO uses Widget SI**:
- Tabla específica de una sola página
- Configuración fija
- No se reutiliza

---

### 2. Gráficos/Charts

**✅ Usa Widget SI**:
- Gráfico reutilizable (ventas, pacientes, etc.)
- Tipo de gráfico configurable
- Datos vienen de Facade

**❌ NO uses Widget SI**:
- Gráfico único para un reporte específico
- No se reutiliza
- Datos hardcoded

---

### 3. Listas de Items

**✅ Usa Widget SI**:
- Lista reutilizable (pacientes, citas, facturas)
- Filtros configurables
- Usada en múltiples contextos

**❌ NO uses Widget SI**:
- Lista específica de una página
- No varía
- No se reutiliza

---

## Ejemplos Prácticos de Vitalia

### ✅ Buenos Candidatos para Widgets

1. **Patient Stats Card** - Usado en 3 dashboards diferentes
2. **Appointment List** - Varía por rol (doctor ve sus citas, admin ve todas)
3. **Billing Summary** - Solo visible para roles finance
4. **KPI Chart** - Configurable (tipo de métrica, período)
5. **Recent Alerts** - Usado en múltiples dashboards

### ❌ Malos Candidatos para Widgets

1. **Login Form** - Estático, no varía
2. **User Profile Edit** - Usado en un solo lugar
3. **Terms & Conditions Page** - Contenido estático
4. **404 Error Page** - No se reutiliza
5. **Simple Contact Form** - No necesita configuración

---

## Checklist de Decisión

Antes de crear un widget, pregúntate:

- [ ] ¿Se usará en más de un lugar?
- [ ] ¿Varía por tenant o rol?
- [ ] ¿Necesita configuración dinámica?
- [ ] ¿Es parte de un dashboard configurable?
- [ ] ¿Tiene lógica de negocio compleja?

**Si respondiste SÍ a 2 o más** → ✅ Usa Widget  
**Si respondiste NO a todas** → ❌ Usa componente tradicional

---

## Estrategia Híbrida (Recomendada)

La mejor arquitectura usa **ambos** enfoques:

```
Vitalia Frontend
├── Dashboards → Widgets (configurables, dinámicos)
├── Forms → Componentes tradicionales (Reactive Forms)
├── Static Pages → Componentes tradicionales
├── Modals/Dialogs → Componentes compartidos (shared/ui/)
└── Navigation → Componentes tradicionales
```

---

## Migración Gradual

**NO refactorices todo a widgets**. Migra gradualmente:

### Fase 1: Dashboards Principales
- Admin Dashboard → Widgets
- Doctor Dashboard → Widgets
- Patient Portal → Widgets

### Fase 2: Componentes Reutilizables
- Stats Cards → Widgets
- Charts → Widgets
- Lists → Widgets (si se reutilizan)

### Fase 3: Evaluación
- Medir beneficios
- Ajustar estrategia
- Decidir qué más migrar

**Nunca migres**:
- Login/Auth
- Formularios simples
- Páginas estáticas
- Componentes de una sola vez

---

## Señales de Over-Engineering

Si ves esto, probablemente NO necesitas un widget:

- ❌ Widget con un solo uso
- ❌ Widget sin configuración (config vacío)
- ❌ Widget que solo renderiza HTML estático
- ❌ Widget sin Facade (no usa dominio)
- ❌ Widget más complejo que la página que lo usa

---

## Conclusión

**Regla simple**:

> Si tienes que preguntarte "¿debería ser un widget?", probablemente no.  
> Los widgets son para casos claros de reutilización y configuración dinámica.

**Cuando hay duda**:
1. Empieza con componente tradicional
2. Si ves que se reutiliza → Refactoriza a widget
3. Si necesitas configuración dinámica → Refactoriza a widget

**No hay prisa**. La arquitectura permite evolución gradual.

---

## Referencias

- [Widget Design Rules](Widget-Design-Rules.md)
- [Widget Template](widget-template.md)
- [Vitalia Frontend Architecture](../Vitalia-Frontend-Architecture.md)
- [ADR-003: Widget-Based Architecture](../../04-ADR/ADR-003-Widget-Based-Architecture.md)

---

**Última actualización**: 2026-01-22  
**Mantenido por**: Equipo Frontend Vitalia
