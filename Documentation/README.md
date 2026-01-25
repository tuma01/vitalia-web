# Vitalia Frontend Documentation

**Widget-Domain Architecture**

---

## 📚 Documentation Index

Welcome to the Vitalia Frontend documentation. This guide will help you understand and implement the Widget-Domain architecture.

---

## 🚀 Quick Start

### For New Developers

**Reading Order**:
1. [Vitalia Frontend Architecture](02-ARCHITECTURE/Vitalia-Frontend-Architecture.md) ← **Start here**
2. [ADR-003: Widget-Based Architecture](04-ADR/ADR-003-Widget-Based-Architecture.md)
3. [ADR-004: Metadata-Driven UI](04-ADR/ADR-004-Metadata-Driven-UI.md)
4. [ADR-005: Domain-First Approach](04-ADR/ADR-005-Domain-First-Approach.md)
5. [Widget Design Rules](02-ARCHITECTURE/05-BEST-PRACTICES/Widget-Design-Rules.md)

### First Task

1. Read the [Domain Boilerplate](02-ARCHITECTURE/04-PATTERNS/domain-boilerplate.md)
2. Create a simple domain (e.g., `patients`)
3. Read the [Widget Boilerplate](02-ARCHITECTURE/04-PATTERNS/widget-boilerplate.md)
4. Create a simple widget (e.g., `patient-count-widget`)
5. Test it in a zone

---

## 📖 Documentation Structure

```
Documentation/
├── 01-GENERAL/              # General information
├── 02-ARCHITECTURE/         # Architecture documentation
│   ├── 00-CONCEPTS/         # Core concepts
│   ├── 04-PATTERNS/         # Implementation patterns
│   ├── 05-BEST-PRACTICES/   # Best practices & rules
│   └── Vitalia-Frontend-Architecture.md  # Master document
├── 03-SECURITY/             # Security documentation
└── 04-ADR/                  # Architecture Decision Records
```

---

## 🎯 Master Document

### [Vitalia Frontend Architecture](02-ARCHITECTURE/Vitalia-Frontend-Architecture.md)

**The canonical guide for the team.** This document covers:
- Vision and principles
- Project structure
- Domain architecture (DDD)
- Widget system
- Zone system
- Pages and routes
- Wizards and flows

---

## 📋 Architecture Decision Records (ADRs)

ADRs document **why** architectural decisions were made. They are historical and immutable.

### [ADR-003: Widget-Based Architecture](04-ADR/ADR-003-Widget-Based-Architecture.md)
- **Decision**: Adopt Widget-Based Architecture
- **Context**: Multi-tenant SaaS with dynamic dashboards
- **Alternatives**: Traditional routing, micro-frontends, NgRx
- **Status**: Accepted

### [ADR-004: Metadata-Driven UI](04-ADR/ADR-004-Metadata-Driven-UI.md)
- **Decision**: Backend orchestrates UI configuration
- **Context**: Tenant-specific UIs, permission-based widgets
- **Alternatives**: Frontend config, feature flags
- **Status**: Accepted

### [ADR-005: Domain-First Approach](04-ADR/ADR-005-Domain-First-Approach.md)
- **Decision**: DDD in frontend with Facades
- **Context**: Avoid widget complexity, reusable logic
- **Alternatives**: Direct HTTP in widgets, NgRx everywhere
- **Status**: Accepted

---

## 🧠 Core Concepts

### [Frontend Architecture Overview](02-ARCHITECTURE/00-CONCEPTS/Frontend-Architecture-Overview.md)
- Architectural principles
- The 4-layer stack
- Architecture diagram
- Data flow
- Comparison with traditional Angular

### [Domain Layer Architecture](02-ARCHITECTURE/00-CONCEPTS/Domain-Layer-Architecture.md)
- DDD principles in frontend
- Domain structure (API, Store, Facade)
- Why Facades never do HTTP directly
- Preventing duplicate HTTP calls
- Testing strategy

---

## 🛠️ Implementation Patterns

### [Project Structure Guide](02-ARCHITECTURE/04-PATTERNS/Project-Structure-Guide.md)
- Complete folder structure
- Naming conventions
- Where each type of file belongs
- Path aliases

### [Domain Boilerplate](02-ARCHITECTURE/04-PATTERNS/domain-boilerplate.md)
- Complete domain template (copy-paste ready)
- Models, API, Store, Facade
- Testing templates
- Checklist

### [Widget Boilerplate](02-ARCHITECTURE/04-PATTERNS/widget-boilerplate.md)
- Complete widget template (copy-paste ready)
- Component, template, styles, config
- Testing templates
- Common patterns

---

## ✅ Best Practices

### [Widget Design Rules](02-ARCHITECTURE/05-BEST-PRACTICES/Widget-Design-Rules.md)
- DO's and DON'Ts
- Widget complexity threshold
- Testing requirements
- Code examples

### [Code Review Checklist](02-ARCHITECTURE/05-BEST-PRACTICES/review-checklist.md)
- Widget review checklist
- Domain layer review checklist
- Architecture compliance checks
- Common anti-patterns

---

## 🔍 By Role

