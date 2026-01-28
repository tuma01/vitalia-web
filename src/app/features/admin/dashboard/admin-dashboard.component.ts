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
    color: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        UiCardComponent,
        UiIconComponent,
        UiButtonComponent
    ],
})
export class AdminDashboardComponent implements OnInit {
    private sessionService = inject(SessionService);

    // Signals
    tenantName = signal<string>('');
    userName = signal<string>('');

    // Stats cards
    stats: StatCard[] = [
        {
            title: 'Total Personal',
            value: 156,
            icon: 'people',
            color: '#2196F3',
            trend: { value: 12, isPositive: true }
        },
        {
            title: 'Pacientes Activos',
            value: 1243,
            icon: 'personal_injury',
            color: '#4CAF50',
            trend: { value: 8, isPositive: true }
        },
        {
            title: 'Citas Hoy',
            value: 47,
            icon: 'event',
            color: '#FF9800',
            trend: { value: 3, isPositive: false }
        },
        {
            title: 'Ocupación Camas',
            value: '78%',
            icon: 'bed',
            color: '#9C27B0',
            trend: { value: 5, isPositive: true }
        }
    ];

    ngOnInit(): void {
        const user = this.sessionService.getCurrentUser();
        if (user) {
            this.tenantName.set(user.tenantName || 'Hospital');
            this.userName.set(user.personName || 'Administrador');
        }
    }
}
