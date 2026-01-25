# GDS & PAL - Implementation Guide (Step by Step)

**Document Type**: Implementation Guide - Practical Walkthrough  
**Status**: ✅ Official - Follow Strictly  
**Version**: 1.0  
**Last Updated**: 2026-01-23  
**Related**: [ADR-006](ADR-006-Design-System-PAL.md), [Component Template](Component-Template.md)

---

## Objetivo

Guía **paso a paso** para implementar el **Global Design System (GDS)** y la **Presentation Abstraction Layer (PAL)** con funcionalidades avanzadas que superan Material Design.

> **CRITICAL**: Este documento es la **única fuente de verdad** para implementar componentes UI.

---

## 📋 Entregables Clave

Este documento cubre **3 entregables** fundamentales:

1. ✅ **Template Oficial** `ui-component` (fundación)
2. ✅ **`ui-form-field`** completo (prueba de fuego)
3. ✅ **Checklist de Validación** (gobernanza)

---

## 1️⃣ TEMPLATE OFICIAL `ui-component` (Fundación del Sistema)

### 🎯 Objetivo

Garantizar que **todos** los componentes `ui-*`:

- ✅ Siguen las mismas reglas
- ✅ Exponen solo API semántica
- ✅ Son predecibles y mantenibles

> **Este template NO es opcional. Es la "placa madre" del GDS.**

---

### 📁 Estructura Canónica

```
src/app/shared/ui/primitives/__name__/
├── ui-__name__.component.ts
├── ui-__name__.component.html
├── ui-__name__.component.scss
├── ui-__name__.types.ts
└── README.md
```

---

### 🧠 Reglas que Impone el Template

| Regla | Motivo |
|-------|--------|
| `standalone: true` | Aislamiento total, tree-shaking |
| `OnPush` | Performance + predictibilidad |
| `.types.ts` obligatorio | API pública explícita |
| Tokens only | Branding centralizado (3 niveles) |
| Sin lógica de dominio | UI pura, reutilizable |
| i18n compatible | Accesibilidad y multi-idioma nativo |
| Responsive-First | Adaptación fluida a móvil y desktop |

---

### 🧩 `ui-__name__.component.ts`

```typescript
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ui__Name__Variant, Ui__Name__Size } from './ui-__name__.types';

/**
 * ui-__name__ - [Descripción del componente]
 * 
 * CONTRATOS:
 * 
 * Variantes (variant):
 *   - primary: [Descripción]
 *   - secondary: [Descripción]
 *   - danger: [Descripción]
 * 
 * Tamaños (size):
 *   - sm: [Descripción]
 *   - md: [Descripción] (default)
 *   - lg: [Descripción]
 * 
 * @example
 * <ui-__name__ variant="primary" size="md">
 *   [Contenido]
 * </ui-__name__>
 */
@Component({
  selector: 'ui-__name__',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-__name__.component.html',
  styleUrls: ['./ui-__name__.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-__name__]': 'true',
    '[class.ui-__name__--primary]': 'variant === "primary"',
    '[class.ui-__name__--secondary]': 'variant === "secondary"',
    '[class.ui-__name__--danger]': 'variant === "danger"',
    '[class.ui-__name__--sm]': 'size === "sm"',
    '[class.ui-__name__--md]': 'size === "md"',
    '[class.ui-__name__--lg]': 'size === "lg"'
  }
})
export class Ui__Name__Component {
  @Input() variant: Ui__Name__Variant = 'primary';
  @Input() size: Ui__Name__Size = 'md';
  @Input() i18n?: import('../../config/ui-i18n.types').UiAriaLabels;
  
  @Output() clicked = new EventEmitter<MouseEvent>();
}
```

> **🔒 Regla de oro**: Ningún `@Input()` acepta `string` libre.

---

### 🧩 `ui-__name__.types.ts`

