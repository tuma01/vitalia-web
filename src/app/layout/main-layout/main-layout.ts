import { Component, ViewChild, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { SettingsPanel } from '../settings-panel/settings-panel';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, RouterOutlet, Header, Sidebar, SettingsPanel, FooterComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  @ViewChild('sidebar') sidebarComponent!: Sidebar;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  sidenavOpened = true;
  sidebarCollapsed = false;
  sidebarHovered = false;
  settingsPanelOpen = false;

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset, '(max-width: 992px)'])
      .subscribe(result => {
        this.isMobile = result.matches;

        if (this.isMobile) {
          this.sidenavOpened = false;
          this.sidebarCollapsed = false;
        } else {
          this.sidenavOpened = true;
        }
        this.cd.markForCheck();
      });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isMobile && this.sidenav) {
        this.sidenav.close();
      }
    });
  }

  toggleSidebar(): void {
    if (this.isMobile && this.sidenav) {
      this.sidenav.toggle();
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
    this.cd.markForCheck();
  }

  onSidebarHover(isHovering: boolean): void {
    this.sidebarHovered = isHovering;
    this.cd.markForCheck();
  }

  toggleSettings(): void {
    this.settingsPanelOpen = !this.settingsPanelOpen;
  }
}
