# ui-form-field

Componente contenedor semántico para elementos de formulario (PAL). Estandariza la visualización de etiquetas, errores y textos de ayuda.

## Responsabilidad
- **Layout estándar**: Asegura una separación consistente entre label, input y mensajes.
- **Labels accesibles**: Renderiza etiquetas formales.
- **Mensajería**: Muestra errores de validación con animaciones o textos de ayuda (hints).
- **Flexibilidad**: Proyecta cualquier control (input, select, textarea) que use el atributo `control` o `#control`.

## No hace
- **Manejo de estado de formulario**: No contiene `FormGroup` ni `FormControl`. Solo recibe el error como string.
- **Estilo del input**: El input interno (`ui-input`) debe estilizarse a s&iacute; mismo. `ui-form-field` solo lo posiciona.

## Uso Básico

```html
<ui-form-field 
  label="Correo Electrónico" 
  hint="Tu correo corporativo" 
  [required]="true">
  
  <ui-input 
    #control 
    type="email" 
    placeholder="ejemplo@vitalia.com">
  </ui-input>
  
</ui-form-field>
```

## Uso con Error (Reactive Forms)

```html
<ui-form-field 
  label="Contraseña"
  [error]="form.controls.password.invalid && form.controls.password.touched ? 'Contraseña requerida' : null">
  
  <ui-input 
    #control 
    type="password" 
    [formControl]="form.controls.password">
  </ui-input>
  
</ui-form-field>
```

## API

| Input | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | `undefined` | Texto de la etiqueta. |
| `hint` | `string` | `undefined` | Texto de ayuda (se oculta si hay error). |
| `error` | `string \| null` | `null` | Mensaje de error (tiene prioridad sobre hint). |
| `required` | `boolean` | `false` | Muestra asterisco de obligatorio. |
| `hideLabel`| `boolean` | `false` | Oculta visualmente el label pero mantiene accesibilidad (si se usa aria-label en input). |

## Proyección
El contenido debe usar el selector `[control]` o ser referenciado (aunque el selector `select="[control]"` en e el ng-content es lo que manda).

```html
<ui-input #control ...></ui-input>
<!-- O simplemente asegúrate de usar componentes que encajen en el slot -->
```
