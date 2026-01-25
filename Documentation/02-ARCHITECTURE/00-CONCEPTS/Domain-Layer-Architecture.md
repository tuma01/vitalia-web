# Domain Layer Architecture

> **Living Document** - Updated as architecture evolves  
> **Last Updated**: 2026-01-22  
> **For**: Developers implementing business logic

---

## Overview

The **Domain Layer** is where all business logic lives in Vitalia Frontend. It follows **Domain-Driven Design (DDD)** principles to keep business logic separate from UI concerns.

**Key Principle**: *The UI is a projection of the domain state.*

For decision context, see [ADR-005: Domain-First Approach](../../04-ADR/ADR-005-Domain-First-Approach.md).

---

## DDD Principles in Frontend

### 1. Domain as Single Source of Truth

```
┌──────────────────────────────────────┐
│         Domain Layer                 │
│  (Business Logic + State)            │
└──────────────────────────────────────┘
         ▲         ▲         ▲
         │         │         │
    ┌────┴───┐ ┌──┴───┐ ┌───┴────┐
    │ Widget │ │ Page │ │ Modal  │
    └────────┘ └──────┘ └────────┘
```

Multiple UI components can consume the same domain without duplication.

### 2. UI as Projection

UI components **react** to domain state changes:

```typescript
// Domain provides signals
readonly patients = facade.allPatients;

// UI computes derived values
readonly count = computed(() => this.patients().length);
```

### 3. Separation of Concerns

- **Domain**: What the data is, how it changes
- **UI**: How the data looks, how users interact

---

## Domain Layer Structure

Each domain follows this structure:

```
src/app/domain/<domain-name>/
├── models/
│   ├── <entity>.model.ts          # TypeScript interfaces
│   └── <entity>-dto.model.ts      # API DTOs (if different)
├── <domain>.api.ts                # HTTP client (only HTTP calls)
├── <domain>.store.ts              # State management (only signals)
├── <domain>.facade.ts             # Public API (orchestrates api + store)
└── index.ts                       # Public exports
```

### Example: Patients Domain

```
domain/patients/
├── models/
│   └── patient.model.ts
├── patients.api.ts
├── patients.store.ts
├── patients.facade.ts
└── index.ts
```

---

## The Three Layers

### Layer 1: API (`*.api.ts`)

**Responsibility**: HTTP communication with backend.

**Characteristics**:
- ✅ Makes HTTP calls
- ✅ Transforms DTOs to domain models (if needed)
- ❌ NO state management
- ❌ NO business logic
- ❌ NO UI knowledge

**Example**:

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from './models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientsApi {
  private http = inject(HttpClient);
  private baseUrl = '/api/patients';

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.baseUrl);
  }

  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${id}`);
  }

  create(patient: Partial<Patient>): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, patient);
  }

  update(id: string, patient: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/${id}`, patient);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

---

### Layer 2: Store (`*.store.ts`)

**Responsibility**: State management with Angular Signals.

**Characteristics**:
- ✅ Manages state with signals
- ✅ Provides computed signals for derived data
- ✅ Exposes readonly signals
- ❌ NO HTTP calls
- ❌ NO business logic (only state mutations)

