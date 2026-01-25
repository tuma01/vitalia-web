# Coding Conventions - UI System (Enterprise Edition)

**Document Type**: Living Document - Coding Standards  
**Status**: ✅ Mandatory - Enforced by Code Review  
**Version**: 2.0 - Enterprise Grade  
**Last Updated**: 2026-01-23  
**Related**: [ADR-006](ADR-006-Design-System-PAL.md), [Folder Structure](Folder-Structure.md)

---

## Objetivo

Definir los **estándares obligatorios** para el desarrollo del **Global Design System (GDS)** y la **Presentation Abstraction Layer (PAL)**.

> **CRITICAL**: Estas convenciones son **obligatorias** y se verifican en code review.

---

## 1️⃣ Convenciones de Nomenclatura (Naming)

| Elemento | Convención | Ejemplo | Regla |
|----------|------------|---------|-------|
| **Componentes UI** | Prefijo `ui-` + Kebab Case | `ui-button`, `ui-card-header` | Selector Angular |
| **Tokens CSS** | Prefijo `--ui-` + Categoría | `--ui-color-brand-primary`, `--ui-space-md` | CSS Variables |
| **Variables SCSS** | Prefijo `$ui-` | `$ui-breakpoint-md`, `$ui-radius-lg` | SCSS Variables |
| **Themes** | Prefijo `theme-` (clase CSS) | `.theme-vitalia`, `.theme-school` | CSS Class |
| **Tipos/Interfaces** | Prefijo `Ui` + Pascal Case | `UiButtonVariant`, `UiCardConfig` | TypeScript |
| **Servicios** | Prefijo `Ui` + Pascal Case + `Service` | `UiConfigService` | Angular Service |
| **Directives** | Prefijo `ui` + Camel Case | `uiLoading`, `uiTooltip` | Angular Directive |
| **Pipes** | Prefijo `ui` + Camel Case | `uiDate`, `uiCurrency` | Angular Pipe |
| **I18n Properties** | `i18n` (interfaces) o `ariaLabel` (directo) | `i18n: UiCardI18n`, `ariaLabel: string` | Inputs |

---

### Ejemplos Completos

#### ✅ Correcto

```typescript
// Componente
@Component({
  selector: 'ui-button',  // ← ui- prefix
  // ...
})
export class UiButtonComponent {}  // ← Ui prefix

// Types
export type UiButtonVariant = 'primary' | 'secondary';  // ← Ui prefix
export interface UiButtonConfig { ... }

// Service
@Injectable()
export class UiConfigService {}  // ← Ui prefix

// Directive
@Directive({
  selector: '[uiLoading]'  // ← ui prefix
})
export class UiLoadingDirective {}

// Pipe
@Pipe({
  name: 'uiDate'  // ← ui prefix
})
export class UiDatePipe {}
```

#### ❌ Incorrecto

```typescript
// ❌ Sin prefijo
@Component({
  selector: 'button',  // ← Falta ui-
})
export class ButtonComponent {}

// ❌ Prefijo incorrecto
export type ButtonVariant = ...;  // ← Falta Ui
export interface CardConfig { ... }  // ← Falta Ui

// ❌ Naming inconsistente
@Component({
  selector: 'vitalia-button',  // ← Prefijo específico de dominio
})
```

---

## 2️⃣ Estándares de Componentes (PAL)

### Estructura de Archivos Obligatoria

Todo componente PAL **debe** cumplir esta estructura:

```
ui-button/
├── ui-button.component.ts       # Lógica + Metadata
├── ui-button.component.html     # Template (si es largo)
├── ui-button.component.scss     # Estilos encapsulados
└── ui-button.types.ts           # ✅ OBLIGATORIO: Tipos públicos
```

#### Cuándo Separar Template

- **Template inline**: Si tiene < 10 líneas
- **Template separado**: Si tiene ≥ 10 líneas

---

### Reglas de Implementación

#### 🔒 Regla 1: Change Detection OnPush (Obligatorio)

