# Principios Arquitectónicos Inmutables - UI System

**Document Type**: Architectural Principles  
**Status**: ✅ Immutable - Non-Negotiable  
**Last Updated**: 2026-01-23  
**Related**: [ADR-006](../../04-ADR/ADR-006-Design-System-PAL.md), [Best Practices](Design-System-Best-Practices.md)

---

## Objetivo

Establecer los **3 principios no negociables** que definen la integridad del UI System y garantizan su escalabilidad multi-dominio.

> **CRITICAL**: Estas reglas son **inmutables**. Violarlas compromete la arquitectura completa.

---

## 🔒 Regla Inmutable 1: `ui-*` Nunca Conoce el Dominio

### Principio

> **El Design System es domain-agnostic.**

El sistema UI debe funcionar en **cualquier dominio** sin modificaciones:
- ✅ Salud (Vitalia)
- ✅ Educación (Escuelas)
- ✅ Finanzas (Bancos)
- ✅ Gobierno (Instituciones públicas)

---

### ❌ Prohibido

#### Nombres con Referencias a Dominio

```typescript
// ❌ PROHIBIDO: Referencias a dominio de negocio
interface UiPatientCardConfig { ... }
class UiHospitalFormComponent { ... }
class UiMedicalButtonComponent { ... }
const UI_CLINIC_COLORS = { ... };

// ❌ PROHIBIDO: Tokens con dominio
:root {
  --ui-color-hospital-blue: #2196f3;
  --ui-space-patient-card-margin: 16px;
  --ui-radius-medical-form: 8px;
  --ui-font-doctor-name: 'Roboto';
}

// ❌ PROHIBIDO: Variantes específicas de dominio
type UiButtonVariant = 'save-patient' | 'discharge' | 'prescribe';
```

#### Dependencias de Dominio

```typescript
// ❌ PROHIBIDO: Importar de domain/ o features/
import { Patient } from '@app/domain/patients/models';
import { TenantsFacade } from '@app/domain/tenants';
import { HospitalService } from '@app/features/hospitals';

// ❌ PROHIBIDO: Lógica de negocio en UI
@Component({
  selector: 'ui-patient-card',
  // ...
})
export class UiPatientCardComponent {
  calculateAge(patient: Patient): number { ... }  // ← Lógica de negocio
}
```

---

### ✅ Permitido

#### Nombres Abstractos y Semánticos

```typescript
// ✅ CORRECTO: Nombres abstractos
interface UiCardConfig { ... }
class UiFormFieldComponent { ... }
class UiButtonComponent { ... }
const UI_BRAND_COLORS = { ... };

// ✅ CORRECTO: Tokens agnósticos
:root {
  --ui-color-brand-primary: #2196f3;
  --ui-space-layout-gap: 16px;
  --ui-radius-form-field: 8px;
  --ui-font-family-primary: 'Roboto';
}

// ✅ CORRECTO: Variantes semánticas
type UiButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
```

#### Solo Dependencias de UI

```typescript
// ✅ CORRECTO: Solo dependencias de UI
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ✅ CORRECTO: Solo tipos UI genéricos
export interface UiCardConfig {
  title: string;
  subtitle?: string;
  elevation: 'flat' | 'elevated';
  // ❌ NO: patient: Patient;
}
```

---

### Enforcement

#### ESLint Custom Rule

```javascript
// .eslintrc.js
{
  rules: {
    '@vitalia/no-domain-in-ui': 'error'
  }
}
```

**Detecta**:
- Nombres de archivos con palabras de dominio (`patient`, `hospital`, `doctor`)
- Imports de `@app/domain/` o `@app/features/` en `shared/presentation/`
- Tokens CSS con nombres de dominio

#### Code Review Checklist

- [ ] ¿El componente tiene nombres de dominio? (patient, hospital, school, etc.)
- [ ] ¿Importa algo de `domain/` o `features/`?
- [ ] ¿Los tokens CSS son agnósticos?
- [ ] ¿Funcionaría en educación sin cambios?

