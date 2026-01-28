import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// PAL Components
import {
  UiButtonComponent,
  UiInputComponent,
  UiFormFieldComponent,
  UiSelectComponent,
  UiSelectOption,
  UiCheckboxComponent,
  UiIconComponent,
  UiCardComponent
} from '@ui';

// API Services
import { TenantService } from '../../../api/services/tenant.service';
import { Tenant } from '../../../api/models/tenant';

// Core Services
import { AuthService } from '../../../core/services/auth.service';

interface RoleOption {
  value: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean; // Solo Admin habilitado por ahora
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
    UiButtonComponent,
    UiInputComponent,
    UiFormFieldComponent,
    UiSelectComponent,
    UiCheckboxComponent,
    UiIconComponent,
    UiCardComponent
  ],
})
export class LoginComponent {
  private router = inject(Router);
  private tenantApiService = inject(TenantService);
  private authService = inject(AuthService);

  // Signals
  selectedRole = signal<string>('');
  tenants = signal<Tenant[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Roles configuration - Solo Admin habilitado
  roles: RoleOption[] = [
    { value: 'ROLE_ADMIN', label: 'Admin', icon: 'admin_panel_settings', color: '#9C27B0', enabled: true },
    { value: 'ROLE_DOCTOR', label: 'Doctor', icon: 'medical_services', color: '#2196F3', enabled: false },
    { value: 'ROLE_NURSE', label: 'Nurse', icon: 'local_hospital', color: '#E91E63', enabled: false },
    { value: 'ROLE_EMPLOYEE', label: 'Employee', icon: 'badge', color: '#FF9800', enabled: false },
    { value: 'ROLE_PATIENT', label: 'Patient', icon: 'person', color: '#4CAF50', enabled: false }
  ];

  // Form
  loginForm = new FormGroup({
    role: new FormControl<string>('', [Validators.required]),
    tenantCode: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    rememberMe: new FormControl<boolean>(false)
  });

  // Tenant options for select
  get tenantOptions(): UiSelectOption[] {
    return this.tenants().map(t => ({
      value: t.code || '',
      label: t.name || ''
    }));
  }

  constructor() {
    this.loadTenants();
  }

  loadTenants(): void {
    this.tenantApiService.getPublicAllTenants().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
        this.errorMessage.set('Error al cargar la lista de hospitales');
      }
    });
  }

  selectRole(roleValue: string): void {
    const role = this.roles.find(r => r.value === roleValue);

    if (!role?.enabled) {
      this.errorMessage.set('Este rol estará disponible próximamente');
      return;
    }

    this.selectedRole.set(roleValue);
    this.loginForm.patchValue({ role: roleValue });
    this.errorMessage.set('');
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, tenantCode } = this.loginForm.value;

    if (!email || !password || !tenantCode) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(email, password, tenantCode).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        // AuthService ya maneja la redirección
        this.authService.navigateBasedOnRole();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Credenciales inválidas. Por favor intenta de nuevo.');
        console.error('Login error:', error);
      }
    });
  }

  getError(fieldName: string): string | null {
    const control = this.loginForm.get(fieldName);
    if (!control || !control.touched || !control.errors) return null;

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['minlength']) return 'Mínimo 8 caracteres';

    return null;
  }
}
