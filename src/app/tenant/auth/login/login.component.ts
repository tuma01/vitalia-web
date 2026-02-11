import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
import { AppContextService } from '../../../core/services/app-context.service'; // 🔥 ADDED
import { switchMap, tap } from 'rxjs';
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
  private appContext = inject(AppContextService); // 🔥 ADDED

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
    this.setupTenantBrandingListener();
  }

  /**
   * 🎨 Dynamically re-brands the login page when a tenant is selected
   */
  private setupTenantBrandingListener(): void {
    const tenantControl = this.loginForm.get('tenantCode');
    if (!tenantControl) return;

    // 1️⃣ Listen for changes (User selection or patchValue)
    tenantControl.valueChanges.subscribe(code => {
      console.log('[Login] 🔄 Tenant selection changed:', code);
      this.applyTenantBranding(code);
    });

    // 2️⃣ Apply initial value if already present
    if (tenantControl.value) {
      this.applyTenantBranding(tenantControl.value);
    }
  }

  private applyTenantBranding(code: string | null): void {
    if (!code) return;

    const selectedTenant = this.tenants().find(t => t.code === code);
    if (selectedTenant && selectedTenant.code) {
      console.log('[Login] 🎨 Applying branding for:', selectedTenant.name);
      this.appContext.setContext('app', {
        code: selectedTenant.code,
        name: selectedTenant.name
      });
    }
  }

  loadTenants(): void {
    this.tenantApiService.getPublicAllTenants().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);

        // 🚀 AUTO-SELECT STRATEGY:
        // 1. Try to restore last used tenant from localStorage
        const lastTenantCode = localStorage.getItem('vitalia-tenant-code');

        if (lastTenantCode && tenants.some(t => t.code === lastTenantCode)) {
          console.log('[Login] 🔄 Restoring last used tenant:', lastTenantCode);
          this.loginForm.patchValue({ tenantCode: lastTenantCode });

          // 🔥 FORCE BRANDING after patchValue to ensure signals are ready
          this.applyTenantBranding(lastTenantCode);
        }
        // 2. Fallback: Autoselect first tenant if ONLY one available
        else if (tenants.length === 1 && tenants[0].code) {
          const firstCode = tenants[0].code;
          this.loginForm.patchValue({ tenantCode: firstCode });
          this.applyTenantBranding(firstCode);
        }
      },
      error: (error) => {
        console.error('Error loading tenants:', error);

        // Si es un error de red (status 0), mostrar mensaje más específico
        if (error.status === 0) {
          console.warn('[Login] Network error loading tenants - backend may not be available');
          this.toastService.warning('No se pudo conectar al servidor. Verifica tu conexión.');
        } else {
          this.toastService.error('Error al cargar la lista de hospitales');
        }
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

    // 🚀 DEV UX: Cambiar el email por defecto según el rol seleccionado
    if (roleValue === 'ROLE_DOCTOR') {
      this.loginForm.patchValue({ email: 'doctor-dev@test.com' });
    } else if (roleValue === 'ROLE_ADMIN') {
      this.loginForm.patchValue({ email: 'admin-dev@test.com' });
    }
  }

  onLogin(): void {
    // 🛡️ Guard against multiple clicks
    if (this.isLoading()) return;

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
        // 🔥 PASS THE SELECTED ROLE to prioritize dashboard
        this.authService.navigateBasedOnRole(this.selectedRole());
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        console.error('[Login] Full error response:', err);

        const backendMsg = err.error?.message || err.error?.error || err.message;
        console.log('[Login] Backend error message detected:', backendMsg);

        switch (err.status) {
          case 400:
          case 401:
          case 403:
            if (backendMsg === 'ACCOUNT_LOCKED' || (backendMsg && backendMsg.includes('locked'))) {
              this.toastService.error('Tu cuenta está bloqueada. Contacta a soporte.');
            } else {
              // 🛡️ Unificar mensaje para errores de credenciales (backend suele devolver 400 o 401)
              this.toastService.error('Correo o contraseña incorrectos.');
            }
            break;

          case 423:
            this.toastService.error('Tu cuenta está temporalmente bloqueada.');
            break;

          case 0:
            this.toastService.error('No se pudo conectar al servidor. Verifica que el backend esté corriendo y tu conexión a internet.');
            break;

          case 500:
            this.toastService.error('Error interno del servidor (500). Inténtalo más tarde.');
            break;

          default:
            this.toastService.error(`Error (${err.status}): ${backendMsg || 'Ocurrió un error inesperado.'}`);
        }
      }
    });
  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }
}
