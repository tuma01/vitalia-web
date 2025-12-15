import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
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
export class MainLayout implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  @ViewChild('sidebar') sidebar!: Sidebar;

  // Responsive state
  isMobile = false;

  // Sidebar state
  sidenavOpened = true;
  sidebarCollapsed = false;
  sidebarHovered = false;

  ngOnInit(): void {
    // Breakpoint: 992px (Tablets/Mobile < 992px)
    this.breakpointObserver.observe(['(max-width: 992px)'])
      .subscribe(result => {
        this.isMobile = result.matches;

        if (this.isMobile) {
          this.sidenavOpened = false; // Closed by default on mobile
          this.sidebarCollapsed = false; // Never collapsed on mobile (always full width when open)
        } else {
          this.sidenavOpened = true; // Open by default on desktop
          this.sidebarCollapsed = false; // Expanded by default on desktop init
        }
      });

    // Close sidenav on navigation (mobile only)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isMobile) {
        this.sidenavOpened = false;
      }
    });
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      // On mobile: Toggle visibility (Open/Close)
      this.sidenavOpened = !this.sidenavOpened;
    } else {
      // On desktop: Toggle collapse state (Shrink/Expand)
      this.sidebarCollapsed = !this.sidebarCollapsed;
      this.sidebar.setCollapsed(this.sidebarCollapsed);

      // Reset hover state immediately to prevent "stuck" expansion
      if (!this.sidebarCollapsed) {
        this.sidebarHovered = false;
      }
    }
  }

  onSidebarHover(isHovering: boolean): void {
    this.sidebarHovered = isHovering;
  }
}
