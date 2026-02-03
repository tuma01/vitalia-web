# PAL Maturity Roadmap: El Camino a la Excelencia

Este documento detalla los horizontes de crecimiento del **Product Abstraction Layer (PAL)**. Tras consolidar la geometría, accesibilidad y micro-UX, nos enfocamos en la robustez, escalabilidad y la experiencia de desarrollo (DX).

---

## 📅 Roadmap por Versiones

### Fase 1: Consolidación & DX (v1.1 - v1.5)
*Objetivo: Estabilizar la herramienta para el equipo de desarrollo actual.*
- **Version Visual & Diagramas**: Documentar visualmente la inyección de dependencias y el flujo de señales.
- **Kit de Integración SaaS**: Guías de extensión para validaciones personalizadas y wrappers de formularios complejos.
- **Material Parity Excellence**: Asegurar que cualquier componente de Material inyectado respete el Contrato Geométrico al 100%.

### Fase 2: Robustez & QA (v2.0)
*Objetivo: Cero regresiones y confianza total en despliegues.*
- **Testing de Alta Fidelidad**: Unit Tests (100% cobertura en lógica ARIA) y Visual Regression (Cypress/Playwright).
- **Storybook Premium**: Catálogo interactivo con documentación técnica integrada por componente.

### Fase 3: Escala Global & UX Avanzada (v3.0)
*Objetivo: Preparar a Vitalia para mercados internacionales y usuarios avanzados.*
- **Internacionalización (i18n)**: Soporte nativo para RTL (Right-To-Left) y mensajería dinámica eficiente.
- **Optimización de Performance**: Fine-tuning de Signals y Lazy Loading en selects masivos.
- **Future-Proof UX**: Auto-scroll inteligente a errores y animaciones adaptativas.

---

## 📈 Métricas de Éxito (KPIs)

Para medir la madurez del sistema, nos guiaremos por los siguientes indicadores:

| Métrica | Objetivo | Estado Actual |
| :--- | :--- | :--- |
| **Cobertura Unit Test (Lógica ARIA)** | 100% | Base implementada |
| **Errores Visuales (Geometry Shift)** | 0px de desviación | Estabilizado (Iron Base) |
| **Accesibilidad (Keyboard Nav)** | 100% Operable | Implementado en Primitivas |
| **Adopción en Features** | 100% de forms usan PAL | En progreso |
| **Onboarding Time (Dev)** | < 1 hora con Quick Start | Documentado |

---

## 🏗️ Estrategia de Coexistencia (Material Parity)

El PAL está diseñado para ser agnóstico pero compatible. La capa `_material-parity.scss` garantiza que:
- Se pueden mezclar componentes nativos del PAL con componentes de Angular Material.
- La precisión física (alturas, bordes, alineación) se mantiene idéntica.
- No hay competencia de estilos; el PAL es la "Fuente de Verdad" geométrica.

---

> El PAL no es solo una librería; es el estándar de calidad de Vitalia. Este roadmap asegura que ese estándar siga elevándose de forma medible y predecible.
