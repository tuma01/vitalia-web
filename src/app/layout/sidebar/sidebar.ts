import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuService } from '../../core/services/menu.service';
import { MenuItem } from '../../core/models/menu.model';
import { SettingsService } from '../../core/services/settings.service';
import { SessionService } from '../../core/services/session.service';
import { filter } from 'rxjs/operators';
import {
  UiIconComponent,
  UiSidenavComponent,
  UiSidenavItem
} from '@ui';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    UiIconComponent,
    UiSidenavComponent
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  private menuService = inject(MenuService);
  private settingsService = inject(SettingsService);
  private sessionService = inject(SessionService);
  private translate = inject(TranslateService);
  private router = inject(Router);

  menuItems: UiSidenavItem[] = [];
  activeItemId = '';
  isCollapsed = false;
  isHovering = false;
  sidenavColor = this.settingsService.sidenavColor;

  @Output() hoverChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.loadMenu();
    this.trackActiveRoute();
  }

  loadMenu(): void {
    const userRole = this.getMenuRoleFromUserRole();

    if (!userRole) {
      console.warn('[Sidebar] No valid role found for menu loading');
      return;
    }

    this.menuService.loadMenuForRole(userRole).subscribe({
      next: (config) => {
        this.menuItems = this.mapMenuItems(config.menu);
        console.log('[Sidebar] Menu loaded and mapped for role:', userRole, this.menuItems);
        this.updateActiveItem();
      },
      error: (err) => {
        console.error('[Sidebar] Error loading menu:', err);
      }
    });
  }

  private mapMenuItems(items: MenuItem[]): UiSidenavItem[] {
    return items.map(item => ({
      id: item.id || item.name,
      label: this.translate.instant('menu.' + item.name),
      icon: item.icon || 'circle',
      route: item.route,
      badge: item.badge?.value,
      // Map badge color if needed, defaulting to primary
      badgeColor: 'primary',
      children: item.children ? this.mapMenuItems(item.children) : undefined
    }));
  }

  private trackActiveRoute(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveItem();
    });
  }

  private updateActiveItem(): void {
    const currentRoute = this.router.url;
    const activeItem = this.findActiveItem(this.menuItems, currentRoute);
    if (activeItem) {
      this.activeItemId = activeItem.id;
    }
  }

  private findActiveItem(items: UiSidenavItem[], url: string): UiSidenavItem | undefined {
    for (const item of items) {
      if (item.route && url.startsWith(item.route as string)) {
        return item;
      }
      if (item.children) {
        const activeChild = this.findActiveItem(item.children, url);
        if (activeChild) return activeChild;
      }
    }
    return undefined;
  }

  private getMenuRoleFromUserRole(): string {
    // Check for specific priority roles first
    if (this.sessionService.hasRole('ROLE_SUPER_ADMIN')) return 'super-admin';

    // Map both standard ADMIN and TENANT_ADMIN to the tenant admin menu
    if (this.sessionService.hasRole('ROLE_TENANT_ADMIN') || this.sessionService.hasRole('ROLE_ADMIN')) {
      return 'tenant-admin';
    }

    if (this.sessionService.hasRole('ROLE_DOCTOR')) return 'doctor';
    if (this.sessionService.hasRole('ROLE_NURSE')) return 'nurse';
    if (this.sessionService.hasRole('ROLE_EMPLOYEE')) return 'employee';
    if (this.sessionService.hasRole('ROLE_PATIENT')) return 'patient';

    return '';
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  setCollapsed(collapsed: boolean): void {
    this.isCollapsed = collapsed;
  }

  onMouseEnter(): void {
    if (this.isCollapsed) {
      this.isHovering = true;
      this.hoverChange.emit(true);
    }
  }

  onMouseLeave(): void {
    this.isHovering = false;
    this.hoverChange.emit(false);
  }
}
