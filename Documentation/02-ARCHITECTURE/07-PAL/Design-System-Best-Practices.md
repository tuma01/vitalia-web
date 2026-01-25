# Design System Best Practices - Domain-Agnostic UI

**Document Type**: Living Document - Best Practices  
**Last Updated**: 2026-01-23  
**Related**: [ADR-006](ADR-006-Design-System-PAL.md)

---

## Objetivo

Establecer las **mejores prácticas** para mantener el Design System **agnóstico de dominio**, permitiendo su uso en múltiples aplicaciones (Vitalia, Escuelas, Finanzas, etc.) sin refactorización.

---

## 🎯 Principio Fundamental

> **El Design System NO debe conocer el dominio de negocio.**

- ❌ No debe saber que existe "Hospital", "Paciente", "Médico"
- ❌ No debe saber que existe "Escuela", "Estudiante", "Profesor"
- ✅ Solo debe saber de "Colores", "Espaciados", "Componentes"

---

## 1️⃣ Nomenclatura de Tokens: Domain-Agnostic

### ❌ Mal: Nombres Específicos de Dominio

```css
/* ❌ PROHIBIDO: Referencias a dominio */
:root {
  --ui-color-hospital-blue: #2196f3;
  --ui-color-clinic-green: #4caf50;
  --ui-space-patient-card-margin: 16px;
  --ui-radius-medical-form: 8px;
}
```

**Problema**: Cuando uses esto en una escuela, los nombres no tienen sentido.

---

### ✅ Bien: Nombres Semánticos y Abstractos

```css
/* ✅ CORRECTO: Nombres agnósticos */
:root {
  /* === BRAND COLORS (Identidad) === */
  --ui-color-brand-primary: #2196f3;
  --ui-color-brand-secondary: #4caf50;
  --ui-color-brand-accent: #ff5722;
  
  /* === SEMANTIC COLORS (Intención) === */
  --ui-color-success: #4caf50;
  --ui-color-warning: #ff9800;
  --ui-color-error: #f44336;
  --ui-color-info: #2196f3;
  
  /* === LAYOUT SPACING (Estructura) === */
  --ui-space-layout-gap: 16px;
  --ui-space-section-padding: 24px;
  --ui-space-card-margin: 12px;
  
  /* === COMPONENT RADIUS (Componentes) === */
  --ui-radius-form-field: 8px;
  --ui-radius-card: 12px;
  --ui-radius-button: 6px;
}
```

**Ventaja**: Estos nombres funcionan en **cualquier dominio**.

---

### 📋 Reglas de Nomenclatura

#### Estructura de Nombres

```
--ui-{category}-{subcategory}-{variant}
```

**Ejemplos**:
```css
--ui-color-brand-primary
--ui-space-layout-gap
--ui-radius-button-sm
--ui-elevation-card-hover
--ui-font-heading-lg
```

#### Categorías Permitidas

| Categoría | Subcategorías | Ejemplo |
|-----------|---------------|---------|
| `color` | `brand`, `semantic`, `neutral`, `text`, `bg`, `border` | `--ui-color-brand-primary` |
| `space` | `layout`, `component`, `inline` | `--ui-space-layout-gap` |
| `radius` | `button`, `card`, `input`, `dialog` | `--ui-radius-card` |
| `elevation` | `card`, `dialog`, `drawer`, `tooltip` | `--ui-elevation-dialog` |
| `font` | `heading`, `body`, `caption`, `code` | `--ui-font-heading-lg` |
| `transition` | `fast`, `normal`, `slow` | `--ui-transition-normal` |

#### ❌ Categorías Prohibidas

- ❌ `--ui-color-hospital-*`
- ❌ `--ui-space-patient-*`
- ❌ `--ui-radius-medical-*`
- ❌ Cualquier referencia a dominio de negocio

---

## 2️⃣ Estructura de Temas: Theme Injection

### Arquitectura de 2 Niveles

```
Design Tokens
├── Core Tokens (Invariantes)       # Rara vez cambian entre apps
│   ├── spacing.css
│   ├── radius.css
│   ├── elevation.css
│   └── transitions.css
│
└── Theme Tokens (Variables)        # Cambian por app/tenant
    ├── colors.css
    └── typography.css
```

---

### Core Tokens (Invariantes)

**`shared/design-system/tokens/core/spacing.css`**:

```css
/**
 * CORE TOKENS - SPACING
 * Estos NO cambian entre Vitalia, Escuelas, etc.
 */

:root {
  --ui-space-0: 0;
  --ui-space-1: 0.25rem;   /* 4px */
  --ui-space-2: 0.5rem;    /* 8px */
  --ui-space-3: 0.75rem;   /* 12px */
  --ui-space-4: 1rem;      /* 16px */
  --ui-space-6: 1.5rem;    /* 24px */
  --ui-space-8: 2rem;      /* 32px */
  --ui-space-12: 3rem;     /* 48px */
  --ui-space-16: 4rem;     /* 64px */
}
```

**`shared/design-system/tokens/core/radius.css`**:

