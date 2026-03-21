# Roadmap & Technical Debt — Vitalia

Este documento registra las funcionalidades pendientes, decisiones arquitectónicas y deuda técnica acumulada para su futura implementación.

## 🚀 Roadmap — Funcionalidades Pendientes

### 1. Gestión de Configuración de Tenencia (TenantConfig)
Los siguientes campos están definidos en la base de datos pero su lógica de negocio no ha sido implementada en el Frontend ni en el Backend:

- **`fallbackHeader` (Texto)**: Implementar lógica en el `ShellComponent` para mostrar este título si el inquilino no tiene un logo cargado.
- **`passwordPolicyJson` (JSON)**: Implementar validador dinámico en el `AuthService` (Backend) que lea estas reglas (longitud mínima, caracteres especiales, etc.) al crear o resetear contraseñas.
- **`extraJson` (JSON)**: Implementar un servicio de "Feature Flags" o "Dynamic Config" que permita extender la funcionalidad por inquilino sin alterar el esquema de la base de datos (ej: habilitar telemedicina, claves de API externas, etc.).

### 2. Carga Masiva de Usuarios (Bulk Onboarding)
Para escalar el onboarding de nuevos hospitales, es imperativo diseñar un flujo de importación asíncrono.
- **Frontend:** Añadir un botón flotante "Importar CSV" en la vista de *Gestión de Usuarios* que ofrezca al Administrador una plantilla `.xlsx` o `.csv` vacía (Columnas: `Email`, `Nombre`, `Role`).
- **Backend (`POST /invitations/bulk`):** Crear un procesador por lotes (Spring Batch o Colas de Mensajes) que itere el archivo subido, cree registros de `UserInvitation` y envíe silenciosamente miles de emails transaccionales al mismo tiempo sin saturar la banda o colgar la solicitud HTTP.

## ⚠️ Deuda Técnica

### 1. Centralización de Temas
**Decisión**: La personalización visual (colores, fuentes) debe gestionarse exclusivamente a través del módulo de **Themes**, no duplicarse en `extraJson`.
- **Tarea**: Auditar que ninguna configuración visual se guarde fuera del sistema de temas centralizado.

### 2. Sincronización i18n
**Deuda**: Se requiere un script automatizado para verificar que los archivos `es-ES.json`, `en-US.json` y `fr-FR.json` tengan el mismo número de claves y estructura idéntica. Actualmente se hace de forma manual bajo el "Golden Protocol".
