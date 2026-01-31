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
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

@Component({
    selector: 'app-doctor-dashboard',
    standalone: true,
    templateUrl: './doctor-dashboard.component.html',
    styleUrls: ['./doctor-dashboard.component.scss'],
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
export class DoctorDashboardComponent implements OnInit {
    private sessionService = inject(SessionService);

    // Signals
    tenantName = signal<string>('');
    userName = signal<string>('');

    // Clinical Stats Cards
    stats: StatCard[] = [
        {
            title: 'Pacientes en Espera',
            value: 8,
            icon: 'people_alt',
            variant: 'danger', // High priority
            trend: { value: 2, isPositive: false } // Increasing queue is negative
        },
        {
            title: 'Citas Hoy',
            value: 24,
            icon: 'calendar_month',
            variant: 'primary',
            trend: { value: 100, isPositive: true }
        },
        {
            title: 'Resultados Pendientes',
            value: 5,
            icon: 'science',
            variant: 'warning',
            trend: { value: 1, isPositive: false }
        },
        {
            title: 'Pacientes Alta',
            value: 3,
            icon: 'check_circle',
            variant: 'success',
            trend: { value: 3, isPositive: true }
        }
    ];

    ngOnInit(): void {
        const user = this.sessionService.getCurrentUser();
        if (user) {
            this.tenantName.set(user.tenantName || 'Hospital');
            this.userName.set(user.personName || 'Doctor');
        }
    }
}
