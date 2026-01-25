# Folder Structure Guide - UI System

**Document Type**: Living Document - Structure Guide  
**Status**: ✅ Approved by Architecture Review  
**Last Updated**: 2026-01-23  
**Related**: [ADR-006](../../04-ADR/ADR-006-Design-System-PAL.md), [Immutable Principles](Immutable-Principles.md)

---

## Objetivo

Definir la **estructura física de carpetas** del UI System, garantizando:

- ✅ Separación clara de responsabilidades
- ✅ Escalabilidad multi-dominio
- ✅ Extraíble a librería NPM
- ✅ Prevención de acoplamiento

---

## 📁 Estructura Completa

```
src/
├── styles/
│   └── ds/                              # Design System (Tokens & Themes)
│       ├── tokens/
│       │   ├── _base.scss               # Spacing, Radius, Elevation, Breakpoints
│       │   └── _semantic.scss           # Contratos semánticos (Brand, Text, BG)
│       ├── themes/
│       │   ├── _vitalia.scss            # Valores para Vitalia (Salud)
│       │   ├── _school.scss             # Valores para Escuelas
│       │   └── _finance.scss            # Valores para Finanzas (futuro)
│       └── _index.scss                  # Punto de entrada
│
└── app/
    ├── shared/
    │   └── ui/                          # PAL (Presentation Abstraction Layer)
    │       ├── config/
    │       │   ├── ui-config.types.ts
    │       │   └── ui-config.service.ts
    │       ├── primitives/              # Componentes atómicos
    │       │   ├── button/
    │       │   │   ├── ui-button.component.ts
    │       │   │   ├── ui-button.component.html
    │       │   │   ├── ui-button.component.scss
    │       │   │   └── ui-button.types.ts
    │       │   ├── input/
    │       │   ├── select/
    │       │   ├── checkbox/
    │       │   ├── radio/
    │       │   └── toggle/
    │       ├── components/              # Componentes moleculares
    │       │   ├── card/
    │       │   ├── form-field/
    │       │   ├── dialog/
    │       │   ├── drawer/
    │       │   ├── table/
    │       │   └── tabs/
    │       ├── directives/
    │       │   ├── ui-loading.directive.ts
    │       │   ├── ui-tooltip.directive.ts
    │       │   └── ui-ripple.directive.ts
    │       ├── pipes/
    │       │   ├── ui-date.pipe.ts
    │       │   ├── ui-currency.pipe.ts
    │       │   └── ui-truncate.pipe.ts
    │       └── index.ts                 # Public API (Barrel Export)
    │
    └── core/
        └── services/
            ├── auth.service.ts          # Servicios de negocio
            └── logger.service.ts
```

---

## 🎨 Capa 1: Design System (`src/styles/ds/`)

### Responsabilidad

Contiene **solo SCSS**, sin Angular. Define tokens y temas.

### Estructura Detallada

```
src/styles/ds/
├── tokens/
│   ├── _base.scss        # Tokens universales (físicos/estructurales)
│   └── _semantic.scss    # Contratos semánticos (abstractos)
├── themes/
│   ├── _vitalia.scss     # Valores para Vitalia
│   └── _school.scss      # Valores para Escuelas
└── _index.scss           # Punto de entrada
```

---

### `tokens/_base.scss`

**Contenido**: Tokens universales que **NO cambian** entre dominios.

```scss
/**
 * BASE TOKENS (Universales)
 * 
 * Estos tokens son invariantes entre dominios.
 * Definen estructura física, no identidad visual.
 */

// === SPACING (Sistema de 8px) ===
$ui-space-0: 0;
$ui-space-1: 0.25rem;   // 4px
$ui-space-2: 0.5rem;    // 8px
$ui-space-3: 0.75rem;   // 12px
$ui-space-4: 1rem;      // 16px
$ui-space-6: 1.5rem;    // 24px
$ui-space-8: 2rem;      // 32px
$ui-space-12: 3rem;     // 48px
$ui-space-16: 4rem;     // 64px

// === BORDER RADIUS ===
$ui-radius-none: 0;
$ui-radius-sm: 0.25rem;   // 4px
$ui-radius-md: 0.5rem;    // 8px
$ui-radius-lg: 0.75rem;   // 12px
$ui-radius-xl: 1rem;      // 16px
$ui-radius-full: 9999px;  // Circular

// === ELEVATION (Sombras) ===
$ui-elevation-0: none;
$ui-elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
$ui-elevation-2: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
$ui-elevation-3: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
$ui-elevation-4: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

// === BREAKPOINTS ===
$ui-breakpoint-xs: 0;
$ui-breakpoint-sm: 600px;
$ui-breakpoint-md: 960px;
$ui-breakpoint-lg: 1280px;
$ui-breakpoint-xl: 1920px;

// === TRANSITIONS ===
$ui-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
$ui-transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
$ui-transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

### `tokens/_semantic.scss`

**Contenido**: Contratos semánticos (sin valores). Los themes los rellenan.

```scss
/**
 * SEMANTIC TOKENS (Contratos)
 * 
 * Estos tokens definen el CONTRATO, no los valores.
 * Los valores vienen de themes/ según el dominio activo.
 */

