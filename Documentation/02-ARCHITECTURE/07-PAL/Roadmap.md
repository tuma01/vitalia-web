# GDS & PAL - Implementation Roadmap

**Document Type**: Roadmap - Strategic Plan  
**Status**: ✅ Official - Follow Sequentially  
**Version**: 1.0  
**Last Updated**: 2026-01-23  
**Related**: [ADR-006](ADR-006-Design-System-PAL.md), [Implementation Guide](Implementation-Guide.md)

---

## Objetivo

Definir el **plan estratégico** para implementar el Global Design System (GDS) y la Presentation Abstraction Layer (PAL) de forma **incremental y segura**.

> **CRITICAL**: Seguir este roadmap **secuencialmente**. No saltar pasos.

---

## 📊 Roadmap Overview

```
FASE 1: Fundación (Semanas 1-2)
├── ✅ PASO 1: Documentación arquitectónica
├── ✅ PASO 2: Template oficial ui-component
└── ✅ PASO 3: Diseño de ui-form-field

FASE 2: Validación (Semanas 3-4)
├── 🔄 PASO 4: Congelar contrato del GDS
├── 🔄 PASO 5: Implementar ui-input
└── 🔄 PASO 6: Refactor de feature piloto

FASE 3: Enforcement (Semanas 5-6)
├── 🔄 PASO 7: Linting & enforcement
└── 🔄 PASO 8: Expandir PAL (ui-button, ui-card, etc.)

FASE 4: Integración (Semanas 7-8)
├── 🔄 PASO 9: Integración con Widgets
└── 🔄 PASO 10: White-label runtime (opcional)
```

---

## 🥇 PASO 4 - Congelar el Contrato del GDS (Governance)

### 🎯 Objetivo

Evitar que el sistema se **degrade con el tiempo**.

### 📋 Acciones

#### 1. Crear Documento de Governance

**Archivo**: `Documentation/02-ARCHITECTURE/06-DESIGN-SYSTEM/Governance.md`

**Contenido**:
- Reglas no negociables
- Quién puede modificar qué
- Proceso de aprobación de cambios
- Excepciones permitidas

#### 2. Declarar Reglas No Negociables

```markdown
# Reglas No Negociables del GDS

## 🔒 Regla 1: `ui-*` es la Única Entrada Visual

- ✅ Features usan solo `<ui-button>`, `<ui-card>`, etc.
- ❌ Prohibido `<mat-button>`, `<mat-card>` en features

## 🔒 Regla 2: Prohibido `mat-*` Fuera de `shared/ui/`

- ✅ `MatButtonModule` solo en `shared/ui/primitives/button/`
- ❌ Prohibido importar Material en features o widgets

## 🔒 Regla 3: Tokens son la Única Fuente de Estilos

- ✅ Usar `var(--ui-space-4)`, `var(--ui-color-brand-primary)`
- ❌ Prohibido `padding: 16px`, `color: #2196f3`
```

#### 3. Definir Ownership

| Elemento | Owner | Aprobación Requerida |
|----------|-------|----------------------|
| **Tokens** (`_base.scss`, `_semantic.scss`) | Architecture Team | Architecture Review |
| **Themes** (`_vitalia.scss`, `_school.scss`) | Design Team | Architecture Review |
| **Componentes PAL** (`ui-button`, `ui-card`) | Frontend Team | Code Review + Tests |
| **Features** (uso de `ui-*`) | Feature Teams | Code Review |

### ✅ Criterio de Salida

> **Un nuevo dev puede entender qué sí y qué no tocar.**

**Checklist**:
- [ ] Documento de Governance creado
- [ ] Reglas no negociables documentadas
- [ ] Ownership definido
- [ ] Proceso de aprobación claro

---

## 🥈 PASO 5 - Implementar `ui-input` (Dependiente de `ui-form-field`)

### 🎯 Objetivo

Cerrar el **circuito de formularios**.

### 📋 Por Qué Ahora

- ✅ `ui-form-field` ya está diseñado
- ✅ `ui-input` es el **80% del uso real**
- ✅ Valida la integración form-field + input

### 📐 Alcance

#### Funcionalidades

- ✅ Wrap de `matInput`
- ✅ States: `normal`, `disabled`, `error`, `focused`
- ✅ Sizes: `sm`, `md`, `lg`
- ✅ Types: `text`, `email`, `password`, `tel`
- ❌ **NO** soportar `date`, `number`, `file` aún (fase 2)

#### API

```typescript
// ui-input.types.ts
export type UiInputType = 'text' | 'email' | 'password' | 'tel';
export type UiInputSize = 'sm' | 'md' | 'lg';

