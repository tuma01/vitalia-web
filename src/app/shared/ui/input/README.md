# ui-input

**Tipo**: Componente Primitivo (PAL)  
**Versión**: 1.0  
**Estado**: ✅ Implementado

---

## ¿Qué problema resuelve?

`ui-input` es un **adaptador visual** que:

- ✅ Estandariza todos los inputs de texto
- ✅ Elimina el uso directo de `<input>` en features
- ✅ Garantiza coherencia visual y de comportamiento
- ✅ Desacopla features de implementación técnica

---

## ¿Qué NO hace?

- ❌ **NO valida**: La validación vive en el `FormControl`
- ❌ **NO transforma**: No formatea números, fechas, etc.
- ❌ **NO decide reglas de negocio**: Es un componente puro
- ❌ **NO renderiza labels ni errores**: Eso es responsabilidad de `ui-form-field`
- ❌ **NO conoce el dominio**: Es agnóstico del negocio

---

## Principios de Diseño

### 1. Semántica > Técnica

El desarrollador dice **qué intención tiene**, no **cómo se renderiza**.

```html
<!-- ✅ Semántico -->
<ui-input type="email" size="lg">

<!-- ❌ Técnico -->
<input type="email" style="height: 48px">
```

### 2. Control Mínimo

`ui-input` es un **adaptador**, no un componente inteligente.

### 3. Composición

Vive **dentro** de `ui-form-field`, no reemplaza al form-field.

---

## API Pública

### Inputs

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `type` | `UiInputType` | `'text'` | Tipo semántico del input |
| `placeholder` | `string` | `''` | Texto guía |
| `size` | `UiInputSize` | `'md'` | Densidad visual |
| `disabled` | `boolean` | `false` | Deshabilita interacción |
| `readonly` | `boolean` | `false` | Solo lectura |
| `autocomplete` | `'on' \| 'off'` | `'off'` | UX / seguridad |
| `maxlength` | `number` | - | Longitud máxima |

### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `blur` | `FocusEvent` | Emitido al perder foco |
| `focus` | `FocusEvent` | Emitido al ganar foco |
| `enter` | `KeyboardEvent` | Emitido al presionar Enter |

---

## Tipos

```typescript
export type UiInputType = 
  | 'text'      // Texto general
  | 'email'     // Email
  | 'password'  // Contraseña
  | 'number'    // Número
  | 'search';   // Búsqueda

export type UiInputSize = 
  | 'sm'   // 32px altura
  | 'md'   // 40px altura (default)
  | 'lg';  // 48px altura
```

---

## Integración con Angular Forms

### Reactive Forms (Recomendado)

```typescript
// component.ts
form = this.fb.group({
  email: ['', [Validators.required, Validators.email]]
});
```

```html
<!-- template.html -->
<ui-form-field label="Email" [error]="getError('email')">
  <ui-input 
    type="email" 
    placeholder="usuario@empresa.com"
    formControlName="email">
  </ui-input>
</ui-form-field>
```

### Template-driven Forms (Legacy)

```html
<ui-form-field label="Nombre">
  <ui-input 
    type="text" 
    [(ngModel)]="nombre"
    name="nombre">
  </ui-input>
</ui-form-field>
```

---

## Ejemplos de Uso

### Básico

```html
<ui-form-field label="Email">
  <ui-input
    type="email"
    placeholder="usuario@empresa.com"
    formControlName="email">
  </ui-input>
</ui-form-field>
```

### Con Tamaño

```html
<ui-form-field label="Búsqueda" size="lg">
  <ui-input
    type="search"
    size="lg"
    placeholder="Buscar pacientes..."
    formControlName="search">
  </ui-input>
</ui-form-field>
```

### Con Eventos

```html
<ui-form-field label="Código">
  <ui-input
    type="text"
    formControlName="code"
    (enter)="onSubmit()"
    (blur)="onBlur()">
  </ui-input>
</ui-form-field>
```

### Readonly

```html
<ui-form-field label="ID">
  <ui-input
    type="text"
    [value]="patient.id"
    readonly>
  </ui-input>
</ui-form-field>
```

---

## Uso Incorrecto (Prohibido)

### ❌ Input Directo

```html
<!-- ❌ PROHIBIDO -->
<input type="email" placeholder="Email">
```

### ❌ Material Directo

```html
<!-- ❌ PROHIBIDO -->
<input matInput type="email" placeholder="Email">
```

### ❌ Estilos Inline

```html
<!-- ❌ PROHIBIDO -->
<ui-input style="width: 300px"></ui-input>
```

### ❌ Clases Custom

```html
<!-- ❌ PROHIBIDO -->
<ui-input class="my-custom-input"></ui-input>
```

---

## Tokens CSS Requeridos

`ui-input` consume los siguientes tokens del GDS:

```scss
--ui-input-bg
--ui-input-border
--ui-input-border-focus
--ui-input-text
--ui-input-placeholder
--ui-input-radius
--ui-input-height-sm
--ui-input-height-md
--ui-input-height-lg
```

**Fallbacks**: Si un token no existe, usa tokens genéricos (`--ui-bg-primary`, etc.)

---

## Testing

### Unit Tests

```typescript
it('should emit enter event on Enter key', () => {
  spyOn(component.enter, 'emit');
  
  const event = new KeyboardEvent('keydown', { key: 'Enter' });
  component.handleKeydown(event);
  
  expect(component.enter.emit).toHaveBeenCalledWith(event);
});
```

### E2E Tests

```typescript
it('should update form control value', () => {
  const input = page.locator('ui-input input');
  await input.fill('test@example.com');
  
  expect(await page.evaluate(() => form.get('email').value)).toBe('test@example.com');
});
```

---

## Contrato Visual

- **Altura**: Controlada por `size` (`sm`, `md`, `lg`)
- **Colores**: Controlados por tokens del GDS
- **Bordes**: Controlados por tokens del GDS
- **Focus**: Borde + sombra (tokens)
- **Disabled**: Opacidad + cursor
- **Readonly**: Background secundario

---

## Decisiones de Diseño

### ¿Por qué NO exponer `class` o `style`?

Para **prevenir overrides** que rompan la consistencia visual.

### ¿Por qué NO emitir `valueChange`?

El **estado vive en el FormControl**. No duplicamos responsabilidades.

### ¿Por qué solo 5 tipos?

**Scope controlado**. Tipos complejos (`date`, `file`) requieren componentes dedicados.

---

## Roadmap

### v1.0 (Actual)
- ✅ Tipos básicos (`text`, `email`, `password`, `number`, `search`)
- ✅ Sizes (`sm`, `md`, `lg`)
- ✅ ControlValueAccessor
- ✅ 100% tokens

### v1.1 (Futuro)
- [ ] `ui-input-number` (con spinners custom)
- [ ] `ui-input-date` (con datepicker)
- [ ] `ui-input-file` (con drag & drop)

---

## Referencias

- [Implementation Guide](../../../../Documentation/02-ARCHITECTURE/06-DESIGN-SYSTEM/Implementation-Guide.md)
- [Coding Conventions](../../../../Documentation/02-ARCHITECTURE/06-DESIGN-SYSTEM/Coding-Conventions.md)
- [ui-form-field](../form-field/README.md)

---

**Última actualización**: 2026-01-23  
**Mantenido por**: Frontend Team  
**Estado**: ✅ Production Ready
