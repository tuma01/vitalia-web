import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

// Material Components
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// API Services
import { TenantService } from '../../../api/services/tenant.service';
import { Tenant } from '../../../api/models/tenant';

// Core Services
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';
import { switchMap } from 'rxjs';
import { ROLE_COLORS } from '@core/constants/role-colors';

interface RoleOption {
  value: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule
  ],
})
export class LoginComponent {
  private router = inject(Router);
  private tenantApiService = inject(TenantService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private toastService = inject(ToastrService);

  // Signals
  selectedRole = signal<string>('');
  tenants = signal<Tenant[]>([]);
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  // Roles configuration
  // roles: RoleOption[] = [
  //   { value: 'ROLE_ADMIN', label: 'Admin', icon: 'admin_panel_settings', color: 'var(--color-success)', enabled: true },
  //   { value: 'ROLE_DOCTOR', label: 'Doctor', icon: 'medical_services', color: 'var(--color-warning)', enabled: true },
  //   { value: 'ROLE_NURSE', label: 'Nurse', icon: 'local_hospital', color: 'var(--color-primary)', enabled: true },
  //   { value: 'ROLE_EMPLOYEE', label: 'Employee', icon: 'badge', color: 'var(--color-accent)', enabled: true },
  //   { value: 'ROLE_PATIENT', label: 'Patient', icon: 'person', color: 'var(--color-info)', enabled: true }
  // ];
  roles: RoleOption[] = [
    { value: 'ROLE_ADMIN', label: 'Admin', icon: 'admin_panel_settings', color: ROLE_COLORS.ROLE_ADMIN, enabled: true },
    { value: 'ROLE_DOCTOR', label: 'Doctor', icon: 'medical_services', color: ROLE_COLORS.ROLE_DOCTOR, enabled: true },
    { value: 'ROLE_NURSE', label: 'Nurse', icon: 'local_hospital', color: ROLE_COLORS.ROLE_NURSE, enabled: true },
    { value: 'ROLE_EMPLOYEE', label: 'Employee', icon: 'badge', color: ROLE_COLORS.ROLE_EMPLOYEE, enabled: true },
    { value: 'ROLE_PATIENT', label: 'Patient', icon: 'person', color: ROLE_COLORS.ROLE_PATIENT, enabled: true }
  ];

  // Form
  loginForm = new FormGroup({
    role: new FormControl<string>('', [Validators.required]),
    tenantCode: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('admin-dev@test.com', [Validators.required, Validators.email]),
    password: new FormControl<string>('dev-password', [Validators.required, Validators.minLength(8)]),
    rememberMe: new FormControl<boolean>(false)
  });

  constructor() {
    this.loadTenants();
  }

  loadTenants(): void {
    this.tenantApiService.getPublicAllTenants().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);
        // Autoselect first tenant if only one
        if (tenants.length === 1) {
          this.loginForm.patchValue({ tenantCode: tenants[0].code });
        }
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
        this.toastService.error('Error al cargar la lista de hospitales');
      }
    });
  }

  selectRole(roleValue: string): void {
    const role = this.roles.find(r => r.value === roleValue);

    if (!role?.enabled) {
      this.toastService.info('Este rol estará disponible próximamente');
      return;
    }

    this.selectedRole.set(roleValue);
    this.loginForm.patchValue({ role: roleValue });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.warning('Por favor verifica los datos del formulario.');
      return;
    }

    const { email, password, tenantCode } = this.loginForm.value;

    if (!email || !password || !tenantCode) return;

    this.isLoading.set(true);

    this.authService.login(email, password, tenantCode).subscribe({
      next: () => {
        this.isLoading.set(false);
        console.log('[Login] Login successful, theme will load automatically');
        this.authService.navigateBasedOnRole();
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Login error:', error);
        this.toastService.error('Credenciales inválidas o error de servidor.');
      }
    });
  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }
}
