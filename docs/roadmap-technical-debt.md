# Vitalia - Roadmap & Technical Debt

Este documento centraliza las tareas pendientes y deuda técnica identificada para futuras iteraciones.

## 🚀 Tareas Pendientes (Roadmap)

### 1. Gestión de Sesiones y Seguridad
- **Purga de Refresh Tokens (Spring Batch)**: Implementar un job de Spring Batch para limpiar la tabla `AUT_REFRESH_TOKEN` periódicamente, ya que crecerá con el uso.
- **Lógica de Niveles de Administrador (1, 2, 3)**: Implementar las restricciones por nivel en el backend. Asegurar que siempre exista al menos un Admin Nivel 1 y que las acciones críticas (borrar otros admins) estén restringidas.
- **Seguridad en Desactivación**: Definir y aplicar el protocolo de manejo de credenciales (email/password) cuando un usuario es desactivado pero no borrado.

### 2. Integridad de Datos
- **Borrado Lógico (Soft Delete)**: Refactorizar `TenantAdmin` y `User` para usar un flag `enabled` o `deleted` en lugar de borrado físico, preservando la trazabilidad y auditoría.

### 3. Gobernanza de Tenencia (Tenant Configuration)
- **Validación de Límites (Backend)**: Implementar la lógica de negocio para los campos de `TenantConfig`:
    - **Max. Usuarios**: Restringir creación de usuarios si se supera el límite.
    - **Storage Quota**: Bloquear subidas de archivos si se excede el espacio en bytes.
    - **Login Local / Email Verification**: Aplicar estas políticas en el flujo de autenticación.
- **Header Identification (Branding)**: Consumir el `fallbackHeader` en el Frontend para personalización dinámica.

### 4. Estandarización de Infraestructura (Maven)
- **Estandarización UTF-8**: Asegurar que todos los plugins críticos (`maven-compiler-plugin`, `maven-resources-plugin`) tengan configurado explícitamente el encoding UTF-8 en el BOM o POM raíz para evitar problemas de caracteres en diferentes entornos.

### 5. Optimización y Rendimiento (Caché con Redis)
- **Implementación de Capa de Caché**: Integrar Redis como sistema de caché. Esta mejora no solo es útil, sino que llegará a ser **necesaria** para garantizar el rendimiento, la escalabilidad y reducir la carga sobre la base de datos principal a medida que el sistema crezca.
    - **Casos de uso críticos**: Datos maestros y catálogos médicos (alta lectura, baja escritura), configuraciones de Inquilinos/Tenants, manejo de sesiones/tokens y bloqueos distribuidos.

---

*Documento generado para seguimiento de tareas a largo plazo.*

## 2026-03-07 Updates
- [x] Global fixed for Date Shift bug (off-by-one).
- [/] Synchronizing i18n files for Person and Onboarding fields.
