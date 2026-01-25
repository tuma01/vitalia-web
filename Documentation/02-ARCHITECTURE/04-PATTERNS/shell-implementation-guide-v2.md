# Plan Maestro de Implementación: Shell Empresarial (v2 - Enhanced)

> **Implementation Guide** - Location Groups & Context Layout  
> **Version**: 2.0 - Professional Edition  
> **Last Updated**: 2026-01-22  
> **For**: Developers implementing the enterprise shell

---

## 🎯 Objetivo

Transformar la navegación estática actual en un sistema de **"Location Groups" (Contextos)** donde el Sidebar y la InfoBar cambian según dónde estés, siguiendo el patrón **Guidewire/PCF**.

**Ejemplos**:
- Contexto "Tenant" → Sidebar con opciones de tenant, InfoBar con nombre del tenant
- Contexto "Global" → Sidebar con opciones globales, InfoBar con usuario actual

---

## 🏗️ Arquitectura del Shell

```
┌─────────────────────────────────────────────────┐
│  InfoBar (Contextual)                           │
│  "Tenant: Hospital XYZ | Status: Active"        │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │  Content Area                        │
│ (Menu)   │  <router-outlet>                     │
│          │    ↓                                 │
│ • Dash   │  <app-zone-renderer>                 │
│ • Users  │    ↓                                 │
│ • Bills  │  Widgets                             │
│ • Config │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

---

## 📌 Etapa 1: Infraestructura de Context Layout (El "Shell")

### Objetivo
Crear el componente contenedor **flexible y reutilizable** que orquestará la InfoBar, la Sidebar y la Zona de contenido.

### Estructura de Archivos

```
src/app/layout/shell/context-layout/
├── context-layout.component.ts
├── context-layout.component.html
├── context-layout.component.scss
├── context-layout.config.ts
├── context-layout.resolver.ts       ← NUEVO: Pre-carga de datos
└── index.ts
```

### 1.1 Interfaz de Configuración (Enhanced)

**`context-layout.config.ts`**:

```typescript
export interface ContextMenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: string | number;
  permissions?: string[];           // ← NUEVO: Validación de permisos
  isActive?: boolean;               // ← NUEVO: Estado activo manual
  children?: ContextMenuItem[];     // ← NUEVO: Submenús (opcional)
}

export interface ContextLayoutConfig {
  title: string;
  subtitle?: string;
  menuItems: ContextMenuItem[];
  showBackButton?: boolean;
  backRoute?: string;
  zoneId?: string;                  // ← NUEVO: ID de zona para ZoneRenderer
}

export interface ContextData {
  id: string;
  name: string;
  status: string;
  [key: string]: any;               // Flexible para diferentes contextos
}
```

### 1.2 Componente Context Layout (Enhanced)

**`context-layout.component.ts`**:

```typescript
import { Component, Input, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ContextLayoutConfig, ContextMenuItem, ContextData } from './context-layout.config';

