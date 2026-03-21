# Análisis de Implementación: Rol TenantAdmin

Este documento detalla el estado actual del desarrollo para el rol **TenantAdmin** (Administrador de Organización), contrastando las definiciones del Frontend con la realidad del Backend.

## 📊 Resumen Ejecutivo

*   **Frontend**: Tiene un menú completo definido (`tenant-admin-menu.json`), pero la mayoría de las rutas y componentes son inexistentes.
*   **Backend**: Posee una arquitectura sólida (Zero Trust, Multi-Tenancy), pero el alcance funcional se limita actualmente al **Gobierno de la Organización** y **Gestión de Empleados**.
*   **Brecha Crítica**: Los módulos clínicos y operativos (Citas, Admisiones, Farmacia, Finanzas) **NO existen aún** en el Backend.

---

## 🔍 Análisis por Sección (Mapa de Realidad)

| Sección | Estado Frontend | Estado Backend | Acción Requerida |
| :--- | :--- | :--- | :--- |
| **Dashboard** | [x] Operativo (Básico) | N/A | Ninguna |
| **Admin - Perfil** | [x] Componente OK | [x] `TenantAdminController` | Sincronización final |
| **Admin - Usuarios** | [ ] Sin Componente | [x] `TenantAdminController` | **Implementar FE** |
| **Admin - Roles** | [ ] Sin Componente | [x] `TenantAdminController` | **Implementar FE** |
| **Admin - Auditoría** | [ ] Sin Componente | [ ] Sin Controller | **Implementar BE + FE** |
| **Staff - Directorio** | [ ] Sin Componente | [x] `EmployeeController` | **Implementar FE** |
| **Staff - Turnos/Equipos** | [ ] Sin Componente | [ ] Sin Controller | **Implementar BE + FE** |
| **Pacientes (Todos)** | [ ] Sin Componente | [!] Sólo Entidad `Patient` | **Implementar BE (CRUD) + FE** |
| **Citas/Agenda** | [ ] Sin Componente | [ ] Sin Controller | **Prioridad Alta: Implementar BE + FE** |
| **Admisiones** | [ ] Sin Componente | [ ] Sin Controller | **Implementar BE + FE** |
| **Hospitalización** | [ ] Sin Componente | [ ] Sin Controller | **Implementar BE + FE** |
| **Farmacia/Inventario** | [ ] Sin Componente | [ ] Sin Controller | **Implementar BE + FE** |
| **Finanzas (Facturas)** | [ ] Sin Componente | [ ] Sin Controller | **Implementar BE + FE** |

---

## 🛠️ Tareas de Implementación por Rol: TenantAdmin

Basado en el análisis, estas son las tareas detalladas para completar este rol:

### Fase 1: Consolidación de lo Existente (Backend OK)
1.  **IAM (Usuarios y Roles)**:
    *   Backend: Ya existe lógica en `TenantAdminController` para listar/crear administradores y usuarios del tenant.
    *   Frontend: Crear `UsersListComponent`, `UsersAddComponent`, etc., siguiendo el `CrudTemplate`.
2.  **Staff Médico (Directorio)**:
    *   Backend: Ya existe `EmployeeController`.
    *   Frontend: Crear módulo `staff` en `/admin/staff` y vincularlo al controlador de empleados.

### Fase 2: Infraestructura Clínica Core (Backend Necesario)
1.  **Módulo de Pacientes**:
    *   **Backend**: Desarrollar `PatientController`, `PatientService` y `PatientRepository` en `vitalia-medical`.
    *   **Frontend**: Implementar el registro de pacientes y la búsqueda avanzada.
2.  **Módulo de Citas**:
    *   **Backend**: Crear entidades `Appointment`, controllers y lógica de agenda.
    *   **Frontend**: Implementar el calendario y la gestión de slots.

### Fase 3: Operaciones y Servicios (Nuevos Módulos)
1.  **Admisiones y Altas**: Control de flujo de pacientes.
2.  **Servicios Clínicos (Labs/Imaging)**: Gestión de resultados.
3.  **Farmacia e Inventarios**: Control de stock de medicamentos.

---

## 🛡️ Reglas de Oro para TenantAdmin
*   **Aislamiento**: Todo controlador de TenantAdmin debe heredar de `BaseController` o asegurar que el `TenantFilter` esté activo.
*   **Naming**: Seguir estrictamente la convención plural en carpetas y clases TS.
*   **i18n**: Sincronizar siempre `es-ES`, `en-US` y `fr-FR`.
*   **Iconografía**: Usar los iconos Material definidos en la guía (ej: `qr_code` para códigos, `badge` para nombres).
