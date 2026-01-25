# Domain Boilerplate

> **Template** - Copy-paste ready code for creating new domains  
> **Last Updated**: 2026-01-22

---

## Complete Domain Template

Use this template when creating a new domain. Replace `MyDomain` and `MyEntity` with your actual names.

---

### File Structure

```
src/app/domain/my-domain/
├── models/
│   └── my-entity.model.ts
├── my-domain.api.ts
├── my-domain.store.ts
├── my-domain.facade.ts
└── index.ts
```

---

### 1. Model (`models/my-entity.model.ts`)

```typescript
/**
 * Domain model for MyEntity
 */
export interface MyEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Add your properties here
}

/**
 * DTO for creating a new entity
 */
export interface CreateMyEntityDto {
  name: string;
  // Add required fields for creation
}

/**
 * DTO for updating an existing entity
 */
export interface UpdateMyEntityDto {
  name?: string;
  // Add fields that can be updated
}
```

---

### 2. API Layer (`my-domain.api.ts`)

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyEntity, CreateMyEntityDto, UpdateMyEntityDto } from './models/my-entity.model';

/**
 * API client for MyDomain
 * Handles all HTTP communication with backend
 */
@Injectable({ providedIn: 'root' })
export class MyDomainApi {
  private http = inject(HttpClient);
  private baseUrl = '/api/my-domain'; // Update with your endpoint

  /**
   * Fetch all entities
   */
  getAll(): Observable<MyEntity[]> {
    return this.http.get<MyEntity[]>(this.baseUrl);
  }

