# Vitalia Web - AI Coding Assistant Instructions

## Project Overview

Vitalia is a multi-tenant hospital management system built with **Angular 21** using standalone components and modern Angular patterns. The application supports role-based access (SUPER_ADMIN, TENANT_ADMIN, DOCTOR, NURSE, EMPLOYEE, PATIENT) with tenant-specific theming and multi-language support (Spanish, English, French).

## Architecture Patterns

### Standalone Components (Angular 21+)
- **NO NgModules**: All components use `standalone: true` with explicit imports
- **Example**: [src/app/app.ts](../src/app/app.ts), [src/app/layout/sidebar/sidebar.ts](../src/app/layout/sidebar/sidebar.ts)
- Always include required Angular Material modules and CommonModule in component imports
- Use `imports: [CommonModule, RouterModule, MatListModule, ...]` in `@Component` decorator

### Dependency Injection
- Prefer `inject()` function over constructor injection in components/services
- Example: `private menuService = inject(MenuService);`
- Services use `@Injectable({ providedIn: 'root' })` for automatic tree-shaking

### Code Generation with ng-openapi-gen
- **NEVER manually edit files in [src/app/api/](../src/app/api/)** - all generated code
- Regenerate API layer after backend OpenAPI changes: `npm run gen-api`
- Backend URL: `http://localhost:8088/api/v1/v3/api-docs`
- Generated services: [src/app/api/services/](../src/app/api/services/) - Use these directly via dependency injection
- Generated models: [src/app/api/models/](../src/app/api/models/) - Import TypeScript interfaces for type safety

### Service Wrapper Pattern
When generated API services need additional functionality (token storage, routing, caching), create wrapper services in [src/app/core/services/](../src/app/core/services/):
- **AuthService** wraps `AuthenticationService` (adds token management, navigation)
- **TenantThemeService** wraps `ThemeControllerService` (adds dynamic CSS injection)
- Always inject the wrapper in components, not the generated service directly

## Multi-Tenancy & Authentication

