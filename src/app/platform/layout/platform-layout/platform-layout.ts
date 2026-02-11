import { Component, ViewChild, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SettingsPanel } from '../../../shared/components/settings-panel/settings-panel';

/**
 * Platform Layout
 * 
 * Dedicated layout for SuperAdmin platform routes.
 * Simplified version without tenant selector or settings panel.
 */
@Component({
    selector: 'app-platform-layout',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        RouterOutlet,
        Header,
        Sidebar,
        FooterComponent,
        SettingsPanel
    ],
    templateUrl: './platform-layout.html',
    styleUrl: './platform-layout.scss',
})
export class PlatformLayout implements OnInit {
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
        this.cd.markForCheck();
    }
}