export interface UiInputConfig {
  type?: UiInputType;
  size?: UiInputSize;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
}
```

#### Ejemplo de Uso

```html
<ui-form-field label="Email" [error]="emailError">
  <ui-input 
    type="email" 
    placeholder="usuario@ejemplo.com"
    formControlName="email">
  </ui-input>
</ui-form-field>
```

### 🚫 Stop Rule

❌ **NO soportar todos los tipos** (`date`, `number`, `file`) en esta fase.

**Razón**: Validar primero los tipos básicos antes de agregar complejidad.

### ✅ Criterio de Salida

- [ ] `ui-input` implementado con tipos básicos
- [ ] Integrado con `ui-form-field`
- [ ] Tests unitarios completos
- [ ] Documentado en Implementation Guide
- [ ] Usado en al menos 1 feature piloto

---

## 🥉 PASO 6 - Refactor de un Feature Real (Piloto)

### 🎯 Objetivo

Validar que el sistema funciona **en producción**, no solo en teoría.

### 🎯 Candidato Ideal

**Criterios**:
- ✅ Formulario existente (usa inputs, buttons)
- ✅ CRUD simple (lista + formulario)
- ✅ Dashboard admin (cards, tables)
- ❌ NO feature crítica de negocio (reducir riesgo)

**Sugerencias**:
- `features/admin/users` (CRUD de usuarios)
- `features/admin/settings` (Configuración)
- `features/tenant/dashboard` (Dashboard simple)

### 📋 Qué Hacer

#### Reemplazar

```html
<!-- ❌ ANTES: Material directo -->
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput type="email" formControlName="email">
  <mat-error *ngIf="emailError">{{ emailError }}</mat-error>
</mat-form-field>

<button mat-raised-button color="primary">Guardar</button>

<!-- ✅ DESPUÉS: UI System -->
<ui-form-field 
  label="Email" 
  [error]="emailError">
  <ui-input type="email" formControlName="email"></ui-input>
</ui-form-field>

<ui-button variant="primary">Guardar</ui-button>
```

#### NO Tocar

- ❌ Lógica de negocio
- ❌ Servicios de dominio
- ❌ Facades
- ❌ Validaciones

### ✅ Criterio de Éxito

**Métricas**:
- [ ] **-50%** de CSS en la feature
- [ ] **+30%** de legibilidad (code review subjetivo)
- [ ] **0** imports de Material en la feature
- [ ] **0** regresiones funcionales

**Validación**:
- [ ] Tests E2E pasan
- [ ] Feature funciona igual que antes
- [ ] Code review aprueba cambios

---

## 🧠 PASO 7 - Linting & Enforcement (Blindaje)

### 🎯 Objetivo

Que nadie rompa la arquitectura **"por accidente"**.

### 📋 Acciones

#### 1. ESLint Rules Custom

**Archivo**: `.eslintrc.js`

```javascript
module.exports = {
  // ...
  rules: {
    // Bloquear Material fuera de shared/ui/
    '@vitalia/no-mat-module-in-features': 'error',
    '@vitalia/no-mat-selector-in-templates': 'error',
    '@vitalia/no-domain-in-ui': 'error',
    '@vitalia/no-class-on-ui-components': 'error'
  }
};
```

**Implementar**:

```typescript
// eslint-rules/no-mat-module-in-features.js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prohibir imports de Material fuera de shared/ui/',
      category: 'Architecture',
      recommended: true
    },
    messages: {
      noMatModule: 'No se permite importar Material fuera de shared/ui/. Usa componentes ui-* en su lugar.'
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const filePath = context.getFilename();
        
        // Si importa Material
        if (importPath.includes('@angular/material')) {
          // Y NO está en shared/ui/
          if (!filePath.includes('shared/ui/')) {
            context.report({
              node,
              messageId: 'noMatModule'
            });
          }
        }
      }
    };
  }
};
```

#### 2. PR Template

**Archivo**: `.github/pull_request_template.md`

```markdown
## Checklist de Arquitectura

