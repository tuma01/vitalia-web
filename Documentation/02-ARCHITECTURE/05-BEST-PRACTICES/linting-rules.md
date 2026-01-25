# Reglas de Linting & Enforcement (Blindaje de Arquitectura)

Para garantizar la mantenibilidad y consistencia del sistema Vitalia, aplicamos reglas estrictas mediante **ESLint**. Estas reglas bloquean violaciones arquitectónicas en tiempo de compilación.

## 🚫 1. Prohibido usar Angular Material en Features

**Regla**: `no-restricted-imports`
**Ámbito**: `src/app/features/**/*.ts`, `src/app/widgets/**/*.ts`

### ❌ Lo que está prohibido
Importar módulos de Angular Material directamente en las páginas o widgets.

```typescript
// features/login/login.component.ts
import { MatButtonModule } from '@angular/material/button'; // Error ❌
import { MatInputModule } from '@angular/material/input';   // Error ❌
```

**Mensaje de Error**:
> "❌ VIOLACIÓN DE ARQUITECTURA: No usar Material directamente en Features. Usa los componentes PAL de @shared/ui."

### ✅ Cómo solucionarlo
Usa siempre los componentes del **PAL (Physical Abstraction Layer)** ubicados en `shared/ui`.

```typescript
// features/login/login.component.ts
import { UiButtonComponent } from '@shared/ui/button';       // Correcto ✅
import { UiInputComponent } from '@shared/ui/input';         // Correcto ✅
```

## ❓ ¿Por qué existe esta regla?

1.  **Desacoplamiento**: Si mañana cambiamos Material por otra librería, solo tocamos `shared/ui`. Las features no se enteran.
2.  **Consistencia**: Obliga a usar nuestros componentes estandarizados (`ui-*`) que ya tienen los tokens GDS aplicados.
3.  **Mantenibilidad**: Evita "estilos zombies" o parches locales con `::ng-deep` sobre componentes de Material.

## 🔓 Excepciones

Solo los archivos dentro de `src/app/shared/ui/**/*` tienen permitido importar `@angular/material`. Ellos son los responsables de encapsular la librería de UI.

Si necesitas un componente de Material que aún no existe en PAL (ej. `MatDatepicker`), **no lo importes directo**. Crea primero el wrapper `ui-datepicker` en `shared/ui`.