### Authentication Flow
1. User selects role on login page (SUPER_ADMIN doesn't show tenant selector)
2. Backend returns `AuthenticationResponse` with `user.tenantCode` (or "GLOBAL" for SUPER_ADMIN)
3. [AuthService](../src/app/core/services/auth.service.ts) stores tokens + user data in localStorage
4. [authGuard](../src/app/core/guards/auth.guard.ts) protects routes, [roleGuard](../src/app/core/guards/role.guard.ts) for role-based access

### Tenant Theme Loading
- On app startup, [APP_INITIALIZER](../src/app/app.config.ts) triggers `TenantThemeService.loadThemeForTenant()`
- Theme loads from `GET /tenants/{tenantCode}/theme` (returns `ThemeDto`)
- CSS custom properties injected dynamically: `--primary-color`, `--accent-color`, `--font-family`, etc.
- If tenant has no theme, applies DEFAULT_THEME (see [tenant-theme.service.ts](../src/app/core/services/tenant-theme.service.ts))

### Role-Based Menus
- Menus are JSON files in [src/assets/menus/](../src/assets/menus/) (e.g., `tenant-admin-menu.json`, `doctor-menu.json`)
- [MenuService](../src/app/core/services/menu.service.ts) loads menus dynamically based on user role
- Menu items support nested children and i18n keys: `'menu.' + item.name | translate`

## Development Workflows

### Starting Development
```bash
npm run start      # ng serve on http://localhost:4200
npm run watch      # Development build with watch mode
npm run gen-api    # Regenerate API layer from backend OpenAPI spec
```

### Testing
- Test runner: **Vitest** (not Karma/Jasmine)
- Run tests: `npm run test`
- Test files: `*.spec.ts` alongside source files

### Angular CLI Conventions
- Component generation: `ng generate component features/auth/component-name`
- Style preference: **SCSS** (set in [angular.json](../angular.json))
- Prefix: `app` (all selectors should start with `app-`)

## Internationalization (i18n)

### Translation System
- Library: `@ngx-translate/core` with custom `WebpackTranslateLoader`
- Translation files: [src/assets/i18n/](../src/assets/i18n/) (`es-ES.json`, `en-US.json`, `fr-FR.json`)
- Default language: **es-ES** (Spanish)
- Usage in templates: `{{ 'menu.dashboard' | translate }}`
- Managed by [LanguageService](../src/app/core/services/language.service.ts) - auto-initializes, stores preference in localStorage

### Adding New Translations
1. Add key-value pairs to all JSON files in [src/assets/i18n/](../src/assets/i18n/)
2. Use nested keys for organization: `"menu": { "dashboard": "Panel de control" }`
3. Access in templates: `'menu.dashboard' | translate`

## Styling Architecture

### SCSS Structure
- Entry point: [src/styles.scss](../src/styles.scss) imports all partials
- Theme system: [src/styles/_themes.scss](../src/styles/_themes.scss) (Material Design 3 integration)
- Utilities: [src/styles/helpers/](../src/styles/helpers/) (flexbox, spacing, sizing, text utilities)
- Grid system: [src/styles/grid/](../src/styles/grid/) (Bootstrap-style responsive grid)
- Plugin overrides: [src/styles/plugins/](../src/styles/plugins/) (ngx-formly, ngx-toastr customizations)

### Layout Modes
- Theme toggle: Light/Dark mode managed by [ThemeService](../src/app/core/services/theme.service.ts)
- Applied via body classes: `body.light-mode`, `body.theme-dark`
- Tenant-specific colors override global theme via CSS custom properties

### Component Styles
- Always use SCSS for component styles (not CSS)
- Component-specific styles: `styleUrl: './component.scss'` (singular, not `styleUrls`)

## Routing & Guards

### Route Structure
- Public routes: `/login`, `/auth/login` (no guards)
- Protected routes: All routes under [MainLayout](../src/app/layout/main-layout/main-layout.ts) use `authGuard`
- Lazy loading: Use `loadChildren` for feature modules (currently commented out in [app.routes.ts](../src/app/app.routes.ts))

### Adding Protected Routes
```typescript
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_TENANT_ADMIN'] },
  loadChildren: () => import('./features/admin/admin.routes')
}
```

## Key Files Reference

| File | Purpose |
|------|---------|
| [src/app/app.config.ts](../src/app/app.config.ts) | Application bootstrap configuration (providers, APP_INITIALIZER) |
| [src/app/app.routes.ts](../src/app/app.routes.ts) | Main routing configuration with guards |
| [src/app/api/api-configuration.ts](../src/app/api/api-configuration.ts) | Backend API root URL (`http://localhost:8088/api/v1`) |
| [DOCS/Authentication-Flow-Plan.md](../DOCS/Authentication-Flow-Plan.md) | Detailed authentication architecture documentation |
| [package.json](../package.json) | Scripts, dependencies, Prettier config |

### Formatting
- Prettier enforced: `printWidth: 100`, `singleQuote: true`
- Angular HTML parser configured for templates
- Format on save recommended

### Naming Conventions
- Components: PascalCase without "Component" suffix (e.g., `export class Sidebar`, `export class LoginComponent` - both acceptable)
- Files: kebab-case (e.g., `sidebar.ts`, `auth.service.ts`)
- Services: Always suffix with `Service` (e.g., `AuthService`)
- Guards: Suffix with `guard` (lowercase) and use function syntax (e.g., `export const authGuard: CanActivateFn`)

### TypeScript
- Version: 5.9.2
- Enable strict mode
- Prefer readonly for properties that don't change
- Use signals where appropriate: `signal()`, `computed()`

## Common Patterns

### Service Initialization
Services like [LanguageService](../src/app/core/services/language.service.ts) and [ThemeService](../src/app/core/services/theme.service.ts) auto-initialize in their constructors - no manual init needed in App component except for async operations (handled by APP_INITIALIZER).

### State Management
- No NgRx/Akita: Use RxJS BehaviorSubject for shared state
- Example: `MenuService.currentMenu$`, `LanguageService.currentLanguage$`
- Subscribe in components, expose as `Observable` from services

### Error Handling
- Use RxJS `catchError` operator in services
- Provide user-friendly fallbacks (e.g., default theme if tenant theme fails)
- Log errors to console with context: `console.error('[ServiceName] Error:', error)`

## DO NOT

❌ Create NgModules - this is a standalone components project  
❌ Edit generated API code in [src/app/api/](../src/app/api/)  
❌ Use constructor injection when `inject()` is cleaner  
❌ Hardcode API URLs - use [ApiConfiguration](../src/app/api/api-configuration.ts)  
❌ Create custom form validators - use `@ngx-formly` patterns  
❌ Add translations only to one language file  

## Questions to Clarify

When encountering ambiguity:
1. Check [DOCS/](../DOCS/) for architecture decisions
2. Examine similar existing components/services for patterns
3. Verify backend API contract in OpenAPI spec before implementing
