# Mapa Visual de Arquitectura Frontend Vitalia

> **Visual Reference** - Diagrama oficial de la arquitectura Widget-Domain  
> **Last Updated**: 2026-01-22  
> **For**: Onboarding, presentaciones, y referencia rápida

---

## Propósito

Este mapa visual resume toda la arquitectura Frontend de Vitalia en un solo diagrama:
- Capas y responsabilidades
- Flujo de datos
- Reglas DO/DON'T
- Relaciones entre componentes

---

## Diagrama de Arquitectura

```mermaid
flowchart TB
    %% ============================================
    %% CAPA 1: PAGES / ROUTES
    %% ============================================
    subgraph Layer1[" 📄 PAGES / ROUTES "]
        Pages["Page Component<br/>(Representa URL)"]
    end

    %% ============================================
    %% CAPA 2: LAYOUT & ZONES
    %% ============================================
    subgraph Layer2[" 🏗️ LAYOUT & ZONES "]
        ZoneRenderer["ZoneRenderer<br/>(Motor de composición)"]
        WidgetRegistry["Widget Registry<br/>(tipo → componente)"]
        UiLayoutService["UI Layout Service<br/>(Backend config)"]
    end

    %% ============================================
    %% CAPA 3: WIDGETS
    %% ============================================
    subgraph Layer3[" 🧩 WIDGETS (Smart Components) "]
        Widget1["Patient Stats Widget"]
        Widget2["Appointment List Widget"]
        Widget3["Billing Summary Widget"]
    end

    %% ============================================
    %% CAPA 4: DOMAIN
    %% ============================================
    subgraph Layer4[" 🧠 DOMAIN (Business Logic) "]
        Facade1["Patients Facade"]
        Facade2["Appointments Facade"]
        Facade3["Billing Facade"]
        
        subgraph DomainLayer["Domain Layer"]
            Store["Store<br/>(Signals)"]
            API["API<br/>(HTTP)"]
        end
    end

    %% ============================================
    %% CAPA 5: SHARED & CORE
    %% ============================================
    subgraph Layer5[" 🎨 SHARED UI (Dumb Components) "]
        SharedUI["Card, Button, Input<br/>DataGrid, Modal"]
    end

    subgraph Layer6[" ⚙️ CORE (Infrastructure) "]
        Core["Auth, Interceptors<br/>Guards, Logging"]
    end

    %% ============================================
    %% FLUJOS PRINCIPALES
    %% ============================================
    Pages -->|"1. Renderiza zona"| ZoneRenderer
    ZoneRenderer -->|"2. Obtiene config"| UiLayoutService
    UiLayoutService -->|"3. JSON config"| ZoneRenderer
    ZoneRenderer -->|"4. Mapea tipo"| WidgetRegistry
    WidgetRegistry -->|"5. Instancia"| Widget1
    WidgetRegistry -->|"5. Instancia"| Widget2
    WidgetRegistry -->|"5. Instancia"| Widget3
    
    Widget1 -->|"6. Inyecta"| Facade1
    Widget2 -->|"6. Inyecta"| Facade2
    Widget3 -->|"6. Inyecta"| Facade3
    
    Facade1 -->|"7. Orquesta"| Store
    Facade1 -->|"7. Orquesta"| API
    Facade2 --> Store
    Facade2 --> API
    Facade3 --> Store
    Facade3 --> API
    
    Widget1 -.->|"Usa para UI"| SharedUI
    Widget2 -.-> SharedUI
    Widget3 -.-> SharedUI
    
    API -.->|"Usa"| Core

    %% ============================================
    %% REGLAS DO
    %% ============================================
    subgraph DO[" ✅ WIDGETS - DO "]
        DO1["✓ Reutilizable"]
        DO2["✓ Desacoplado"]
        DO3["✓ Configurable"]
        DO4["✓ Consume Facade"]
        DO5["✓ Usa Shared UI"]
        DO6["✓ Computed signals"]
    end

    %% ============================================
    %% REGLAS DON'T
    %% ============================================
    subgraph DONT[" ❌ WIDGETS - DON'T "]
        DONT1["✗ HTTP directo"]
        DONT2["✗ Router/Routes"]
        DONT3["✗ Lógica de negocio"]
        DONT4["✗ Múltiples Facades"]
        DONT5["✗ localStorage"]
        DONT6["✗ Conoce otras páginas"]
    end

    %% ============================================
    %% ESTILOS
    %% ============================================
    classDef pageStyle fill:#e1f5ff,stroke:#0288d1,stroke-width:2px
    classDef layoutStyle fill:#fff4e1,stroke:#f57c00,stroke-width:2px
    classDef widgetStyle fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef domainStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef sharedStyle fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef coreStyle fill:#e0e0e0,stroke:#616161,stroke-width:2px
    classDef doStyle fill:#e0ffe0,stroke:#2ca02c,stroke-width:2px
    classDef dontStyle fill:#ffe0e0,stroke:#d62728,stroke-width:2px

    class Pages pageStyle
    class ZoneRenderer,WidgetRegistry,UiLayoutService layoutStyle
    class Widget1,Widget2,Widget3 widgetStyle
    class Facade1,Facade2,Facade3,Store,API domainStyle
    class SharedUI sharedStyle
    class Core coreStyle
    class DO1,DO2,DO3,DO4,DO5,DO6 doStyle
    class DONT1,DONT2,DONT3,DONT4,DONT5,DONT6 dontStyle
```

