# ADR-007 — Global Design System (GDS) & Presentation Abstraction Layer (PAL)

**Status**: ✅ Accepted  
**Date**: 2026-01-23  
**Supersedes**: [ADR-006](ADR-006-Design-System-PAL.md) (detailed version)  
**Related**: [Implementation Guide](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Implementation-Guide.md), [Roadmap](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Roadmap.md)

---

## Estado

**✅ Aceptado**

---

## Fecha

2026-01-23

---

## Contexto

Vitalia es una plataforma empresarial **multi-dominio** y **multi-tenant**. La UI creció históricamente con uso directo de Angular Material y estilos locales en Features, generando:

- ❌ **Inconsistencias visuales** entre features
- ❌ **Alto costo de cambio** de branding
- ❌ **Dificultad para escalar** a nuevos dominios (escuelas, finanzas, otros sectores)
- ❌ **Deuda técnica** en estilos duplicados
- ❌ **Onboarding lento** (cada dev decide estilos)

### Requisitos

Se requiere una solución que:

- ✅ Centralice la identidad visual
- ✅ Elimine decisiones de diseño a nivel Feature
- ✅ Permita white-labeling por tenant
- ✅ Sea agnóstica del dominio
- ✅ Escalable a largo plazo (5-10 años)

---

## Decisión

Adoptar un **Global Design System (GDS)** basado en **Design Tokens** y una **Presentation Abstraction Layer (PAL)** como única interfaz visual para la aplicación.

### Componentes de la Decisión

#### 1. **Design Tokens (GDS)** como Única Fuente de Verdad Visual

```scss
// src/styles/ds/tokens/_base.scss
$ui-space-4: 1rem;
$ui-radius-md: 0.5rem;
$ui-elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12);

// src/styles/ds/tokens/_semantic.scss
$ui-color-brand-primary: null !default;
$ui-font-family-primary: null !default;

// src/styles/ds/themes/_vitalia.scss
$ui-color-brand-primary: #2F80ED;
$ui-font-family-primary: 'Inter', sans-serif;
```

#### 2. **PAL (`ui-*`)** como Abstracción Semántica sobre Angular Material

```typescript
// shared/ui/primitives/button/ui-button.component.ts
@Component({
  selector: 'ui-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class UiButtonComponent {
  @Input() variant: UiButtonVariant = 'primary'; // No 'string'
  @Input() size: UiButtonSize = 'md';
}
```

#### 3. **Prohibición Explícita** del Uso Directo de `mat-*` Fuera de `shared/ui/`

```typescript
// ❌ PROHIBIDO en features/
import { MatButtonModule } from '@angular/material/button';

// ✅ PERMITIDO solo en shared/ui/
import { MatButtonModule } from '@angular/material/button';
```

#### 4. **Tematización por Runtime** mediante Clases `.theme-*`

```typescript
// shared/ui/config/ui-config.service.ts
@Injectable({ providedIn: 'root' })
export class UiConfigService {
  setTheme(theme: UiTheme): void {
    document.body.className = `theme-${theme}`;
  }
  
  setTenantTheme(tenantId: string): void {
    const themeMap: Record<string, UiTheme> = {
      'hospital-xyz': 'vitalia',
      'school-abc': 'school'
    };
    this.setTheme(themeMap[tenantId] || 'vitalia');
  }
}
```

---

## Arquitectura Resultante

### Capas

```
src/
├── styles/
│   └── ds/                              # GDS (Estilos)
│       ├── tokens/
│       │   ├── _base.scss               # Tokens universales
│       │   └── _semantic.scss           # Contratos semánticos
│       └── themes/
│           ├── _vitalia.scss            # Tema Salud
│           └── _school.scss             # Tema Educación
│
└── app/
    ├── shared/
    │   └── ui/                          # PAL (Componentes UI)
    │       ├── primitives/              # ui-button, ui-input
    │       ├── components/              # ui-card, ui-form-field
    │       └── config/                  # UiConfigService
    │
    └── features/                        # Features / Widgets
        └── patients/                    # Consumen únicamente ui-*
```

### Flujo de Datos

```
Tokens (GDS) → PAL (ui-*) → Features
     ↓              ↓            ↓
  Estilos      Componentes   Composición
```

---

## Convenciones Clave

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| **Componentes UI** | Prefijo `ui-` + Kebab Case | `ui-button`, `ui-form-field` |
| **Tokens CSS** | Prefijo `--ui-` + Categoría | `--ui-color-brand-primary` |
| **Variables SCSS** | Prefijo `$ui-` | `$ui-space-4` |
| **Themes** | Prefijo `theme-` (clase CSS) | `.theme-vitalia` |
| **Tipos** | Prefijo `Ui` + Pascal Case | `UiButtonVariant` |
| **Change Detection** | Siempre `OnPush` | Obligatorio |
| **Inputs** | Union Types (no `string`) | `variant: UiButtonVariant` |
| **Estilos** | Solo tokens (no `px`/`#hex`) | `padding: var(--ui-space-4)` |

---

## Consecuencias

### ✅ Positivas

- ✅ **Consistencia visual total**: Un solo lugar para cambiar diseño
- ✅ **White-label nativo**: Cambiar tema en runtime sin recompilar
- ✅ **Menor deuda técnica**: Estilos centralizados, no duplicados
- ✅ **Onboarding más rápido**: Nuevos devs usan componentes, no deciden estilos
- ✅ **Gobierno arquitectónico claro**: Reglas no negociables documentadas
- ✅ **Multi-dominio**: Funciona en salud, educación, finanzas sin cambios

### ⚠️ Negativas / Costos