**Example**:

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { Patient } from './models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientsStore {
  // Private writable signals
  private _patients = signal<Patient[]>([]);
  private _selectedPatient = signal<Patient | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly allPatients = this._patients.asReadonly();
  readonly selectedPatient = this._selectedPatient.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals (derived state)
  readonly patientCount = computed(() => this._patients().length);
  
  readonly activePatients = computed(() =>
    this._patients().filter(p => p.status === 'ACTIVE')
  );
  
  readonly criticalPatients = computed(() =>
    this._patients().filter(p => p.riskLevel > 7)
  );

  // State mutations
  setPatients(patients: Patient[]) {
    this._patients.set(patients);
  }

  addPatient(patient: Patient) {
    this._patients.update(current => [...current, patient]);
  }

  updatePatient(id: string, updates: Partial<Patient>) {
    this._patients.update(current =>
      current.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  }

  removePatient(id: string) {
    this._patients.update(current => current.filter(p => p.id !== id));
  }

  selectPatient(patient: Patient | null) {
    this._selectedPatient.set(patient);
  }

  setLoading(loading: boolean) {
    this._loading.set(loading);
  }

  setError(error: string | null) {
    this._error.set(error);
  }

  clear() {
    this._patients.set([]);
    this._selectedPatient.set(null);
    this._loading.set(false);
    this._error.set(null);
  }
}
```

---

### Layer 3: Facade (`*.facade.ts`)

**Responsibility**: Public API that orchestrates API + Store.

**Characteristics**:
- ✅ Orchestrates API calls and store updates
- ✅ Prevents duplicate HTTP calls
- ✅ Handles loading/error states
- ✅ Exposes simple, high-level methods
- ❌ NEVER makes HTTP calls directly (uses API layer)

**Example**:

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { PatientsApi } from './patients.api';
import { PatientsStore } from './patients.store';
import { Patient } from './models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientsFacade {
  private api = inject(PatientsApi);
  private store = inject(PatientsStore);
  
  // Track if data has been loaded
  private loaded = signal(false);

  // Expose store signals
  readonly allPatients = this.store.allPatients;
  readonly activePatients = this.store.activePatients;
  readonly criticalPatients = this.store.criticalPatients;
  readonly selectedPatient = this.store.selectedPatient;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly count = this.store.patientCount;

  // Public methods
  loadAll() {
    // ⭐ Prevent duplicate calls
    if (this.loaded()) return;

    this.store.setLoading(true);
    this.store.setError(null);

    this.api.getAll().subscribe({
      next: (patients) => {
        this.store.setPatients(patients);
        this.loaded.set(true);
        this.store.setLoading(false);
      },
      error: (err) => {
        this.store.setError(err.message);
        this.store.setLoading(false);
      }
    });
  }

  loadById(id: string) {
    this.store.setLoading(true);
    
    this.api.getById(id).subscribe({
      next: (patient) => {
        this.store.selectPatient(patient);
        this.store.setLoading(false);
      },
      error: (err) => {
        this.store.setError(err.message);
        this.store.setLoading(false);
      }
    });
  }

  create(patient: Partial<Patient>) {
    this.store.setLoading(true);
    
    this.api.create(patient).subscribe({
      next: (created) => {
        this.store.addPatient(created);
        this.store.setLoading(false);
      },
      error: (err) => {
        this.store.setError(err.message);
        this.store.setLoading(false);
      }
    });
  }

  update(id: string, updates: Partial<Patient>) {
    // Optimistic update
    this.store.updatePatient(id, updates);
    
    this.api.update(id, updates).subscribe({
      error: (err) => {
        // Rollback on error (reload from server)
        this.loadAll();
        this.store.setError(err.message);
      }
    });
  }

  delete(id: string) {
    // Optimistic delete
    this.store.removePatient(id);
    
    this.api.delete(id).subscribe({
      error: (err) => {
        // Rollback on error
        this.loadAll();
        this.store.setError(err.message);
      }
    });
  }

  selectPatient(patient: Patient | null) {
    this.store.selectPatient(patient);
  }

  refresh() {
    this.loaded.set(false);
    this.loadAll();
  }

  clear() {
    this.store.clear();
    this.loaded.set(false);
  }
}
```

---

## Why Facades Never Do HTTP Directly

### ❌ Bad: Facade with HTTP

```typescript
export class PatientsFacade {
  private http = inject(HttpClient);
  private store = inject(PatientsStore);
  
  loadAll() {
    // ❌ Facade doing HTTP directly
    this.http.get<Patient[]>('/api/patients').subscribe(patients => {
      this.store.setPatients(patients);
    });
  }
}
```

**Problems**:
- Tight coupling to HTTP implementation
- Hard to test (need to mock HttpClient)
- Can't reuse HTTP logic
- Violates Single Responsibility Principle

### ✅ Good: Facade with API Layer