```css
/**
 * CORE TOKENS - BORDER RADIUS
 * Estos NO cambian entre apps
 */

:root {
  --ui-radius-none: 0;
  --ui-radius-sm: 0.25rem;   /* 4px */
  --ui-radius-md: 0.5rem;    /* 8px */
  --ui-radius-lg: 0.75rem;   /* 12px */
  --ui-radius-xl: 1rem;      /* 16px */
  --ui-radius-full: 9999px;  /* Circular */
}
```

---

### Theme Tokens (Variables por App)

**`shared/design-system/themes/vitalia.theme.css`**:

```css
/**
 * VITALIA THEME
 * Identidad visual para aplicaciones de salud
 */

.theme-vitalia {
  /* === BRAND COLORS === */
  --ui-color-brand-primary: #2F80ED;    /* Azul médico */
  --ui-color-brand-secondary: #27AE60;  /* Verde salud */
  --ui-color-brand-accent: #EB5757;     /* Rojo alertas */
  
  /* === TYPOGRAPHY === */
  --ui-font-family-primary: 'Inter', sans-serif;
  --ui-font-family-heading: 'Poppins', sans-serif;
  
  /* === BACKGROUNDS === */
  --ui-bg-app: #f8f9fa;
  --ui-bg-card: #ffffff;
  --ui-bg-sidebar: #1e293b;
}
```

**`shared/design-system/themes/school.theme.css`**:

```css
/**
 * SCHOOL THEME
 * Identidad visual para aplicaciones educativas
 */

.theme-school {
  /* === BRAND COLORS === */
  --ui-color-brand-primary: #E63946;    /* Rojo académico */
  --ui-color-brand-secondary: #F1C40F;  /* Amarillo conocimiento */
  --ui-color-brand-accent: #457B9D;     /* Azul institucional */
  
  /* === TYPOGRAPHY === */
  --ui-font-family-primary: 'Roboto', sans-serif;
  --ui-font-family-heading: 'Montserrat', sans-serif;
  
  /* === BACKGROUNDS === */
  --ui-bg-app: #fefefe;
  --ui-bg-card: #ffffff;
  --ui-bg-sidebar: #2c3e50;
}
```

---

### Theme Injection con UiConfigService

**`shared/presentation/config/ui-config.service.ts`**:

```typescript
import { Injectable, signal, effect } from '@angular/core';

export type UiTheme = 'vitalia' | 'school' | 'finance';

@Injectable({ providedIn: 'root' })
export class UiConfigService {
  private theme = signal<UiTheme>('vitalia');
  
  readonly currentTheme = this.theme.asReadonly();
  
  constructor() {
    // Inyectar tema en el DOM
    effect(() => {
      const themeName = this.theme();
      document.body.className = `theme-${themeName}`;
    });
  }
  
  setTheme(theme: UiTheme): void {
    this.theme.set(theme);
  }
  
  // White-labeling por tenant
  setTenantTheme(tenantId: string): void {
    // Lógica para mapear tenant → theme
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

**Uso**:

```typescript
// En AppComponent o TenantResolver
constructor(private uiConfig: UiConfigService) {
  // Cambiar tema según tenant
  this.uiConfig.setTenantTheme('school-abc');
  // → Aplica .theme-school al body
  // → Todos los componentes usan colores de escuela
}
```

---

## 3️⃣ Evitar "Leakage" de Material

### Problema: Material "Asoma" en Features

```typescript
// ❌ MAL: Material filtrándose a features
@Component({
  selector: 'app-patient-form',
  template: `
    <mat-form-field appearance="outline">  <!-- ← Material directo -->
      <mat-label>Nombre</mat-label>
      <input matInput />
    </mat-form-field>
  `,
  styles: [`
    ::ng-deep .mat-form-field-outline {  /* ← Estilos de Material */
      border-radius: 8px;
    }
  `]
})
export class PatientFormComponent {}
```

**Consecuencias**:
- Features conocen Material
- Estilos duplicados
- Difícil cambiar biblioteca UI

---

### Solución: Encapsular Material en PAL

**`shared/presentation/components/form-field/ui-form-field.component.ts`**:

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/**
 * ui-form-field - Encapsula mat-form-field
 * 
 * Features NO deben usar mat-form-field directamente.
 */
@Component({
  selector: 'ui-form-field',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field 
      appearance="outline"
      [class.ui-form-field--error]="hasError">
      <mat-label>{{ label }}</mat-label>
      <ng-content></ng-content>
      @if (hint) {
        <mat-hint>{{ hint }}</mat-hint>
      }
      @if (hasError && errorMessage) {
        <mat-error>{{ errorMessage }}</mat-error>
      }
    </mat-form-field>
  `,
  styleUrls: ['./ui-form-field.component.scss']
})
export class UiFormFieldComponent {
  @Input() label!: string;
  @Input() hint?: string;
  @Input() hasError = false;
  @Input() errorMessage?: string;
}
```

**`ui-form-field.component.scss`**:

```scss
@import '../../../design-system/tokens/index.css';

