import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { MenuConfig, MenuItem } from '../models/menu.model';
import { AuthService } from './auth.service';
import { TenantService } from './tenant.service';

/**
 * Service to manage role-based menu configurations
 */
@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);
    private currentMenuSubject = new BehaviorSubject<MenuItem[]>([]);

    /** Observable of current menu items */
    public currentMenu$ = this.currentMenuSubject.asObservable();

    /** Cache for loaded menus */
    private menuCache = new Map<string, Observable<MenuConfig>>();

    /**
     * Load menu configuration for a specific role
     * @param role User role (e.g., 'tenant-admin', 'doctor', 'patient', 'super-admin')
     * @returns Observable of menu configuration
     */
    loadMenuForRole(role: string): Observable<MenuConfig> {
        // Check cache first
        if (this.menuCache.has(role)) {
            return this.menuCache.get(role)!;
        }

        // Load from assets
        const menuUrl = `assets/menus/${role}-menu.json`;
        const menu$ = this.http.get<MenuConfig>(menuUrl).pipe(
            map(config => this.filterVisibleItems(config)),
            catchError(error => {
                console.error(`Failed to load menu for role: ${role}`, error);
                // Return empty menu on error
                return of({ menu: [] });
            }),
            shareReplay(1) // Cache the result
        );

        this.menuCache.set(role, menu$);
        return menu$;
    }

    /**
     * Set the current menu (updates the subject)
     * @param menuItems Array of menu items
     */
    setCurrentMenu(menuItems: MenuItem[]): void {
        this.currentMenuSubject.next(menuItems);
    }

    /**
     * Clear menu cache (useful when user role changes)
     */
    clearCache(): void {
        this.menuCache.clear();
    }

    // --- 🔥 IMPROVED FILTERS ---

  private applyFilters(config: MenuConfig): MenuConfig {
    return {
      menu: this.filterMenuItems(config.menu)
    };
  }

    /**
     * Filter menu items based on visibility flag
     * @param config Menu configuration
     * @returns Filtered menu configuration
     */
    private filterVisibleItems(config: MenuConfig): MenuConfig {
        return {
            menu: this.filterMenuItems(config.menu)
        };
    }

    /**
     * Recursively filter menu items by visibility
     * @param items Menu items to filter
     * @returns Filtered menu items
     */
    private filterMenuItems2(items: MenuItem[]): MenuItem[] {
        return items
            .filter(item => item.visible !== false)
            .map(item => {
                if (item.children) {
                    return {
                        ...item,
                        children: this.filterMenuItems(item.children)
                    };
                }
                return item;
            });
    }

  private filterMenuItems(items: MenuItem[]): MenuItem[] {
    const userRole = this.auth.currentUserRole();
    const tenantFeatures = this.tenantService.getActiveFeatures();

    return items
      .filter(item => this.isVisible(item, userRole, tenantFeatures))
      .map(item => ({
        ...item,
        children: item.children ? this.filterMenuItems(item.children) : undefined
      }));
  }

  private isVisible(item: MenuItem, role: string, tenantFeatures: string[]): boolean {

    if (item.visible === false) return false;

    if (item.permissions?.only && !item.permissions.only.includes(role)) {
      return false;
    }

    if (item.permissions?.except && item.permissions.except.includes(role)) {
      return false;
    }

    if (item.tenantFeature && !tenantFeatures.includes(item.tenantFeature)) {
      return false;
    }

    return true;
  }


}
