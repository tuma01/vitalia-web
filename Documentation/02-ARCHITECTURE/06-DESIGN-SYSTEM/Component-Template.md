# UI Component Template - Official Boilerplate

**Document Type**: Template - Copy-Paste Ready  
**Status**: ✅ Official - Use for All New UI Components  
**Version**: 1.0  
**Last Updated**: 2026-01-23  
**Related**: [Coding Conventions](Coding-Conventions.md), [Folder Structure](Folder-Structure.md)

---

## Objetivo

Proporcionar un **template oficial** para crear nuevos componentes UI que cumpla automáticamente con todas las convenciones enterprise.

> **CRITICAL**: Todos los nuevos componentes UI **deben** usar este template.

---

## 📁 Estructura de Archivos

```
shared/ui/primitives/__name__/
├── ui-__name__.component.ts
├── ui-__name__.component.html
├── ui-__name__.component.scss
├── ui-__name__.types.ts
└── ui-__name__.component.spec.ts
```

---

## 📝 Template Files

### 1. `ui-__name__.component.ts`

```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ui__Name__Variant, Ui__Name__Size, Ui__Name__Config } from './ui-__name__.types';

/**
 * ui-__name__ - [Descripción breve del componente]
 * 
 * CONTRATOS:
 * 
 * Variantes (variant):
 *   - primary: [Descripción]
 *   - secondary: [Descripción]
 * 
 * Tamaños (size):
 *   - sm: [Descripción]
 *   - md: [Descripción] (default)
 *   - lg: [Descripción]
 * 
 * Estados:
 *   - disabled: [Descripción]
 *   - loading: [Descripción]
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
    '[class.ui-__name__--sm]': 'size === "sm"',
    '[class.ui-__name__--md]': 'size === "md"',
    '[class.ui-__name__--lg]': 'size === "lg"',
    '[class.ui-__name__--disabled]': 'disabled',
    '[class.ui-__name__--loading]': 'loading'
  }
})
export class Ui__Name__Component {
  // === INPUTS ===
  @Input() variant: Ui__Name__Variant = 'primary';
  @Input() size: Ui__Name__Size = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  
  // === OUTPUTS ===
  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() valueChange = new EventEmitter<string>();
  
  // === COMPUTED PROPERTIES ===
  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }
  
  // === METHODS ===
  handleClick(event: MouseEvent): void {
    if (this.isDisabled) {
      return;
    }
    this.clicked.emit(event);
  }
}
```

---

### 2. `ui-__name__.component.html`

```html
<div class="ui-__name__-inner">
  <!-- Loading State -->
  @if (loading) {
    <div class="ui-__name__-loading">
      <!-- Spinner o loading indicator -->
    </div>
  }
  
  <!-- Content -->
  <div class="ui-__name__-content" [class.ui-__name__-content--hidden]="loading">
    <ng-content></ng-content>
  </div>
</div>
```

---

### 3. `ui-__name__.component.scss`