```typescript
/**
 * Variantes semánticas de ui-__name__
 */
export type Ui__Name__Variant =
  | 'primary'      // Acción principal
  | 'secondary'    // Acción secundaria
  | 'danger';      // Acción destructiva

/**
 * Tamaños de ui-__name__
 */
export type Ui__Name__Size =
  | 'sm'   // 32px altura
  | 'md'   // 40px altura (default)
  | 'lg';  // 48px altura

/**
 * Configuración de ui-__name__
 */
export interface Ui__Name__Config {
  variant?: Ui__Name__Variant;
  size?: Ui__Name__Size;
}
```

---

### 🎨 `ui-__name__.component.scss`

```scss
@import '../../../../styles/ds/index';

/* ============================================
   UI-__NAME__ (Tokens de 3 Niveles)
   ============================================ */
:root {
  /* Nivel 3: Component Tokens (Overrides locales) */
  --ui-__name__-bg: var(--ui-color-surface);
  --ui-__name__-radius: var(--ui-radius-md);
}

.ui-__name__ {
  display: block;
  padding: var(--ui-space-md);
  border-radius: var(--ui-__name__-radius);
  background: var(--ui-__name__-bg);
  transition: all var(--ui-motion-fast);
}

/* SIZE VARIANTS */
.ui-__name__--sm {
  padding: var(--ui-space-sm);
  font-size: var(--ui-text-sm);
}

.ui-__name__--md {
  padding: var(--ui-space-md);
  font-size: var(--ui-text-base);
}

.ui-__name__--lg {
  padding: var(--ui-space-lg);
  font-size: var(--ui-text-lg);
}

/* VARIANT: PRIMARY */
.ui-__name__--primary {
  background: var(--ui-color-brand-primary);
  color: white;
}

/* VARIANT: SECONDARY */
.ui-__name__--secondary {
  background: transparent;
  border: 1px solid var(--ui-border-medium);
  color: var(--ui-text-primary);
}

/* VARIANT: DANGER */
.ui-__name__--danger {
  background: var(--ui-color-error);
  color: white;
}
```

/* ============================================
   RESPONSIVE DESIGN (Mandatorio)
   ============================================ */
@media (max-width: 640px) {
  .ui-__name__ {
    padding: var(--ui-space-sm); // Ajuste fluido para móvil
  }
}

> **❌ Prohibido**: `padding: 16px;`, `color: #fff;`

---

### 📄 `README.md` (Obligatorio)

```markdown
# ui-__name__

## ¿Qué problema resuelve?

[Descripción del problema que resuelve este componente]

## ¿Qué NO hace?

- ❌ No maneja navegación
- ❌ No contiene lógica de negocio
- ❌ No conoce el dominio

## Ejemplos de Uso

### Básico

\`\`\`html
<ui-__name__ variant="primary" size="md">
  Contenido
</ui-__name__>
\`\`\`

### Avanzado

\`\`\`html
<ui-__name__ 
  variant="danger" 
  size="lg"
  (clicked)="onDelete()">
  Eliminar
</ui-__name__>
\`\`\`
```

---

## 2️⃣ `ui-form-field` - DISEÑO PROFESIONAL (Prueba de Fuego)

### 🎯 Rol del `ui-form-field`

`ui-form-field` **NO es solo un input**. Es el **orquestador visual del formulario**.

**Controla**:
- ✅ Label
- ✅ Hint
- ✅ Error
- ✅ Estado visual
- ✅ Densidad
- ✅ Consistencia total

---

### 📁 Estructura

```
ui-form-field/
├── ui-form-field.component.ts
├── ui-form-field.component.html
├── ui-form-field.component.scss
├── ui-form-field.types.ts
└── README.md
```

---

### 🧠 API SEMÁNTICA (No Técnica)

#### `ui-form-field.types.ts`

```typescript
/**
 * Apariencia del form field
 */
export type UiFormFieldAppearance = 
  | 'outline'   // Borde visible (default)
  | 'filled';   // Fondo relleno

/**
 * Tamaño del form field
 */
export type UiFormFieldSize = 
  | 'sm'   // Compacto
  | 'md'   // Normal (default)
  | 'lg';  // Grande

/**
 * Estado del form field
 */
export type UiFormFieldState = 
  | 'default'
  | 'focused'
  | 'error'
  | 'disabled';

/**
 * Configuración del form field
 */
export interface UiFormFieldConfig {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  appearance?: UiFormFieldAppearance;
  size?: UiFormFieldSize;
}
```

