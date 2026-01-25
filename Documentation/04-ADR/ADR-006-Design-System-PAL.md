# ADR-006: Vitalia Design System + Presentation Abstraction Layer (PAL)

**Status**: ✅ Accepted  
**Date**: 2026-01-23  
**Deciders**: Architecture Team  
**Related**: [ADR-003](ADR-003-Widget-Based-Architecture.md), [ADR-004](ADR-004-Metadata-Driven-UI.md)

---

## Contexto y Problema

### Situación Actual

Vitalia Frontend utiliza **Angular Material** y **Ng-Matero Extensions** directamente en componentes de negocio (features y widgets). Esto ha generado los siguientes problemas:

#### 🔴 Problemas Identificados

1. **Inconsistencia Visual**
   - Cada desarrollador toma decisiones de diseño locales (colores, espaciados, bordes)
   - Mismo componente (`mat-button`) con estilos diferentes en distintas partes de la app
   - CSS filtrado en features y widgets, violando separación de responsabilidades

2. **Mantenibilidad Comprometida**
   - Cambiar el "look & feel" global requiere editar decenas de archivos
   - No existe una única fuente de verdad para el diseño visual
   - Refactors visuales son costosos y propensos a errores

3. **Multi-tenant Inviable**
   - White-labeling por tenant requeriría duplicar componentes
   - No hay mecanismo para cambiar branding dinámicamente
   - Temas hardcodeados en componentes

4. **Falta de Governance Arquitectónico**
   - No hay barrera que impida usar `mat-*` directamente en features
   - Desarrolladores pueden "saltarse" las reglas de diseño fácilmente
   - Onboarding lento: nuevos devs no saben qué componentes usar

### Ejemplo del Problema

```typescript
// ❌ PROBLEMA: Decisiones visuales en features
@Component({
  selector: 'app-tenant-form',
  template: `
    <button 
      mat-raised-button 
      color="primary"
      class="custom-save-button">
      Guardar
    </button>
  `,
  styles: [`
    .custom-save-button {
      border-radius: 8px;        /* ← Decisión local */
      padding: 12px 24px;        /* ← Decisión local */
      box-shadow: 0 2px 4px...;  /* ← Decisión local */
    }
  `]
})
export class TenantFormComponent {}
```

**Consecuencias**:
- Otro componente usa `border-radius: 4px` → Inconsistencia
- Cambiar el diseño global requiere buscar y reemplazar en 50+ archivos
- No hay forma de aplicar branding por tenant

---

## Decisión

Implementamos el **Vitalia Design System (VDS)** con **Presentation Abstraction Layer (PAL)**, una arquitectura de 3 capas que separa:

1. **Branding** (Design Tokens)
2. **Comportamiento Visual** (Componentes PAL)
3. **Lógica de Negocio** (Features/Widgets)

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────────────┐
│  LAYER 3: Features / Widgets / Pages                │
│  ❌ No CSS, No mat-*, No decisiones visuales        │
│  ✅ Solo composición con v-*                        │
├─────────────────────────────────────────────────────┤
│  LAYER 2: Presentation Abstraction Layer (PAL)      │
│  🎨 v-button, v-card, v-table, v-form-field         │
│  📦 Envuelve Material + Mtx + Charts                │
│  🔒 Única capa que conoce mat-*                     │
├─────────────────────────────────────────────────────┤
│  LAYER 1: Design System (Tokens + Themes)           │
│  🧬 Contratos visuales (CSS Variables)              │
│  🎨 No Angular, solo CSS puro                       │
│  🌍 Multi-tenant, White-label ready                 │
└─────────────────────────────────────────────────────┘
```

### Principios Fundamentales

#### 1. **Tokens como Única Fuente de Verdad**

```css
/* shared/design-system/tokens/colors.css */
:root {
  --v-primary-500: #2F80ED;
  --v-radius-md: 8px;
  --v-space-4: 16px;
  --v-elevation-card: 0 2px 8px rgba(0,0,0,.08);
}
```

> **Regla**: Ningún componente usa valores hardcodeados. Todo viene de tokens.

#### 2. **Abstracción Semántica, No Técnica**

```html
<!-- ❌ Antes: Decisión técnica -->
<button mat-raised-button color="primary" class="my-button">