```scss
@import '../../../../styles/ds/index';

/* ============================================
   UI-__NAME__ - [Descripción]
   ============================================ */

.ui-__name__ {
  display: inline-block;
  position: relative;
}

.ui-__name__-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ui-space-2);
  
  font-family: var(--ui-font-family-primary);
  line-height: var(--ui-leading-normal);
  
  border: var(--ui-border-width) solid transparent;
  cursor: pointer;
  transition: all var(--ui-transition-normal);
  
  &:focus-visible {
    outline: 2px solid var(--ui-color-brand-primary);
    outline-offset: 2px;
  }
}

/* ============================================
   SIZE VARIANTS
   ============================================ */

.ui-__name__--sm .ui-__name__-inner {
  padding: var(--ui-space-2) var(--ui-space-3);
  font-size: var(--ui-text-sm);
  border-radius: var(--ui-radius-md);
  min-height: 32px;
}

.ui-__name__--md .ui-__name__-inner {
  padding: var(--ui-space-3) var(--ui-space-4);
  font-size: var(--ui-text-base);
  border-radius: var(--ui-radius-lg);
  min-height: 40px;
}

.ui-__name__--lg .ui-__name__-inner {
  padding: var(--ui-space-4) var(--ui-space-6);
  font-size: var(--ui-text-lg);
  border-radius: var(--ui-radius-xl);
  min-height: 48px;
}

/* ============================================
   VARIANT: PRIMARY
   ============================================ */

.ui-__name__--primary .ui-__name__-inner {
  background: var(--ui-color-brand-primary);
  color: white;
  box-shadow: var(--ui-elevation-1);
  
  &:hover:not(:disabled) {
    background: var(--ui-color-brand-primary-dark);
    box-shadow: var(--ui-elevation-2);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    background: var(--ui-color-brand-primary-darker);
    box-shadow: var(--ui-elevation-1);
    transform: translateY(0);
  }
}

/* ============================================
   VARIANT: SECONDARY
   ============================================ */

.ui-__name__--secondary .ui-__name__-inner {
  background: transparent;
  border-color: var(--ui-border-medium);
  color: var(--ui-text-primary);
  
  &:hover:not(:disabled) {
    background: var(--ui-bg-secondary);
    border-color: var(--ui-border-dark);
  }
}

/* ============================================
   STATE: DISABLED
   ============================================ */

.ui-__name__--disabled {
  cursor: not-allowed;
  opacity: 0.6;
  
  .ui-__name__-inner {
    pointer-events: none;
  }
}

/* ============================================
   STATE: LOADING
   ============================================ */

.ui-__name__--loading {
  cursor: wait;
}

.ui-__name__-loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.ui-__name__-content {
  display: flex;
  align-items: center;
  gap: var(--ui-space-2);
  
  &--hidden {
    visibility: hidden;
  }
}
```

---

### 4. `ui-__name__.types.ts`

```typescript
/**
 * Variantes semánticas de ui-__name__
 */
export type Ui__Name__Variant = 
  | 'primary'      // [Descripción]
  | 'secondary';   // [Descripción]

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
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Evento emitido por ui-__name__
 */
export interface Ui__Name__Event {
  source: 'ui-__name__';
  value: string;
  timestamp: number;
}
```

---

### 5. `ui-__name__.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ui__Name__Component } from './ui-__name__.component';

describe('Ui__Name__Component', () => {
  let component: Ui__Name__Component;
  let fixture: ComponentFixture<Ui__Name__Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ui__Name__Component]
    }).compileComponents();

    fixture = TestBed.createComponent(Ui__Name__Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Variants', () => {
    it('should apply primary variant class', () => {
      component.variant = 'primary';
      fixture.detectChanges();
      
      const element = fixture.nativeElement;
      expect(element.classList.contains('ui-__name__--primary')).toBe(true);
    });

    it('should apply secondary variant class', () => {
      component.variant = 'secondary';
      fixture.detectChanges();
      
      const element = fixture.nativeElement;
      expect(element.classList.contains('ui-__name__--secondary')).toBe(true);
    });
  });

  describe('Sizes', () => {
    it('should apply sm size class', () => {
      component.size = 'sm';
      fixture.detectChanges();
      
      const element = fixture.nativeElement;
      expect(element.classList.contains('ui-__name__--sm')).toBe(true);
    });

    it('should apply md size class by default', () => {
      const element = fixture.nativeElement;
      expect(element.classList.contains('ui-__name__--md')).toBe(true);
    });
  });

  describe('States', () => {
    it('should apply disabled class when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      
      const element = fixture.nativeElement;
      expect(element.classList.contains('ui-__name__--disabled')).toBe(true);
    });

    it('should apply loading class when loading', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const element = fixture.nativeElement;
      expect(element.classList.contains('ui-__name__--loading')).toBe(true);
    });

    it('should not emit clicked when disabled', () => {
      component.disabled = true;
      spyOn(component.clicked, 'emit');
      
      component.handleClick(new MouseEvent('click'));
      
      expect(component.clicked.emit).not.toHaveBeenCalled();
    });
  });

  describe('Events', () => {
    it('should emit clicked event', () => {
      spyOn(component.clicked, 'emit');
      
      const event = new MouseEvent('click');
      component.handleClick(event);
      
      expect(component.clicked.emit).toHaveBeenCalledWith(event);
    });
  });
});
```

---

## 🔄 Cómo Usar el Template

### Paso 1: Copiar Estructura

```bash
# Crear carpeta del componente
mkdir -p src/app/shared/ui/primitives/button

