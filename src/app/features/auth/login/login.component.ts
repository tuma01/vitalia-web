import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// PAL Components
import {
  UiButtonComponent,
  UiInputComponent,
  UiFormFieldComponent,
  UiSelectNativeComponent,
  UiSelectNativeOption,
  UiCheckboxComponent,
  UiIconComponent,
  UiCardComponent,
  UiToastService // Import Toast Service
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
    UiSelectNativeComponent,
    UiCheckboxComponent,
    UiIconComponent,
    UiCardComponent
  ],
})
export class LoginComponent {
  private router = inject(Router);
  private tenantApiService = inject(TenantService);
  private authService = inject(AuthService);
  private toastService = inject(UiToastService); // Inject Service

  // Signals
  selectedRole = signal<string>('');
  tenants = signal<Tenant[]>([]);
  isLoading = signal<boolean>(false);
  // errorMessage signal removed

  // Roles configuration - Solo Admin habilitado
  roles: RoleOption[] = [
    { value: 'ROLE_ADMIN', label: 'Admin', icon: 'admin_panel_settings', color: '#16a34a', enabled: true }, // Green (Reference)
    { value: 'ROLE_DOCTOR', label: 'Doctor', icon: 'medical_services', color: '#f97316', enabled: false },  // Orange (Reference)
    { value: 'ROLE_NURSE', label: 'Nurse', icon: 'local_hospital', color: '#2563eb', enabled: false },      // Blue
    { value: 'ROLE_EMPLOYEE', label: 'Employee', icon: 'badge', color: '#9333ea', enabled: false },         // Purple
    { value: 'ROLE_PATIENT', label: 'Patient', icon: 'person', color: '#06b6d4', enabled: false }           // Cyan
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
  get tenantOptions(): UiSelectNativeOption[] {
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
        this.toastService.error('Error al cargar la lista de hospitales', 'Error', { position: 'bottom-center' });
      }
    });
  }

  selectRole(roleValue: string): void {
    const role = this.roles.find(r => r.value === roleValue);

    if (!role?.enabled) {
      this.toastService.info('Este rol estará disponible próximamente', 'Información', { position: 'bottom-center' });
      return;
    }

    this.selectedRole.set(roleValue);
    this.loginForm.patchValue({ role: roleValue });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, tenantCode } = this.loginForm.value;

    if (!email || !password || !tenantCode) return;

    this.isLoading.set(true);

    this.authService.login(email, password, tenantCode).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        // AuthService ya maneja la redirección
        this.authService.navigateBasedOnRole();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toastService.error('Credenciales inválidas. Por favor intenta de nuevo.', 'Error de Acceso', { position: 'bottom-center' });
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