  /**
   * Fetch a single entity by ID
   */
  getById(id: string): Observable<MyEntity> {
    return this.http.get<MyEntity>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new entity
   */
  create(dto: CreateMyEntityDto): Observable<MyEntity> {
    return this.http.post<MyEntity>(this.baseUrl, dto);
  }

  /**
   * Update an existing entity
   */
  update(id: string, dto: UpdateMyEntityDto): Observable<MyEntity> {
    return this.http.put<MyEntity>(`${this.baseUrl}/${id}`, dto);
  }

  /**
   * Delete an entity
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Add custom endpoints as needed
  // Example:
  // search(query: string): Observable<MyEntity[]> {
  //   return this.http.get<MyEntity[]>(`${this.baseUrl}/search`, {
  //     params: { q: query }
  //   });
  // }
}
```

---

### 3. Store Layer (`my-domain.store.ts`)

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { MyEntity } from './models/my-entity.model';

/**
 * State management for MyDomain
 * Uses Angular Signals for reactive state
 */
@Injectable({ providedIn: 'root' })
export class MyDomainStore {
  // Private writable signals
  private _entities = signal<MyEntity[]>([]);
  private _selectedEntity = signal<MyEntity | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly allEntities = this._entities.asReadonly();
  readonly selectedEntity = this._selectedEntity.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals (derived state)
  readonly entityCount = computed(() => this._entities().length);
  
  readonly hasEntities = computed(() => this.entityCount() > 0);
  
  // Add domain-specific computed signals
  // Example:
  // readonly activeEntities = computed(() =>
  //   this._entities().filter(e => e.status === 'ACTIVE')
  // );

  // State mutations
  setEntities(entities: MyEntity[]) {
    this._entities.set(entities);
  }

  addEntity(entity: MyEntity) {
    this._entities.update(current => [...current, entity]);
  }

  updateEntity(id: string, updates: Partial<MyEntity>) {
    this._entities.update(current =>
      current.map(e => e.id === id ? { ...e, ...updates } : e)
    );
  }

  removeEntity(id: string) {
    this._entities.update(current => current.filter(e => e.id !== id));
  }

  selectEntity(entity: MyEntity | null) {
    this._selectedEntity.set(entity);
  }

  setLoading(loading: boolean) {
    this._loading.set(loading);
  }

  setError(error: string | null) {
    this._error.set(error);
  }

  clear() {
    this._entities.set([]);
    this._selectedEntity.set(null);
    this._loading.set(false);
    this._error.set(null);
  }
}
```

---

### 4. Facade Layer (`my-domain.facade.ts`)

```typescript
import { Injectable, inject, signal } from '@angular/core';
import { MyDomainApi } from './my-domain.api';
import { MyDomainStore } from './my-domain.store';
import { MyEntity, CreateMyEntityDto, UpdateMyEntityDto } from './models/my-entity.model';

/**
 * Facade for MyDomain
 * Public API that orchestrates API calls and store updates
 */
@Injectable({ providedIn: 'root' })
export class MyDomainFacade {
  private api = inject(MyDomainApi);
  private store = inject(MyDomainStore);
  
  // Track if data has been loaded
  private loaded = signal(false);

  // Expose store signals
  readonly allEntities = this.store.allEntities;
  readonly selectedEntity = this.store.selectedEntity;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly count = this.store.entityCount;
  readonly hasEntities = this.store.hasEntities;

  /**
   * Load all entities
   * Prevents duplicate calls if already loaded
   */
  loadAll() {
    if (this.loaded()) return; // Prevent duplicate calls

    this.store.setLoading(true);
    this.store.setError(null);

    this.api.getAll().subscribe({
      next: (entities) => {
        this.store.setEntities(entities);
        this.loaded.set(true);
        this.store.setLoading(false);
      },
      error: (err) => {
        this.store.setError(err.message || 'Failed to load entities');
        this.store.setLoading(false);
      }
    });
  }

  /**
   * Load a single entity by ID
   */
  loadById(id: string) {
    this.store.setLoading(true);
    this.store.setError(null);

    this.api.getById(id).subscribe({
      next: (entity) => {
        this.store.selectEntity(entity);
        this.store.setLoading(false);
      },
      error: (err) => {
        this.store.setError(err.message || 'Failed to load entity');
        this.store.setLoading(false);
      }
    });
  }

  /**
   * Create a new entity
   */
  create(dto: CreateMyEntityDto) {
    this.store.setLoading(true);
    this.store.setError(null);

    this.api.create(dto).subscribe({
      next: (created) => {
        this.store.addEntity(created);
        this.store.setLoading(false);
      },
      error: (err) => {
        this.store.setError(err.message || 'Failed to create entity');
        this.store.setLoading(false);
      }
    });
  }

  /**
   * Update an existing entity
   * Uses optimistic update
   */
  update(id: string, dto: UpdateMyEntityDto) {
    // Optimistic update
    this.store.updateEntity(id, dto as Partial<MyEntity>);

    this.api.update(id, dto).subscribe({
      next: (updated) => {
        // Confirm with server response
        this.store.updateEntity(id, updated);
      },
      error: (err) => {
        // Rollback on error
        this.refresh();
        this.store.setError(err.message || 'Failed to update entity');
      }
    });
  }

  /**
   * Delete an entity
   * Uses optimistic delete
   */
  delete(id: string) {
    // Optimistic delete
    this.store.removeEntity(id);

    this.api.delete(id).subscribe({
      error: (err) => {
        // Rollback on error
        this.refresh();
        this.store.setError(err.message || 'Failed to delete entity');
      }
    });
  }

  /**
   * Select an entity
   */
  selectEntity(entity: MyEntity | null) {
    this.store.selectEntity(entity);
  }

  /**
   * Refresh data from server
   */
  refresh() {
    this.loaded.set(false);
    this.loadAll();
  }

  /**
   * Clear all state
   */
  clear() {
    this.store.clear();
    this.loaded.set(false);
  }
}
```

---

### 5. Public Exports (`index.ts`)

```typescript
// Export models
export * from './models/my-entity.model';

// Export only the Facade (public API)
export { MyDomainFacade } from './my-domain.facade';

// ❌ DO NOT export API or Store (internal implementation)
// These should only be used by the Facade
```

---

## Usage Example

### In a Widget

```typescript
import { Component, inject, computed } from '@angular/core';
import { MyDomainFacade, MyEntity } from '@app/domain/my-domain';

@Component({
  selector: 'app-my-widget',
  template: `
    <div>
      <h3>Total: {{ count() }}</h3>
      
      @if (loading()) {
        <p>Loading...</p>
      }
      
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
      
      @for (entity of entities(); track entity.id) {
        <div>{{ entity.name }}</div>
      }
    </div>
  `
})
export class MyWidget {
  private facade = inject(MyDomainFacade);
  
  readonly entities = this.facade.allEntities;
  readonly count = this.facade.count;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  
  ngOnInit() {
    this.facade.loadAll();
  }
  
  onCreate(name: string) {
    this.facade.create({ name });
  }
  
  onDelete(id: string) {
    this.facade.delete(id);
  }
}
```

---

## Testing Template

### API Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyDomainApi } from './my-domain.api';

describe('MyDomainApi', () => {
  let api: MyDomainApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    api = TestBed.inject(MyDomainApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all entities', () => {
    const mockEntities = [{ id: '1', name: 'Test' }];

    api.getAll().subscribe(entities => {
      expect(entities).toEqual(mockEntities);
    });

    const req = httpMock.expectOne('/api/my-domain');
    expect(req.request.method).toBe('GET');
    req.flush(mockEntities);
  });
});
```

### Store Tests

```typescript
import { MyDomainStore } from './my-domain.store';

describe('MyDomainStore', () => {
  let store: MyDomainStore;

  beforeEach(() => {
    store = new MyDomainStore();
  });

  it('should set entities', () => {
    const entities = [{ id: '1', name: 'Test' }];
    store.setEntities(entities);
    expect(store.allEntities()).toEqual(entities);
  });

  it('should compute count', () => {
    store.setEntities([{ id: '1' }, { id: '2' }]);
    expect(store.entityCount()).toBe(2);
  });
});
```

### Facade Tests

```typescript
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MyDomainFacade } from './my-domain.facade';
import { MyDomainApi } from './my-domain.api';
import { MyDomainStore } from './my-domain.store';

describe('MyDomainFacade', () => {
  let facade: MyDomainFacade;
  let apiSpy: jasmine.SpyObj<MyDomainApi>;
  let store: MyDomainStore;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('MyDomainApi', ['getAll', 'create', 'delete']);
    store = new MyDomainStore();

    TestBed.configureTestingModule({
      providers: [
        MyDomainFacade,
        { provide: MyDomainApi, useValue: apiSpy },
        { provide: MyDomainStore, useValue: store }
      ]
    });

    facade = TestBed.inject(MyDomainFacade);
  });

  it('should load entities', () => {
    const mockEntities = [{ id: '1', name: 'Test' }];
    apiSpy.getAll.and.returnValue(of(mockEntities));

    facade.loadAll();

    expect(apiSpy.getAll).toHaveBeenCalled();
    expect(store.allEntities()).toEqual(mockEntities);
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

## Checklist

When creating a new domain, verify:

- [ ] Created `models/` directory with model interfaces
- [ ] Created `*.api.ts` with HTTP client
- [ ] Created `*.store.ts` with signals
- [ ] Created `*.facade.ts` with public API
- [ ] Created `index.ts` exporting only public API
- [ ] API layer has no state
- [ ] Store layer has no HTTP calls
- [ ] Facade prevents duplicate loads
- [ ] All files have proper TypeScript types
- [ ] Unit tests created for each layer

---

## References

- [Domain Layer Architecture](../00-CONCEPTS/Domain-Layer-Architecture.md)
- [Creating a Domain](Creating-A-Domain.md)
- [ADR-005: Domain-First Approach](../../04-ADR/ADR-005-Domain-First-Approach.md)