### UI System
- [ ] ✅ No importo `MatButtonModule` ni otros de Material (excepto en `shared/ui/`)
- [ ] ✅ Uso solo componentes `ui-*` en features
- [ ] ✅ No paso `class` a componentes `ui-*`
- [ ] ✅ No uso `::ng-deep` sobre `ui-*`

### Estilos
- [ ] ✅ No uso valores hardcodeados (`16px`, `#2196f3`)
- [ ] ✅ Uso tokens CSS para layout (`var(--ui-space-4)`)

### Tests
- [ ] ✅ Tests unitarios pasan
- [ ] ✅ Tests E2E pasan (si aplica)
```

### ✅ Criterio de Salida

> **Esto convierte el diseño en regla técnica, no sugerencia.**

- [ ] ESLint rules implementadas
- [ ] PR template actualizado
- [ ] CI/CD ejecuta linting
- [ ] 0 violaciones en código existente

---

## 🧩 PASO 8 - Expandir PAL (Orden Correcto)

### 🎯 Objetivo

Crear los componentes UI más usados en **orden de prioridad**.

### 📋 Orden Recomendado (NO CAMBIAR)

| # | Componente | Razón | Complejidad |
|---|------------|-------|-------------|
| 1 | `ui-button` | Más usado, simple | Baja |
| 2 | `ui-card` | Contenedor común | Baja |
| 3 | `ui-select` | Formularios | Media |
| 4 | `ui-checkbox` | Formularios | Baja |
| 5 | `ui-table` | Listas de datos | Alta |

### 🔒 Regla de Oro

> **Nunca más de 1 componente nuevo a la vez.**

**Razón**: Validar cada componente antes de agregar el siguiente.

### 📐 Proceso por Componente

1. ✅ Diseñar API (types)
2. ✅ Implementar componente
3. ✅ Escribir tests
4. ✅ Documentar en Implementation Guide
5. ✅ Usar en feature piloto
6. ✅ Code review + aprobación
7. ✅ **Solo entonces** → siguiente componente

### ✅ Criterio de Salida

- [ ] 5 componentes implementados
- [ ] Todos con tests > 80% coverage
- [ ] Todos documentados
- [ ] Todos usados en al menos 1 feature

---

## 🏗️ PASO 9 - Integración con Widgets

### 🎯 Objetivo

Cerrar el círculo **GDS ↔ Widgets ↔ Dominios**.

### 📋 Qué Validar

#### 1. Widgets Usan Solo `ui-*`

```typescript
// ✅ CORRECTO: Widget usa UI System
@Component({
  selector: 'widget-patient-card',
  template: `
    <ui-card elevation="elevated">
      <ui-form-field label="Nombre">
        <ui-input [value]="patient.name" readonly></ui-input>
      </ui-form-field>
      
      <ui-button variant="primary" (clicked)="onEdit()">
        Editar
      </ui-button>
    </ui-card>
  `
})
export class PatientCardWidgetComponent {
  @Input() patient!: Patient;
  @Output() edit = new EventEmitter<void>();
  
  onEdit(): void {
    this.edit.emit();
  }
}
```

#### 2. Widgets No Tienen CSS Propio

```scss
// ❌ PROHIBIDO en widgets
.patient-card {
  padding: 16px;
  background: #f5f5f5;
}

// ✅ PERMITIDO: Solo layout
.patient-card {
  display: flex;
  flex-direction: column;
  gap: var(--ui-space-4);
}
```

#### 3. Layout Visual Viene del GDS

**Separación clara**:
- **GDS**: Define **cómo se ven** los componentes (colores, tamaños, estilos)
- **Widgets**: Define **cómo se organizan** los componentes (layout, gap, orden)

### ✅ Criterio de Salida

> **Aquí tu arquitectura queda completa y coherente.**

- [ ] 3+ widgets refactorizados para usar `ui-*`
- [ ] 0 CSS visual en widgets
- [ ] Widgets funcionan en Vitalia y School sin cambios
- [ ] Documentación de integración creada

---

## 🌐 PASO 10 - White-Label Runtime (Opcional, pero Estratégico)

### 🎯 Objetivo

Activar **themes por tenant** en runtime.

### 📋 Acciones

#### 1. `UiConfigService` Completo

```typescript
// shared/ui/config/ui-config.service.ts
@Injectable({ providedIn: 'root' })
export class UiConfigService {
  private theme = signal<UiTheme>('vitalia');
  
