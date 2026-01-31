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
    selector: 'app-nurse-dashboard',
    standalone: true,
    templateUrl: './nurse-dashboard.component.html',
    styleUrls: ['./nurse-dashboard.component.scss'],
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
export class NurseDashboardComponent implements OnInit {
    private sessionService = inject(SessionService);

    // Signals
    tenantName = signal<string>('');
    userName = signal<string>('');

    // Nurse Stats Cards
    stats: StatCard[] = [
        {
            title: 'Pacientes Asignados',
            value: 12,
            icon: 'personal_injury',
            variant: 'info',
            trend: { value: 2, isPositive: true }
        },
        {
            title: 'Medicaciones Pendientes',
            value: 5,
            icon: 'medication',
            variant: 'warning',
            trend: { value: 1, isPositive: false }
        },
        {
            title: 'Camas Ocupadas',
            value: '85%',
            icon: 'bed',
            variant: 'danger',
            trend: { value: 5, isPositive: true }
        },
        {
            title: 'Altas Previstas',
            value: 4,
            icon: 'output',
            variant: 'success',
            trend: { value: 1, isPositive: true }
        }
    ];

    ngOnInit(): void {
        const user = this.sessionService.getCurrentUser();
        if (user) {
            this.tenantName.set(user.tenantName || 'Hospital');
            this.userName.set(user.personName || 'Enfermero/a');
        }
    }
}
