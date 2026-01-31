import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService } from '../../core/services/menu.service';
import { MenuItem } from '../../core/models/menu.model';
import { SettingsService } from '../../core/services/settings.service';
import { SessionService } from '../../core/services/session.service';
import {
  UiIconComponent,
  UiExpansionPanelComponent,
  UiTooltipDirective
} from '@ui';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    UiIconComponent,
    UiExpansionPanelComponent,
    UiTooltipDirective
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  private menuService = inject(MenuService);
  private settingsService = inject(SettingsService);
  private sessionService = inject(SessionService);

  menuItems: MenuItem[] = [];
  isCollapsed = false;
  isHovering = false;
  sidebarColor = this.settingsService.sidebarColor;

  // TODO: Get from auth service
  currentRole = 'tenant-admin';

  @Output() hoverChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(): void {
    const userRole = this.getMenuRoleFromUserRole();

    if (!userRole) {
      console.warn('[Sidebar] No valid role found for menu loading');
      return;
    }

    this.menuService.loadMenuForRole(userRole).subscribe({
      next: (config) => {
        this.menuItems = config.menu;
        console.log('[Sidebar] Menu loaded for role:', userRole, this.menuItems);
      },
      error: (err) => {
        console.error('[Sidebar] Error loading menu:', err);
      }
    });
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