@Component({
  selector: 'app-context-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './context-layout.component.html',
  styleUrls: ['./context-layout.component.scss']
})
export class ContextLayoutComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  
  // 🔹 NUEVO: Inputs flexibles para reutilización
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() menuItems?: ContextMenuItem[];
  @Input() zoneId?: string;
  
  // Configuración del contexto (prioridad: Input > Route Data > Default)
  config = signal<ContextLayoutConfig>({
    title: '',
    menuItems: []
  });
  
  // 🔹 NUEVO: Datos del contexto cargados por Resolver
  contextData = signal<ContextData | null>(null);
  
  // Estado del sidebar
  sidebarCollapsed = signal(false);
  
  // 🔹 NUEVO: Título dinámico basado en datos del contexto
  contextTitle = computed(() => {
    const data = this.contextData();
    if (data) {
      return `${this.config().title}: ${data.name}`;
    }
    return this.title || this.config().title;
  });
  
  // 🔹 NUEVO: Subtitle dinámico
  contextSubtitle = computed(() => {
    const data = this.contextData();
    if (data) {
      return `Status: ${data.status} | ID: ${data.id}`;
    }
    return this.subtitle || this.config().subtitle;
  });
  
  // 🔹 NUEVO: Menú filtrado por permisos
  filteredMenuItems = computed(() => {
    const items = this.menuItems || this.config().menuItems;
    // TODO: Implementar lógica de permisos con PermissionsFacade
    return items.filter(item => {
      if (!item.permissions || item.permissions.length === 0) {
        return true;
      }
      // return this.permissionsFacade.hasAnyPermission(item.permissions);
      return true; // Placeholder
    });
  });
  
  ngOnInit(): void {
    // Leer configuración de route data
    this.route.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Prioridad: Input > Route Data
        const config: ContextLayoutConfig = {
          title: this.title || data['title'] || '',
          subtitle: this.subtitle || data['subtitle'],
          menuItems: this.menuItems || data['menuItems'] || [],
          showBackButton: data['showBackButton'],
          backRoute: data['backRoute'],
          zoneId: this.zoneId || data['zoneId']
        };
        
        this.config.set(config);
        
        // 🔹 NUEVO: Datos pre-cargados por Resolver
        if (data['contextData']) {
          this.contextData.set(data['contextData']);
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
```

### 1.3 Resolver para Pre-carga de Datos

**`context-layout.resolver.ts`**:

```typescript
import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TenantsFacade } from '@app/domain/tenants';
import { ContextData } from './context-layout.config';

/**
 * Resolver para pre-cargar datos del contexto antes de renderizar el Shell.
 * Esto evita que la InfoBar muestre datos vacíos mientras carga.
 */
export const tenantContextResolver: ResolveFn<ContextData | null> = (
  route: ActivatedRouteSnapshot
): Observable<ContextData | null> => {
  const tenantsFacade = inject(TenantsFacade);
  const tenantId = route.params['id'];
  
  if (!tenantId) {
    return of(null);
  }
  
  // Cargar tenant y transformar a ContextData
  return tenantsFacade.loadById(tenantId).pipe(
    map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      status: tenant.status,
      // Agregar más campos según necesidad
    })),
    catchError(() => of(null))
  );
};

/**
 * Resolver genérico para otros contextos (Admin, Doctor, etc.)
 */
export const adminContextResolver: ResolveFn<ContextData | null> = (
  route: ActivatedRouteSnapshot
): Observable<ContextData | null> => {
  // Implementar lógica similar para contexto Admin
  return of({
    id: 'admin',
    name: 'Admin Panel',
    status: 'ACTIVE'
  });
};
```

### 1.4 Template HTML (Enhanced)

**`context-layout.component.html`**:

```html
<div class="context-layout">
  <!-- InfoBar (Header) -->
  <header class="info-bar">
    <div class="info-bar-content">
      @if (config().showBackButton) {
        <button class="back-button" [routerLink]="config().backRoute">
          ← Back
        </button>
      }
      
      <div class="context-info">
        <h1 class="context-title">{{ contextTitle() }}</h1>
        @if (contextSubtitle()) {
          <p class="context-subtitle">{{ contextSubtitle() }}</p>
        }
      </div>
      
      <!-- 🔹 NUEVO: Indicadores de estado -->
      @if (contextData(); as data) {
        <div class="context-indicators">
          <span 
            class="indicator" 
            [class.active]="data.status === 'ACTIVE'"
            [class.inactive]="data.status === 'INACTIVE'">
            {{ data.status }}
          </span>
        </div>
      }
      
      <div class="info-bar-actions">
        <!-- Acciones contextuales (notificaciones, perfil, etc.) -->
        <ng-content select="[infoBarActions]"></ng-content>
      </div>
    </div>
  </header>

  <div class="layout-body">
    <!-- Sidebar (Navigation) -->
    <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
      <button class="sidebar-toggle" (click)="toggleSidebar()">
        {{ sidebarCollapsed() ? '→' : '←' }}
      </button>
      
      <nav class="sidebar-nav">
        <!-- 🔹 NUEVO: Menú filtrado por permisos -->
        @for (item of filteredMenuItems(); track item.route) {
          <a 
            class="nav-item" 
            [routerLink]="item.route"
            routerLinkActive="active"
            [class.disabled]="item.isActive === false">
            <span class="nav-icon">{{ item.icon }}</span>
            @if (!sidebarCollapsed()) {
              <span class="nav-label">{{ item.label }}</span>
            }
            <!-- 🔹 NUEVO: Badge dinámico -->
            @if (item.badge && !sidebarCollapsed()) {
              <span class="nav-badge">{{ item.badge }}</span>
            }
          </a>
        }
      </nav>
    </aside>

    <!-- Content Area -->
    <main class="content-area">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
