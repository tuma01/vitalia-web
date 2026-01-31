import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// PAL Components
import {
    UiCardComponent,
    UiIconComponent,
    UiButtonComponent
} from '@ui';

// Core Services
import { SessionService } from '../../../core/services/session.service';

interface StatCard {
    title: string;
    value: string | number;
    icon: string;
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

@Component({
    selector: 'app-employee-dashboard',
    standalone: true,
    templateUrl: './employee-dashboard.component.html',
    styleUrls: ['./employee-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        UiCardComponent,
        UiIconComponent
    ],
})
export class EmployeeDashboardComponent implements OnInit {
    private sessionService = inject(SessionService);

    tenantName = signal<string>('');
    userName = signal<string>('');

    stats: StatCard[] = [
        {
            title: 'Turno Actual',
            value: 'Mañana',
            icon: 'schedule',
            variant: 'primary'
        },
        {
            title: 'Notificaciones',
            value: 3,
            icon: 'notifications',
            variant: 'warning'
        }
    ];

    ngOnInit(): void {
        const user = this.sessionService.getCurrentUser();
        if (user) {
            this.tenantName.set(user.tenantName || 'Hospital');
            this.userName.set(user.personName || 'Empleado');
        }
    }
}
