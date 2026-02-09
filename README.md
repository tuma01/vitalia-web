# VitaliaWeb

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.0-next.1.

## 🚀 Key Features & Updates

### 📱 Responsive- **Dashboard Engine**: Framework basado en configuración para paneles dinámicos. Revisar [docs/dashboard-framework.md](file:///f:/JAVA-PROJET/vitalia/workspace/vitalia-web/docs/dashboard-framework.md) para más detalles técnicos.
*   **Mobile & Tablet Support**: The dashboard sidebar automatically switches to a hidden "drawer" mode on screens smaller than **992px**.
*   **Push-on-Hover**: On desktop, hovering over the collapsed sidebar triggers a smooth content push animation instead of an overlay, ensuring content remains visible.
*   **Auto-Close**: Sidebar automatically closes on mobile navigation.

### 🌑 Dark Mode Enhancements
*   **Seamless Transitions**: Fixed background flashing issues during sidebar collapse/expand.
*   **Global Theme Sync**: The root body background now dynamically adapts to the selected theme (Light/Dark).

### 🔒 Authentication & UX
*   **Secure Login**: Implemented strict role validation to prevent unauthorized dashboard access.
*   **Loading States**: Login buttons disable during processing to prevent double-submission errors.
*   **Modern Alerts**: Replaced inline error messages with non-intrusive red `MatSnackBar` notifications.

---

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
