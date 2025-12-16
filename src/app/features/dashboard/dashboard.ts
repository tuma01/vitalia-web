import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { TranslateModule } from '@ngx-translate/core';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    TranslateModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private sessionService = inject(SessionService);
  currentUser$ = this.sessionService.user$;

  get isDoctor(): boolean {
    return this.sessionService.hasRole('ROLE_DOCTOR');
  }

  get isNurse(): boolean {
    return this.sessionService.hasRole('ROLE_NURSE');
  }

  get isAdmin(): boolean {
    return this.sessionService.hasAnyRole(['ROLE_ADMIN', 'ROLE_TENANT_ADMIN', 'ROLE_SUPER_ADMIN']);
  }

  get isPatient(): boolean {
    return this.sessionService.hasRole('ROLE_PATIENT');
  }

  get isEmployee(): boolean {
    return this.sessionService.hasRole('ROLE_EMPLOYEE');
  }
}
