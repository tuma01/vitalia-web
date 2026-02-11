import { Component, OnInit, inject, Output, EventEmitter, signal, input, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MenuService } from '../../../core/services/menu.service';
import { MenuItem } from '../../../core/models/menu.model';
import { SettingsService } from '../../../core/services/settings.service';
import { SessionService } from '../../../core/services/session.service';
import { filter } from 'rxjs/operators';

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
  private translate = inject(TranslateService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  menuItems: SidenavItem[] = [];
  activeItemId = '';
  isCollapsed = input(false);
  isHovering = false;
  isMobile = false;

  // ✅ User info
  userName = signal<string>('');
  userRole = signal<string>('');

  @Output() hoverChange = new EventEmitter<boolean>();
  @Output() menuItemClick = new EventEmitter<void>();

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    this.loadMenu();
    this.trackActiveRoute();
    this.loadUserInfo(); // ✅ Load user info
  }

  onMenuItemClick(): void {
    if (this.isMobile) {
      this.menuItemClick.emit();
    }
  }

  /**
   * ✅ Load user information from SessionService
   */
  private loadUserInfo(): void {
    const user = this.sessionService.getCurrentUser();
    if (user) {
      this.userName.set(user.personName || 'Usuario');
      this.userRole.set(user.roles?.[0] || 'Rol'); // ✅ Use first role from roles array
    }
  }

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
    if (this.sessionService.hasRole('ROLE_SUPER_ADMIN')) return 'super-admin';
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
