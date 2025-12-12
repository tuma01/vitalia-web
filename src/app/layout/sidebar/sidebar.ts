import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MenuService } from '../../core/services/menu.service';
import { MenuItem } from '../../core/models/menu.model';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  private menuService = inject(MenuService);
  private settingsService = inject(SettingsService);

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
    this.menuService.loadMenuForRole(this.currentRole).subscribe({
      next: (config) => {
        this.menuItems = config.menu;
        console.log('[Sidebar] Menu loaded for role:', this.currentRole, this.menuItems);
      },
      error: (err) => {
        console.error('[Sidebar] Error loading menu:', err);
      }
    });
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