```typescript
// ✅ CORRECTO: Siempre OnPush
@Component({
  selector: 'ui-button',
  changeDetection: ChangeDetectionStrategy.OnPush,  // ← Obligatorio
  // ...
})
export class UiButtonComponent {}
```

```typescript
// ❌ PROHIBIDO: Default change detection
@Component({
  selector: 'ui-button',
  // changeDetection no especificado = Default ← Prohibido
})
export class UiButtonComponent {}
```

**Razón**: Performance y predictibilidad.

---

#### 🔒 Regla 2: Inputs Tipados con Union Types (Obligatorio)

```typescript
// ✅ CORRECTO: Union types cerrados
import { UiButtonVariant, UiButtonSize } from './ui-button.types';

@Component({
  selector: 'ui-button',
  // ...
})
export class UiButtonComponent {
  @Input() variant: UiButtonVariant = 'primary';  // ← Type cerrado
  @Input() size: UiButtonSize = 'md';             // ← Type cerrado
}
```

```typescript
// ❌ PROHIBIDO: string genérico
@Component({
  selector: 'ui-button',
  // ...
})
export class UiButtonComponent {
  @Input() variant: string;  // ← Demasiado abierto
  @Input() size: string;     // ← Permite valores inválidos
}
```

**Razón**: TypeScript previene valores inválidos en compile-time.

---

#### 🔒 Regla 3: Host Binding para Clases Semánticas (Recomendado)

**Opción A: Concatenación** (simple, funciona bien)

```typescript
@Component({
  selector: 'ui-button',
  host: {
    '[class]': '"ui-button ui-button--" + variant + " ui-button--" + size'
  },
  // ...
})
export class UiButtonComponent {
  @Input() variant: UiButtonVariant = 'primary';
  @Input() size: UiButtonSize = 'md';
}
```

**Opción B: Múltiples clases semánticas** (⭐ best practice, más explícito)

```typescript
@Component({
  selector: 'ui-button',
  host: {
    '[class.ui-button]': 'true',
    '[class.ui-button--primary]': 'variant === "primary"',
    '[class.ui-button--secondary]': 'variant === "secondary"',
    '[class.ui-button--danger]': 'variant === "danger"',
    '[class.ui-button--ghost]': 'variant === "ghost"',
    '[class.ui-button--link]': 'variant === "link"',
    '[class.ui-button--sm]': 'size === "sm"',
    '[class.ui-button--md]': 'size === "md"',
    '[class.ui-button--lg]': 'size === "lg"'
  },
  // ...
})
export class UiButtonComponent {
  @Input() variant: UiButtonVariant = 'primary';
  @Input() size: UiButtonSize = 'md';
}
```

**Ventajas de Opción B**:
- ✅ CSS más claro (BEM-like)
- ✅ Mejor extensibilidad
- ✅ Más fácil de debuggear en DevTools
- ✅ TypeScript verifica variantes en compile-time

**Opción C: HostBinding** (también válida)

```typescript
@HostBinding('class') get hostClasses(): string {
  return `ui-button ui-button--${this.variant} ui-button--${this.size}`;
}
```

---

#### 🔒 Regla 4: Standalone Components (Obligatorio)

```typescript
// ✅ CORRECTO: Standalone
@Component({
  selector: 'ui-button',
  standalone: true,  // ← Obligatorio
  imports: [CommonModule, MatButtonModule],
  // ...
})
export class UiButtonComponent {}
```

```typescript
// ❌ PROHIBIDO: No standalone
@Component({
  selector: 'ui-button',
  standalone: false,  // ← Prohibido
  // ...
})
export class UiButtonComponent {}
```

**Razón**: Facilita extracción a NPM y tree-shaking.

---

#### 🔒 Regla 5: Archivo `.types.ts` Obligatorio

