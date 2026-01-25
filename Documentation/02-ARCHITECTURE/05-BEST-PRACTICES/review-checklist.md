# Code Review Checklist

> **Living Document** - Updated as standards evolve  
> **Last Updated**: 2026-01-22  
> **For**: Code reviewers and developers

---

## Purpose

This checklist ensures that all code changes comply with the Widget-Domain architecture standards before merging.

---

## General Checklist

### Code Quality
- [ ] Code follows TypeScript best practices
- [ ] No `any` types (use proper typing)
- [ ] No console.log statements (use logging service)
- [ ] No commented-out code
- [ ] Meaningful variable and function names
- [ ] Code is self-documenting or has necessary comments

### Testing
- [ ] Unit tests added/updated
- [ ] All tests pass
- [ ] Test coverage maintained or improved
- [ ] Edge cases covered

---

## Widget Review Checklist

Use this when reviewing widget PRs.

### Configuration
- [ ] Single `@Input() config` with typed interface
- [ ] Config interface has JSDoc comments
- [ ] Optional properties have default values via `computed()`
- [ ] No multiple `@Input()` properties

### Dependencies
- [ ] Uses **Facade**, not HTTP services
- [ ] Does NOT inject `HttpClient`
- [ ] Does NOT inject `Router` or `ActivatedRoute`
- [ ] Injects only ONE Facade (not multiple)

### State Management
- [ ] Uses `computed()` for derived state
- [ ] No manual subscriptions (use signals)
- [ ] No business logic in component
- [ ] No state mutations in template

### Template
- [ ] Handles loading state
- [ ] Handles error state
- [ ] Uses `@if` and `@for` (new control flow)
- [ ] No complex logic in template

### Size & Complexity
- [ ] Component <200 lines
- [ ] Template <100 lines
- [ ] Single responsibility (does one thing well)

### Events
- [ ] Emits events via `@Output()`
- [ ] Event names are descriptive
- [ ] Widget doesn't handle its own events

### Registration
- [ ] Widget registered in `WidgetRegistry`
- [ ] Widget type string is kebab-case

### Testing
- [ ] Unit tests for component logic
- [ ] Tests for config variations
- [ ] Tests for event emissions

---

## Domain Layer Review Checklist

Use this when reviewing domain PRs.

### Structure
- [ ] Follows domain structure: `models/`, `*.api.ts`, `*.store.ts`, `*.facade.ts`, `index.ts`
- [ ] Files use correct naming convention
- [ ] `index.ts` exports only public API (Facade + models)

### API Layer (`*.api.ts`)
- [ ] Only HTTP calls, no state
- [ ] Returns `Observable<T>`
- [ ] Uses proper HTTP methods (GET, POST, PUT, DELETE)
- [ ] Error handling delegated to Facade
- [ ] No business logic

### Store Layer (`*.store.ts`)
- [ ] Uses Angular Signals
- [ ] Private writable signals, public readonly
- [ ] Has computed signals for derived state
- [ ] No HTTP calls
- [ ] No business logic (only state mutations)

### Facade Layer (`*.facade.ts`)
- [ ] Orchestrates API + Store
- [ ] **Never makes HTTP calls directly** (uses API layer)
- [ ] Prevents duplicate HTTP calls (uses `loaded` signal)
- [ ] Handles loading/error states
- [ ] Exposes simple, high-level methods
- [ ] Uses optimistic updates where appropriate

### Models
- [ ] Proper TypeScript interfaces
- [ ] JSDoc comments for complex types
- [ ] Separate DTOs if needed (CreateDto, UpdateDto)

### Testing
- [ ] API layer tests (mock HttpClient)
- [ ] Store layer tests (signal updates)
- [ ] Facade layer tests (mock API and Store)

---

## Architecture Compliance Checklist

### Folder Structure
- [ ] Files in correct directories
- [ ] No UI components in `core/`
- [ ] No HTTP calls in widgets
- [ ] No business logic in `shared/`

### Imports
- [ ] Uses path aliases (`@app/`, `@domain/`, etc.)
- [ ] No circular dependencies
- [ ] Imports from `index.ts` (not internal files)

