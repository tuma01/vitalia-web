import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Material Components
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

// Shared Components & Models
import { StatCardComponent } from '../../../shared/ui/stat-card/stat-card.component';
import { DashboardSkeletonComponent } from '../../../shared/ui/dashboard-skeleton/dashboard-skeleton.component';
import { DashboardConfig } from '../../../core/models/dashboard.model';

// Core Services
import { SessionService } from '../../../core/services/session.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { PermissionService } from '../../../core/auth/permission.service';

@Component({
    selector: 'app-role-dashboard',
    standalone: true,
    templateUrl: './role-dashboard.component.html',
    styleUrls: ['./role-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatTooltipModule,
        StatCardComponent,
        DashboardSkeletonComponent
    ],
})
export class RoleDashboardComponent implements OnInit {
    private sessionService = inject(SessionService);
    private dashboardService = inject(DashboardService);
    private permissionService = inject(PermissionService);
    private translate = inject(TranslateService);
    public router = inject(Router);

    tenantName = signal<string>('');
    userName = signal<string>('');

    // ✅ Architecture: Raw Config + Permission Filter = Final Dashboard
    private rawDashboard = signal<DashboardConfig | null>(null);

    dashboard = computed(() => {
        const config = this.rawDashboard();
        if (!config) return null;

        // 🧠 Permission Logic Layer
        return {
            stats: config.stats.filter(stat =>
                this.permissionService.has(stat.requiredPermission)
            ),
            activities: config.activities?.filter(act =>
                this.permissionService.has(act.requiredPermission)
            ),
            quickActions: config.quickActions?.filter(action =>
                this.permissionService.has(action.requiredPermission)
            )
        };
    });

    ngOnInit(): void {
        const user = this.sessionService.getCurrentUser();

        // 🌎 i18n Fallbacks (Safe & Reactive)
        this.tenantName.set(user?.tenantName || this.translate.instant('dashboard.tenant'));
        this.userName.set(user?.personName || this.translate.instant('dashboard.admin.welcome'));

        if (user) {

            // 🔐 Simulate setting permissions (In real app, comes from user profile)
            this.permissionService.setPermissions([
                'VIEW_STAFF',
                'VIEW_PATIENTS',
                'VIEW_APPOINTMENTS',
                'VIEW_FACILITY',
                // Activities
                'VIEW_ACTIVITY_LOG',
                'VIEW_SYSTEM_LOGS',
                // Quick Actions
                'MANAGE_STAFF',
                'MANAGE_SETTINGS',
                'VIEW_REPORTS'
            ]);

            // 🚀 Load "Remote" Dashboard
            this.dashboardService.loadDashboard('admin')
                .subscribe(config => this.rawDashboard.set(config));
        }
    }
}