- ⚠️ **Curva inicial de adopción**: Equipo debe aprender nuevas convenciones
- ⚠️ **Inversión inicial**: Crear componentes base (ui-button, ui-card, etc.)
- ⚠️ **Menor libertad estética a nivel Feature**: Intencional, es una feature no un bug

**Mitigación**:
- Documentación completa (8 documentos)
- Template oficial copy-paste ready
- Roadmap incremental (10 pasos)
- Feature piloto para validación

---

## Reglas No Negociables

### 🔒 Regla 1: `ui-*` es la Única Entrada Visual

```html
<!-- ✅ CORRECTO -->
<ui-button variant="primary">Guardar</ui-button>

<!-- ❌ PROHIBIDO -->
<button mat-raised-button color="primary">Guardar</button>
```

### 🔒 Regla 2: Prohibido `mat-*` Fuera de `shared/ui/`

```typescript
// ❌ PROHIBIDO en features/
import { MatButtonModule } from '@angular/material/button';

// ✅ PERMITIDO solo en shared/ui/primitives/button/
import { MatButtonModule } from '@angular/material/button';
```

### 🔒 Regla 3: No Estilos Visuales en Features

```scss
// ❌ PROHIBIDO en features/
.patient-card {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

// ✅ PERMITIDO: Solo layout
.patient-card {
  display: flex;
  gap: var(--ui-space-4);
}
```

### 🔒 Regla 4: Inputs Visuales Tipados

```typescript
// ❌ PROHIBIDO
@Input() variant: string;

// ✅ CORRECTO
@Input() variant: UiButtonVariant = 'primary';
```

---

## Gobernanza

### Ownership

| Elemento | Owner | Aprobación Requerida |
|----------|-------|----------------------|
| **Tokens** | Architecture Team | Architecture Review |
| **Themes** | Design Team | Architecture Review |
| **Componentes PAL** | Frontend Team | Code Review + Tests |
| **Features** | Feature Teams | Code Review |

### Proceso de Cambios

1. **Tokens/Themes**: Propuesta → Architecture Review → Aprobación → Implementación
2. **Componentes PAL**: Diseño API → Implementación → Tests → Code Review → Merge
3. **Features**: Code Review → Checklist UI → Merge

### Enforcement

- ✅ ESLint rules custom (`@vitalia/no-mat-in-features`)
- ✅ PR template con checklist UI
- ✅ Code review obligatorio
- ✅ CI/CD ejecuta linting

---

## Alternativas Consideradas

### Alternativa 1: UI Kit Ad-Hoc por Feature

**Descripción**: Cada feature decide sus estilos.

**Rechazado porque**:
- ❌ Inconsistencia visual
- ❌ Duplicación de código
- ❌ Imposible white-labeling

### Alternativa 2: Uso Directo de Angular Material

**Descripción**: Usar `mat-*` directamente en features.

**Rechazado porque**:
- ❌ Acoplamiento a Material
- ❌ Difícil cambiar biblioteca UI
- ❌ No soporta multi-dominio

### Alternativa 3: Librería Externa de Diseño

**Descripción**: Usar Tailwind, Bootstrap, etc.

**Rechazado porque**:
- ❌ No cumple multi-dominio
- ❌ Clases utilitarias dificultan gobierno
- ❌ No integra con Angular Material

---

## Implementación

### Roadmap (10 Pasos)

| Fase | Paso | Duración |
|------|------|----------|
| **Fundación** | 1-3: Documentación + Template + ui-form-field | 2 semanas |
| **Validación** | 4-6: Governance + ui-input + Feature piloto | 2 semanas |
| **Enforcement** | 7-8: Linting + Expandir PAL | 2 semanas |
| **Integración** | 9-10: Widgets + White-label | 2 semanas |

**Total**: 8 semanas

### Métricas de Éxito

**Corto plazo (1-2 meses)**:
- [ ] 100% de nuevos features usan `ui-*`
- [ ] 0 imports de Material en nuevos PRs
- [ ] 5+ componentes PAL creados

**Mediano plazo (3-6 meses)**:
- [ ] 50%+ de features migrados a PAL
- [ ] Tiempo de cambio visual global < 1 hora
- [ ] White-labeling funcional para 2+ tenants

**Largo plazo (6-12 meses)**:
- [ ] 90%+ de features migrados a PAL
- [ ] Design System extraído como librería NPM
- [ ] 0 inconsistencias visuales reportadas

---

## Documentación

### Documentos Creados

1. **[ADR-006](ADR-006-Design-System-PAL.md)**: Versión detallada (referencia)
2. **[Immutable Principles](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Immutable-Principles.md)**: 3 reglas no negociables
3. **[Best Practices](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Design-System-Best-Practices.md)**: 5 consejos estratégicos
4. **[Folder Structure](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Folder-Structure.md)**: Estructura aprobada
5. **[Coding Conventions](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Coding-Conventions.md)**: Estándares obligatorios
6. **[Component Template](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Component-Template.md)**: Template copy-paste
7. **[Implementation Guide](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Implementation-Guide.md)**: Guía paso a paso
8. **[Roadmap](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Roadmap.md)**: Plan estratégico

---

## Resultado

Esta ADR establece una base **sólida**, **extensible** y **gobernable** para la UI empresarial de Vitalia y futuros dominios (escuelas, finanzas, gobierno, etc.).

**Próximo paso**: Implementar [Roadmap - Paso 4](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Roadmap.md#-paso-4---congelar-el-contrato-del-gds-governance)

---

**Aprobado por**: Architecture Team  
**Fecha de aprobación**: 2026-01-23  
**Revisión**: Anual