---

## Explicación del Flujo

### 1️⃣ Page Component (📄)
- Representa una URL (`/admin/dashboard`)
- Renderiza `<app-zone-renderer zone="admin-dashboard">`
- **NO contiene lógica de negocio**

### 2️⃣ ZoneRenderer (🏗️)
- Motor de composición dinámica
- Obtiene configuración del `UiLayoutService`
- Instancia widgets según `WidgetRegistry`
- **NO decide permisos** (backend ya filtró)

### 3️⃣ Widgets (🧩)
- Smart Components configurables
- Inyectan **solo Facades**
- Usan `computed()` para estado derivado
- Renderizan con componentes `Shared UI`

### 4️⃣ Domain Facades (🧠)
- API pública del dominio
- Orquestan `Store` + `API`
- Previenen llamadas HTTP duplicadas
- **Nunca hacen HTTP directamente**

### 5️⃣ Domain Layer
- **Store**: Estado con Signals
- **API**: Llamadas HTTP
- Completamente desacoplado de UI

### 6️⃣ Shared UI (🎨)
- Componentes Dumb (presentacionales)
- Solo `@Input()` / `@Output()`
- **NO inyectan servicios**

### 7️⃣ Core (⚙️)
- Infraestructura singleton
- Auth, Interceptors, Guards
- **UI-agnostic**

---

## Flujo de Datos Completo

```
Usuario navega a /admin/dashboard
         ↓
Page Component renderiza <app-zone-renderer zone="admin-dashboard">
         ↓
ZoneRenderer llama UiLayoutService.getLayout('admin-dashboard')
         ↓
Backend retorna JSON: [{ type: 'patient-stats', config: {...} }]
         ↓
ZoneRenderer mapea 'patient-stats' → PatientStatsWidget (vía Registry)
         ↓
Widget se instancia con config
         ↓
Widget inyecta PatientsFacade
         ↓
Widget llama facade.loadAll()
         ↓
Facade orquesta PatientsApi.getAll() + PatientsStore.setPatients()
         ↓
Widget usa computed(() => facade.allPatients()) para renderizar
         ↓
Widget usa componentes Shared UI (Card, Button, etc.)
```

---

## Reglas Visuales

### ✅ DO (Verde)
- ✓ **Reutilizable**: Widget usado en múltiples zonas
- ✓ **Desacoplado**: No conoce rutas ni layouts
- ✓ **Configurable**: Recibe `WidgetConfig`
- ✓ **Consume Facade**: Única fuente de datos
- ✓ **Usa Shared UI**: Para presentación
- ✓ **Computed signals**: Para estado derivado

### ❌ DON'T (Rojo)
- ✗ **HTTP directo**: Usar Facade, no `HttpClient`
- ✗ **Router/Routes**: Widget no navega
- ✗ **Lógica de negocio**: Va en Domain
- ✗ **Múltiples Facades**: Un widget = un Facade
- ✗ **localStorage**: No persistencia local
- ✗ **Conoce otras páginas**: Totalmente aislado

---

## Ejemplo Concreto: Patient Stats Widget