# Copiar archivos del template
cp template/* src/app/shared/ui/primitives/button/
```

### Paso 2: Reemplazar `__name__`

**Find & Replace** en todos los archivos:

| Buscar | Reemplazar | Ejemplo |
|--------|------------|---------|
| `__name__` | `button` | `ui-button` |
| `__Name__` | `Button` | `UiButtonComponent` |

**Herramientas**:
- VSCode: `Ctrl+Shift+H` (Replace in Files)
- Sed: `sed -i 's/__name__/button/g' *.ts`

### Paso 3: Personalizar

1. ✅ Actualizar JSDoc con descripción real
2. ✅ Ajustar variantes según necesidad
3. ✅ Agregar inputs/outputs específicos
4. ✅ Implementar lógica específica
5. ✅ Actualizar tests

### Paso 4: Exportar en Public API

```typescript
// shared/ui/index.ts
export * from './primitives/button/ui-button.component';
export * from './primitives/button/ui-button.types';
```

---

## ✅ Checklist de Validación

Antes de hacer commit, verificar:

- [ ] ✅ Todos los `__name__` reemplazados
- [ ] ✅ JSDoc actualizado con descripción real
- [ ] ✅ Variantes documentadas en JSDoc
- [ ] ✅ `changeDetection: OnPush` presente
- [ ] ✅ `standalone: true` presente
- [ ] ✅ Host bindings configurados
- [ ] ✅ Inputs usan union types (no `string`)
- [ ] ✅ Outputs tipados (no `any`)
- [ ] ✅ SCSS usa solo tokens (no valores hardcodeados)
- [ ] ✅ Tests cubren variantes y estados
- [ ] ✅ Exportado en `index.ts`
- [ ] ✅ No importa `Router` o `ActivatedRoute`
- [ ] ✅ No expone clases internas

---

## 🎯 Ejemplo: Crear `ui-badge`

### Antes del Reemplazo

```
ui-__name__.component.ts
Ui__Name__Component
Ui__Name__Variant
```

### Después del Reemplazo

```
ui-badge.component.ts
UiBadgeComponent
UiBadgeVariant
```

### Personalización

```typescript
// ui-badge.types.ts
export type UiBadgeVariant = 
  | 'success'   // Verde, para estados positivos
  | 'warning'   // Amarillo, para advertencias
  | 'error'     // Rojo, para errores
  | 'info';     // Azul, para información

export type UiBadgeSize = 
  | 'sm'   // 16px altura
  | 'md'   // 20px altura (default)
  | 'lg';  // 24px altura
```

---

## 🚨 Errores Comunes

### ❌ Error 1: Olvidar Reemplazar en SCSS

```scss
/* ❌ MAL: Quedó __name__ */
.ui-__name__ {
  // ...
}

/* ✅ BIEN */
.ui-badge {
  // ...
}
```

### ❌ Error 2: Usar `string` en Inputs

```typescript
// ❌ MAL
@Input() variant: string;

// ✅ BIEN
@Input() variant: UiBadgeVariant = 'info';
```

### ❌ Error 3: Olvidar Exportar

```typescript
// ❌ MAL: No exportado en index.ts

// ✅ BIEN: Exportado
// shared/ui/index.ts
export * from './primitives/badge/ui-badge.component';
export * from './primitives/badge/ui-badge.types';
```

---

## 📚 Referencias

- [Coding Conventions](Coding-Conventions.md)
- [Folder Structure](Folder-Structure.md)
- [Immutable Principles](Immutable-Principles.md)

---

## 🔄 Changelog

### v1.0 (2026-01-23)
- ✅ Template inicial con todas las reglas enterprise
- ✅ Estructura de 5 archivos
- ✅ Host bindings múltiples (best practice)
- ✅ Outputs tipados
- ✅ Tests completos
- ✅ Checklist de validación

---

**Última actualización**: 2026-01-23  
**Mantenido por**: Architecture Team  
**Estado**: ✅ Official - Ready to Use
