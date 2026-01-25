# Checklist de PR (Code Review) específico para PAL / GDS

Este checklist NO es genérico, es arquitectónico.
Sirve para bloquear regresiones y educar al equipo.

## ✅ Checklist Obligatorio — Componentes PAL (shared/ui)

### 1️⃣ Arquitectura General
- [ ] El componente vive exclusivamente en `src/app/shared/ui`
- [ ] No importa nada desde `features/` o `domain/`
- [ ] No contiene lógica de negocio
- [ ] No conoce rutas, servicios, stores o facades
- [ ] **🚫 Bloqueante si falla**

### 2️⃣ API Pública (Contrato)
- [ ] Existe archivo `ui-*.types.ts`
- [ ] Todos los `@Input()` usan tipos cerrados (Union Types / Interfaces)
- [ ] No hay `string`, `any`, `unknown` en Inputs públicos
- [ ] El nombre del selector empieza con `ui-`
- [ ] **🚫 Bloqueante si falla**

### 3️⃣ Integración Angular
- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] No hay `subscribe()` manual
- [ ] Si es input de formulario → implementa `ControlValueAccessor`
- [ ] `@HostBinding` controla las clases (no `[class]` desde fuera)
- [ ] **⚠️ Advertencia si falla**

### 4️⃣ Estilos (GDS Compliance)
- [ ] CERO valores hardcodeados (`px`, `#hex`, `rgba`)
- [ ] Todos los estilos usan `var(--ui-*)`
- [x] Sigue la estrategia de **3 niveles**: Base -> Semantic -> Component Token
- [ ] **Responsive-First**: Adaptación fluida a móvil (≤640px) y desktop
- [ ] No hay `!important`
- [ ] No hay estilos globales (`::ng-deep` ❌ fuera del PAL)
- [ ] **🚫 Bloqueante si falla**

### 5️⃣ Aislamiento de Librerías
- [ ] Si usa Angular Material, NO filtra `mat-*` al exterior
- [ ] No se exportan directivas Material
- [ ] Material solo vive dentro del componente PAL
- [ ] **🚫 Bloqueante si falla**

### 6️⃣ i18n & Accesibilidad
- [ ] Usa elementos HTML semánticos
- [ ] Soporta `disabled`
- [ ] **Mandatorio**: Acepta input `i18n` o `ariaLabel` para etiquetas ARIA
- [ ] No rompe navegación por teclado
- [ ] Emite eventos clave (`blur`, `focus` cuando aplica)
- [ ] **🚫 Bloqueante si falla**

### 7️⃣ Documentación mínima
- [ ] Existe `README.md`
- [ ] Define: qué hace / qué no hace
- [ ] Ejemplo de uso incluido
- [ ] **⚠️ Advertencia si falla**

---

## 🧠 Regla de oro del reviewer

> ❝ Si este componente se copia a otro proyecto,
> ¿sigue funcionando sin cambios? ❞

Si la respuesta es **NO** → **PR rechazado.**

