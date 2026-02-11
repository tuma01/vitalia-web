import { Component, OnInit, inject, Output, EventEmitter, input, ViewEncapsulation, computed, effect } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MenuService } from '../../../core/services/menu.service';
import { MenuItem } from '../../../core/models/menu.model';
import { SettingsService } from '../../../core/services/settings.service';
import { SessionService } from '../../../core/services/session.service';
import { AppContextService } from '../../../core/services/app-context.service';
import { filter, map } from 'rxjs/operators';

// Material Components
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

export interface SidenavItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  badge?: string | number;
  badgeColor?: string;
  children?: SidenavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatListModule,
    MatIconModule,
    MatBadgeModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  encapsulation: ViewEncapsulation.None
})
export class Sidebar implements OnInit {
  private menuService = inject(MenuService);
  private settingsService = inject(SettingsService);
  private sessionService = inject(SessionService);
  private appContext = inject(AppContextService); // 🔥 ADDED
  private translate = inject(TranslateService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  activeItemId = '';
  isCollapsed = input(false);
  isHovering = false;
  isMobile = false;

  // ✅ Reactive User info (from signals)
  userName = computed(() => this.sessionService.user()?.personName || 'Usuario');

  // 🏆 The role to display in sidebar (matched with template)
  userRole = computed(() => {
    const active = this.sessionService.activeRole();
    if (active) return active;
    return this.sessionService.user()?.roles?.[0] || 'Rol';
  });

  menuItems: SidenavItem[] = [];

  @Output() hoverChange = new EventEmitter<boolean>();
  @Output() menuItemClick = new EventEmitter<void>();

  constructor() {
    // 🔄 Reactively reload menu when role changes
    effect(() => {
      const role = this.userRole();
      if (role) {
        this.loadMenu();
      }
    });
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    this.trackActiveRoute();
  }

  onMenuItemClick(): void {
    if (this.isMobile) {
      this.menuItemClick.emit();
    }
  }

  // loadUserInfo is no longer needed as we use computed signals

  loadMenu(): void {
    const userRole = this.getMenuRoleFromUserRole();
    if (!userRole) return;

    this.menuService.loadMenuForRole(userRole).subscribe({
      next: (config) => {
        this.menuItems = this.mapMenuItems(config.menu);
        this.updateActiveItem();
      },
      error: (err) => console.error('[Sidebar] Error loading menu:', err)
    });
  }

  private mapMenuItems(items: MenuItem[]): SidenavItem[] {
    return items.map(item => ({
      id: item.id || item.name,
      label: this.translate.instant('menu.' + item.name),
      icon: item.icon || 'circle',
      route: item.route,
      badge: item.badge?.value,
      badgeColor: 'primary',
      children: item.children ? this.mapMenuItems(item.children) : undefined
    }));
  }

  private trackActiveRoute(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.updateActiveItem());
  }

  private updateActiveItem(): void {
    const currentRoute = this.router.url;
    const activeItem = this.findActiveItem(this.menuItems, currentRoute);
    if (activeItem) {
      this.activeItemId = activeItem.id;
    }
  }

  private findActiveItem(items: SidenavItem[], url: string): SidenavItem | undefined {
    for (const item of items) {
      if (item.route && url.startsWith(item.route)) return item;
      if (item.children) {
        const activeChild = this.findActiveItem(item.children, url);
        if (activeChild) return activeChild;
      }
    }
    return undefined;
  }

  private getMenuRoleFromUserRole(): string {
    // 🛡️ Prioritize context for platform detection
    if (this.appContext.isPlatform()) return 'super-admin';

    // 🏆 PRIORITY 1: Respect the active role from session (the one selected at login)
    const activeRole = this.sessionService.getActiveRoleSync();
    if (activeRole) {
      if (activeRole === 'ROLE_SUPER_ADMIN') return 'super-admin';
      if (activeRole === 'ROLE_ADMIN' || activeRole === 'ROLE_TENANT_ADMIN') return 'tenant-admin';
      if (activeRole === 'ROLE_DOCTOR') return 'doctor';
      if (activeRole === 'ROLE_NURSE') return 'nurse';
      if (activeRole === 'ROLE_EMPLOYEE') return 'employee';
      if (activeRole === 'ROLE_PATIENT') return 'patient';
    }

    // 🏆 PRIORITY 2: Discovery fallback (standard priority)
    if (this.sessionService.hasRole('ROLE_TENANT_ADMIN') || this.sessionService.hasRole('ROLE_ADMIN')) {
      return 'tenant-admin';
    }
    if (this.sessionService.hasRole('ROLE_DOCTOR')) return 'doctor';
    if (this.sessionService.hasRole('ROLE_NURSE')) return 'nurse';
    if (this.sessionService.hasRole('ROLE_EMPLOYEE')) return 'employee';
    if (this.sessionService.hasRole('ROLE_PATIENT')) return 'patient';

    return '';
  }

  onMouseEnter(): void {
    if (this.isCollapsed()) {
      this.isHovering = true;
      this.hoverChange.emit(true);
    }
  }

  onMouseLeave(): void {
    this.isHovering = false;
    this.hoverChange.emit(false);
  }

  /**
   * ✅ Determina si una ruta está activa (para [activated] de Material)
   */
  isActiveRoute(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url.startsWith(route);
  }
}