```typescript
export class PatientsFacade {
  private api = inject(PatientsApi);
  private store = inject(PatientsStore);
  
  loadAll() {
    // ✅ Facade uses API layer
    this.api.getAll().subscribe(patients => {
      this.store.setPatients(patients);
    });
  }
}
```

**Benefits**:
- Separation of concerns
- Easy to test (mock API, not HttpClient)
- API logic reusable
- Can swap HTTP implementation

---

## Preventing Duplicate HTTP Calls

When multiple widgets call `facade.loadAll()` simultaneously, only one HTTP call should execute:

```typescript
export class PatientsFacade {
  private loaded = signal(false);

  loadAll() {
    if (this.loaded()) return; // ⭐ Guard clause
    
    this.api.getAll().subscribe(patients => {
      this.store.setPatients(patients);
      this.loaded.set(true);
    });
  }

  refresh() {
    this.loaded.set(false); // Reset flag
    this.loadAll();
  }
}
```

---

## Public API Export

Only export what's needed by UI components:

```typescript
// index.ts
export * from './models/patient.model';
export { PatientsFacade } from './patients.facade';

// ❌ Don't export API and Store (internal implementation)
```

UI components should only import:

```typescript
import { PatientsFacade, Patient } from '@app/domain/patients';
```

---

## Testing Strategy

### Testing API Layer

```typescript
describe('PatientsApi', () => {
  let api: PatientsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    api = TestBed.inject(PatientsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch all patients', () => {
    const mockPatients = [{ id: '1', name: 'John' }];
    
    api.getAll().subscribe(patients => {
      expect(patients).toEqual(mockPatients);
    });

    const req = httpMock.expectOne('/api/patients');
    expect(req.request.method).toBe('GET');
    req.flush(mockPatients);
  });
});
```

### Testing Store Layer

```typescript
describe('PatientsStore', () => {
  let store: PatientsStore;

  beforeEach(() => {
    store = new PatientsStore();
  });

  it('should set patients', () => {
    const patients = [{ id: '1', name: 'John' }];
    store.setPatients(patients);
    expect(store.allPatients()).toEqual(patients);
  });

  it('should compute patient count', () => {
    store.setPatients([{ id: '1' }, { id: '2' }]);
    expect(store.patientCount()).toBe(2);
  });
});
```

### Testing Facade Layer

```typescript
describe('PatientsFacade', () => {
  let facade: PatientsFacade;
  let apiSpy: jasmine.SpyObj<PatientsApi>;
  let store: PatientsStore;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('PatientsApi', ['getAll']);
    store = new PatientsStore();
    facade = new PatientsFacade();
    (facade as any).api = apiSpy;
    (facade as any).store = store;
  });

  it('should load patients', () => {
    const mockPatients = [{ id: '1', name: 'John' }];
    apiSpy.getAll.and.returnValue(of(mockPatients));

    facade.loadAll();

    expect(apiSpy.getAll).toHaveBeenCalled();
    expect(store.allPatients()).toEqual(mockPatients);
  });

  it('should prevent duplicate loads', () => {
    apiSpy.getAll.and.returnValue(of([]));

    facade.loadAll();
    facade.loadAll();
    facade.loadAll();

    expect(apiSpy.getAll).toHaveBeenCalledTimes(1);
  });
});
```

---

## When to Create a New Domain

### ✅ Create a domain if:

- Entity has >3 operations (CRUD + business logic)
- Multiple components need the same data
- There's business logic associated with the entity
- You need shared state across components

### ❌ Don't create a domain if:

- Entity only used in one place
- Only 1-2 simple operations
- No business logic
- Static lookup data

---

## Complete Example: Tenants Domain

See the full implementation guide: [Creating a Domain](../04-PATTERNS/Creating-A-Domain.md)

---

## References

- **Decision Context**: [ADR-005: Domain-First Approach](../../04-ADR/ADR-005-Domain-First-Approach.md)
- **Implementation**: [Creating a Domain](../04-PATTERNS/Creating-A-Domain.md)
- **Boilerplate**: [Domain Template](../04-PATTERNS/Domain-Boilerplate.md)
- **Architecture Overview**: [Frontend Architecture](Frontend-Architecture-Overview.md)