```typescript
// ui-button.types.ts

/**
 * Variantes semánticas del botón
 */
export type UiButtonVariant = 
  | 'primary'      // Acción principal
  | 'secondary'    // Acción secundaria
  | 'danger'       // Acción destructiva
  | 'ghost'        // Acción terciaria
  | 'link';        // Acción de navegación

/**
 * Tamaños del botón
 */
export type UiButtonSize = 'sm' | 'md' | 'lg';

/**
 * Configuración del botón
 */
export interface UiButtonConfig {
  variant?: UiButtonVariant;
  size?: UiButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}
```

**Razón**: Separación de concerns, reutilización de tipos, documentación clara.

---

#### 🔒 Regla 6: Outputs Tipados (Obligatorio)

```typescript
// ✅ CORRECTO: Outputs con tipos explícitos
@Component({
  selector: 'ui-button',
  // ...
})
export class UiButtonComponent {
  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() valueChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<UiSelectionEvent>();
}
```

```typescript
// ❌ PROHIBIDO: Outputs sin tipo
@Component({
  selector: 'ui-button',
  // ...
})
export class UiButtonComponent {
  @Output() clicked = new EventEmitter();  // ← any implícito
  @Output() valueChange = new EventEmitter<any>();  // ← any explícito
}
```

**Razón**: Previene `any`, clarifica contratos, facilita refactoring.

---

## 3️⃣ Reglas de Estilo (SCSS)

### 🔒 Regla 1: Uso de Tokens (Obligatorio)

```scss
// ✅ CORRECTO: Usar tokens
.ui-button {
  padding: var(--ui-space-3) var(--ui-space-4);
  border-radius: var(--ui-radius-md);
  background: var(--ui-color-brand-primary);
  color: var(--ui-text-primary);
  box-shadow: var(--ui-elevation-1);
}
```

#### 🔒 Regla 1.1: Estrategia de Tokens (3 Niveles)
Para maximizar el multi-tenant, usa siempre esta jerarquía:
1.  **Global Base**: `var(--ui-space-md)`
2.  **Semantic Alias**: `var(--ui-color-primary)`
3.  **Component Token**: `var(--ui-button-bg)` (Nivel 3, definido en `:root` del componente)

**Excepción**: Valores literales **solo permitidos** en `tokens/_base.scss`

```scss
// ✅ PERMITIDO: Solo en tokens/_base.scss
$ui-space-4: 1rem;        // ← OK aquí
$ui-radius-md: 0.5rem;    // ← OK aquí
$ui-elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12);  // ← OK aquí
```

```scss
// ❌ PROHIBIDO: Valores hardcodeados en componentes
.ui-button {
  padding: 12px 16px;        // ← Prohibido
  border-radius: 8px;        // ← Prohibido
  background: #2196f3;       // ← Prohibido
  color: rgba(0, 0, 0, 0.87); // ← Prohibido
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // ← Prohibido
}
```

**Enforcement**: Code review rechaza valores hardcodeados.

---

### 🔒 Regla 2: No Leaking de Material (Obligatorio)

```scss
// ✅ CORRECTO: Sobrescribir Material DENTRO del componente PAL
// ui-form-field.component.scss

::ng-deep .mat-form-field-outline {
  border-radius: var(--ui-radius-form-field);
  border-color: var(--ui-border-light);
}

::ng-deep .mat-form-field-label {
  color: var(--ui-text-secondary);
  font-family: var(--ui-font-family-primary);
}
```

```scss
// ❌ PROHIBIDO: Sobrescribir Material en features
// features/patients/patient-form.component.scss

::ng-deep .mat-form-field-outline {  // ← Prohibido fuera de PAL
  border-radius: 12px;
}
```

**Razón**: Encapsulación, prevención de leaking.

---

### 🔒 Regla 3: Encapsulación de Estilos (Obligatorio)

```typescript
// ✅ CORRECTO: ViewEncapsulation.Emulated (default)
@Component({
  selector: 'ui-button',
  encapsulation: ViewEncapsulation.Emulated,  // ← Default, OK
  // ...
})
```

