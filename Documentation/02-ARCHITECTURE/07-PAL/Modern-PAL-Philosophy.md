# Modern PAL Philosophy - Vitalia UI System

Este documento define la visión y estándares para la **Presentation Abstraction Layer (PAL)** de Vitalia, optimizada para un entorno **Multi-Tenant** y **Multi-Sector**.

## 1. Soberanía Visual (Custom CSS vs. UI Kits)

A diferencia de los enfoques tradicionales que envuelven librerías como Angular Material, el PAL de Vitalia apuesta por **Primitivos Propios (Custom CSS)**.

### Por qué esta decisión:
*   **Independencia de Marca**: Permite que un botón parezca de un hospital en un tenant y de una escuela en otro, sin las restricciones del DOM de terceros.
*   **Estabilidad a largo plazo**: Los cambios en librerías externas no rompen la identidad visual de la plataforma.
*   **Rendimiento**: Código minimalista y optimizado para una carga instantánea.

## 2. El Sistema de Tokens de 3 Niveles

Para que un PAL sea verdaderamente escalable, los estilos no deben estar "hardcodeados". Seguimos una jerarquía descendente:

| Nivel | Nombre | Responsabilidad | Ejemplo (SCSS/CSS) |
| :--- | :--- | :--- | :--- |
| **1** | **Global Tokens** | Valores físicos e invariantes. | `$ui-color-blue-500: #2F80ED;` |
| **2** | **Semantic Tokens** | Definen la función o intención. | `--ui-color-primary: var(--ui-color-blue-500);` |
| **3** | **Component Tokens** | Estilos específicos del componente. | `--ui-button-bg: var(--ui-color-primary);` |

> [!TIP]
> Al usar **Component Tokens**, podemos cambiar el diseño de un componente específico para un Tenant sin afectar a los demás componentes que usan el mismo color primario.

## 3. Contratos Inmutables

Las **Features** consumen componentes, no diseños. El contrato (API) del componente debe ser semántico:
*   ✅ `<ui-button variant="primary">`
*   ❌ `<ui-button color="blue">`

## 4. Conmutación en Runtime (Zero Rebuild)

El PAL debe reaccionar al contexto del usuario (Tenant/Sector) mediante:
1.  **CSS Variables**: Los tokens deben ser variables CSS para permitir cambios instantáneos.
2.  **Angular Signals**: Uso de signals para gestionar el estado de configuración de forma reactiva.
3.  **Encapsulamiento de Tematización**: El `UiConfigService` gestiona la inyección de clases en el `<body>` que activan los diferentes themes.

---
**Arquitectura**: Multi-Tenant Design Engine  
**Última revisión**: 2026-01-25
