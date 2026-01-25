# Plan Maestro de Implementación: Shell Empresarial

> **Implementation Guide** - Location Groups & Context Layout  
> **Last Updated**: 2026-01-22  
> **For**: Developers implementing the enterprise shell

---

## Objetivo

Transformar la navegación estática actual en un sistema de **"Location Groups" (Contextos)** donde el Sidebar y la InfoBar cambian según dónde estés.

**Ejemplos**:
- Contexto "Tenant" → Sidebar con opciones de tenant, InfoBar con nombre del tenant
- Contexto "Global" → Sidebar con opciones globales, InfoBar con usuario actual

---

## Arquitectura del Shell

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
Crear el componente contenedor que orquestará la InfoBar, la Sidebar y la Zona de contenido.

### Estructura de Archivos

```
src/app/layout/shell/context-layout/
├── context-layout.component.ts
├── context-layout.component.html
├── context-layout.component.scss
├── context-layout.config.ts
└── index.ts
```

### 1.1 Interfaz de Configuración

**`context-layout.config.ts`**:

```typescript
export interface ContextMenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: string | number;
}

export interface ContextLayoutConfig {
  title: string;
  subtitle?: string;
  menuItems: ContextMenuItem[];
  showBackButton?: boolean;
  backRoute?: string;
}
```

### 1.2 Componente Context Layout

**`context-layout.component.ts`**:

```typescript
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-context-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './context-layout.component.html',
  styleUrls: ['./context-layout.component.scss']
})
export class ContextLayoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  // Configuración del contexto
  config = signal<ContextLayoutConfig>({
    title: '',
    menuItems: []
  });
  
  // Estado del sidebar
  sidebarCollapsed = signal(false);
  
  ngOnInit() {
    // La configuración se puede pasar por route data
    this.route.data.subscribe(data => {
      if (data['contextConfig']) {
        this.config.set(data['contextConfig']);
      }
    });
  }
  
  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }
}
```

### 1.3 Template HTML

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
        <h1 class="context-title">{{ config().title }}</h1>
        @if (config().subtitle) {
          <p class="context-subtitle">{{ config().subtitle }}</p>
        }
      </div>
      
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
        @for (item of config().menuItems; track item.route) {
          <a 
            class="nav-item" 
            [routerLink]="item.route"
            routerLinkActive="active">
            <span class="nav-icon">{{ item.icon }}</span>
            @if (!sidebarCollapsed()) {
              <span class="nav-label">{{ item.label }}</span>
            }
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

### 1.4 Estilos SCSS

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
    }
  }
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background: var(--content-bg, #f5f5f5);
  padding: 1.5rem;
}
```

---

## 📌 Etapa 2: Configuración de Rutas Anidadas (El "Wiring")

### Objetivo
Que Angular cargue este Shell automáticamente cuando entramos a una ruta de Dominio (ej. `/tenants/:id`).

### 2.1 Configuración de Rutas

**`app.routes.ts`**:

```typescript
import { Routes } from '@angular/router';
import { ContextLayoutComponent } from './layout/shell/context-layout/context-layout.component';