// === BRAND COLORS (Identidad) ===
$ui-color-brand-primary: null !default;
$ui-color-brand-secondary: null !default;
$ui-color-brand-accent: null !default;

// === SEMANTIC COLORS (Intención) ===
$ui-color-success: null !default;
$ui-color-warning: null !default;
$ui-color-error: null !default;
$ui-color-info: null !default;

// === TEXT COLORS ===
$ui-text-primary: null !default;
$ui-text-secondary: null !default;
$ui-text-disabled: null !default;

// === BACKGROUND COLORS ===
$ui-bg-app: null !default;
$ui-bg-card: null !default;
$ui-bg-sidebar: null !default;

// === TYPOGRAPHY ===
$ui-font-family-primary: null !default;
$ui-font-family-heading: null !default;
$ui-font-family-mono: null !default;

// === FONT SIZES ===
$ui-text-xs: 0.75rem;    // 12px
$ui-text-sm: 0.875rem;   // 14px
$ui-text-base: 1rem;     // 16px
$ui-text-lg: 1.125rem;   // 18px
$ui-text-xl: 1.25rem;    // 20px
$ui-text-2xl: 1.5rem;    // 24px
```

---

### `themes/_vitalia.scss`

**Contenido**: Valores específicos para Vitalia (Salud).

```scss
/**
 * VITALIA THEME
 * Identidad visual para aplicaciones de salud
 */

// === BRAND COLORS ===
$ui-color-brand-primary: #2F80ED;    // Azul médico
$ui-color-brand-secondary: #27AE60;  // Verde salud
$ui-color-brand-accent: #EB5757;     // Rojo alertas

// === SEMANTIC COLORS ===
$ui-color-success: #27AE60;
$ui-color-warning: #F2994A;
$ui-color-error: #EB5757;
$ui-color-info: #2F80ED;

// === TEXT COLORS ===
$ui-text-primary: rgba(0, 0, 0, 0.87);
$ui-text-secondary: rgba(0, 0, 0, 0.6);
$ui-text-disabled: rgba(0, 0, 0, 0.38);

// === BACKGROUNDS ===
$ui-bg-app: #f8f9fa;
$ui-bg-card: #ffffff;
$ui-bg-sidebar: #1e293b;

// === TYPOGRAPHY ===
$ui-font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$ui-font-family-heading: 'Poppins', sans-serif;
$ui-font-family-mono: 'Fira Code', 'Courier New', monospace;
```

---

### `themes/_school.scss`

**Contenido**: Valores específicos para Escuelas.

```scss
/**
 * SCHOOL THEME
 * Identidad visual para aplicaciones educativas
 */

// === BRAND COLORS ===
$ui-color-brand-primary: #E63946;    // Rojo académico
$ui-color-brand-secondary: #F1C40F;  // Amarillo conocimiento
$ui-color-brand-accent: #457B9D;     // Azul institucional

// === SEMANTIC COLORS ===
$ui-color-success: #27AE60;
$ui-color-warning: #F39C12;
$ui-color-error: #E74C3C;
$ui-color-info: #3498DB;

// === TEXT COLORS ===
$ui-text-primary: rgba(0, 0, 0, 0.87);
$ui-text-secondary: rgba(0, 0, 0, 0.6);
$ui-text-disabled: rgba(0, 0, 0, 0.38);

// === BACKGROUNDS ===
$ui-bg-app: #fefefe;
$ui-bg-card: #ffffff;
$ui-bg-sidebar: #2c3e50;

// === TYPOGRAPHY ===
$ui-font-family-primary: 'Roboto', sans-serif;
$ui-font-family-heading: 'Montserrat', sans-serif;
$ui-font-family-mono: 'Source Code Pro', monospace;
```

---

### `_index.scss`

**Contenido**: Punto de entrada que importa todo.

```scss
/**
 * DESIGN SYSTEM - ENTRY POINT
 * 
 * Importar este archivo carga todo el sistema de diseño.
 */

