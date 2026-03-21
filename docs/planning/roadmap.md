# Vitalia - Roadmap & Deuda Técnica Global

Este documento centraliza las tareas pendientes, decisiones arquitectónicas y deuda técnica identificada para la evolución de la plataforma.

## 🚀 Hoja de Ruta (Roadmap) — Funcionalidades Pendientes

### 1. Gestión de Sesiones y Seguridad
- **Purga de Refresh Tokens (Spring Batch)**: Implementar un job de Spring Batch para limpiar la tabla `AUT_REFRESH_TOKEN` periódicamente.
- **Lógica de Niveles de Administrador (1, 2, 3)**: Implementar restricciones por nivel en el backend. Asegurar que siempre exista al menos un Admin Nivel 1.
- **Seguridad en Desactivación**: Protocolo de manejo de credenciales cuando un usuario es desactivado.
- **Política de Contraseñas (`passwordPolicyJson`)**: Implementar validador dinámico en `AuthService` (Backend) que lea estas reglas.

### 2. Gobernanza de Tenencia (Tenant Configuration)
- **Validación de Límites (Backend)**: Restringir usuarios y cuota de almacenamiento según `TenantConfig`.
- **Branding Dinámico (`fallbackHeader`)**: Lógica en el `ShellComponent` para mostrar este título si no hay logo.
- **Configuración Extendida (`extraJson`)**: Servicio de "Feature Flags" para habilitar módulos dinámicamente (ej: telemedicina).

### 3. Integridad y Estandarización
- **Borrado Lógico (Soft Delete)**: Refactorizar `TenantAdmin` y `User` para usar flag `enabled`/`deleted`.
- **Estandarización UTF-8 (Maven)**: Configurar encoding explícito en plugins críticos para evitar problemas de caracteres.

---

## ⚠️ Deuda Técnica Identificada

### 1. Centralización de Temas Visuales
- La personalización (colores, fuentes) debe gestionarse exclusivamente a través del módulo de **Themes**, evitando duplicidad en `extraJson`.

### 2. Automatización de i18n
- Se requiere un script para verificar la paridad entre `es-ES.json`, `en-US.json` y `fr-FR.json` (actualmente manual bajo el "Golden Protocol").

---

## 📅 Registro de Actualizaciones
- **2026-03-07**: Solucionado bug de desfase de fechas (off-by-one).
- **2026-03-07**: Sincronización de campos de i18n para Person y Onboarding.