export const routes: Routes = [
  // Ruta global (sin contexto)
  {
    path: '',
    loadComponent: () => import('./features/home/home.component')
  },

  // Contexto de Tenant (Location Group)
  {
    path: 'tenants/:id',
    component: ContextLayoutComponent,
    data: {
      contextConfig: {
        title: 'Tenant Context',
        menuItems: [
          { icon: '📊', label: 'Dashboard', route: 'dashboard' },
          { icon: '👥', label: 'Users', route: 'users' },
          { icon: '💰', label: 'Billing', route: 'billing' },
          { icon: '⚙️', label: 'Settings', route: 'settings' }
        ],
        showBackButton: true,
        backRoute: '/tenants'
      }
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

  // Contexto de Admin (otro Location Group)
  {
    path: 'admin',
    component: ContextLayoutComponent,
    data: {
      contextConfig: {
        title: 'Admin Panel',
        menuItems: [
          { icon: '🏥', label: 'Tenants', route: 'tenants' },
          { icon: '👤', label: 'Users', route: 'users' },
          { icon: '📈', label: 'Analytics', route: 'analytics' },
          { icon: '🔧', label: 'System', route: 'system' }
        ]
      }
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

---

## 📌 Etapa 3: Menú Lateral Dinámico (Data-Driven Sidebar)

### Objetivo
Que el menú lateral se construya a partir de un array de configuración, no HTML hardcodeado.

### 3.1 Servicio de Configuración de Menú

**`layout/services/context-menu.service.ts`**:

```typescript
import { Injectable, signal } from '@angular/core';
import { ContextMenuItem } from '../shell/context-layout/context-layout.config';

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  private menuItems = signal<ContextMenuItem[]>([]);

  readonly currentMenu = this.menuItems.asReadonly();

  setMenu(items: ContextMenuItem[]) {
    this.menuItems.set(items);
  }

  addMenuItem(item: ContextMenuItem) {
    this.menuItems.update(current => [...current, item]);
  }

  removeMenuItem(route: string) {
    this.menuItems.update(current => 
      current.filter(item => item.route !== route)
    );
  }

  updateBadge(route: string, badge: string | number) {
    this.menuItems.update(current =>
      current.map(item =>
        item.route === route ? { ...item, badge } : item
      )
    );
  }
}
```

### 3.2 Componente de Nav Item (Shared)

**`shared/ui/nav-item/nav-item.component.ts`**:

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a 
      class="nav-item" 
      [routerLink]="route"
      routerLinkActive="active">
      <span class="nav-icon">{{ icon }}</span>
      <span class="nav-label">{{ label }}</span>
      @if (badge) {
        <span class="nav-badge">{{ badge }}</span>
      }
    </a>
  `,
  styles: [`
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
    }

    .nav-icon {
      font-size: 1.25rem;
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
    }
  `]
})
export class NavItemComponent {
  @Input() icon!: string;
  @Input() label!: string;
  @Input() route!: string;
  @Input() badge?: string | number;
}
```

---

## 📌 Etapa 4: InfoBar Contextual (La "Barra Inteligente")

### Objetivo
Que la barra superior muestre información del "Sujeto" actual (ej. Nombre del Tenant, Estado, ID).

### 4.1 Context Layout con Facade

**Actualizar `context-layout.component.ts`**:

```typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TenantsFacade } from '@app/domain/tenants';

@Component({
  selector: 'app-context-layout',
  standalone: true,
  // ... imports
})
export class ContextLayoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tenantsFacade = inject(TenantsFacade);
  
  // Configuración base
  config = signal<ContextLayoutConfig>({
    title: '',
    menuItems: []
  });
  
  // Datos del contexto actual
  contextData = computed(() => {
    const tenantId = this.route.snapshot.params['id'];
    if (tenantId) {
      return this.tenantsFacade.selectedTenant();
    }
    return null;
  });
  
  // Título dinámico basado en datos
  contextTitle = computed(() => {
    const tenant = this.contextData();
    if (tenant) {
      return `Tenant: ${tenant.name}`;
    }
    return this.config().title;
  });
  
  contextSubtitle = computed(() => {
    const tenant = this.contextData();
    if (tenant) {
      return `Status: ${tenant.status} | ID: ${tenant.id}`;
    }
    return this.config().subtitle;
  });
  
  ngOnInit() {
    // Cargar datos del contexto
    const tenantId = this.route.snapshot.params['id'];
    if (tenantId) {
      this.tenantsFacade.loadById(tenantId);
    }
    
    // Configurar menú
    this.route.data.subscribe(data => {
      if (data['contextConfig']) {
        this.config.set(data['contextConfig']);
      }
    });
  }
}
```

### 4.2 Template Actualizado

```html
<header class="info-bar">
  <div class="info-bar-content">
    <div class="context-info">
      <h1 class="context-title">{{ contextTitle() }}</h1>
      @if (contextSubtitle()) {
        <p class="context-subtitle">{{ contextSubtitle() }}</p>
      }
    </div>
    
    <!-- Indicadores de estado -->
    @if (contextData(); as tenant) {
      <div class="context-indicators">
        <span class="indicator" [class.active]="tenant.status === 'ACTIVE'">
          {{ tenant.status }}
        </span>
      </div>
    }
  </div>
</header>
```

---

## 📌 Etapa 5: Prueba de Integración (Smoke Test)

### Objetivo
Verificar que todo funciona junto.

### 5.1 Checklist de Pruebas

- [ ] **Navegación**: Ir a `/tenants/1`
- [ ] **InfoBar**: Ver "Tenant: Hospital XYZ" en el header
- [ ] **Subtitle**: Ver "Status: ACTIVE | ID: 1"
- [ ] **Sidebar**: Ver menú con Dashboard, Users, Billing, Settings
- [ ] **Navegación interna**: Click en "Users" → URL cambia a `/tenants/1/users`
- [ ] **Contenido**: Ver widgets cargando en la zona central
- [ ] **Persistencia**: Sidebar y InfoBar permanecen al cambiar de sub-ruta
- [ ] **Back button**: Click en "← Back" → Volver a `/tenants`

### 5.2 Componente de Prueba

**`features/tenant/dashboard/tenant-dashboard.component.ts`**:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <h2>Tenant Dashboard</h2>
      <app-zone-renderer zone="tenant-dashboard"></app-zone-renderer>
    </div>
  `
})
export class TenantDashboardComponent {}
```

### 5.3 Escenario de Prueba Completo

```typescript
// 1. Usuario navega a /tenants/1
// 2. Angular carga ContextLayoutComponent
// 3. ContextLayout carga TenantsFacade.loadById('1')
// 4. InfoBar muestra: "Tenant: Hospital XYZ | Status: ACTIVE"
// 5. Sidebar muestra menú de tenant
// 6. Content area renderiza TenantDashboardComponent
// 7. TenantDashboardComponent renderiza ZoneRenderer
// 8. ZoneRenderer carga widgets desde backend
// 9. Usuario click en "Users"
// 10. URL cambia a /tenants/1/users
// 11. InfoBar y Sidebar permanecen (NO se recargan)
// 12. Solo cambia el contenido del router-outlet
```

---

## Beneficios del Shell Empresarial

### ✅ Ventajas

1. **Contexto Persistente**: Datos del tenant se cargan una sola vez
2. **Navegación Fluida**: Sidebar no se recarga entre sub-rutas
3. **Reutilizable**: Mismo shell para diferentes contextos (Tenant, Admin, Doctor)
4. **Data-Driven**: Menú configurable desde rutas o servicio
5. **Escalable**: Fácil agregar nuevos contextos

### 📊 Performance

- **Antes**: Cada ruta carga header + sidebar + datos
- **Después**: Header + sidebar se cargan 1 vez, solo cambia contenido

---

## Próximos Pasos

1. **Implementar Context Layout** (Etapa 1)
2. **Configurar Rutas** (Etapa 2)
3. **Crear Nav Items** (Etapa 3)
4. **Conectar Facades** (Etapa 4)
5. **Probar Integración** (Etapa 5)
6. **Crear más contextos** (Admin, Doctor, Patient)

---

## Referencias

- [Vitalia Frontend Architecture](Vitalia-Frontend-Architecture.md)
- [Location Groups Pattern](04-PATTERNS/Location-Groups-Pattern.md)
- [Domain Layer Architecture](00-CONCEPTS/Domain-Layer-Architecture.md)

---

**Última actualización**: 2026-01-22  
**Mantenido por**: Equipo Frontend Vitalia  
**Estado**: Ready for implementation
