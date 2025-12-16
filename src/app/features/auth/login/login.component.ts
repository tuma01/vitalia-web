import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TenantThemeService } from '../../../core/services/tenant-theme.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonRole } from '../../../core/models/button-role.model';
import { Tenant } from 'app/api/models/tenant';
import { TenantControllerService } from 'app/api/services';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '@core/services/theme.service';
import { SessionService } from '../../../core/services/session.service';


type UserRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'DOCTOR' | 'NURSE' | 'EMPLOYEE' | 'PATIENT';

interface TenantOption {
  code: string;
  name: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIcon,
    MatRippleModule,
    MatProgressSpinnerModule,
    TranslateModule,
    MatCheckboxModule,
    MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private tenantService = inject(TenantControllerService);
  private authService = inject(AuthService);
  private sessionService = inject(SessionService);
  private tenantThemeService = inject(TenantThemeService);
  private readonly router = inject(Router);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);

  themeService = inject(ThemeService);

  loginForm!: FormGroup;
  tenants: Tenant[] = [];
  tenantsOptions: { code: string, name: string }[] = [];
  roles: string[] = ['ROLE_TENANT_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT', 'ROLE_NURSE', 'ROLE_EMPLOYEE'];


  selectedRole: UserRole = 'PATIENT';
  selectedButtonRole: string | null = null;

  selectedTenant: string = '';
  showPassword = false;
  isLoading: boolean = false;
  isSubmitting = false;

  buttonRoles: ButtonRole[] = [
    { id: 'TENANT_ADMIN', label: 'Admin', icon: 'admin_panel_settings', colorClass: 'role-admin' },
    { id: 'DOCTOR', label: 'Doctor', icon: 'medical_services', colorClass: 'role-doctor' },
    { id: 'NURSE', label: 'Nurse', icon: 'local_hospital', colorClass: 'role-nurse' },
    { id: 'EMPLOYEE', label: 'Employee', icon: 'badge', colorClass: 'role-employee' },
    { id: 'PATIENT', label: 'Patient', icon: 'person', colorClass: 'role-patient' }
  ];

  availableTenants: TenantOption[] = [
    { code: 'HOSPITAL_CENTRAL', name: 'Hospital Central' },
    { code: 'CLINICA_SAN_JOSE', name: 'Clínica San José' },
    { code: 'HOSPITAL_UNIVERSITARIO', name: 'Hospital Universitario' },
    { code: 'CLINICA_DEL_NORTE', name: 'Clínica del Norte' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.themeService.initTheme();
    this.initForm();
    this.getTenants();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['admin.hospa@system.com', [Validators.required, Validators.email]],
      password: ['ChangeMe123!', Validators.required],
      rememberMe: [false],
      tenantCode: ['']
    });
  }

  getTenants(): void {
    this.tenantService.getTenants().subscribe({
      next: (response: any) => {
        // Handle ApiResponse wrapper if present
        const data = response.data || response;
        if (Array.isArray(data)) {
          this.tenants = data;
          this.tenantsOptions = data.map((t: Tenant) => ({ code: t.code!, name: t.name! }));
        } else {
          console.error('Invalid tenants format', response);
          this.tenants = [];
        }
      },
      error: (err: any) => console.error('Error fetching tenants', err)
    });
  }


  selectButtonRole(roleId: string): void {
    this.selectedButtonRole = roleId;
  }

  get requiresTenant(): boolean {
    return true;
  }

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  forgotPassword(): void {
    console.log('Forgot password clicked');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formTenantCode = this.loginForm.value.tenantCode;

    if (this.requiresTenant && !formTenantCode) {
      this.snackBar.open('Please select a hospital/clinic', 'Close', { duration: 3000, verticalPosition: 'top' });
      return;
    }

    this.isLoading = true;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const tenantCode = this.requiresTenant ? formTenantCode : undefined;

    this.authService.login(email, password, tenantCode).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        const userRoles = response.user?.roles || [];
        const selectedRole = this.selectedButtonRole;
        let isAuthorized = false;

        console.log('[Login Debug] Validating Role:', { selectedRole, userRoles });

        switch (selectedRole) {
          case 'TENANT_ADMIN':
            isAuthorized = userRoles.some(r => ['ROLE_TENANT_ADMIN', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(r));
            break;
          case 'DOCTOR':
            isAuthorized = userRoles.includes('ROLE_DOCTOR');
            break;
          case 'NURSE':
            isAuthorized = userRoles.includes('ROLE_NURSE');
            break;
          case 'PATIENT':
            isAuthorized = userRoles.includes('ROLE_PATIENT');
            break;
          case 'EMPLOYEE':
            isAuthorized = userRoles.includes('ROLE_EMPLOYEE');
            break;
          default:
            // If no role is selected, ONLY allow if user is SUPER_ADMIN
            // Otherwise, force them to select a role.
            if (userRoles.includes('ROLE_SUPER_ADMIN')) {
              isAuthorized = true;
            } else {
              isAuthorized = false;
              // If we fail here, we should probably set a distinct error message,
              // but the generic role mismatch message below can be adapted.
              console.warn(`[Login] No role selected and user is not SUPER_ADMIN. Actual: ${userRoles}`);
            }
            break;
        }

        if (!isAuthorized) {
          console.warn(`[Login] Role mismatch! Selected: ${selectedRole}, Actual: ${userRoles}`);

          const roleName = selectedRole ? selectedRole.toUpperCase() : 'USER';
          const msg = selectedRole
            ? `Access denied. You are not authorized as a ${roleName}.`
            : 'Please select a role (Doctor, Nurse, etc.) to login.';

          this.snackBar.open(msg, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });

          this.isLoading = false;
          this.cd.detectChanges();
          return;
        }

        if (response.user && response.tokens) {
          this.sessionService.login({
            accessToken: response.tokens.accessToken!,
            refreshToken: response.tokens.refreshToken,
            user: response.user
          });
        }

        const isMockUser = this.loginForm.value.email.includes('@test.com');

        if (response.user?.tenantCode && response.user.tenantCode !== 'GLOBAL' && !isMockUser) {
          this.tenantThemeService.loadThemeForTenant(response.user.tenantCode).subscribe({
            next: () => {
              this.navigateBasedOnRole(response.user?.roles || []);
            },
            error: (error) => {
              console.error('Error loading theme:', error);
              this.navigateBasedOnRole(response.user?.roles || []);
            }
          });
        } else {
          this.navigateBasedOnRole(response.user?.roles || []);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);

        let msg = '';
        if (error.status === 401) {
          msg = 'Invalid email or password';
        } else if (error.status === 403) {
          msg = 'Access denied. Please check your credentials and tenant selection.';
        } else {
          msg = error.error?.message || 'An error occurred during login. Please try again.';
        }

        this.snackBar.open(msg, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });

        this.cd.detectChanges();
      }
    });
  }

  private navigateBasedOnRole(roles: string[]): void {
    this.isLoading = false;
    console.log('Navigating based on roles:', roles);

    if (roles.includes('ROLE_SUPER_ADMIN')) {
      this.router.navigate(['/super-admin/dashboard']);
    } else if (roles.includes('ROLE_TENANT_ADMIN') || roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin/hospital-dashboard']);
    } else if (roles.includes('ROLE_DOCTOR')) {
      this.router.navigate(['/doctor/dashboard']);
    } else if (roles.includes('ROLE_NURSE')) {
      this.router.navigate(['/nurse/dashboard']);
    } else if (roles.includes('ROLE_PATIENT')) {
      this.router.navigate(['/patient/dashboard']);
    } else if (roles.includes('ROLE_EMPLOYEE')) {
      this.router.navigate(['/employee/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

}