### For Developers
1. [Vitalia Frontend Architecture](02-ARCHITECTURE/Vitalia-Frontend-Architecture.md)
2. [Domain Boilerplate](02-ARCHITECTURE/04-PATTERNS/domain-boilerplate.md)
3. [Widget Boilerplate](02-ARCHITECTURE/04-PATTERNS/widget-boilerplate.md)
4. [Widget Design Rules](02-ARCHITECTURE/05-BEST-PRACTICES/Widget-Design-Rules.md)

### For Architects
1. [ADR-003](04-ADR/ADR-003-Widget-Based-Architecture.md)
2. [ADR-004](04-ADR/ADR-004-Metadata-Driven-UI.md)
3. [ADR-005](04-ADR/ADR-005-Domain-First-Approach.md)
4. [Frontend Architecture Overview](02-ARCHITECTURE/00-CONCEPTS/Frontend-Architecture-Overview.md)

### For Code Reviewers
1. [Code Review Checklist](02-ARCHITECTURE/05-BEST-PRACTICES/review-checklist.md)
2. [Widget Design Rules](02-ARCHITECTURE/05-BEST-PRACTICES/Widget-Design-Rules.md)
3. [Domain Layer Architecture](02-ARCHITECTURE/00-CONCEPTS/Domain-Layer-Architecture.md)

---

## 📝 By Task

### Creating a New Domain
1. Read [Domain Layer Architecture](02-ARCHITECTURE/00-CONCEPTS/Domain-Layer-Architecture.md)
2. Use [Domain Boilerplate](02-ARCHITECTURE/04-PATTERNS/domain-boilerplate.md)
3. Follow [Project Structure Guide](02-ARCHITECTURE/04-PATTERNS/Project-Structure-Guide.md)

### Creating a New Widget
1. Read [Widget Design Rules](02-ARCHITECTURE/05-BEST-PRACTICES/Widget-Design-Rules.md)
2. Use [Widget Boilerplate](02-ARCHITECTURE/04-PATTERNS/widget-boilerplate.md)
3. Register in WidgetRegistry

### Reviewing Code
1. Use [Code Review Checklist](02-ARCHITECTURE/05-BEST-PRACTICES/review-checklist.md)
2. Check against [Widget Design Rules](02-ARCHITECTURE/05-BEST-PRACTICES/Widget-Design-Rules.md)
3. Verify [Domain Layer Architecture](02-ARCHITECTURE/00-CONCEPTS/Domain-Layer-Architecture.md) compliance

---

## 🎓 Learning Path

### Week 1: Understanding
- [ ] Read [Vitalia Frontend Architecture](02-ARCHITECTURE/Vitalia-Frontend-Architecture.md)
- [ ] Read all 3 ADRs
- [ ] Understand [Domain Layer Architecture](02-ARCHITECTURE/00-CONCEPTS/Domain-Layer-Architecture.md)

### Week 2: Practice
- [ ] Create a simple domain using [Domain Boilerplate](02-ARCHITECTURE/04-PATTERNS/domain-boilerplate.md)
- [ ] Create a simple widget using [Widget Boilerplate](02-ARCHITECTURE/04-PATTERNS/widget-boilerplate.md)
- [ ] Write tests

### Week 3: Mastery
- [ ] Review someone else's PR using [Code Review Checklist](02-ARCHITECTURE/05-BEST-PRACTICES/review-checklist.md)
- [ ] Create a complex widget with multiple computed signals
- [ ] Contribute to architecture documentation

---

## 🔗 External Resources

- **Angular Signals**: https://angular.dev/guide/signals
- **Domain-Driven Design**: Eric Evans book
- **Clean Architecture**: Robert C. Martin
- **Enterprise UI Patterns**: Martin Fowler

---

## 📞 Getting Help

- **Architecture Questions**: Check ADRs first
- **Implementation Help**: Check boilerplates and patterns
- **Code Review**: Use the checklist
- **Team Discussion**: #frontend-architecture (Slack)

---

## 🔄 Keeping Documentation Updated

This documentation is a **living document**. When you:

- Make architectural changes → Update ADRs
- Discover new patterns → Update patterns docs
- Find better practices → Update best practices
- Create new templates → Add to boilerplates

**Last Updated**: 2026-01-22  
**Maintained By**: Equipo Frontend Vitalia

---

## 📊 Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| Vitalia Frontend Architecture | ✅ Complete | 2026-01-22 |
| ADR-003 | ✅ Complete | 2026-01-22 |
| ADR-004 | ✅ Complete | 2026-01-22 |
| ADR-005 | ✅ Complete | 2026-01-22 |
| Domain Layer Architecture | ✅ Complete | 2026-01-22 |
| Frontend Architecture Overview | ✅ Complete | 2026-01-22 |
| Project Structure Guide | ✅ Complete | 2026-01-22 |
| Widget Design Rules | ✅ Complete | 2026-01-22 |
| Domain Boilerplate | ✅ Complete | 2026-01-22 |
| Widget Boilerplate | ✅ Complete | 2026-01-22 |
| Code Review Checklist | ✅ Complete | 2026-01-22 |

---

**Welcome to the Vitalia Frontend team! 🚀**