```typescript
// ✅ CORRECTO
@Component({
  selector: 'app-patient-stats-widget',
  template: `
    <app-card>
      <h3>{{ config.title }}</h3>
      <p>{{ count() }}</p>
    </app-card>
  `
})
export class PatientStatsWidget {
  @Input() config!: PatientStatsConfig;
  
  private facade = inject(PatientsFacade);  // ✅ Facade
  
  readonly count = computed(() =>           // ✅ Computed
    this.facade.allPatients().length
  );
  
  ngOnInit() {
    this.facade.loadAll();                  // ✅ Facade method
  }
}
```

```typescript
// ❌ INCORRECTO
@Component({...})
export class PatientStatsWidget {
  private http = inject(HttpClient);        // ❌ HTTP directo
  private router = inject(Router);          // ❌ Router
  
  @Input() title!: string;                  // ❌ Múltiples inputs
  @Input() type!: string;
  
  ngOnInit() {
    this.http.get('/api/patients')          // ❌ HTTP directo
      .subscribe(data => {
        const count = data.length;          // ❌ Lógica de negocio
        localStorage.setItem('count', count); // ❌ localStorage
      });
  }
  
  navigate() {
    this.router.navigate(['/other']);       // ❌ Navegación
  }
}
```

---

## Capas y Responsabilidades

| Capa | Responsabilidad | Puede hacer | NO puede hacer |
|------|-----------------|-------------|----------------|
| **Pages** | Representar URL | Renderizar zonas | Lógica de negocio, HTTP |
| **ZoneRenderer** | Composición dinámica | Instanciar widgets | Decidir permisos, lógica |
| **Widgets** | UI configurable | Consumir Facades | HTTP, Router, negocio |
| **Facades** | API pública dominio | Orquestar Store+API | HTTP directo |
| **Store** | Estado (Signals) | Mutaciones de estado | HTTP |
| **API** | Llamadas HTTP | GET/POST/PUT/DELETE | Estado, lógica |
| **Shared UI** | Presentación | Renderizar | Inyectar servicios |
| **Core** | Infraestructura | Auth, logging | UI, negocio |

---

## Uso del Diagrama

### Para Onboarding
1. Mostrar el diagrama en la primera sesión
2. Explicar el flujo de arriba hacia abajo
3. Enfatizar reglas DO/DON'T

### Para Code Reviews
1. Verificar que el código sigue el flujo
2. Validar que no hay flechas "prohibidas"
3. Confirmar que widgets cumplen reglas verdes

### Para Presentaciones
1. Usar como slide principal de arquitectura
2. Explicar cada capa con ejemplos
3. Mostrar flujo completo con caso real

---

## Variantes del Diagrama

### Versión Simplificada (para ejecutivos)

```mermaid
flowchart TB
    Pages[Pages] --> Zones[Zones]
    Zones --> Widgets[Widgets]
    Widgets --> Domain[Domain]
    Domain --> Backend[Backend API]
    
    style Pages fill:#e1f5ff
    style Zones fill:#fff4e1
    style Widgets fill:#e8f5e9
    style Domain fill:#f3e5f5
```

### Versión Detallada (para arquitectos)

Ver diagrama completo arriba con todas las capas, flujos y reglas.

---

## Referencias

- [Vitalia Frontend Architecture](Vitalia-Frontend-Architecture.md)
- [ADR-003: Widget-Based Architecture](../04-ADR/ADR-003-Widget-Based-Architecture.md)
- [Widget Design Rules](05-BEST-PRACTICES/Widget-Design-Rules.md)
- [Domain Layer Architecture](00-CONCEPTS/Domain-Layer-Architecture.md)

---

## Exportar el Diagrama

### Para Wiki/Confluence
1. Copiar el código Mermaid
2. Usar plugin Mermaid
3. El diagrama se renderiza automáticamente

### Para Presentaciones
1. Usar [Mermaid Live Editor](https://mermaid.live)
2. Pegar el código
3. Exportar como PNG/SVG

### Para README.md
1. GitHub/GitLab renderizan Mermaid automáticamente
2. Solo incluir el bloque de código
3. Se verá interactivo

---

**Última actualización**: 2026-01-22  
**Mantenido por**: Equipo Frontend Vitalia  
**Formato**: Mermaid (compatible con GitHub, GitLab, Confluence)
