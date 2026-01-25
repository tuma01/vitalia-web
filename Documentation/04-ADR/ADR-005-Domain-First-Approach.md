# ADR-005: Domain-Driven Design en Frontend

**Estado**: Accepted  
**Fecha**: 2026-01-22  
**Decisores**: Equipo Frontend Vitalia  
**Contexto del Sistema**: Vitalia Frontend (Angular, SaaS Multi-tenant)

---

## 1. Contexto

En arquitecturas frontend tradicionales, es común que los componentes:

- Inyecten servicios HTTP directamente
- Contengan lógica de negocio mezclada con lógica de presentación
- Dupliquen código entre diferentes vistas
- Sean difíciles de testear por alto acoplamiento

**Ejemplo del problema**:

```typescript
// ❌ Widget acoplado a HTTP y con lógica de negocio
@Component({...})
export class PatientStatsWidget {
  private http = inject(HttpClient);
  
  patients = signal<Patient[]>([]);
  
  ngOnInit() {
    // HTTP directo
    this.http.get<Patient[]>('/api/patients').subscribe(data => {
      // Lógica de negocio en el componente
      const active = data.filter(p => p.status === 'ACTIVE');
      const critical = active.filter(p => p.riskLevel > 7);
      this.patients.set(critical);
    });
  }
}
```

**Problemas**:
- Widget "sabe demasiado" (HTTP, filtrado, reglas de negocio)
- Lógica duplicada si otro componente necesita lo mismo
- Imposible testear sin mockear HttpClient
- Difícil reutilizar en otro contexto (modal, página, otro widget)

---

## 2. Decisión

Se adopta **Domain-Driven Design (DDD) en Frontend** con una capa de dominio explícita:

### 2.1 Capa de Dominio

Toda la lógica de negocio vive en `src/app/domain/<domain-name>/`:

```
domain/
└── patients/
    ├── models/
    │   └── patient.model.ts       # Interfaces TypeScript
    ├── patients.api.ts            # HttpClient (solo HTTP)
    ├── patients.store.ts          # Signals (solo estado)
    └── patients.facade.ts         # API pública (orquesta api + store)
```

### 2.2 Facades como API Pública

Los **Facades** son la única puerta de entrada al dominio:

```typescript
@Injectable({ providedIn: 'root' })
export class PatientsFacade {
  private api = inject(PatientsApi);
  private store = inject(PatientsStore);
  
  // Signals públicos (readonly)
  readonly allPatients = this.store.allPatients;
  readonly criticalPatients = this.store.criticalPatients;
  
  // Métodos públicos
  loadPatients() {
    this.api.getAll().subscribe(patients => {
      this.store.setPatients(patients);
    });
  }
}
```

### 2.3 Separación de Responsabilidades

**API Layer** (`*.api.ts`):
- Solo llamadas HTTP
- No contiene estado
- No contiene lógica de negocio
- Retorna Observables

**Store Layer** (`*.store.ts`):
- Solo manejo de estado con Signals
- No hace HTTP
- Contiene computed signals para datos derivados
- Provee signals readonly al exterior

**Facade Layer** (`*.facade.ts`):
- Orquesta API + Store
- Expone API pública simple
- Previene llamadas duplicadas
- Puede contener lógica de coordinación

### 2.4 Widgets consumen Facades

```typescript
// ✅ Widget desacoplado
@Component({...})
export class PatientStatsWidget {
  private facade = inject(PatientsFacade);
  
  // Computed desde facade
  readonly criticalCount = computed(() => 
    this.facade.criticalPatients().length
  );
  
  ngOnInit() {
    this.facade.loadPatients(); // Simple, sin lógica
  }
}
```

---

## 3. Alternativas Consideradas

### 3.1 Servicios inyectados directamente en widgets

**Descripción**:  
Widgets inyectan servicios HTTP directamente.

**Motivos de descarte**:
- Alto acoplamiento (widget conoce estructura de API)
- Lógica de negocio dispersa
- Difícil testear (mock de HTTP en cada test)
- Duplicación de código entre componentes

### 3.2 NgRx para todo el estado

**Descripción**:  
Usar NgRx Store, Effects, Actions para todo el estado de la aplicación.

**Motivos de descarte**:
- **Overkill** para la complejidad actual
- Boilerplate excesivo (actions, reducers, effects, selectors)
- Curva de aprendizaje alta
- Pérdida de agilidad en desarrollo

> **Nota**: Signals + Facades ofrecen 80% de los beneficios con 20% de la complejidad.

### 3.3 Servicios compartidos sin estructura

**Descripción**:  
Servicios compartidos pero sin separación clara API/Store/Facade.