// 1. Base Tokens (siempre primero)
@forward 'tokens/base';

// 2. Semantic Tokens (contratos)
@forward 'tokens/semantic';

// 3. Theme Activo (según configuración)
// Por defecto: Vitalia
@forward 'themes/vitalia';

// Para cambiar tema, comentar/descomentar:
// @forward 'themes/school';
// @forward 'themes/finance';
```

---

## 🧩 Capa 2: Presentation Abstraction Layer (`shared/ui/`)

### Responsabilidad

Contiene **componentes UI**, directives, pipes y configuración. Sin lógica de negocio.

### Estructura Detallada

```
src/app/shared/ui/
├── config/                  # Configuración del UI System
├── primitives/              # Componentes atómicos
├── components/              # Componentes moleculares
├── directives/              # Directives de UI
├── pipes/                   # Pipes de UI
└── index.ts                 # Public API
```

---

### `config/`

**Contenido**: Configuración y servicios del UI System.

```
config/
├── ui-config.types.ts
└── ui-config.service.ts
```

**`ui-config.types.ts`**:

```typescript
export type UiTheme = 'vitalia' | 'school' | 'finance';
export type UiDensity = 'compact' | 'comfortable' | 'spacious';

export interface UiConfig {
  theme: UiTheme;
  density: UiDensity;
  enableAnimations: boolean;
  enableRipple: boolean;
}

export const DEFAULT_UI_CONFIG: UiConfig = {
  theme: 'vitalia',
  density: 'comfortable',
  enableAnimations: true,
  enableRipple: true
};
```

**`ui-config.service.ts`**:

```typescript
import { Injectable, signal, effect } from '@angular/core';
import { UiConfig, DEFAULT_UI_CONFIG, UiTheme, UiDensity } from './ui-config.types';

@Injectable({ providedIn: 'root' })
export class UiConfigService {
  private config = signal<UiConfig>(DEFAULT_UI_CONFIG);
  
  readonly currentConfig = this.config.asReadonly();
  readonly currentTheme = () => this.config().theme;
  readonly currentDensity = () => this.config().density;
  
  constructor() {
    effect(() => {
      const cfg = this.config();
      document.body.className = `theme-${cfg.theme} density-${cfg.density}`;
    });
  }
  
  setTheme(theme: UiTheme): void {
    this.config.update(cfg => ({ ...cfg, theme }));
  }
  
  setDensity(density: UiDensity): void {
    this.config.update(cfg => ({ ...cfg, density }));
  }
  
  setTenantTheme(tenantId: string): void {
    const themeMap: Record<string, UiTheme> = {
      'hospital-xyz': 'vitalia',
      'school-abc': 'school'
    };
    const theme = themeMap[tenantId] || 'vitalia';
    this.setTheme(theme);
  }
}
```

---

### `primitives/`

**Contenido**: Componentes atómicos (no divisibles).

```
primitives/
├── button/
│   ├── ui-button.component.ts
│   ├── ui-button.component.html
│   ├── ui-button.component.scss
│   └── ui-button.types.ts
├── input/
├── select/
├── checkbox/
├── radio/
└── toggle/
```

**Ejemplo**: `button/ui-button.types.ts`

```typescript
export type UiButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
export type UiButtonSize = 'sm' | 'md' | 'lg';

export interface UiButtonConfig {
  variant?: UiButtonVariant;
  size?: UiButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}
```

---

### `components/`

**Contenido**: Componentes moleculares (compuestos de primitivos).

```
components/
├── card/
├── form-field/
├── dialog/
├── drawer/
├── table/
└── tabs/
```

---

### `directives/`

**Contenido**: Directives de UI (sin lógica de negocio).

```
directives/
├── ui-loading.directive.ts
├── ui-tooltip.directive.ts
└── ui-ripple.directive.ts
```

---

### `pipes/`

**Contenido**: Pipes de UI (formateo visual).

```
pipes/
├── ui-date.pipe.ts
├── ui-currency.pipe.ts
└── ui-truncate.pipe.ts
```

---

### `index.ts` (Public API)

**Contenido**: Barrel export de todo el UI System.

```typescript
/**
 * UI SYSTEM - PUBLIC API
 * 
 * Este es el ÚNICO punto de entrada para usar el UI System.
 * Si no está exportado aquí, no debe usarse.
 */

// Config
export * from './config/ui-config.types';
export * from './config/ui-config.service';

// Primitives
export * from './primitives/button/ui-button.component';
export * from './primitives/button/ui-button.types';
export * from './primitives/input/ui-input.component';
export * from './primitives/select/ui-select.component';