#### Test de Dominio

**Pregunta**: ¿Este componente funcionaría en una app de escuelas sin cambios?

- ✅ **Sí** → Correcto, es domain-agnostic
- ❌ **No** → Incorrecto, tiene acoplamiento de dominio

---

## 🔒 Regla Inmutable 2: Features Nunca Estilizan UI

### Principio

> **Features solo componen, nunca estilizan.**

La responsabilidad de estilos está **100% en PAL**. Features solo usan componentes UI.

---

### ❌ Prohibido

#### CSS Custom sobre Componentes UI

```typescript
// ❌ PROHIBIDO: CSS en features sobre ui-*
@Component({
  selector: 'app-patient-form',
  template: `
    <ui-button class="custom-save-button">Guardar</ui-button>
  `,
  styles: [`
    .custom-save-button {
      border-radius: 12px;  /* ← PROHIBIDO */
      padding: 20px;        /* ← PROHIBIDO */
      background: red;      /* ← PROHIBIDO */
    }
  `]
})
export class PatientFormComponent {}
```

#### Overrides con ::ng-deep

```scss
// ❌ PROHIBIDO: Sobrescribir estilos de UI
::ng-deep ui-button {
  background: red !important;
  border-radius: 20px !important;
}

::ng-deep .ui-button-inner {
  padding: 30px;
}
```

#### Pasar class o style como Input

```html
<!-- ❌ PROHIBIDO: Pasar class o style -->
<ui-button class="my-custom-style">Guardar</ui-button>
<ui-button style="background: red; padding: 20px">Guardar</ui-button>
<ui-card class="special-card">...</ui-card>
```

---

### ✅ Permitido

#### Solo Composición Semántica

```typescript
// ✅ CORRECTO: Solo composición, sin estilos
@Component({
  selector: 'app-patient-form',
  template: `
    <ui-button 
      variant="primary" 
      size="lg"
      [loading]="isSaving"
      (clicked)="onSave()">
      Guardar
    </ui-button>
  `
  // ❌ No CSS aquí
})
export class PatientFormComponent {
  isSaving = false;
  
  onSave(): void {
    // Lógica de negocio
  }
}
```

#### Layout y Espaciado de Features

```scss
// ✅ CORRECTO: Layout de la feature (no estilos de UI)
.patient-form {
  display: flex;
  flex-direction: column;
  gap: var(--ui-space-4);  // ← Usa tokens
  padding: var(--ui-space-6);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--ui-space-2);
}
```

**Regla**: Puedes organizar **dónde** van los componentes UI, pero no **cómo** se ven.

---

### Proceso: "Si Algo Falta"

#### ❌ Incorrecto

```typescript
// ❌ Hackear estilos localmente
<ui-button class="extra-rounded">Guardar</ui-button>

.extra-rounded {
  border-radius: 20px !important;
}
```

#### ✅ Correcto

1. **Identificar necesidad**: "Necesito un botón más redondeado"
2. **Proponer en Architecture Review**: "¿Podemos agregar `size="xl"`?"
3. **Agregar al contrato PAL**:
   ```typescript
   type UiButtonSize = 'sm' | 'md' | 'lg' | 'xl';  // ← Nueva variante
   ```
4. **Implementar en PAL**:
   ```scss
   // shared/presentation/primitives/button/ui-button.component.scss
   .ui-button--xl .ui-button-inner {
     padding: var(--ui-space-6) var(--ui-space-8);
     border-radius: var(--ui-radius-xl);
     min-height: 56px;
   }
   ```
5. **Documentar en Storybook**
6. **Usar en feature**:
   ```html
   <ui-button variant="primary" size="xl">Guardar</ui-button>
   ```

---

### Enforcement

#### ESLint Custom Rule

```javascript
// .eslintrc.js
{
  rules: {
    '@vitalia/no-ui-styling-in-features': 'error'
  }
}
```

**Detecta**:
- CSS en features que selecciona `ui-*`
- Uso de `::ng-deep` sobre componentes UI
- `class` o `style` en templates sobre `ui-*`

