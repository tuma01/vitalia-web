import { Component, OnInit, inject, input, Input, ViewEncapsulation, effect, computed, Output, EventEmitter, signal } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { filter } from 'rxjs/operators';
import { MenuService } from '../../../core/services/menu.service';
import { SidenavItem } from './sidemenu.model';
import { SessionService } from '../../../core/services/session.service';
import { AppContextService } from '../../../core/services/app-context.service';

@Component({
    selector: 'app-sidemenu',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        MatListModule,
        MatIconModule,
        MatBadgeModule
    ],
    animations: [
        trigger('expansion', [
            state('collapsed', style({ height: '0px', visibility: 'hidden', overflow: 'hidden' })),
            state('expanded', style({ height: '*', visibility: 'visible', overflow: 'hidden' })),
            transition('expanded <=> collapsed', animate('200ms cubic-bezier(0.4,0,0.2,1)')),
        ]),
    ],
    templateUrl: './sidemenu.html',
    styleUrl: './sidemenu.scss',
    encapsulation: ViewEncapsulation.None
})
export class SidemenuComponent implements OnInit {
    private menuService = inject(MenuService);
    private sessionService = inject(SessionService);
    private appContext = inject(AppContextService);
    private router = inject(Router);

    isCollapsed = input(false);
    @Output() menuItemClick = new EventEmitter<void>();

    menuItems: SidenavItem[] = [];

    // 🚀 Reactive State for Expanded Items
    expandedItems = signal<Set<string>>(new Set<string>());

    // 🏆 Reactive Role Detection
    private userRole = computed(() => {
        return this.sessionService.user()?.roles?.[0] || '';
    });

    constructor() {
        // 🔄 Reactively reload menu when role changes
        effect(() => {
            const role = this.userRole();
            const menuRole = this.getMenuRoleFromUserRole(role);
            if (menuRole) {
                this.loadMenu(menuRole);
            }
        });

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.autoExpandActiveRoute();
        });
    }

    ngOnInit(): void { }

    onMenuItemClick(): void {
        this.menuItemClick.emit();
    }

    private getMenuRoleFromUserRole(role: string): string | null {
        if (this.appContext.isPlatform()) return 'super-admin';
        if (role === 'ROLE_SUPER_ADMIN') return 'super-admin';
        if (role === 'ROLE_ADMIN') return 'admin';
        if (role === 'ROLE_DOCTOR') return 'doctor';
        if (role === 'ROLE_PATIENT') return 'patient';
        return null;
    }

    private loadMenu(menuRole: string): void {
        this.menuService.loadMenuForRole(menuRole).subscribe({
            next: (config) => {
                this.menuItems = this.mapMenuItems(config.menu);
                this.autoExpandActiveRoute();
            },
            error: (err) => console.error('[Sidemenu] Error loading menu:', err)
        });
    }

    toggleMenu(item: SidenavItem): void {
        const currentSet = new Set(this.expandedItems());
        if (currentSet.has(item.id)) {
            currentSet.delete(item.id);
        } else {
            currentSet.add(item.id);
        }
        this.expandedItems.set(currentSet);
    }

    isOpen(itemId: string): boolean {
        return this.expandedItems().has(itemId);
    }

    isActiveRoute(route?: string): boolean {
        if (!route) return false;
        return this.router.url.startsWith(route);
    }

    private autoExpandActiveRoute(): void {
        const currentRoute = this.router.url;
        this.expandParentOfRoute(this.menuItems, currentRoute);
    }

    private expandParentOfRoute(items: SidenavItem[], url: string): boolean {
        let anyExpanded = false;
        for (const item of items) {
            if (item.children) {
                const hasActiveChild = this.expandParentOfRoute(item.children, url);
                if (hasActiveChild || (item.route && url.startsWith(item.route))) {
                    this.addToExpanded(item.id);
                    anyExpanded = true;
                }
            } else if (item.route && url.startsWith(item.route)) {
                anyExpanded = true;
            }
        }
        return anyExpanded;
    }

    private addToExpanded(id: string): void {
        const currentSet = new Set(this.expandedItems());
        if (!currentSet.has(id)) {
            currentSet.add(id);
            this.expandedItems.set(currentSet);
        }
    }

    private mapMenuItems(items: any[]): SidenavItem[] {
        return items.map(item => ({
            id: item.id || item.name,
            label: 'menu.' + item.name,
            icon: item.icon,
            route: item.route,
            type: item.type,
            badge: item.badge?.value,
            badgeColor: 'primary',
            children: item.children ? this.mapMenuItems(item.children) : undefined
        }));
    }
}