```typescript
// ❌ PROHIBIDO: ViewEncapsulation.None
@Component({
  selector: 'ui-button',
  encapsulation: ViewEncapsulation.None,  // ← Prohibido
  // ...
})
```

**Excepción**: Solo permitido si es absolutamente necesario para sobrescribir Material, y debe documentarse.

---

### 🔒 Regla 4: BEM Modificado para Variantes

```scss
// ✅ CORRECTO: BEM modificado
.ui-button {
  // Base styles
  
  &--primary {
    background: var(--ui-color-brand-primary);
  }
  
  &--secondary {
    background: transparent;
    border: 1px solid var(--ui-border-medium);
  }
  
  &--sm {
    padding: var(--ui-space-2) var(--ui-space-3);
    font-size: var(--ui-text-sm);
  }
  
  &--md {
    padding: var(--ui-space-3) var(--ui-space-4);
    font-size: var(--ui-text-base);
  }
}
```

**Resultado**:
```html
<ui-button class="ui-button ui-button--primary ui-button--md">
```

---

## 4️⃣ Patrón de Consumo (Features)

### Cómo Features Usan el UI System

Las Features **solo** pueden interactuar con la capa UI a través de:

#### ✅ Permitido

```typescript
// 1. Selectores en templates
@Component({
  template: `
    <ui-button variant="primary" size="md">Guardar</ui-button>
    <ui-card elevation="elevated">...</ui-card>
  `
})
export class PatientFormComponent {}

// 2. Inputs/Outputs
@Component({
  template: `
    <ui-button 
      [variant]="buttonVariant" 
      [loading]="isSaving"
      (clicked)="onSave()">
      Guardar
    </ui-button>
  `
})
export class PatientFormComponent {
  buttonVariant: UiButtonVariant = 'primary';
  isSaving = false;
  
  onSave(): void { ... }
}

// 3. Tipos exportados
import { UiButtonVariant, UiCardElevation } from '@ui';

export class PatientFormComponent {
  variant: UiButtonVariant = 'primary';
  elevation: UiCardElevation = 'elevated';
}
```

---

#### ❌ Prohibido

```typescript
// ❌ PROHIBIDO: Importar Material directamente
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule],  // ← Prohibido en features
  template: `
    <button mat-raised-button>Guardar</button>  // ← Prohibido
  `
})
export class PatientFormComponent {}

// ❌ PROHIBIDO: Estilizar componentes UI
@Component({
  template: `<ui-button class="custom-style">Guardar</ui-button>`,
  styles: [`
    .custom-style {
      background: red;  // ← Prohibido
    }
  `]
})
export class PatientFormComponent {}

// ❌ PROHIBIDO: Usar tokens directamente
@Component({
  styles: [`
    .patient-card {
      padding: var(--ui-space-4);  // ← Prohibido en features
    }
  `]
})
export class PatientFormComponent {}
```

---

## 5️⃣ Imports y Exports

### Public API (`shared/ui/index.ts`)

```typescript
/**
 * UI SYSTEM - PUBLIC API
 * 
 * Solo lo exportado aquí puede usarse fuera de shared/ui/
 */

// Config
export * from './config/ui-config.types';
export * from './config/ui-config.service';

// Primitives
export * from './primitives/button/ui-button.component';
export * from './primitives/button/ui-button.types';

// Components
export * from './components/card/ui-card.component';
export * from './components/card/ui-card.types';

// Directives
export * from './directives/ui-loading.directive';

// Pipes
export * from './pipes/ui-date.pipe';
```

---

### Imports en Features

```typescript
// ✅ CORRECTO: Importar desde @ui
import { UiButtonComponent, UiButtonVariant } from '@ui';

// ❌ PROHIBIDO: Importar desde paths internos
import { UiButtonComponent } from '@ui/primitives/button/ui-button.component';
```

**Razón**: Public API permite cambiar estructura interna sin romper features.

---

## 6️⃣ Testing Standards

### Unit Tests Obligatorios