  readonly currentTheme = this.theme.asReadonly();
  
  constructor() {
    effect(() => {
      const themeName = this.theme();
      document.body.className = `theme-${themeName}`;
    });
  }
  
  setTheme(theme: UiTheme): void {
    this.theme.set(theme);
  }
  
  setTenantTheme(tenantId: string): void {
    const themeMap: Record<string, UiTheme> = {
      'hospital-xyz': 'vitalia',
      'school-abc': 'school',
      'bank-def': 'finance'
    };
    const theme = themeMap[tenantId] || 'vitalia';
    this.setTheme(theme);
  }
}
```

#### 2. Inyección de `.theme-*` en `<body>`

```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
  constructor(
    private uiConfig: UiConfigService,
    private tenantFacade: TenantsFacade
  ) {}
  
  ngOnInit(): void {
    // Cambiar tema según tenant actual
    this.tenantFacade.selectedTenant$.subscribe(tenant => {
      if (tenant) {
        this.uiConfig.setTenantTheme(tenant.id);
      }
    });
  }
}
```

#### 3. Toggle Dinámico (Admin)

```typescript
// admin/settings/theme-selector.component.ts
@Component({
  selector: 'app-theme-selector',
  template: `
    <ui-form-field label="Tema">
      <ui-select [(value)]="selectedTheme" (valueChange)="onThemeChange($event)">
        <option value="vitalia">Vitalia (Salud)</option>
        <option value="school">School (Educación)</option>
        <option value="finance">Finance (Finanzas)</option>
      </ui-select>
    </ui-form-field>
  `
})
export class ThemeSelectorComponent {
  selectedTheme: UiTheme = 'vitalia';
  
  constructor(private uiConfig: UiConfigService) {
    this.selectedTheme = this.uiConfig.currentTheme();
  }
  
  onThemeChange(theme: UiTheme): void {
    this.uiConfig.setTheme(theme);
  }
}
```

### ✅ Criterio de Salida

> **Esto te habilita: hospitales, escuelas, clientes premium.**

- [ ] `UiConfigService` implementado
- [ ] Themes se inyectan dinámicamente en `<body>`
- [ ] Toggle de tema funciona en admin
- [ ] 3+ themes funcionan sin cambios de código
- [ ] Documentación de white-labeling creada

---

## 📊 Métricas de Éxito (Global)

### Corto Plazo (1-2 meses)

- [ ] ✅ 100% de nuevos features usan `ui-*`
- [ ] ✅ 0 imports de Material en nuevos PRs
- [ ] ✅ 5+ componentes PAL creados
- [ ] ✅ 1 feature piloto refactorizado

### Mediano Plazo (3-6 meses)

- [ ] ✅ 50%+ de features migrados a PAL
- [ ] ✅ Tiempo de cambio visual global < 1 hora
- [ ] ✅ White-labeling funcional para 2+ tenants
- [ ] ✅ ESLint rules activas y sin violaciones

### Largo Plazo (6-12 meses)

- [ ] ✅ 90%+ de features migrados a PAL
- [ ] ✅ Design System extraído como librería NPM
- [ ] ✅ Storybook completo con todos los componentes
- [ ] ✅ 0 inconsistencias visuales reportadas

---

## 🚨 Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Resistencia del equipo | Media | Alto | Onboarding, documentación clara |
| Bugs en migración | Alta | Medio | Tests E2E, feature piloto primero |
| Performance issues | Baja | Medio | OnPush, lazy loading |
| Scope creep | Media | Alto | Roadmap estricto, 1 componente a la vez |

---

## 📚 Referencias

- [ADR-006: Design System + PAL](ADR-006-Design-System-PAL.md)
- [Implementation Guide](Implementation-Guide.md)
- [Coding Conventions](Coding-Conventions.md)
- [Component Template](Component-Template.md)

---

**Última actualización**: 2026-01-23  
**Mantenido por**: Architecture Team  
**Estado**: ✅ Official - Follow Sequentially

