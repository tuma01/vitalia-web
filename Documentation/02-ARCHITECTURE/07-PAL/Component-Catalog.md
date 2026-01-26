# Component Catalog - PAL Design System

**Category**: Extended PAL / Supplemental Components
**Status**: 🚀 Implemented & Validated

This document catalogs the supplemental components added to the Vitalia Design System to extend its capabilities for navigation, lists, and contextual feedback.

## Summary Table

| Component | Selector | Type | Purpose |
|-----------|----------|------|---------|
| [Divider](#ui-divider) | `ui-divider` | Atomic | Visual separation of content. |
| [List](#ui-list) | `ui-list`, `ui-list-item` | Molecular | Structured data display. |
| [Tooltip](#ui-tooltip) | `[uiTooltip]` | Utility | Contextual information on hover. |
| [Menu](#ui-menu) | `ui-menu`, `[uiMenuItem]` | Molecular | Dropdown actions and navigation. |
| [Slider](#ui-slider) | `ui-slider` | Primitive | Value selection with range support. |
| [Rating](#ui-rating) | `ui-rating` | Primitive | Star-based or icon-based feedback. |
| [Autocomplete](#ui-autocomplete) | `ui-autocomplete` | Molecular | Searchable selection with complex object support. |
| [File Uploader](#ui-file-uploader) | `ui-file-uploader` | Molecular | Drag & drop zone with progress tracking. |

---

## Component Details

### ui-divider
A simple semantic separator.

**API**:
- `orientation`: `'horizontal' | 'vertical'` (default: `'horizontal'`)
- `inset`: `boolean` - Adds a left margin for nested lists.

**Example**:
```html
<ui-divider [inset]="true"></ui-divider>
```

---

### ui-list
Wraps Angular Material lists with standardized branding.

**Components**:
- `ui-list`: Main container.
- `ui-list-item`: Individual item.

**Directives**:
- `uiListItemIcon`: Slot for icons.
- `uiListItemTitle`: Slot for primary text.
- `uiListItemLine`: Slot for secondary text.

---

### ui-tooltip
A directive that wraps `matTooltip` with global design compliance.

**Example**:
```html
<ui-button uiTooltip="Action detail" uiTooltipPosition="above">Button</ui-button>
```

---

### ui-menu
A molecular component for dropdown actions.

**Components**:
- `ui-menu`: Menu container.
- `button[uiMenuItem]`: Menu item trigger.

**Example**:
```html
<ui-button [matMenuTriggerFor]="menu.matMenu">Open</ui-button>
<ui-menu #menu="uiMenu">
  <button uiMenuItem>Option 1</button>
  <button uiMenuItem>Option 2</button>
</ui-menu>
```

---

### ui-slider
A professional slider component supporting continuous and discrete modes.

**API**:
- `min`: `number` - Minimum value (default: 0).
- `max`: `number` - Maximum value (default: 100).
- `step`: `number` - Selection interval.
- `discrete`: `boolean` - Shows value labels on thumb.
- `showTicks`: `boolean` - Visual tick marks.

---

### ui-rating
Interactive icon-based rating system.

**API**:
- `max`: `number` - Number of icons (default: 5).
- `readonly`: `boolean` - Read-only mode.
- `icon`: `string` - Active icon name (Material).
- `iconOutline`: `string` - Inactive icon name.

---

### ui-autocomplete
Advanced search-as-you-type component with state synchronization.

**Features**:
- **DI State Sync**: Automatically communicates focus/empty state to parent `ui-form-field`.
- **Complex Objects**: Supports `{label, value}` structures.
- **Reactive Filtering**: Local filtering with optimized change detection.

---

### ui-file-uploader
Modern file selection zone with animation.

**Features**:
- **Drag & Drop**: Native zone monitoring.
- **Progress Tracking**: Integrated `ui-progress-bar`.
- **i18n Support**: Dynamic size and type hints.
