import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { MenuConfig, MenuItem } from '../models/menu.model';
import { AuthService } from './auth.service';

/**
 * Service to manage role-based menu configurations
 */
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private currentMenuSubject = new BehaviorSubject<MenuItem[]>([]);

  /** Observable of current menu items */
  public currentMenu$ = this.currentMenuSubject.asObservable();

  /** Cache for loaded menus */
  private menuCache = new Map<string, Observable<MenuConfig>>();

  /**
   * Load menu configuration for a specific role
   */
  loadMenuForRole(role: string): Observable<MenuConfig> {
    if (this.menuCache.has(role)) {
      return this.menuCache.get(role)!;
    }

    const menuUrl = `assets/menus/${role}-menu.json`;
    const menu$ = this.http.get<MenuConfig>(menuUrl).pipe(
      map(config => this.filterVisibleItems(config)),
      catchError(error => {
        console.error(`Failed to load menu for role: ${role}`, error);
        return of({ menu: [] });
      }),
      shareReplay(1)
    );

    this.menuCache.set(role, menu$);
    return menu$;
  }

  private filterVisibleItems(config: MenuConfig): MenuConfig {
    return {
      menu: this.filterMenuItems(config.menu)
    };
  }

  private filterMenuItems(items: MenuItem[]): MenuItem[] {
    const userRole = this.auth.currentUserRole();

    return items
      .filter(item => this.isVisible(item, userRole))
      .map(item => ({
        ...item,
        children: item.children ? this.filterMenuItems(item.children) : undefined
      }));
  }

  private isVisible(item: MenuItem, role: string): boolean {
    if (item.visible === false) return false;

    if (item.permissions?.only && !item.permissions.only.includes(role)) {
      return false;
    }

    if (item.permissions?.except && item.permissions.except.includes(role)) {
      return false;
    }

    return true;
  }

  clearCache(): void {
    this.menuCache.clear();
  }
}
