# ⚡ PAL Maturity Checklist

Este documento es la hoja de ruta operativa para llevar el **Product Abstraction Layer (PAL)** a un nivel de madurez "Enterprise".

## 📊 Status Tracker
| Track | Description | Priority | Status | Owner |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Testing & QA** | ⚡ CRITICAL | 🏗️ To Do | QA/Dev |
| **2** | **Storybook Premium** | ⚡ HIGH | 🏗️ To Do | Dev |
| **3** | **i18n & RTL** | MEDIUM | ⏳ Pending | Dev |
| **4** | **SaaS Kit** | MEDIUM | ⏳ Pending | Architect |
| **5** | **Optimization** | LOW | ⏳ Pending | Dev |
| **6** | **Future-Proofing** | LOW | ⏳ Pending | Product |

---

## 🏗️ Ejecución Detallada

### ⚡ Track 1: Testing & QA (Robustez Total)
- [ ] **1.1 Unit Tests (Angular + Jest)**
    - [ ] `UiFormField`: Propagación de ARIA (invalid, required, describedby)
    - [ ] `UiFormField`: Generación única de IDs y vinculación lógica
    - [ ] `UiFormField`: Delegación de foco (`focus()`) y limpieza de efectos
    - [ ] `UiInput`: Contrato `ControlValueAccessor` (writeValue, change/touch)
    - [ ] `UiInput`: Sincronización de señales (`focused`, `empty`)
    - [ ] `UiSelectNative`: Keyboard Navigation (ArrowUp/Down)
    - [ ] `UiSelectNative`: Keyboard Navigation (Enter/Escape flow)
    - [ ] `UiSelectNative`: Lógica de `aria-activedescendant` dinámica
- [ ] **1.2 Visual Regression (Playwright/Percy Snapshots)**
    - [ ] Snapshot: `UiFormField` Sm/Md/Lg (Outline/Filled)
    - [ ] Snapshot: Estados Error y Disabled (Paridad 1px)
    - [ ] Snapshot: Floating Label placement & Legend notch transition
- [ ] **1.3 E2E Testing (Playwright)**
    - [ ] ⌨️ Tab navigation flow (Forward)
    - [ ] ⌨️ Shift+Tab navigation flow (Backward)
    - [ ] ⌨️ Enter to open/select (UiSelectNative)
    - [ ] ⌨️ Escape to close/cancel (UiSelectNative)
    - [ ] 🗣️ Accessibility Mapping: `aria-describedby` correct context announcement

### ⚡ Track 2: Storybook Premium (Documentación Viva)
- [ ] **2.1 Setup & Infrastructure**
    - [ ] Config Storybook 8+ with Angular 17.3+ and SCSS
    - [ ] Addon: a11y (Auto-accessibility audit)
    - [ ] Addon: Controls (Dynamic testing)
- [ ] **2.2 Stories Library**
    - [ ] `UiFormField`: States playground (Prefixes, Suffixes, Multi-error)
    - [ ] `UiInput`: Placeholder stress test & Custom validation UI
    - [ ] `UiSelectNative`: Search behavior & Custom templates demo
- [ ] **2.3 Technical Doc Injection**
    - [ ] Markdown documentation embedded per component (ARIA focus)

### Track 3: Internacionalización (i18n/RTL)
- [ ] **3.1 Dynamic Messaging**
    - [ ] Integration with `i18next` o `Angular i18n`
- [ ] **3.2 RTL Layout Engine**
    - [ ] Refactor styles to logical properties (Start/End)
    - [ ] Verify Floating Label & Legend Notch in RTL

### Track 4: Kit de Integración SaaS
- [ ] **4.1 Public API Documentation** (Inputs, Outputs, Signals)
- [ ] **4.2 Implementation Examples** (Reactive Forms, Complex validation)
- [ ] **4.3 Integration Guide** for Third-party (Material) parity

### Track 5: Optimización & Performance
- [ ] **5.1 Signal Fine-tuning** (Minimize change detection cycles)
- [ ] **5.2 Lazy Loading** para listas grandes (>1000 items)
- [ ] **5.3 Bundle Size Audit** (Standalone optimization)

### Track 6: Future-Proofing (UX Avanzada)
- [ ] **6.1 Smart Auto-scroll** al primer error
- [ ] **6.2 Adaptive Shake feedback**
- [ ] **6.3 Runtime Dynamic Tokens**

---

> [!NOTE]
> Este documento debe actualizarse periódicamente a medida que se completen las tareas para reflejar el estado real de madurez del sistema.
