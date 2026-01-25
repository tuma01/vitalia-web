# PAL & GDS Guidelines

Bienvenido a la capa de **Interfaz de Usuario Compartida (PAL)** de Vitalia.
Esta carpeta contiene los bloques constructivos visuales de la aplicación.

## 🛡 Reglas de Oro (Architectural Enforcement)

Para mantener la integridad del sistema de diseño y la arquitectura hexagonal:

1.  **PROHIBIDO usar Material directamente en Features**:
    *   ❌ `import { MatButtonModule } ...` en `features/` o `widgets/`.
    *   ✅ Usa `import { UiButtonComponent } from '@ui';`.

2.  **Usar siempre los componentes `ui-*`**:
    *   Los componentes aquí ya tienen aplicados los tokens de diseño, accesibilidad y comportamiento estándar.

3.  **Verificar Tokens**:
    *   Si necesitas espaciado, colores o tamaños, usa las variables CSS `--ui-*`.
    *   Nunca hardcodees pixeles o colores hex.

4.  **Cambios en PAL**:
    *   Si un componente necesita una nueva variante, agrégala aquí (`shared/ui`). No la hackees en la feature.

## Catálogo de Componentes

*   [**ui-button**](./primitives/button/README.md): Botones de acción.
*   [**ui-input**](./primitives/input/README.md): Entradas de texto.
*   [**ui-form-field**](./components/form-field/README.md): Wrappers semánticos para formularios.

> Para ver estos componentes en acción, revisa la ruta `/pilot` (PilotFormComponent).