#### Code Review Checklist

- [ ] ¿Hay CSS en la feature que estiliza `ui-*`?
- [ ] ¿Se usa `::ng-deep` para sobrescribir UI?
- [ ] ¿Se pasa `class` o `style` a componentes UI?
- [ ] Si falta una variante, ¿se propuso en Architecture Review?

---

## 🔒 Regla Inmutable 3: Intención > Estilo

### Principio

> **API semántica, no técnica.**

Los componentes UI exponen **intenciones** (qué quieres lograr), no **estilos** (cómo se ve).

---

### ❌ Prohibido

#### Estilos Técnicos como Inputs

```html
<!-- ❌ PROHIBIDO: Valores técnicos -->
<ui-button 
  color="#1976d2" 
  padding="20px" 
  borderRadius="8px"
  fontSize="16px">
  Guardar
</ui-button>

<!-- ❌ PROHIBIDO: Clases CSS libres -->
<ui-button class="blue-button rounded-lg p-4 text-white">
  Guardar
</ui-button>

<!-- ❌ PROHIBIDO: Valores arbitrarios -->
<ui-card 
  elevation="5px" 
  backgroundColor="#f5f5f5"
  borderColor="#e0e0e0">
  ...
</ui-card>
```

#### Types Abiertos

```typescript
// ❌ PROHIBIDO: Tipos demasiado abiertos
interface UiButtonConfig {
  variant: string;        // ← Demasiado abierto
  color: string;          // ← Permite cualquier color
  size: string | number;  // ← Permite valores arbitrarios
}
```

---

### ✅ Permitido

#### Variantes Semánticas

```html
<!-- ✅ CORRECTO: Intenciones claras -->
<ui-button variant="primary" size="md">
  Guardar
</ui-button>

<ui-button variant="danger" size="sm">
  Eliminar
</ui-button>

<ui-button variant="ghost" size="lg">
  Ver Más
</ui-button>

<!-- ✅ CORRECTO: Estados semánticos -->
<ui-card elevation="elevated">
  ...
</ui-card>

<ui-form-field state="error">
  ...
</ui-form-field>
```

#### Types Cerrados (Union Types)

```typescript
// ✅ CORRECTO: Contratos cerrados
type UiButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
type UiButtonSize = 'sm' | 'md' | 'lg';
type UiCardElevation = 'flat' | 'elevated';
type UiFormFieldState = 'default' | 'error' | 'success' | 'disabled';

interface UiButtonConfig {
  variant: UiButtonVariant;  // ← Solo 5 opciones
  size: UiButtonSize;        // ← Solo 3 opciones
}
```

---

### Mapeo: Intención → Estilo

**Responsabilidad del PAL**: Traducir intenciones a estilos.

```scss
// shared/presentation/primitives/button/ui-button.component.scss

// Intención: variant="primary"
.ui-button--primary .ui-button-inner {
  background: var(--ui-color-brand-primary);  // ← Estilo técnico
  color: white;
  box-shadow: var(--ui-elevation-1);
}

// Intención: variant="danger"
.ui-button--danger .ui-button-inner {
  background: var(--ui-color-error);  // ← Estilo técnico
  color: white;
}

// Intención: size="lg"
.ui-button--lg .ui-button-inner {
  padding: var(--ui-space-4) var(--ui-space-6);  // ← Estilo técnico
  font-size: var(--ui-text-lg);
  min-height: 48px;
}
```

**Features solo ven**:
```html
<ui-button variant="primary" size="lg">
```

**PAL traduce a**:
```css
background: #2196f3;
padding: 16px 24px;
font-size: 18px;
min-height: 48px;
```

---

### Contratos Documentados

Cada componente PAL debe documentar sus variantes:

```typescript
/**
 * ui-button - Componente de botón del UI System
 * 
 * CONTRATOS:
 * 
 * Variantes (variant):
 *   - primary: Acción principal (guardar, crear, confirmar)
 *   - secondary: Acción secundaria (cancelar, volver)
 *   - danger: Acción destructiva (eliminar, desactivar)
 *   - ghost: Acción terciaria (ver más, expandir)
 *   - link: Acción de navegación
 * 
 * Tamaños (size):
 *   - sm: 32px altura (formularios compactos)
 *   - md: 40px altura (uso general)
 *   - lg: 48px altura (CTAs principales)
 * 
 * Estados:
 *   - loading: Muestra spinner, deshabilita click
 *   - disabled: Deshabilita interacción
 * 
 * @example
 * <ui-button variant="primary" size="md" [loading]="isSaving">
 *   Guardar
 * </ui-button>
 */
```

---

### Enforcement

#### TypeScript Strict Types

```typescript
// ✅ TypeScript previene valores inválidos
<ui-button variant="invalid">  // ← Error de compilación
<ui-button size="huge">        // ← Error de compilación
```

#### Storybook Controls

Solo mostrar variantes permitidas en Storybook:

```typescript
// ui-button.stories.ts
export default {
  component: UiButtonComponent,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost', 'link']  // ← Solo estas
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg']  // ← Solo estas
    }
  }
};
```

#### Code Review Checklist

- [ ] ¿Se usan solo variantes documentadas?
- [ ] ¿Los types son unions cerrados (no `string`)?
- [ ] ¿El contrato está documentado en JSDoc?
- [ ] ¿Storybook muestra solo variantes permitidas?

---

## 📊 Resumen de Enforcement

| Regla | ESLint | Code Review | TypeScript | Storybook |
|-------|--------|-------------|------------|-----------|
| **1. Domain-Agnostic** | `@vitalia/no-domain-in-ui` | ✅ Checklist | ⚠️ Naming | ✅ Test visual |
| **2. No Styling in Features** | `@vitalia/no-ui-styling-in-features` | ✅ Checklist | ❌ N/A | ❌ N/A |
| **3. Intención > Estilo** | ❌ N/A | ✅ Checklist | ✅ Strict types | ✅ Controls |

---

## 🎯 Test de Cumplimiento

### Para Cada Componente UI

- [ ] **Regla 1**: ¿Funcionaría en educación sin cambios?
- [ ] **Regla 2**: ¿Features solo componen, sin CSS?
- [ ] **Regla 3**: ¿API es semántica, no técnica?

### Para Cada Feature

- [ ] **Regla 1**: ¿No importa nada de `shared/presentation/` excepto componentes?
- [ ] **Regla 2**: ¿No hay CSS que estiliza `ui-*`?
- [ ] **Regla 3**: ¿Solo usa variantes documentadas?

---

## 🚨 Consecuencias de Violación

### Violación de Regla 1 (Domain-Agnostic)

**Impacto**: Sistema no reutilizable en otros dominios.

**Ejemplo**: `UiPatientCardComponent` no sirve para escuelas.

**Solución**: Renombrar a `UiCardComponent`, hacer configuración genérica.

---

### Violación de Regla 2 (No Styling in Features)

**Impacto**: Inconsistencia visual, imposible cambiar diseño global.

**Ejemplo**: 10 features estilizan botones de forma diferente.

**Solución**: Eliminar CSS local, proponer variante en PAL.

---

### Violación de Regla 3 (Intención > Estilo)

**Impacto**: API técnica dificulta mantenimiento y consistencia.

**Ejemplo**: `<ui-button color="#ff0000">` permite cualquier color.

**Solución**: Cambiar a `variant="danger"`, cerrar API.

---

## 📚 Referencias

- [ADR-006: Design System + PAL](../../04-ADR/ADR-006-Design-System-PAL.md)
- [Design System Best Practices](Design-System-Best-Practices.md)
- [Atlassian Design System Principles](https://atlassian.design/foundations/principles)
- [Shopify Polaris Principles](https://polaris.shopify.com/foundations/principles)

---

**Última actualización**: 2026-01-23  
**Mantenido por**: Architecture Team  
**Estado**: ✅ Immutable - Non-Negotiable
