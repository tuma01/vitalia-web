# ADR-004: UI Basada en Metadatos con Orquestación Backend

**Estado**: Accepted  
**Fecha**: 2026-01-22  
**Decisores**: Equipo Frontend Vitalia  
**Contexto del Sistema**: Vitalia Frontend (Angular, SaaS Multi-tenant)

---

## 1. Contexto

En un sistema SaaS multi-tenant como Vitalia, los requisitos de configuración de UI son complejos:

- **Tenant A** ve widgets de facturación, **Tenant B** no
- **Usuarios con rol Finance** ven widgets financieros, otros roles no
- Cambios frecuentes en la configuración de dashboards sin necesidad de deploy frontend
- Necesidad de personalización por tenant sin duplicar código

El enfoque tradicional de hardcodear la lógica de UI en el frontend presenta problemas:

```typescript
// ❌ Enfoque tradicional: lógica hardcoded
if (user.hasRole('FINANCE_ADMIN')) {
  widgets.push(BillingWidget);
}
if (tenant.features.includes('ADVANCED_ANALYTICS')) {
  widgets.push(AnalyticsWidget);
}
```

**Problemas**:
- Cada cambio de configuración requiere deploy frontend
- Lógica de permisos duplicada entre backend y frontend
- Difícil mantener consistencia entre tenants
- Testing complejo (muchas combinaciones de if/else)

---

## 2. Decisión

Se adopta un enfoque de **UI Basada en Metadatos** donde:

### 2.1 Backend como Orquestador de UI

El backend decide qué widgets mostrar basándose en:
- Tenant actual
- Permisos del usuario
- Features habilitadas
- Configuración personalizada

### 2.2 Frontend como Renderizador

El frontend:
- Solicita la configuración de una zona al backend
- Recibe un JSON con la lista de widgets a renderizar
- Instancia dinámicamente los widgets según la metadata
- **NO** contiene lógica de permisos o filtrado

### 2.3 Contrato de Configuración

```typescript
// GET /api/ui/layout?zone=admin-dashboard
{
  "zoneName": "admin-dashboard",
  "widgets": [
    {
      "type": "tenant-stats",
      "cols": 1,
      "config": { "metric": "active_tenants" }
    },
    {
      "type": "billing-summary",
      "cols": 2,
      "config": { "period": "monthly" }
    }
  ]
}
```

El backend ya filtró por permisos y tenant. El frontend solo renderiza.

---

## 3. Alternativas Consideradas

### 3.1 Configuración Frontend-Driven

**Descripción**:  
Mantener archivos de configuración JSON en el frontend que definen qué widgets mostrar.

**Motivos de descarte**:
- Requiere deploy para cambiar configuración
- No resuelve el problema multi-tenant
- Permisos siguen hardcoded en frontend
- Difícil sincronizar con backend

### 3.2 Feature Flags en Frontend

**Descripción**:  
Usar un sistema de feature flags (LaunchDarkly, etc.) para controlar visibilidad de widgets.

**Motivos de descarte**:
- No maneja configuración específica por tenant
- Complejidad adicional (otro servicio externo)
- No resuelve la personalización de dashboards
- Costo adicional de infraestructura

### 3.3 Configuración Híbrida (Frontend + Backend)

**Descripción**:  
Parte de la configuración en frontend, parte en backend.

**Motivos de descarte**:
- Confusión sobre dónde vive cada regla
- Duplicación de lógica
- Difícil de mantener y debuggear
- Inconsistencias inevitables

---

## 4. Consecuencias

### 4.1 Consecuencias Positivas

- ✅ **Zero-deploy UI changes**: Cambiar configuración sin deploy frontend
- ✅ **Tenant isolation**: Cada tenant ve su configuración específica
- ✅ **Centralized control**: Toda la lógica de permisos en un solo lugar (backend)
- ✅ **Simplified frontend**: Menos lógica condicional, más declarativo
- ✅ **Better testing**: Backend testea permisos, frontend testea rendering
- ✅ **Audit trail**: Backend puede loggear qué se mostró a quién

### 4.2 Costes / Trade-offs

- ⚠️ **Backend UI-aware**: Backend necesita conocer estructura de widgets
- ⚠️ **API versioning**: Cambios en contratos requieren versionado cuidadoso
- ⚠️ **Network dependency**: UI depende de llamada HTTP inicial
- ⚠️ **Caching complexity**: Necesidad de cache inteligente para performance
- ⚠️ **Debugging**: Más difícil debuggear "por qué no veo este widget"

### 4.3 Riesgos

- ❌ **Over-metadata**: Riesgo de querer hacer TODO dinámico (incluso cosas simples)
- ❌ **Backend bottleneck**: Backend se convierte en cuello de botella para cambios UI
- ❌ **Schema drift**: Frontend y backend pueden desincronizarse en contratos

**Mitigaciones**:
- No todo debe ser metadata-driven (formularios simples pueden ser estáticos)
- Contratos versionados y documentados
- Tests de integración entre frontend y backend
- Cache agresivo para reducir latencia

---

## 5. Guías de Implementación

### 5.1 Cuándo usar Metadata-Driven UI

✅ **Usar para**:
- Dashboards configurables
- Widgets que varían por tenant
- Features con permisos complejos
- Pantallas que cambian frecuentemente

❌ **NO usar para**:
- Formularios simples de login
- Páginas estáticas (about, terms)
- Componentes usados en un solo lugar
- UI que nunca cambia

### 5.2 Responsabilidades Claras

**Backend**:
- Filtrar widgets por tenant
- Validar permisos del usuario
- Retornar configuración JSON
- Loggear accesos

**Frontend**:
- Solicitar configuración
- Renderizar widgets dinámicamente
- Pasar config a widgets
- Manejar errores de rendering

**ZoneRenderer NO debe**:
- Validar permisos
- Filtrar widgets
- Conocer lógica de negocio

---

## 6. Estado y Evolución

Esta decisión se considera **aceptada** y será aplicada:

- Inicialmente en dashboards principales
- Expandida gradualmente a otras áreas
- Evaluada después de 3 meses de uso

**Criterios de éxito**:
- Reducción de deploys frontend para cambios de configuración
- Feedback positivo de equipos de producto
- Performance aceptable (<500ms para cargar configuración)

---

## 7. Referencias

- Metadata-Driven UI Patterns (Martin Fowler)
- Backend for Frontend (BFF) Pattern
- SAP Fiori Launchpad Architecture
- Salesforce Lightning App Builder
