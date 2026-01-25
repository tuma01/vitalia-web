# ADR-003: Arquitectura Frontend basada en Widgets y Dominios

**Estado**: Accepted  
**Fecha**: 2026-01-22  
**Decisores**: Equipo Frontend Vitalia  
**Contexto del Sistema**: Vitalia Frontend (Angular, SaaS Multi-tenant)

---

## 1. Contexto

Vitalia es una plataforma SaaS multi-tenant orientada a un dominio complejo (Health / Gestión institucional), que debe soportar:

- Configuración dinámica por tenant
- Dashboards personalizables
- Crecimiento progresivo de funcionalidades
- Separación clara entre lógica de negocio y UI
- Evolución futura hacia estructuras más complejas (flujos, wizards, contextos persistentes)

La arquitectura frontend existente se basa principalmente en:

- Rutas estáticas
- Componentes acoplados a servicios HTTP
- Lógica de negocio distribuida en la capa de presentación

Este enfoque empieza a mostrar limitaciones claras:

- Dificultad para reutilizar UI de forma consistente
- Alto acoplamiento entre vistas y lógica
- Crecimiento desordenado de componentes
- Complejidad para habilitar features por tenant o rol

---

## 2. Decisión

Se adopta una **Arquitectura Frontend basada en Widgets y Dominios**, con los siguientes principios:

### 2.1 Domain-Driven Design (DDD) en Frontend

- Toda la lógica de negocio vive en `src/app/domain`
- La UI no contiene lógica de negocio
- El acceso al dominio se realiza exclusivamente a través de **Facades**

### 2.2 UI basada en Widgets

La interfaz se compone de **Widgets autónomos**. Un Widget:

- No conoce rutas
- No conoce layouts
- No realiza llamadas HTTP directas
- Consume datos únicamente desde su Facade
- Recibe su configuración mediante un contrato (`WidgetConfig`)

### 2.3 Composición dinámica mediante Zonas

- Las páginas no definen explícitamente qué componentes renderizar
- Un componente infraestructura (`ZoneRenderer`) renderiza Widgets dinámicamente
- La configuración de una Zona puede provenir de:
  - Backend
  - Servicio de configuración UI
  - Mock durante desarrollo

### 2.4 Separación clara de responsabilidades

- **Core**: infraestructura (auth, interceptors, logging)
- **Domain**: estado, reglas de negocio, facades
- **Layout**: shell, zonas, composición
- **Widgets**: componentes smart, autocontenidos
- **Pages**: definición de rutas y orquestación mínima

---

## 3. Alternativas Consideradas

### 3.1 Arquitectura clásica basada en rutas y componentes

**Descripción**:  
Cada ruta define explícitamente qué componentes renderiza.

**Motivos de descarte**:
- Alto acoplamiento UI ↔ negocio
- Poca reutilización real
- Escalabilidad limitada en dashboards
- Dificultad para configuración por tenant

### 3.2 Micro-frontends tempranos (Module Federation)

**Descripción**:  
Separar la app en múltiples micro-frontends desde el inicio.

**Motivos de descarte**:
- Complejidad innecesaria en esta etapa
- Sobrecoste operativo
- Problemas de coordinación de equipos prematuros

> **Nota**: la arquitectura de Widgets es compatible con una futura migración a micro-frontends si fuera necesario.

### 3.3 State management global obligatorio (NgRx everywhere)

**Descripción**:  
Forzar un store global desde el inicio.

**Motivos de descarte**:
- Over-engineering
- Curva de aprendizaje innecesaria
- Pérdida de agilidad

---

## 4. Consecuencias

### 4.1 Consecuencias Positivas

- ✅ Alta reutilización de UI
- ✅ Bajo acoplamiento entre vistas y lógica
- ✅ Configuración dinámica por tenant
- ✅ Escalabilidad organizacional
- ✅ Código más testeable y mantenible
- ✅ Claridad arquitectónica para nuevos desarrolladores

### 4.2 Costes / Trade-offs

- ⚠️ Mayor complejidad inicial
- ⚠️ Necesidad de disciplina arquitectónica
- ⚠️ Curva de aprendizaje para el equipo
- ⚠️ Requiere documentación clara y code reviews estrictos

---

## 5. Estado y Evolución

Esta decisión se considera **aceptada** y será aplicada:

- De forma incremental
- Sin refactors masivos
- Empezando por dashboards y pantallas complejas

Cualquier cambio significativo a esta arquitectura deberá registrarse en un nuevo ADR.

---

## 6. Referencias

- Domain-Driven Design (Evans)
- Frontend Architecture Patterns (Enterprise UI)
- Widget-Based UI (SAP Fiori, Salesforce, Guidewire)