```typescript
// ui-button.component.spec.ts

describe('UiButtonComponent', () => {
  let component: UiButtonComponent;
  let fixture: ComponentFixture<UiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent]  // Standalone
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply variant class', () => {
    component.variant = 'primary';
    fixture.detectChanges();
    
    const element = fixture.nativeElement;
    expect(element.classList.contains('ui-button--primary')).toBe(true);
  });

  it('should emit clicked event', () => {
    spyOn(component.clicked, 'emit');
    
    component.handleClick(new MouseEvent('click'));
    
    expect(component.clicked.emit).toHaveBeenCalled();
  });
});
```

---

## 7️⃣ Documentation Standards

### JSDoc Obligatorio

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
@Component({
  selector: 'ui-button',
  // ...
})
export class UiButtonComponent {}
```

---

## 🔒 Reglas Enterprise (Nivel Corporativo)

### 🔒 Regla 5: PAL No Conoce Navegación (Obligatorio)

**Principio**: Componentes UI son **puros**, no navegan.

```typescript
// ❌ PROHIBIDO: Navegación en componentes UI
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ui-button',
  // ...
})
export class UiButtonComponent {
  constructor(private router: Router) {}  // ← Prohibido
  
  handleClick(): void {
    this.router.navigate(['/patients']);  // ← Prohibido
  }
}
```

```typescript
// ✅ CORRECTO: Emitir evento, feature navega
@Component({
  selector: 'ui-button',
  // ...
})
export class UiButtonComponent {
  @Output() clicked = new EventEmitter<MouseEvent>();
  
  handleClick(event: MouseEvent): void {
    this.clicked.emit(event);  // ← Feature decide qué hacer
  }
}
```

**Razón**:
- ✅ Mantiene pureza del componente
- ✅ Facilita testing (no mock de Router)
- ✅ Reutilizable en diferentes contextos
- ✅ Evita acoplamiento con rutas

**Enforcement**: ESLint rule `@vitalia/no-router-in-ui`

---

### 🔒 Regla 6: Features No Aplican Clases CSS a `ui-*` (Obligatorio)

**Principio**: Features **componen**, no **estilizan**.

```html
<!-- ❌ PROHIBIDO: Pasar class a componentes UI -->
<ui-button class="my-custom-red-button">Guardar</ui-button>
<ui-card class="special-card">...</ui-card>
<ui-form-field class="extra-margin">...</ui-form-field>
```

```html
<!-- ✅ CORRECTO: Usar variantes semánticas -->
<ui-button variant="danger">Guardar</ui-button>
<ui-card elevation="elevated">...</ui-card>
<ui-form-field size="lg">...</ui-form-field>
```

**Si necesitas layout**:

```html
<!-- ✅ CORRECTO: Wrapper para layout -->
<div class="button-container">
  <ui-button variant="primary">Guardar</ui-button>
</div>
```

```scss
// feature.component.scss
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: var(--ui-space-2);  // ← Usa tokens para layout
}
```

**Razón**:
- ✅ Previene overrides silenciosos
- ✅ Mantiene consistencia visual
- ✅ Evita hacks de último minuto
- ✅ Facilita refactoring global

**Enforcement**: 
- ESLint rule `@vitalia/no-class-on-ui-components`
- Code review rechaza PRs con `class` en `ui-*`

---

### 🔒 Regla 7: `ui-*` Nunca Expone Estilos Internos (Obligatorio)

**Principio**: Encapsulación total, API cerrada.

```scss
// ❌ PROHIBIDO: Exponer clases internas para override
// ui-button.component.scss

.ui-button {
  // ...
}

// ❌ NO crear clases "públicas" para override
.ui-button__inner {  // ← No exponer
  // ...
}

.ui-button__icon {  // ← No exponer
  // ...
}
```

```scss
// ✅ CORRECTO: Encapsulación completa
// ui-button.component.scss

.ui-button {
  // ...
}

.ui-button-inner {  // ← Privado, no documentado
  // ...
}