// Components
export * from './components/card/ui-card.component';
export * from './components/form-field/ui-form-field.component';
export * from './components/dialog/ui-dialog.component';
export * from './components/table/ui-table.component';

// Directives
export * from './directives/ui-loading.directive';
export * from './directives/ui-tooltip.directive';

// Pipes
export * from './pipes/ui-date.pipe';
export * from './pipes/ui-currency.pipe';
```

---

## 🔒 Reglas de Oro (Non-Negotiable)

### 🔒 Regla 1: `shared/ui/` NO Depende de Dominio

```typescript
// ❌ PROHIBIDO en shared/ui/
import { TenantsFacade } from '@app/domain/tenants';
import { Patient } from '@app/domain/patients/models';
import { HospitalService } from '@app/features/hospitals';

// ✅ PERMITIDO en shared/ui/
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
```

**Enforcement**: ESLint rule `@vitalia/no-domain-in-ui`

---

### 🔒 Regla 2: Tokens NO se Usan Directamente en Features

```scss
// ❌ PROHIBIDO en features/
.patient-card {
  padding: $ui-space-4;        // ← Prohibido
  border-radius: $ui-radius-md;
  color: $ui-color-brand-primary;
}

// ✅ PERMITIDO en features/
.patient-card {
  display: flex;
  gap: var(--ui-space-4);  // ← Solo para layout
}

// ✅ MEJOR: Usar componentes UI
<ui-card>
  <ui-button variant="primary">Guardar</ui-button>
</ui-card>
```

**Enforcement**: Code review checklist

---

### 🔒 Regla 3: Themes NO Contienen Lógica

```scss
// ❌ PROHIBIDO en themes/
@import '../components/button';  // ← No importar componentes

@mixin complex-logic() { ... }   // ← No mixins complejos

// ✅ PERMITIDO en themes/
$ui-color-brand-primary: #2F80ED;  // ← Solo asignación de valores
$ui-font-family-primary: 'Inter';
```

**Enforcement**: Code review checklist

---

## 🛠️ Path Aliases

**`tsconfig.json`**:

```json
{
  "compilerOptions": {
    "paths": {
      "@ui": ["src/app/shared/ui"],
      "@ui/*": ["src/app/shared/ui/*"],
      "@ui/primitives/*": ["src/app/shared/ui/primitives/*"],
      "@ui/components/*": ["src/app/shared/ui/components/*"],
      "@ui/config": ["src/app/shared/ui/config"],
      "@styles/ds": ["src/styles/ds"]
    }
  }
}
```

**Uso**:

```typescript
// ✅ Imports limpios
import { UiButtonComponent } from '@ui/primitives/button';
import { UiCardComponent } from '@ui/components/card';
import { UiConfigService } from '@ui/config';
```

---

## 📋 Reglas de Ubicación

### ¿Dónde va cada cosa?

| Tipo | Ubicación | Ejemplo |
|------|-----------|---------|
| **Token universal** | `styles/ds/tokens/_base.scss` | `$ui-space-4`, `$ui-radius-md` |
| **Token semántico** | `styles/ds/tokens/_semantic.scss` | `$ui-color-brand-primary` |
| **Valor de theme** | `styles/ds/themes/_vitalia.scss` | `$ui-color-brand-primary: #2F80ED` |
| **Componente atómico** | `shared/ui/primitives/` | `ui-button`, `ui-input` |
| **Componente molecular** | `shared/ui/components/` | `ui-card`, `ui-form-field` |
| **Directive UI** | `shared/ui/directives/` | `uiLoading`, `uiTooltip` |
| **Pipe UI** | `shared/ui/pipes/` | `uiDate`, `uiCurrency` |
| **Config UI** | `shared/ui/config/` | `UiConfigService` |

---

## ✅ Checklist de Calidad

### Para Cada Archivo Nuevo

- [ ] ¿Está en la carpeta correcta según la tabla de arriba?
- [ ] ¿Usa solo tokens (no valores hardcodeados)?
- [ ] ¿No importa nada de `domain/` o `features/`?
- [ ] ¿Está exportado en `index.ts` si es público?
- [ ] ¿Tiene types separados si es componente?

---

## 📚 Referencias

- [ADR-006: Design System + PAL](../../04-ADR/ADR-006-Design-System-PAL.md)
- [Immutable Principles](Immutable-Principles.md)
- [Best Practices](Design-System-Best-Practices.md)

---

**Última actualización**: 2026-01-23  
**Mantenido por**: Architecture Team  
**Estado**: ✅ Approved - Ready for Implementation
