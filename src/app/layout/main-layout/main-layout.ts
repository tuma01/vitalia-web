import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { SettingsPanel } from '../settings-panel/settings-panel';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, RouterOutlet, Header, Sidebar, SettingsPanel],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  @ViewChild('sidebar') sidebar!: Sidebar;

  sidenavOpened = true;
  sidebarCollapsed = false;
  sidebarHovered = false;

  toggleSidebar(): void {
    // Simple 2-state toggle: expanded <-> collapsed
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebar.setCollapsed(this.sidebarCollapsed);
    // Reset hover state on toggle
    if (!this.sidebarCollapsed) {
      this.sidebarHovered = false;
    }
  }

  onSidebarHover(isHovering: boolean): void {
    this.sidebarHovered = isHovering;
  }


}