.ui-button-icon {  // ← Privado, no documentado
  // ...
}
```

**Features NO deben hacer**:
1.  ❌ Sobrescribir estilos internos (`::ng-deep`) fuera del PAL.
2.  ❌ Usar valores hardcodeados en media queries (usar tokens de breakpoint).

### 🔒 Regla 8: Multi-Device Standard (Mandatorio)
Todo componente PAL **debe** ser testeado en:
-   **Mobile (375px)**: Uso de paddings reducidos (`var(--ui-space-sm/md)`) y layouts colapsables.
-   **Desktop (1440px)**: Uso de paddings generosos (`var(--ui-space-lg/xl)`).

### 🔒 Regla 9: Touch Target Standard (Accesibilidad)
Para componentes interactivos en móvil:
1.  **Área Táctil**: Mínimo **44x44px** (WCAG).
2.  **Solución**: Usar pseudo-elementos (`:after`) para expandir el área de click en componentes visualmente pequeños (ej. `sm-button`, `checkbox`).

```scss
// ❌ PROHIBIDO en features
::ng-deep .ui-button-inner {
  padding: 20px;  // ← Rompe encapsulación
}

::ng-deep .mat-button-wrapper {
  color: red;  // ← Accede a internals de Material
}
```

**Razón**:
- ✅ API cerrada y controlada
- ✅ Permite refactoring interno sin breaking changes
- ✅ Previene dependencias frágiles
- ✅ Facilita evolución del sistema

**Enforcement**: 
- Code review rechaza `::ng-deep` sobre `ui-*` en features
- Documentación de componentes NO menciona clases internas

---

## 📋 Checklist de Code Review

### Para Cada Componente UI

- [ ] ✅ Prefijo `ui-` en selector
- [ ] ✅ Prefijo `Ui` en class name
- [ ] ✅ `standalone: true`
- [ ] ✅ `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] ✅ Archivo `.types.ts` existe
- [ ] ✅ Inputs usan union types (no `string`)
- [ ] ✅ Outputs tipados (no `any`)
- [ ] ✅ Estilos usan tokens (no valores hardcodeados)
- [ ] ✅ No importa `Router` o `ActivatedRoute`
- [ ] ✅ No expone clases internas para override
- [ ] ✅ JSDoc completo con contratos
- [ ] ✅ Unit tests cubren variantes principales
- [ ] ✅ Exportado en `index.ts`

### Para Cada Feature

- [ ] ✅ No importa `MatButtonModule` ni otros de Material
- [ ] ✅ No estiliza componentes `ui-*`
- [ ] ✅ No pasa `class` a componentes `ui-*`
- [ ] ✅ No usa `::ng-deep` sobre `ui-*`
- [ ] ✅ No usa tokens CSS directamente (excepto para layout)
- [ ] ✅ Importa desde `@ui` (no paths internos)

---

## 🚨 Violaciones Comunes

### Violación 1: Inputs sin Tipos

```typescript
// ❌ MAL
@Input() variant: string;

// ✅ BIEN
@Input() variant: UiButtonVariant = 'primary';
```

### Violación 2: Valores Hardcodeados

```scss
// ❌ MAL
.ui-button {
  padding: 12px 16px;
}

// ✅ BIEN
.ui-button {
  padding: var(--ui-space-3) var(--ui-space-4);
}
```

### Violación 3: Material en Features

```typescript
// ❌ MAL
import { MatButtonModule } from '@angular/material/button';

// ✅ BIEN
import { UiButtonComponent } from '@ui';
```

---

## 📚 Referencias

- [ADR-006: Design System + PAL](ADR-006-Design-System-PAL.md)
- [Folder Structure](Folder-Structure.md)
- [Immutable Principles](Immutable-Principles.md)
- [Best Practices](Design-System-Best-Practices.md)

---

**Última actualización**: 2026-01-23  
**Mantenido por**: Architecture Team  
**Estado**: ✅ Mandatory - Enforced by Code Review

