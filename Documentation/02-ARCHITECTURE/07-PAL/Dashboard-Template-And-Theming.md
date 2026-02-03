# Documentación Técnica: Dashboard Template & Sistema de Temas Global

## 1. Visión General (Strict PAL Policy)

Este documento detalla la arquitectura implementada para la plantilla del **Dashboard Administrativo** y el **Motor de Temas Global** de Vitalia.
Se ha establecido una política de **Tolerancia Cero** a dependencias directas de Angular Material en los componentes de Layout y Feature.

**Principio Fundamental:**
> Todo componente visual debe ser una primitiva PAL (`ui-button`, `ui-icon`, `ui-card`).
> Angular Material existe **solo** como motor de cálculo de estilos (SCSS) y lógica subyacente (CDK), no como componentes visuales en los templates de la aplicación.

---

## 2. Arquitectura de Temas Globales

Hemos migrado de un sistema de intercambio de archivos CSS (`assets/themes/*.css`) a una **Arquitectura de Clases Globales SCSS**. Esto soluciona la inestabilidad entre el Modo Oscuro y los Temas de Color.

### 2.1 Modelo Conceptual

El sistema separa estrictamente dos dimensiones ortogonales:
1.  **Layout Mode (El Lienzo):** Define el brillo base (Fondo Claro vs Fondo Oscuro).
2.  **Color Theme (La Pintura):** Define la paleta de acento (Primario/Secundario).

Los usuarios pueden combinar cualquier Layout con cualquier Color.
*   *Ejemplo:* **Dark Mode** + **Purple Theme** = Fondo Negro con Botones Violetas.

### 2.2 Implementación SCSS (`_themes.scss`)

Se utiliza la API **Material 2 (M2)** (`m2-define-palette`) compatible con Angular v18+.

```scss
// Definición de Clases Globales
@mixin register-theme($primary, $accent) {
  // Configura colores para Light Mode
  $light-config: mat.m2-define-light-theme(...);
  
  // Configura colores para Dark Mode
  $dark-config: mat.m2-define-dark-theme(...);

  // Aplica colores base
  @include mat.all-component-colors($light-config);

  // Si el body tiene .theme-dark, aplica colores oscuros
  &.theme-dark, .theme-dark & {
    @include mat.all-component-colors($dark-config);
  }
}

// Registro de Temas
.indigo-pink { @include register-theme($indigo, $pink); }
.purple-green { @include register-theme($purple, $green); }
// ...
```

### 2.3 ThemeService (`theme.service.ts`)

El servicio ya no carga archivos CSS. Su única función es gestionar las clases del `<body>`.

*   **Color Class:** `.indigo-pink`, `.purple-green`. (Gestionado por `setTheme`)
*   **Layout Class:** `.theme-light` o `.theme-dark`. (Gestionado por `SettingsService`)
*   **PAL Integration:** Inyecta automáticamente variables CSS globales para que los componentes PAL (que no usan Material internamente) reaccionen al tema:
    ```css
    --ui-color-primary: #hexValue;
    --ui-color-secondary: #hexValue;
    ```

---

## 3. Componentes de Layout (Dashboard)

El Layout Principal (`MainLayout`) orquesta la estructura.

### 3.1 Sidebar (`sidebar.ts` / `.html`)
*   **Migración:** Se eliminaron `mat-list`, `mat-icon` y `mat-expansion-panel`.
*   **Implementación PAL:**
    *   `<ui-expansion-panel>`: Maneja submenús con estado reactivo.
    *   `<ui-icon>`: Renderizado de iconos unificado.
    *   `[uiTooltip]`: Directiva PAL para tooltips.
*   **Estado:** Reactivo a `SidebarColor` ('light'/'dark') independiente del tema global.

### 3.2 Header (`header.ts` / `.html`)
*   **Migración:** Se eliminaron `mat-toolbar` y botones nativos.
*   **Implementación:**
    *   `<ui-toolbar>`: Contenedor estructural.
    *   `<ui-icon-button>`: Acciones (Notificaciones, Usuario).
*   **Flat Design:** Se eliminaron sombras excesivas (`elevation-0`) para un look moderno y limpio.

### 3.3 Settings Panel (`settings-panel.ts`)
Panel de control centralizado flotante.
*   **Handle (Pestaña):**
    *   Forma: Semicírculo izquierdo (`border-radius: 20px 0 0 20px`).
    *   Posición: `right: 0` (Flush al borde).
    *   Estilo: Color Primario dinámico (`var(--ui-color-primary)`), sin artefactos visuales internos.
*   **Lógica de Selección:**
    *   **Light Mode (Botón):** Resetea a Índigo + Layout Light.
    *   **Dark Mode (Botón):** Resetea a Índigo + Layout Dark.
    *   **Colores (Círculos):** Cambian SOLO la paleta de color, preservando el Layout actual.
    *   **Indicador:** Icono Check (`ui-icon`) blanco centrado con sombra para alta visibilidad.

### 3.4 Footer (`footer.component.ts`)
*   **Light Mode:** Fondo Gris Neutro (`#e5e5e5`) para evitar tintes azules no deseados.
*   **Dark Mode:** Fondo Standard Dark (`#1e1e1e`) coincidente con VS Code / Material Dark.

---

## 4. Guía para Desarrolladores

### Cómo añadir un nuevo componente al Dashboard
1.  **NO** importes `MatModule`.
2.  Busca el equivalente en `@ui` (ej. `UiButton`, `UiCard`).
3.  Si no existe, créalo en `shared/ui/primitives` usando SCSS puro o encapsulando CDK si es estrictamente necesario (ej. Dialogs), pero exponiendo una API limpia.

### Cómo depurar temas
Si un componente no cambia de color:
1.  Verifica que use `var(--ui-color-primary)` en su SCSS.
2.  Verifica que el `<body>` tenga la clase del tema (ej. `.purple-green`).
3.  Verifica que `ThemeService` tenga mapeado el color hexadecimal en `themeColors`.

---

**Estado Actual:**
*   **Compilación:** Limpia (Sin errores de Sass `mat.define-palette`).
*   **Consistencia:** 100% PAL en Layouts.
*   **Estabilidad:** Layout y Color desacoplados correctamente.
