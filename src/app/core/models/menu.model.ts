/**
 * Badge configuration for menu items
 */
export interface MenuBadge {
    /** Badge color (e.g., 'red-50', 'blue-100') */
    color: string;
    /** Badge value/text to display */
    value: string;
}

/**
 * Menu item type
 * - 'link': Direct navigation link
 * - 'sub': Submenu with children
 */
export type MenuItemType = 'link' | 'sub' | 'extLink' | 'extTabLink';

/**
 * Permission configuration for menu items.
 * - only: only visible for these roles
 * - except: visible for everyone except these roles
 */
export interface MenuPermissions {
  only?: string[];
  except?: string[];
}

/**
 * Individual menu item
 */
export interface MenuItem {
  /** Route path (can be relative or absolute) */
  route: string;

  /** Translation key for menu item name */
  name: string;

  /** Menu item type */
  type: MenuItemType;

  /** Material icon name (optional for sub items) */
  icon?: string;

  /** Badge configuration (optional) */
  badge?: MenuBadge;

  /** Child menu items (for type: 'sub') */
  children?: MenuItem[];

  /** Visibility flag (default: true) */
  visible?: boolean;

  /** Role-based permissions */
  permissions?: MenuPermissions;

  /** Required tenant feature (ex: 'pharmacy', 'laboratory') */
  tenantFeature?: string;
}

/**
 * Complete menu configuration
 */
export interface MenuConfig {
    /** Array of top-level menu items */
    menu: MenuItem[];
}