---

### 🧩 `ui-form-field.component.ts`

```typescript
import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldAppearance, UiFormFieldSize, UiFormFieldState } from './ui-form-field.types';

/**
 * ui-form-field - Orquestador visual de formularios
 * 
 * Funcionalidades avanzadas:
 * - Label flotante automático
 * - Hint contextual
 * - Error integrado
 * - Estados visuales claros
 * - Densidad configurable
 * - Accesibilidad (ARIA)
 * 
 * @example
 * <ui-form-field
 *   label="Email"
 *   hint="Correo institucional"
 *   [error]="emailError"
 *   required>
 *   <input type="email" formControlName="email" />
 * </ui-form-field>
 */
@Component({
  selector: 'ui-form-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-form-field.component.html',
  styleUrls: ['./ui-form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-form-field]': 'true',
    '[class.ui-form-field--outline]': 'appearance === "outline"',
    '[class.ui-form-field--filled]': 'appearance === "filled"',
    '[class.ui-form-field--sm]': 'size === "sm"',
    '[class.ui-form-field--md]': 'size === "md"',
    '[class.ui-form-field--lg]': 'size === "lg"',
    '[class.ui-form-field--error]': '!!error',
    '[class.ui-form-field--required]': 'required'
  }
})
export class UiFormFieldComponent {
  @Input() label?: string;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() required = false;
  @Input() appearance: UiFormFieldAppearance = 'outline';
  @Input() size: UiFormFieldSize = 'md';
  
  get hasError(): boolean {
    return !!this.error;
  }
  
  get showHint(): boolean {
    return !!this.hint && !this.hasError;
  }
}
```

---

### 🧩 `ui-form-field.component.html`

```html
<div class="ui-form-field-container">
  <!-- Label -->
  <label 
    *ngIf="label" 
    class="ui-form-field__label"
    [class.ui-form-field__label--required]="required">
    {{ label }}
    <span *ngIf="required" class="ui-form-field__required-marker">*</span>
  </label>

  <!-- Control (Input proyectado) -->
  <div class="ui-form-field__control">
    <ng-content></ng-content>
  </div>

  <!-- Hint -->
  <div 
    *ngIf="showHint" 
    class="ui-form-field__hint">
    {{ hint }}
  </div>

  <!-- Error -->
  <div 
    *ngIf="hasError" 
    class="ui-form-field__error"
    role="alert">
    {{ error }}
  </div>
</div>
```

> **📌 El input real (`<input>`, `<select>`, `<textarea>`) entra por proyección, no por acoplamiento.**

---

### 🎨 `ui-form-field.component.scss`