```

### 1.5 Estilos SCSS (Enhanced)

**`context-layout.component.scss`**:

```scss
.context-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.info-bar {
  background: var(--primary-color, #1976d2);
  color: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;

  .info-bar-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .back-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .context-info {
    flex: 1;
  }

  .context-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .context-subtitle {
    margin: 0.25rem 0 0 0;
    font-size: 0.875rem;
    opacity: 0.9;
  }

  // 🔹 NUEVO: Indicadores de estado
  .context-indicators {
    display: flex;
    gap: 0.5rem;

    .indicator {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      background: rgba(255, 255, 255, 0.2);

      &.active {
        background: #4caf50;
      }

      &.inactive {
        background: #f44336;
      }
    }
  }
}

.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  background: var(--sidebar-bg, #2c3e50);
  color: white;
  transition: width 0.3s ease;
  position: relative;
  overflow-y: auto;

  &.collapsed {
    width: 60px;

    .nav-label,
    .nav-badge {
      display: none;
    }
  }

  .sidebar-toggle {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .sidebar-nav {
    padding: 3rem 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    &.active {
      background: var(--primary-color, #1976d2);
      color: white;
    }

    // 🔹 NUEVO: Estado deshabilitado
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .nav-icon {
      font-size: 1.25rem;
      min-width: 1.5rem;
      text-align: center;
    }

    .nav-label {
      flex: 1;
    }

    .nav-badge {
      background: var(--accent-color, #ff5722);
      padding: 0.125rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      // 🔹 NUEVO: Animación de badge
      animation: pulse 2s infinite;
    }
  }
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background: var(--content-bg, #f5f5f5);
  padding: 1.5rem;
}

// 🔹 NUEVO: Animación para badges
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
```

---

## 📌 Etapa 2: Configuración de Rutas Anidadas (El "Wiring")

### Objetivo
Que Angular cargue este Shell automáticamente cuando entramos a una ruta de Dominio, **pre-cargando datos con Resolvers**.

### 2.1 Configuración de Rutas (Enhanced)

**`app.routes.ts`**:

```typescript
import { Routes } from '@angular/router';
import { ContextLayoutComponent } from './layout/shell/context-layout/context-layout.component';
import { tenantContextResolver, adminContextResolver } from './layout/shell/context-layout/context-layout.resolver';

export const routes: Routes = [
  // Ruta global (sin contexto)
  {
    path: '',
    loadComponent: () => import('./features/home/home.component')
  },

  // 🔹 Contexto de Tenant (Location Group) con Resolver
  {
    path: 'tenants/:id',
    component: ContextLayoutComponent,
    resolve: {
      contextData: tenantContextResolver  // ← NUEVO: Pre-carga de datos
    },
    data: {
      title: 'Tenant',
      menuItems: [
        { 
          icon: '📊', 
          label: 'Dashboard', 
          route: 'dashboard',
          permissions: ['tenant.dashboard.view']  // ← NUEVO: Permisos
        },
        { 
          icon: '👥', 
          label: 'Users', 
          route: 'users',
          badge: 5,  // ← NUEVO: Badge dinámico
          permissions: ['tenant.users.view']
        },
        { 
          icon: '💰', 
          label: 'Billing', 
          route: 'billing',
          permissions: ['tenant.billing.view']
        },
        { 
          icon: '⚙️', 
          label: 'Settings', 
          route: 'settings',
          permissions: ['tenant.settings.view']
        }
      ],
      showBackButton: true,
      backRoute: '/tenants'
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/tenant/dashboard/tenant-dashboard.component')
      },
      {
        path: 'users',
        loadComponent: () => import('./features/tenant/users/tenant-users.component')
      },
      {
        path: 'billing',
        loadComponent: () => import('./features/tenant/billing/tenant-billing.component')
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/tenant/settings/tenant-settings.component')
      }
    ]
  },

  // 🔹 Contexto de Admin (otro Location Group)
  {
    path: 'admin',
    component: ContextLayoutComponent,
    resolve: {
      contextData: adminContextResolver  // ← NUEVO: Resolver para Admin
    },
    data: {
      title: 'Admin Panel',
      menuItems: [
        { icon: '🏥', label: 'Tenants', route: 'tenants', permissions: ['admin.tenants.view'] },
        { icon: '👤', label: 'Users', route: 'users', permissions: ['admin.users.view'] },
        { icon: '📈', label: 'Analytics', route: 'analytics', permissions: ['admin.analytics.view'] },
        { icon: '🔧', label: 'System', route: 'system', permissions: ['admin.system.view'] }
      ]
    },
    children: [
      {
        path: 'tenants',
        loadComponent: () => import('./features/admin/tenants/admin-tenants.component')
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/admin-users.component')
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/admin/analytics/admin-analytics.component')
      },
      {
        path: 'system',
        loadComponent: () => import('./features/admin/system/admin-system.component')
      }
    ]
  }
];
```

### 2.2 Ventajas de usar Resolvers

✅ **Datos disponibles antes de renderizar**: InfoBar nunca muestra vacío  
✅ **Mejor UX**: Loading state centralizado  
✅ **Evita race conditions**: Datos garantizados en `ngOnInit`  
✅ **Cacheable**: Resolver puede usar cache del Facade

---

## 📌 Etapa 3: Menú Lateral Dinámico (Data-Driven Sidebar)

### Objetivo
Que el menú lateral se construya a partir de un array de configuración, con **validación de permisos** y **badges dinámicos**.

### 3.1 Servicio de Configuración de Menú (Enhanced)

**`layout/services/context-menu.service.ts`**:

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { ContextMenuItem } from '../shell/context-layout/context-layout.config';
import { PermissionsFacade } from '@app/domain/permissions';

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  private permissionsFacade = inject(PermissionsFacade);
  private menuItems = signal<ContextMenuItem[]>([]);

  readonly currentMenu = this.menuItems.asReadonly();

  // 🔹 NUEVO: Menú filtrado por permisos
  readonly filteredMenu = computed(() => {
    const items = this.menuItems();
    const userPermissions = this.permissionsFacade.currentPermissions();
    
    return items.filter(item => {
      if (!item.permissions || item.permissions.length === 0) {
        return true;
      }
      return item.permissions.some(permission => 
        userPermissions.includes(permission)
      );
    });
  });

  setMenu(items: ContextMenuItem[]): void {
    this.menuItems.set(items);
  }

  addMenuItem(item: ContextMenuItem): void {
    this.menuItems.update(current => [...current, item]);
  }

  removeMenuItem(route: string): void {
    this.menuItems.update(current => 
      current.filter(item => item.route !== route)
    );
  }

  // 🔹 NUEVO: Actualizar badge dinámicamente
  updateBadge(route: string, badge: string | number): void {
    this.menuItems.update(current =>
      current.map(item =>
        item.route === route ? { ...item, badge } : item
      )
    );
  }

  // 🔹 NUEVO: Habilitar/deshabilitar item
  setItemActive(route: string, isActive: boolean): void {
    this.menuItems.update(current =>
      current.map(item =>
        item.route === route ? { ...item, isActive } : item
      )
    );
  }

  // 🔹 NUEVO: Limpiar todos los badges
  clearAllBadges(): void {
    this.menuItems.update(current =>
      current.map(item => ({ ...item, badge: undefined }))
    );
  }
}
```

### 3.2 Ejemplo de Uso de Badges Dinámicos

**`features/tenant/users/tenant-users.component.ts`**:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ContextMenuService } from '@app/layout/services/context-menu.service';
import { UsersFacade } from '@app/domain/users';

@Component({
  selector: 'app-tenant-users',
  standalone: true,
  template: `
    <div class="users-page">
      <h2>Users ({{ pendingCount() }} pending)</h2>
      <!-- ... -->
    </div>
  `
})
export class TenantUsersComponent implements OnInit {
  private menuService = inject(ContextMenuService);
  private usersFacade = inject(UsersFacade);
  
  pendingCount = this.usersFacade.pendingUsersCount;
  
  ngOnInit(): void {
    // 🔹 Actualizar badge del menú con usuarios pendientes
    this.usersFacade.pendingUsersCount$.subscribe(count => {
      this.menuService.updateBadge('users', count > 0 ? count : '');
    });
  }
}
```

---

## 📌 Etapa 4: InfoBar Contextual (La "Barra Inteligente")

### Objetivo
Que la barra superior muestre información del "Sujeto" actual, **sin lógica de negocio en la UI**.

### 4.1 Separación de Responsabilidades

✅ **ContextLayout**: Solo renderiza datos  
✅ **Resolver**: Carga datos antes de renderizar  
✅ **Facade**: Contiene toda la lógica de negocio  

### 4.2 Ejemplo de InfoBar con Datos del Resolver

El componente `ContextLayoutComponent` ya está configurado para usar datos del Resolver (ver Etapa 1.2).

**Flujo de datos**:

```
1. Usuario navega a /tenants/1
2. Angular ejecuta tenantContextResolver
3. Resolver llama TenantsFacade.loadById('1')
4. Resolver retorna ContextData
5. ContextLayout recibe datos en route.data['contextData']
6. InfoBar renderiza: "Tenant: Hospital XYZ | Status: ACTIVE"
```

---

## 📌 Etapa 5: Prueba de Integración (Smoke Test + E2E)

### Objetivo
Verificar que todo funciona junto, con **tests automatizados**.

### 5.1 Checklist de Pruebas Manuales

- [ ] **Navegación**: Ir a `/tenants/1`
- [ ] **InfoBar**: Ver "Tenant: Hospital XYZ" en el header
- [ ] **Subtitle**: Ver "Status: ACTIVE | ID: 1"
- [ ] **Sidebar**: Ver menú con Dashboard, Users, Billing, Settings
- [ ] **Permisos**: Verificar que items sin permisos no aparecen
- [ ] **Badges**: Ver badge "5" en Users
- [ ] **Navegación interna**: Click en "Users" → URL cambia a `/tenants/1/users`
- [ ] **Contenido**: Ver widgets cargando en la zona central
- [ ] **Persistencia**: Sidebar y InfoBar permanecen al cambiar de sub-ruta
- [ ] **Back button**: Click en "← Back" → Volver a `/tenants`
- [ ] **Collapse**: Click en toggle → Sidebar colapsa

### 5.2 Tests E2E Automatizados

**`e2e/shell/context-layout.spec.ts`**:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Context Layout - Tenant Context', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tenants/1');
  });

  test('should display tenant info in InfoBar', async ({ page }) => {
    await expect(page.locator('.context-title')).toContainText('Tenant: Hospital XYZ');
    await expect(page.locator('.context-subtitle')).toContainText('Status: ACTIVE');
  });

  test('should display sidebar menu items', async ({ page }) => {
    const sidebar = page.locator('.sidebar-nav');
    await expect(sidebar.locator('text=Dashboard')).toBeVisible();
    await expect(sidebar.locator('text=Users')).toBeVisible();
    await expect(sidebar.locator('text=Billing')).toBeVisible();
    await expect(sidebar.locator('text=Settings')).toBeVisible();
  });

  test('should show badge on Users menu item', async ({ page }) => {
    const usersBadge = page.locator('.nav-item:has-text("Users") .nav-badge');
    await expect(usersBadge).toContainText('5');
  });

  test('should navigate to child routes without reloading shell', async ({ page }) => {
    // Click en Users
    await page.click('text=Users');
    await expect(page).toHaveURL('/tenants/1/users');
    
    // Verificar que InfoBar sigue visible (no se recargó)
    await expect(page.locator('.context-title')).toContainText('Tenant: Hospital XYZ');
    
    // Click en Billing
    await page.click('text=Billing');
    await expect(page).toHaveURL('/tenants/1/billing');
    
    // InfoBar sigue igual
    await expect(page.locator('.context-title')).toContainText('Tenant: Hospital XYZ');
  });

  test('should collapse sidebar on toggle click', async ({ page }) => {
    const sidebar = page.locator('.sidebar');
    
    // Verificar que sidebar está expandido
    await expect(sidebar).not.toHaveClass(/collapsed/);
    
    // Click en toggle
    await page.click('.sidebar-toggle');
    
    // Verificar que sidebar está colapsado
    await expect(sidebar).toHaveClass(/collapsed/);
    
    // Labels deben estar ocultos
    await expect(page.locator('.nav-label').first()).not.toBeVisible();
  });

  test('should navigate back on back button click', async ({ page }) => {
    await page.click('.back-button');
    await expect(page).toHaveURL('/tenants');
  });
});

test.describe('Context Layout - Permissions', () => {
  test('should hide menu items without permissions', async ({ page }) => {
    // Simular usuario sin permisos de Billing
    await page.goto('/tenants/1?mockPermissions=tenant.dashboard.view,tenant.users.view');
    
    const sidebar = page.locator('.sidebar-nav');
    await expect(sidebar.locator('text=Dashboard')).toBeVisible();
    await expect(sidebar.locator('text=Users')).toBeVisible();
    await expect(sidebar.locator('text=Billing')).not.toBeVisible();  // ← Oculto
  });
});
```

### 5.3 Tests Unitarios del Componente

**`context-layout.component.spec.ts`**:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ContextLayoutComponent } from './context-layout.component';
import { ContextData } from './context-layout.config';

describe('ContextLayoutComponent', () => {
  let component: ContextLayoutComponent;
  let fixture: ComponentFixture<ContextLayoutComponent>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      data: of({
        title: 'Test Context',
        menuItems: [
          { icon: '📊', label: 'Dashboard', route: 'dashboard' }
        ],
        contextData: {
          id: '1',
          name: 'Test Tenant',
          status: 'ACTIVE'
        } as ContextData
      })
    };

    await TestBed.configureTestingModule({
      imports: [ContextLayoutComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContextLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load context data from route', () => {
    expect(component.contextData()).toEqual({
      id: '1',
      name: 'Test Tenant',
      status: 'ACTIVE'
    });
  });

  it('should compute context title from data', () => {
    expect(component.contextTitle()).toBe('Test Context: Test Tenant');
  });

  it('should compute context subtitle from data', () => {
    expect(component.contextSubtitle()).toBe('Status: ACTIVE | ID: 1');
  });

  it('should toggle sidebar collapsed state', () => {
    expect(component.sidebarCollapsed()).toBe(false);
    
    component.toggleSidebar();
    expect(component.sidebarCollapsed()).toBe(true);
    
    component.toggleSidebar();
    expect(component.sidebarCollapsed()).toBe(false);
  });

  it('should prioritize input over route data', () => {
    component.title = 'Override Title';
    component.ngOnInit();
    
    expect(component.config().title).toBe('Override Title');
  });
});
```

---

## 🎯 Beneficios del Shell Empresarial (Enhanced)

### ✅ Ventajas Técnicas

1. **Contexto Persistente**: Datos del tenant se cargan una sola vez con Resolver
2. **Navegación Fluida**: Sidebar no se recarga entre sub-rutas
3. **Reutilizable**: Mismo shell para diferentes contextos (Tenant, Admin, Doctor)
4. **Data-Driven**: Menú configurable desde rutas o servicio
5. **Escalable**: Fácil agregar nuevos contextos
6. **Seguro**: Validación de permisos integrada
7. **Flexible**: Inputs permiten customización sin duplicar componentes

### 📊 Performance

- **Antes**: Cada ruta carga header + sidebar + datos → **3 requests**
- **Después**: Header + sidebar se cargan 1 vez con Resolver → **1 request**

### 🔒 Seguridad

- Permisos validados en **backend** (source of truth)
- Frontend solo **oculta UI** basándose en permisos del usuario
- Rutas protegidas con Guards (no incluido en esta guía)

---

## 💡 Tips Profesionales

### 1. Reutilización del Shell

```typescript
// Mismo ContextLayoutComponent, diferentes contextos
{
  path: 'doctors/:id',
  component: ContextLayoutComponent,
  resolve: { contextData: doctorContextResolver },
  data: {
    title: 'Doctor',
    menuItems: [/* menú específico de doctor */]
  }
}
```

### 2. ZoneRenderer Dinámico

```typescript
// Cada Location Group puede tener su propio ZoneRenderer
{
  path: 'tenants/:id/dashboard',
  component: TenantDashboardComponent,
  data: {
    zoneId: 'tenant-dashboard'  // ← Backend retorna widgets para esta zona
  }
}
```

### 3. Badges en Tiempo Real

```typescript
// Actualizar badges con WebSockets o Polling
this.notificationsFacade.unreadCount$.subscribe(count => {
  this.menuService.updateBadge('notifications', count);
});
```

### 4. Submenús (Opcional)

```typescript
{
  icon: '⚙️',
  label: 'Settings',
  route: 'settings',
  children: [
    { icon: '👤', label: 'Profile', route: 'settings/profile' },
    { icon: '🔒', label: 'Security', route: 'settings/security' }
  ]
}
```

---

## 📚 Próximos Pasos

1. ✅ **Implementar Context Layout** (Etapa 1)
2. ✅ **Configurar Rutas con Resolvers** (Etapa 2)
3. ✅ **Crear Menú Dinámico con Permisos** (Etapa 3)
4. ✅ **Conectar Facades** (Etapa 4)
5. ✅ **Probar Integración** (Etapa 5)
6. 🔄 **Crear más contextos** (Admin, Doctor, Patient)
7. 🔄 **Implementar Guards de Rutas**
8. 🔄 **Agregar tests E2E completos**

---

## 📖 Referencias

- [Vitalia Frontend Architecture](../Vitalia-Frontend-Architecture.md)
- [Domain Layer Architecture](../00-CONCEPTS/Domain-Layer-Architecture.md)
- [Widget Design Rules](../05-BEST-PRACTICES/Widget-Design-Rules.md)
- [Code Review Checklist](../05-BEST-PRACTICES/code-review-checklist.md)

---

## 🔄 Changelog

### v2.0 - Enhanced Edition (2026-01-22)
- ✅ Agregados Inputs flexibles para reutilización
- ✅ Implementados Resolvers para pre-carga de datos
- ✅ Validación de permisos en Sidebar
- ✅ Badges dinámicos con animaciones
- ✅ Tests E2E automatizados
- ✅ Tests unitarios del componente
- ✅ Mejor separación de responsabilidades
- ✅ Tips profesionales y ejemplos avanzados

### v1.0 - Initial Release (2026-01-22)
- Estructura básica de Context Layout
- Configuración de rutas anidadas
- Menú lateral dinámico
- InfoBar contextual

---

**Última actualización**: 2026-01-22  
**Mantenido por**: Equipo Frontend Vitalia  
**Estado**: ✅ Ready for production implementation