<!-- ✅ Después: Intención semántica -->
<v-button variant="primary" size="md">
```

> **Regla**: El desarrollador elige **intenciones** (primary, secondary, danger), no **estilos** (colores, píxeles).

#### 3. **Prohibición Arquitectónica**

> ❌ **Prohibido usar `mat-*` fuera de `shared/presentation/`**

Esta regla se aplica mediante:
- Code review checklist
- Linting rules (ESLint custom rule)
- Arquitectura de carpetas clara

#### 4. **White-labeling Nativo**

```typescript
// Cambiar branding por tenant
uiConfigService.setTenantBranding('hospital-xyz');

// Automáticamente aplica:
// --v-primary-500: #10b981 (verde del hospital)
```

---

## Alternativas Consideradas

### Alternativa 1: UI Kit Simple (Wrappers de Material)

**Descripción**: Crear componentes base (`ui-button`, `ui-card`) que envuelven Material pero sin Design Tokens.

**Pros**:
- ✅ Más rápido de implementar inicialmente
- ✅ Menos archivos que mantener

**Contras**:
- ❌ Cambios visuales globales requieren editar componentes
- ❌ White-labeling difícil de implementar
- ❌ No hay separación clara entre branding y comportamiento
- ❌ Desarrolladores aún pueden usar `mat-*` directamente

**Decisión**: ❌ Rechazada. No resuelve el problema de multi-tenant ni governance.

---

### Alternativa 2: Theming de Angular Material Nativo

**Descripción**: Usar solo el sistema de temas de Angular Material (`@include mat.all-component-themes()`).

**Pros**:
- ✅ Nativo de Angular Material
- ✅ No requiere componentes custom

**Contras**:
- ❌ Limitado a paletas de Material (no permite branding completo)
- ❌ No previene uso directo de `mat-*` en features
- ❌ Difícil cambiar temas dinámicamente por tenant
- ❌ No controla espaciados, radios, elevaciones de forma granular

**Decisión**: ❌ Rechazada. Insuficiente para necesidades empresariales.

---

### Alternativa 3: Tailwind CSS

**Descripción**: Reemplazar Material con Tailwind CSS para utility-first styling.

**Pros**:
- ✅ Altamente configurable
- ✅ Design tokens nativos
- ✅ Muy popular en la industria

**Contras**:
- ❌ Requiere reescribir TODA la UI existente
- ❌ Pérdida de componentes avanzados de Material (Mtx Grid, Stepper, etc.)
- ❌ Curva de aprendizaje para el equipo
- ❌ Aún permite decisiones visuales locales (`class="p-4 bg-blue-500"`)

**Decisión**: ❌ Rechazada. Costo de migración muy alto, no resuelve governance.

---

### Alternativa 4: VDS + PAL (Elegida)

**Descripción**: Sistema de 3 capas con Design Tokens + Componentes PAL + Prohibición de `mat-*`.

**Pros**:
- ✅ Separación clara: Branding / Comportamiento / Lógica
- ✅ White-labeling nativo y dinámico
- ✅ Cambios visuales globales en un solo archivo
- ✅ Governance arquitectónico fuerte
- ✅ Mantiene componentes avanzados de Material
- ✅ Escalable a múltiples apps

**Contras**:
- ⚠️ Requiere inversión inicial (2-3 semanas)
- ⚠️ Migración progresiva de features existentes

**Decisión**: ✅ **Aceptada**. Beneficios superan ampliamente los costos.

---

## Consecuencias

### Positivas

#### 1. **Consistencia Visual Garantizada**

```typescript
// Todos los botones primarios se ven EXACTAMENTE igual
<v-button variant="primary">Guardar</v-button>
<v-button variant="primary">Crear</v-button>
<v-button variant="primary">Actualizar</v-button>
```

No hay forma de que un desarrollador "rompa" el diseño accidentalmente.

#### 2. **Cambios Visuales Instantáneos**

```css
/* Cambiar TODOS los botones a más redondeados */
:root {
  --v-radius-md: 12px;  /* Era 8px */
}
```

Un solo cambio afecta a toda la aplicación.

#### 3. **White-labeling Sin Esfuerzo**

```typescript
// Hospital XYZ
uiConfigService.setTenantBranding('hospital-xyz');
// → Azul médico

// Clínica ABC
uiConfigService.setTenantBranding('clinic-abc');
// → Verde institucional
```

Mismo código, diferente branding.

#### 4. **Developer Experience Mejorado**

```html
<!-- Antes: 8 líneas -->
<button 
  mat-raised-button 
  color="primary"
  class="custom-button"
  [disabled]="loading">
  @if (loading) {
    <mat-spinner diameter="20"></mat-spinner>
  }
  Guardar