```scss
@import '../../../../styles/ds/index';

/* ============================================
   UI-FORM-FIELD
   ============================================ */

.ui-form-field {
  display: flex;
  flex-direction: column;
  gap: var(--ui-space-2);
  width: 100%;
}

.ui-form-field-container {
  display: flex;
  flex-direction: column;
  gap: var(--ui-space-1);
}

/* ============================================
   LABEL
   ============================================ */

.ui-form-field__label {
  font-size: var(--ui-text-sm);
  font-weight: var(--ui-font-medium);
  color: var(--ui-text-secondary);
  transition: color var(--ui-transition-fast);
  
  &--required {
    color: var(--ui-text-primary);
  }
}

.ui-form-field__required-marker {
  color: var(--ui-color-error);
  margin-left: var(--ui-space-1);
}

/* ============================================
   CONTROL
   ============================================ */

.ui-form-field__control {
  position: relative;
  
  // Estilos para el input proyectado
  ::ng-deep input,
  ::ng-deep select,
  ::ng-deep textarea {
    width: 100%;
    padding: var(--ui-space-3);
    font-size: var(--ui-text-base);
    font-family: var(--ui-font-family-primary);
    color: var(--ui-text-primary);
    background: var(--ui-bg-primary);
    border: 1px solid var(--ui-border-light);
    border-radius: var(--ui-radius-md);
    transition: all var(--ui-transition-fast);
    
    &:focus {
      outline: none;
      border-color: var(--ui-color-brand-primary);
      box-shadow: 0 0 0 3px rgba(var(--ui-color-brand-primary-rgb), 0.1);
    }
    
    &:disabled {
      background: var(--ui-bg-secondary);
      color: var(--ui-text-disabled);
      cursor: not-allowed;
    }
  }
}

/* ============================================
   APPEARANCE: OUTLINE
   ============================================ */

.ui-form-field--outline {
  .ui-form-field__control {
    ::ng-deep input,
    ::ng-deep select,
    ::ng-deep textarea {
      border: 2px solid var(--ui-border-medium);
    }
  }
}

/* ============================================
   APPEARANCE: FILLED
   ============================================ */

.ui-form-field--filled {
  .ui-form-field__control {
    ::ng-deep input,
    ::ng-deep select,
    ::ng-deep textarea {
      background: var(--ui-bg-secondary);
      border: none;
      border-bottom: 2px solid var(--ui-border-medium);
      border-radius: var(--ui-radius-md) var(--ui-radius-md) 0 0;
    }
  }
}

/* ============================================
   SIZE VARIANTS
   ============================================ */

.ui-form-field--sm {
  .ui-form-field__control {
    ::ng-deep input,
    ::ng-deep select,
    ::ng-deep textarea {
      padding: var(--ui-space-2);
      font-size: var(--ui-text-sm);
    }
  }
}

.ui-form-field--lg {
  .ui-form-field__control {
    ::ng-deep input,
    ::ng-deep select,
    ::ng-deep textarea {
      padding: var(--ui-space-4);
      font-size: var(--ui-text-lg);
    }
  }
}

/* ============================================
   STATE: ERROR
   ============================================ */

.ui-form-field--error {
  .ui-form-field__label {
    color: var(--ui-color-error);
  }
  
  .ui-form-field__control {
    ::ng-deep input,
    ::ng-deep select,
    ::ng-deep textarea {
      border-color: var(--ui-color-error);
      
      &:focus {
        box-shadow: 0 0 0 3px rgba(var(--ui-color-error-rgb), 0.1);
      }
    }
  }
}

/* ============================================
   HINT & ERROR
   ============================================ */

.ui-form-field__hint {
  font-size: var(--ui-text-xs);
  color: var(--ui-text-secondary);
}

.ui-form-field__error {
  font-size: var(--ui-text-xs);
  color: var(--ui-color-error);
  font-weight: var(--ui-font-medium);
}
```

---

### ✅ Ejemplo de Uso en Feature

```typescript
// patient-form.component.ts
@Component({
  selector: 'app-patient-form',
  template: `
    <form [formGroup]="form">
      <ui-form-field
        label="Email"
        hint="Correo institucional"
        [error]="getError('email')"
        required>
        <input type="email" formControlName="email" />
      </ui-form-field>

      <ui-form-field
        label="Nombre Completo"
        [error]="getError('name')"
        required>
        <input type="text" formControlName="name" />
      </ui-form-field>

      <ui-form-field
        label="Teléfono"
        hint="Formato: +1234567890"
        appearance="filled"
        size="lg">
        <input type="tel" formControlName="phone" />
      </ui-form-field>
    </form>
  `
})
export class PatientFormComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    phone: ['']
  });
  
  constructor(private fb: FormBuilder) {}
  
  getError(field: string): string | undefined {
    const control = this.form.get(field);
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) return 'Este campo es requerido';
      if (control.errors?.['email']) return 'Email inválido';
    }
    return undefined;
  }
}
```

> **👉 La Feature no toca estilos. Nunca.**

---

## 3️⃣ CHECKLIST DE VALIDACIÓN ARQUITECTÓNICA (Gobernanza)

