import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Material Components
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Core Services
import { SessionService } from '../../../core/services/session.service';

interface StatCard {
    title: string;
    value: string | number;
    icon: string;
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
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
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ],
})
export class DoctorDashboardComponent implements OnInit {
    private sessionService = inject(SessionService);

    tenantName = signal<string>('');
    userName = signal<string>('');

    stats: StatCard[] = [
        {
            title: 'Pacientes Hoy',
            value: '8',
            icon: 'people',
            variant: 'primary'
        },
        {
            title: 'Consultas Pendientes',
            value: '3',
            icon: 'pending_actions',
            variant: 'warning'
        },
        {
            title: 'Cirugías Programadas',
            value: '1',
            icon: 'medical_information',
            variant: 'info'
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