</button>

<!-- Después: 1 línea -->
<v-button variant="primary" [loading]="loading">Guardar</v-button>
```

Menos código, más legible, más mantenible.

#### 5. **Onboarding Simplificado**

Nuevos desarrolladores solo necesitan aprender:
- ✅ Qué componentes PAL existen (`v-button`, `v-card`, etc.)
- ✅ Qué variantes semánticas usar (`primary`, `secondary`, `danger`)

No necesitan:
- ❌ Conocer Material en profundidad
- ❌ Tomar decisiones de diseño
- ❌ Escribir CSS

#### 6. **Escalabilidad Multi-App**

```
shared/design-system/  ← Extraíble como librería NPM
shared/presentation/   ← Reutilizable en otras apps Vitalia
```

Futuro: `@vitalia/design-system` como paquete compartido.

---

### Negativas (Mitigadas)

#### 1. **Inversión Inicial**

**Problema**: Crear Design Tokens + Componentes PAL toma 2-3 semanas.

**Mitigación**:
- Implementación incremental (empezar con 3 componentes: `v-button`, `v-card`, `v-table`)
- Migración progresiva de features (no big bang)
- ROI positivo en 1-2 meses

#### 2. **Curva de Aprendizaje**

**Problema**: Equipo debe aprender nuevo sistema.

**Mitigación**:
- Documentación completa (ADRs + Guides)
- Storybook con ejemplos interactivos
- Code review checklist
- Pair programming en primeras implementaciones

#### 3. **Migración de Código Existente**

**Problema**: Features existentes usan `mat-*` directamente.

**Mitigación**:
- Migración progresiva (no bloqueante)
- Priorizar features más visibles primero
- Crear script de migración automatizada (find & replace inteligente)

---

## Estructura de Carpetas

```
src/app/shared/
├── design-system/                    # LAYER 1
│   ├── tokens/
│   │   ├── colors.css
│   │   ├── spacing.css
│   │   ├── typography.css
│   │   ├── elevation.css
│   │   ├── radius.css
│   │   └── index.css
│   ├── themes/
│   │   ├── vitalia-light.theme.css
│   │   ├── vitalia-dark.theme.css
│   │   └── tenant-override.theme.css
│   └── README.md
│
├── presentation/                      # LAYER 2
│   ├── config/
│   │   ├── ui-config.service.ts
│   │   └── ui-config.types.ts
│   ├── primitives/
│   │   ├── button/
│   │   ├── input/
│   │   ├── select/
│   │   └── ...
│   ├── components/
│   │   ├── card/
│   │   ├── dialog/
│   │   └── ...
│   ├── data/
│   │   ├── table/
│   │   └── ...
│   └── index.ts
│
└── features/                          # LAYER 3
    └── (usa solo v-*)
```

---

## Refinamientos Críticos (Safeguards)

### 🔒 Refinamiento 1: Contratos Explícitos del PAL

**Problema**: Sin contratos claros, desarrolladores pueden intentar "extender" componentes PAL de formas no previstas.

**Solución**: Documentar explícitamente qué variantes existen y cómo extender el sistema.

#### Ejemplo: Contrato de `v-button`

```typescript
/**
 * v-button - Componente de botón del Vitalia Design System
 * 
 * CONTRATOS:
 * 
 * 1. Variantes Permitidas:
 *    - primary: Acción principal (guardar, crear, confirmar)
 *    - secondary: Acción secundaria (cancelar, volver)
 *    - danger: Acción destructiva (eliminar, desactivar)
 *    - ghost: Acción terciaria (ver más, expandir)
 *    - link: Acción de navegación
 * 
 * 2. Tamaños Permitidos:
 *    - sm: 32px altura (formularios compactos)
 *    - md: 40px altura (uso general)
 *    - lg: 48px altura (CTAs principales)
 * 
 * 3. Extensiones NO Permitidas:
 *    ❌ No se puede pasar `class` como Input
 *    ❌ No se puede pasar `style` como Input
 *    ❌ No se puede usar `::ng-deep` para sobrescribir estilos
 * 
 * 4. Cómo Agregar Nueva Variante:
 *    - Proponer en Architecture Review
 *    - Agregar a `VButtonVariant` type
 *    - Implementar en `v-button.component.scss`
 *    - Documentar en Storybook
 *    - Actualizar este contrato
 * 
 * @example
 * <v-button variant="primary" size="md" [loading]="isSaving">
 *   Guardar
 * </v-button>
 */
