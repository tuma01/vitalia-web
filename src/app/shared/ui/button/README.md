# ui-button

Botón base del sistema de diseño Vitalia ("Premium UI"). Consistente, accesible y rico en interacciones.

## Responsabilidad
- Renderizar botones con estilos consistentes y estados definidos.
- Manejar variantes (primary, secondary, outline, ghost, danger).
- Manejar tamaños (sm, md, lg, xl).
- Gestionar estado de carga (loading) y deshabilitado (disabled).
- Emitir eventos de interacción limpios.

## No hace
- **Manejar navegación**: No inyecta `Router`. Usa el evento `(clicked)` o envuelve en `<a>` si es necesario.
- **Gestionar permisos**: La visibilidad debe controlarse desde el padre.
- **Lógica de negocio**: No decide qué acción ejecutar.

## Uso

```html
<!-- Primario con loading state -->
<ui-button 
  variant="primary" 
  size="md" 
  [loading]="isSaving" 
  (clicked)="onSave()">
  Guardar Cambios
</ui-button>

<!-- Secundario Outline -->
<ui-button 
  variant="outline" 
  (clicked)="onCancel()">
  Cancelar
</ui-button>

<!-- Botón de peligro -->
<ui-button 
  variant="danger" 
  size="sm" 
  (clicked)="onDelete()">
  Eliminar
</ui-button>
```

## API

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Estilo visual del botón. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tamaño del botón. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo de botón HTML. |
| `disabled` | `boolean` | `false` | Deshabilita interacciones. |
| `loading` | `boolean` | `false` | Muestra spinner y bloquea clicks. |
| `fullWidth` | `boolean` | `false` | Ocupa el 100% del ancho disponible. |

| Output | Evento | Descripción |
|--------|--------|-------------|
| `clicked` | `MouseEvent` | Emite cuando el usuario hace click (si no está disabled/loading). |