/* Todos los estilos de Material están aquí, NO en features */

::ng-deep .mat-form-field-outline {
  border-radius: var(--ui-radius-form-field);
  border-color: var(--ui-border-light);
}

::ng-deep .mat-form-field-label {
  color: var(--ui-text-secondary);
  font-family: var(--ui-font-family-primary);
}

.ui-form-field--error {
  ::ng-deep .mat-form-field-outline {
    border-color: var(--ui-color-error);
  }
}
```

**Uso en Features**:

```typescript
// ✅ BIEN: Feature solo ve ui-form-field
@Component({
  selector: 'app-patient-form',
  template: `
    <ui-form-field 
      label="Nombre"
      [hasError]="nameControl.invalid"
      errorMessage="El nombre es requerido">
      <input type="text" [formControl]="nameControl" />
    </ui-form-field>
  `
  // ❌ No CSS aquí
})
export class PatientFormComponent {}
```

---

## 4️⃣ Pilot Component: `ui-form-field`

### Por Qué Empezar con Form Field

1. **Más Usado**: Presente en 90% de las features
2. **Más Complejo**: Integra input, select, errors, hints, icons
3. **Más Problemático**: Material tiene muchos estilos específicos
4. **Mayor Impacto**: Si esto funciona, el resto es más fácil

### Checklist del Pilot

- [ ] Encapsula `mat-form-field` completamente
- [ ] Soporta `input`, `select`, `textarea`
- [ ] Maneja errores de validación
- [ ] Soporta hints y prefijos/sufijos
- [ ] Usa solo tokens (no valores hardcodeados)
- [ ] Funciona en Vitalia y School sin cambios
- [ ] Documentado en Storybook

### Orden de Implementación

1. **Semana 1**: `ui-form-field` (pilot)
2. **Semana 2**: `ui-button`, `ui-card`
3. **Semana 3**: `ui-table`, `ui-dialog`
4. **Semana 4**: Migrar 1 feature completo como POC

---

## 5️⃣ Preparación para Extracción a NPM

### Objetivo Futuro

```bash
# Futuro: Librería independiente
npm install @vitalia/ui-kit
```

### Reglas para Mantener Extraíble

#### ✅ Permitido en `shared/presentation/`

```typescript
// ✅ Dependencias de UI puras
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
```

#### ❌ Prohibido en `shared/presentation/`

```typescript
// ❌ NO: Servicios de dominio
import { TenantsFacade } from '@app/domain/tenants';
import { PatientService } from '@app/features/patients';

// ❌ NO: Modelos de negocio
import { Patient } from '@app/domain/patients/models';
import { Hospital } from '@app/domain/hospitals/models';

// ❌ NO: Configuración específica de Vitalia
import { VITALIA_CONFIG } from '@app/core/config';
```

### Estructura Limpia

```
shared/presentation/
├── primitives/
│   └── button/
│       ├── ui-button.component.ts
│       ├── ui-button.types.ts       # ✅ Solo tipos UI
│       └── ui-button.component.scss
│
├── config/
│   ├── ui-config.service.ts         # ✅ Configuración genérica
│   └── ui-config.types.ts
│
└── index.ts                         # Barrel export limpio
```

**Regla de Oro**:
> Si `shared/presentation/` importa algo de `domain/` o `features/`, está mal.

---

## 📋 Checklist de Calidad

### Para Cada Componente PAL

- [ ] **Nomenclatura**: Usa `ui-` prefix
- [ ] **Tokens**: No valores hardcodeados
- [ ] **Contratos**: Variantes semánticas documentadas
- [ ] **Encapsulación**: Material no visible fuera de PAL
- [ ] **Domain-Agnostic**: No referencias a negocio
- [ ] **Extraíble**: No dependencias de `domain/` o `features/`
- [ ] **Testeado**: Unit tests + Storybook
- [ ] **Documentado**: JSDoc + README

---

## 🎯 Métricas de Éxito

### Corto Plazo (1 mes)
- ✅ `ui-form-field` funciona en Vitalia
- ✅ 0 usos de `mat-form-field` en features nuevos
- ✅ Tokens 100% domain-agnostic

### Mediano Plazo (3 meses)
- ✅ `ui-form-field` funciona en School (sin cambios)
- ✅ 5+ componentes PAL creados
- ✅ 50% de features migrados

### Largo Plazo (6 meses)
- ✅ `shared/presentation/` extraíble a NPM
- ✅ Usado en 2+ aplicaciones diferentes
- ✅ 0 dependencias de dominio en PAL

---

## 📚 Referencias

- [ADR-006: Design System + PAL](ADR-006-Design-System-PAL.md)
- [Design Tokens W3C Spec](https://www.w3.org/community/design-tokens/)
- [Atlassian Design System](https://atlassian.design/)
- [Shopify Polaris](https://polaris.shopify.com/)

---

**Última actualización**: 2026-01-23  
**Mantenido por**: Architecture Team  
**Estado**: ✅ Active - Living Document