**Motivos de descarte**:
- Servicios se vuelven "god objects"
- Mezcla de responsabilidades
- Difícil evolucionar
- Testing complejo

---

## 4. Consecuencias

### 4.1 Consecuencias Positivas

- ✅ **Testabilidad**: Cada capa se testea independientemente
- ✅ **Reutilización**: Múltiples componentes usan el mismo Facade
- ✅ **Bajo acoplamiento**: Widgets no conocen HTTP ni estructura de API
- ✅ **Claridad**: Responsabilidades bien definidas
- ✅ **Mantenibilidad**: Cambios en API no afectan widgets
- ✅ **Escalabilidad**: Fácil agregar nuevos dominios

### 4.2 Costes / Trade-offs

- ⚠️ **Más archivos**: 3-4 archivos por dominio (vs 1 servicio)
- ⚠️ **Curva de aprendizaje**: Equipo debe entender el patrón
- ⚠️ **Disciplina requerida**: Fácil romper las reglas si no hay code review
- ⚠️ **Overhead inicial**: Setup más complejo para dominios simples

### 4.3 Riesgos

- ❌ **Over-abstraction**: Crear dominios para entidades triviales
- ❌ **Facade bloat**: Facades con demasiados métodos
- ❌ **Leaky abstraction**: Exponer detalles de implementación

**Mitigaciones**:
- No crear dominio para entidades con <3 operaciones
- Facades con máximo 10-15 métodos públicos
- Code review estricto en PRs de nuevos dominios

---

## 5. Reglas de Implementación

### 5.1 Regla de Oro

> **Un Facade NUNCA hace llamadas HTTP directamente**

```typescript
// ❌ MAL: Facade hace HTTP
export class PatientsFacade {
  private http = inject(HttpClient);
  
  loadPatients() {
    this.http.get('/api/patients').subscribe(...); // ❌ NO
  }
}

// ✅ BIEN: Facade usa API
export class PatientsFacade {
  private api = inject(PatientsApi);
  private store = inject(PatientsStore);
  
  loadPatients() {
    this.api.getAll().subscribe(patients => {
      this.store.setPatients(patients);
    });
  }
}
```

### 5.2 Prevención de Llamadas Duplicadas

```typescript
export class PatientsFacade {
  private loaded = signal(false);
  
  loadPatients() {
    if (this.loaded()) return; // ⭐ Evita duplicados
    
    this.api.getAll().subscribe(patients => {
      this.store.setPatients(patients);
      this.loaded.set(true);
    });
  }
}
```

Si 3 widgets llaman `facade.loadPatients()` simultáneamente, solo se ejecuta 1 HTTP call.

### 5.3 Cuándo crear un nuevo Dominio

✅ **Crear dominio si**:
- Entidad tiene >3 operaciones (CRUD + lógica)
- Múltiples componentes necesitan los mismos datos
- Hay lógica de negocio asociada
- Necesitas estado compartido

❌ **NO crear dominio si**:
- Entidad solo se usa en 1 lugar
- Solo tiene 1-2 operaciones simples
- No hay lógica de negocio
- Es un lookup estático

---

## 6. Testing Strategy

### API Layer
```typescript
it('should fetch patients', () => {
  const httpMock = TestBed.inject(HttpTestingController);
  api.getAll().subscribe();
  const req = httpMock.expectOne('/api/patients');
  expect(req.request.method).toBe('GET');
});
```

### Store Layer
```typescript
it('should update patients signal', () => {
  store.setPatients([patient1, patient2]);
  expect(store.allPatients()).toEqual([patient1, patient2]);
});
```

### Facade Layer
```typescript
it('should load patients', () => {
  spyOn(api, 'getAll').and.returnValue(of([patient1]));
  facade.loadPatients();
  expect(store.allPatients()).toEqual([patient1]);
});
```

### Widget Layer
```typescript
it('should display patient count', () => {
  spyOn(facade, 'loadPatients');
  const fixture = TestBed.createComponent(PatientStatsWidget);
  expect(facade.loadPatients).toHaveBeenCalled();
});
```

---

## 7. Estado y Evolución

Esta decisión se considera **aceptada** y será aplicada:

- Nuevos dominios siguen este patrón obligatoriamente
- Dominios existentes se migran gradualmente
- Code review valida cumplimiento

**Criterios de éxito**:
- 100% de nuevos dominios siguen el patrón
- Reducción de bugs relacionados con estado
- Mejora en coverage de tests

---

## 8. Referencias

- Domain-Driven Design (Eric Evans)
- Facade Pattern (Gang of Four)
- Angular Signals Documentation
- Clean Architecture (Robert C. Martin)