Este checklist se usa en:
- ✅ PR reviews
- ✅ Auditorías técnicas
- ✅ Onboarding

---

### ✅ Checklist - UI Component (PAL)

#### Arquitectura
- [ ] ✅ Está en `shared/ui/primitives/` o `shared/ui/components/`
- [ ] ✅ Es `standalone: true`
- [ ] ✅ Usa `ChangeDetectionStrategy.OnPush`
- [ ] ✅ Tiene archivo `.types.ts`
- [ ] ✅ Exportado en `shared/ui/index.ts`

#### API
- [ ] ✅ Inputs semánticos (`variant`, `size`, etc.)
- [ ] ✅ No acepta `string` libre en inputs
- [ ] ✅ Outputs tipados (no `any`)
- [ ] ✅ No expone detalles de Material
- [ ] ✅ JSDoc completo con contratos

#### Estilos
- [ ] ✅ Solo tokens CSS (no `px`, `#hex`, `rem` directos)
- [ ] ✅ No clases utilitarias externas (Tailwind, Bootstrap)
- [ ] ✅ Encapsulación correcta (`ViewEncapsulation.Emulated`)

#### Pureza
- [ ] ✅ No importa `Router` o `ActivatedRoute`
- [ ] ✅ No importa servicios de dominio (`TenantsFacade`, etc.)
- [ ] ✅ No conoce modelos de negocio (`Patient`, `Hospital`)

---

### ✅ Checklist - Feature / Widget

- [ ] ✅ Usa solo `<ui-*>` (no `<mat-*>`)
- [ ] ✅ No importa `MatButtonModule` ni otros de Material
- [ ] ✅ No define estilos visuales (colores, tamaños)
- [ ] ✅ No pasa `class` a componentes `ui-*`
- [ ] ✅ No usa `::ng-deep` sobre `ui-*`
- [ ] ✅ Importa desde `@ui` (no paths internos)

---

### 🚨 Red Flags (Rechazo Automático)

Si ves esto en un PR → **NO MERGE**:

```html
<!-- ❌ Material directo en feature -->
<button mat-raised-button color="primary">Guardar</button>

<!-- ❌ Estilos hardcodeados -->
<ui-button style="margin: 12px;">Guardar</ui-button>

<!-- ❌ Class en componente UI -->
<ui-card class="custom-card">...</ui-card>
```

```typescript
// ❌ Input string libre
@Input() variant: string;

// ❌ Import de Material en feature
import { MatButtonModule } from '@angular/material/button';

// ❌ Import de dominio en UI
import { TenantsFacade } from '@app/domain/tenants';
```

```scss
// ❌ Valores hardcodeados
.my-component {
  padding: 16px;
  color: #2196f3;
}

// ❌ ::ng-deep sobre ui-*
::ng-deep .ui-button {
  background: red;
}
```

---

## 🏁 CONCLUSIÓN FINAL (Arquitectura Senior)

Este enfoque garantiza:

- ✅ **Consistencia visual total**
- ✅ **White-label real** (multi-tenant)
- ✅ **Multi-dominio** sin refactor
- ✅ **Gobierno arquitectónico** fuerte
- ✅ **Escalabilidad** a 5–10 años

---

## 🚀 Próximos Pasos

### Opción 1: Implementar Más Componentes
- `ui-button`
- `ui-card`
- `ui-dialog`
- `ui-table`

### Opción 2: Crear Reglas ESLint
- `@vitalia/no-mat-in-features`
- `@vitalia/no-domain-in-ui`
- `@vitalia/no-class-on-ui-components`

### Opción 3: Extraer como Librería NPM
- Preparar `package.json`
- Configurar build
- Publicar en registry privado

---

## 📚 Referencias

- [ADR-006: Design System + PAL](ADR-006-Design-System-PAL.md)
- [Component Template](Component-Template.md)
- [Coding Conventions](Coding-Conventions.md)
- [Immutable Principles](Immutable-Principles.md)

---

**Última actualización**: 2026-01-23  
**Mantenido por**: Architecture Team  
**Estado**: ✅ Official - Ready for Implementation