### Naming Conventions
- [ ] Domain files: `*.api.ts`, `*.store.ts`, `*.facade.ts`
- [ ] Widget files: `*.component.ts`, `*.config.ts`
- [ ] Kebab-case for file names
- [ ] PascalCase for classes/interfaces

---

## Common Anti-Patterns to Watch For

### ❌ Widget Anti-Patterns

```typescript
// ❌ BAD: Multiple inputs
@Input() title!: string;
@Input() type!: string;

// ❌ BAD: Direct HTTP
private http = inject(HttpClient);

// ❌ BAD: Multiple facades
private patientsFacade = inject(PatientsFacade);
private billingFacade = inject(BillingFacade);

// ❌ BAD: Business logic
calculateRiskScore(patient: Patient): number {
  return patient.age * 0.3 + patient.conditions.length * 2;
}

// ❌ BAD: Router dependency
private router = inject(Router);
```

### ❌ Domain Anti-Patterns

```typescript
// ❌ BAD: Facade making HTTP calls
export class PatientsFacade {
  private http = inject(HttpClient);
  
  loadAll() {
    this.http.get('/api/patients').subscribe(...);
  }
}

// ❌ BAD: Store making HTTP calls
export class PatientsStore {
  private http = inject(HttpClient);
  
  loadData() {
    this.http.get('/api/patients').subscribe(...);
  }
}

// ❌ BAD: API with state
export class PatientsApi {
  private patients = signal<Patient[]>([]);
}
```

---

## Performance Checklist

- [ ] Lazy loading used for routes
- [ ] Widgets loaded on-demand
- [ ] No unnecessary re-renders
- [ ] Signals used efficiently
- [ ] No memory leaks (subscriptions cleaned up)

---

## Security Checklist

- [ ] No sensitive data in logs
- [ ] No hardcoded credentials
- [ ] Proper input validation
- [ ] XSS prevention (Angular handles this)
- [ ] No eval() or innerHTML

---

## Accessibility Checklist

- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader friendly

---

## Documentation Checklist

- [ ] JSDoc comments for public APIs
- [ ] README updated if needed
- [ ] Architecture docs updated if structure changed
- [ ] ADR created for significant decisions

---

## Before Merging

### Final Checks
- [ ] All checklist items passed
- [ ] CI/CD pipeline green
- [ ] No merge conflicts
- [ ] Branch up to date with main
- [ ] At least one approval from senior developer

### Communication
- [ ] PR description is clear
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)
- [ ] Team notified of significant changes

---

## Review Comments Template

### For Violations

```markdown
❌ **Architecture Violation**: Widget is injecting HttpClient directly

**Issue**: Widgets should not make HTTP calls. They should use Facades.

**Fix**: 
1. Remove `HttpClient` injection
2. Inject `PatientsFacade` instead
3. Call `facade.loadPatients()` instead of HTTP

**Reference**: [Widget Design Rules](Widget-Design-Rules.md)
```

### For Suggestions

```markdown
💡 **Suggestion**: Consider using computed signal

**Current**:
\`\`\`typescript
get count(): number {
  return this.patients().length;
}
\`\`\`

**Better**:
\`\`\`typescript
readonly count = computed(() => this.patients().length);
\`\`\`

**Why**: Computed signals are more efficient and reactive.
```

---

## Severity Levels

Use these labels in PR reviews:

- 🔴 **BLOCKER**: Must fix before merge (architecture violation, security issue)
- 🟡 **IMPORTANT**: Should fix (best practice violation, performance issue)
- 🟢 **MINOR**: Nice to have (style, documentation)
- 💡 **SUGGESTION**: Optional improvement

---

## References

- [Widget Design Rules](Widget-Design-Rules.md)
- [Domain Layer Architecture](../00-CONCEPTS/Domain-Layer-Architecture.md)
- [Project Structure Guide](../04-PATTERNS/Project-Structure-Guide.md)
- [Vitalia Frontend Architecture](../Vitalia-Frontend-Architecture.md)
- [ADR-003](../../04-ADR/ADR-003-Widget-Based-Architecture.md)
- [ADR-004](../../04-ADR/ADR-004-Metadata-Driven-UI.md)
- [ADR-005](../../04-ADR/ADR-005-Domain-First-Approach.md)
