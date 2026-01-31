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
    selector: 'app-patient-dashboard',
    standalone: true,
    templateUrl: './patient-dashboard.component.html',
    styleUrls: ['./patient-dashboard.component.scss'],
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
export class PatientDashboardComponent implements OnInit {
    private sessionService = inject(SessionService);

    tenantName = signal<string>('');
    userName = signal<string>('');

    stats: StatCard[] = [
        {
            title: 'Próxima Cita',
            value: '15 Feb',
            icon: 'event',
            variant: 'primary'
        },
        {
            title: 'Recetas Activas',
            value: 2,
            icon: 'prescriptions',
            variant: 'success'
        }
    ];

    ngOnInit(): void {
        const user = this.sessionService.getCurrentUser();
        if (user) {
            this.tenantName.set(user.tenantName || 'Hospital');
            this.userName.set(user.personName || 'Paciente');
        }
    }
}