```

**Enforcement**:
- Cada componente PAL debe tener su contrato documentado
- Code review verifica cumplimiento de contratos
- Storybook muestra solo variantes permitidas

---

### 🚫 Refinamiento 2: Prohibición de `class` Input

**Problema**: Permitir `class` como Input rompe el sistema de diseño.

```typescript
// ❌ ESTO NUNCA DEBE SER POSIBLE
<v-button class="my-custom-style">Guardar</v-button>
```

**Solución**: Prohibir explícitamente `class` y `style` como Inputs.

#### Implementación

```typescript
// v-button.component.ts

@Component({
  selector: 'v-button',
  // ...
  // ❌ NO AGREGAR:
  // @Input() class?: string;
  // @Input() style?: string;
})
export class VButtonComponent {
  // Solo Inputs semánticos
  @Input() variant: VButtonVariant = 'primary';
  @Input() size: VButtonSize = 'md';
  // ...
}
```

#### Regla de ESLint (Custom)

```javascript
// .eslintrc.js
{
  rules: {
    '@vitalia/no-class-input-on-pal-components': 'error'
  }
}
```

**Mensaje de Error**:
```
❌ Error: No se permite pasar 'class' a componentes PAL.
   Si necesitas una variante nueva, propón una extensión del contrato.
   
   Archivo: tenant-form.component.html
   Línea: 42
   
   <v-button class="custom-style">  ← Prohibido
   
   Solución:
   1. Usa variantes existentes: variant="primary|secondary|danger|ghost|link"
   2. O propón nueva variante en Architecture Review
```

---

### 🚪 Refinamiento 3: Escape Hatch Consciente

**Problema**: Siempre habrá casos extremos (ej. landing pages de marketing) que necesiten estilos únicos.

**Solución**: Crear un namespace especial para excepciones conscientes.

#### Estructura

```
src/app/
├── shared/
│   ├── design-system/        # Tokens
│   ├── presentation/          # PAL (reglas estrictas)
│   └── custom-ui/             # Escape Hatch (excepciones)
│       ├── README.md          # ⚠️ "Solo para casos aprobados"
│       └── marketing/
│           └── hero-button.component.ts
```

#### Reglas del Escape Hatch

```markdown
# shared/custom-ui/README.md

⚠️ **ESCAPE HATCH - Uso Restringido**

Este directorio contiene componentes UI que NO siguen el PAL.

## Cuándo Usar

✅ **Permitido**:
- Landing pages de marketing (fuera de la app principal)
- Demos para clientes (no producción)
- Prototipos de diseño (temporal)

❌ **Prohibido**:
- Features de la aplicación principal
- Widgets reutilizables
- Formularios de negocio

## Proceso de Aprobación

1. Justificar por qué PAL no es suficiente
2. Obtener aprobación de Architecture Team
3. Documentar en este README
4. Marcar como `@deprecated` si es temporal

## Componentes Aprobados

| Componente | Razón | Aprobado Por | Fecha | Deprecar |
|------------|-------|--------------|-------|----------|
| `hero-button` | Marketing landing | @arquitecto | 2026-01-23 | 2026-03-01 |
```

#### Ejemplo de Uso

```typescript
// ✅ Permitido SOLO en marketing/
import { HeroButtonComponent } from '@app/shared/custom-ui/marketing/hero-button.component';

@Component({
  selector: 'app-landing-page',
  template: `
    <hero-button>  <!-- ← Excepción aprobada -->
      Prueba Gratis
    </hero-button>
  `
})
export class LandingPageComponent {}
```

```typescript
// ❌ Prohibido en features/
import { HeroButtonComponent } from '@app/shared/custom-ui/marketing/hero-button.component';

@Component({
  selector: 'app-tenant-form',
  template: `
    <hero-button>  <!-- ❌ Code review rechazará esto -->
      Guardar
    </hero-button>
  `
})
export class TenantFormComponent {}
```

**Enforcement**:
- ESLint rule: `@vitalia/no-custom-ui-in-features`
- Code review checklist
- Auditoría trimestral de `custom-ui/`

---

## Plan de Implementación

### Fase 1: Fundación (Semana 1-2)
1. ✅ Crear `design-system/tokens/`
2. ✅ Crear `design-system/themes/`
3. ✅ Crear `UiConfigService`
4. ✅ Implementar `v-button`
5. ✅ Implementar `v-card`
6. ✅ Documentar en ADR-006

### Fase 2: Componentes Core (Semana 3-5)
7. ✅ `v-input`, `v-select`, `v-checkbox`
8. ✅ `v-form-field`
9. ✅ `v-table` (wrapper de Mtx Grid)
10. ✅ `v-dialog`, `v-drawer`

### Fase 3: Migración (Semana 6+)
11. ✅ Refactorizar `CrudTemplate` para usar PAL
12. ✅ Migrar features progresivamente
13. ✅ Crear Storybook para documentación
14. ✅ Agregar ESLint rule: `no-direct-material-usage`

---

## Reglas de Governance

### 🔒 Regla 1: Prohibición de `mat-*` en Features

```typescript
// ❌ PROHIBIDO en features/widgets/pages
import { MatButtonModule } from '@angular/material/button';

// ✅ PERMITIDO solo en shared/presentation/
import { MatButtonModule } from '@angular/material/button';
```

**Enforcement**:
- Code review checklist
- ESLint custom rule
- Arquitectura de carpetas

### 🎨 Regla 2: Solo Variantes Semánticas

```typescript
// ❌ PROHIBIDO: Estilos libres
<v-button style="background: red; padding: 20px">

// ✅ PERMITIDO: Variantes semánticas
<v-button variant="danger" size="lg">
```

### 🧬 Regla 3: No Valores Hardcodeados

```scss
// ❌ PROHIBIDO
.my-component {
  color: #2196f3;
  padding: 16px;
  border-radius: 8px;
}

// ✅ PERMITIDO
.my-component {
  color: var(--v-primary-500);
  padding: var(--v-space-4);
  border-radius: var(--v-radius-md);
}
```

### 🚪 Regla 4: Escape Hatch Solo con Aprobación

```typescript
// ❌ PROHIBIDO: Usar custom-ui/ sin aprobación
import { HeroButtonComponent } from '@app/shared/custom-ui/marketing/hero-button.component';

// ✅ PERMITIDO: Solo después de Architecture Review
// Ver: shared/custom-ui/README.md
import { HeroButtonComponent } from '@app/shared/custom-ui/marketing/hero-button.component';
```

**Proceso**:
1. Justificar por qué PAL no es suficiente
2. Proponer en Architecture Review
3. Documentar en `custom-ui/README.md`
4. Marcar fecha de deprecación si es temporal

---

## Métricas de Éxito

### Corto Plazo (1-3 meses)
- ✅ 100% de nuevos features usan PAL
- ✅ 0 usos de `mat-*` en nuevos PRs
- ✅ 3+ componentes PAL creados

### Mediano Plazo (3-6 meses)
- ✅ 50%+ de features migrados a PAL
- ✅ Tiempo de cambio visual global < 1 hora
- ✅ White-labeling funcional para 2+ tenants

### Largo Plazo (6-12 meses)
- ✅ 90%+ de features migrados a PAL
- ✅ Design System extraído como librería NPM
- ✅ Storybook completo con todos los componentes
- ✅ 0 inconsistencias visuales reportadas

---

## Referencias

- [ADR-003: Widget-Based Architecture](ADR-003-Widget-Based-Architecture.md)
- [ADR-004: Metadata-Driven UI](ADR-004-Metadata-Driven-UI.md)
- [Vitalia Design System Guide](../02-ARCHITECTURE/06-DESIGN-SYSTEM/Design-System-Guide.md) *(próximo)*
- [PAL Implementation Guide](../02-ARCHITECTURE/06-DESIGN-SYSTEM/PAL-Implementation-Guide.md) *(próximo)*
- [Material Design System](https://material.io/design/foundation/overview)
- [Design Tokens W3C Spec](https://www.w3.org/community/design-tokens/)

---

## Notas

### Inspiración

Este enfoque está inspirado en:
- **Google Material Design**: Sistema de tokens y componentes
- **Ant Design**: Abstracción semántica y theming
- **Shopify Polaris**: Design System empresarial
- **Atlassian Design System**: Governance y escalabilidad

### Evolución Futura

Posibles mejoras a largo plazo:
- Extraer `design-system/` como paquete NPM independiente
- Crear Design System CLI para generar componentes PAL
- Implementar Visual Regression Testing (Chromatic)
- Agregar A11y (accesibilidad) testing automatizado

---

**Última actualización**: 2026-01-23  
**Mantenido por**: Architecture Team  
**Estado**: ✅ Accepted & Ready for Implementation
