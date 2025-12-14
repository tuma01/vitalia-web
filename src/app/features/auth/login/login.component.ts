import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TenantThemeService } from '../../../core/services/tenant-theme.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatRippleModule } from '@angular/material/core'; // Add this import
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ButtonRole } from '../../../core/models/button-role.model';
import { Tenant } from 'app/api/models/tenant';
import { TenantControllerService } from 'app/api/services';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '@core/services/theme.service';



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
    MatCheckboxModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private tenantService = inject(TenantControllerService);
  private authService = inject(AuthService);
  private tenantThemeService = inject(TenantThemeService);
  private readonly router = inject(Router);
  private fb = inject(FormBuilder);

  themeService = inject(ThemeService);

  loginForm!: FormGroup;
  tenants: Tenant[] = [];
  tenantsOptions: { code: string, name: string }[] = [];
  roles: string[] = ['ROLE_TENANT_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT', 'ROLE_NURSE', 'ROLE_EMPLOYEE'];


  selectedRole: UserRole = 'PATIENT'; // Default to PATIENT role
  selectedButtonRole: string | null = null;

  selectedTenant: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  isSubmitting = false;
  buttonRoles: ButtonRole[] = [
    { id: 'TENANT_ADMIN', label: 'Admin', icon: 'admin_panel_settings', colorClass: 'role-admin' },
    { id: 'DOCTOR', label: 'Doctor', icon: 'medical_services', colorClass: 'role-doctor' },
    { id: 'NURSE', label: 'Nurse', icon: 'local_hospital', colorClass: 'role-nurse' },
    { id: 'EMPLOYEE', label: 'Employee', icon: 'badge', colorClass: 'role-employee' },
    { id: 'PATIENT', label: 'Patient', icon: 'person', colorClass: 'role-patient' }
  ];

  // Note: SUPER_ADMIN role is hidden from public login for security
  // SUPER_ADMIN users should access via a separate admin portal URL

  // Available tenants (in production, this should come from an API)
  availableTenants: TenantOption[] = [
    { code: 'HOSPITAL_CENTRAL', name: 'Hospital Central' },
    { code: 'CLINICA_SAN_JOSE', name: 'Clínica San José' },
    { code: 'HOSPITAL_UNIVERSITARIO', name: 'Hospital Universitario' },
    { code: 'CLINICA_DEL_NORTE', name: 'Clínica del Norte' }
  ];

  constructor(

  ) { }

  ngOnInit(): void {
    this.themeService.initTheme();
    this.initForm();
    this.getTenants();
  }

  private getTenants(): void {
    this.tenantService.getTenants().subscribe({
      next: (tenants: Tenant[]) => {
        console.log('getTenants response:', tenants);
        this.tenants = tenants.filter(t => t.isActive && t.code !== 'GLOBAL');
        // Precalcular opciones para el template
        this.tenantsOptions = this.tenants.map(t => ({ code: t.code, name: t.name }));
        console.log('Tenants filtrados:', this.tenantsOptions);
      },
      error: err => console.error('Error cargando tenants', err)
    });
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['admin.hospa@system.com', [Validators.required, Validators.email]],
      password: ['ChangeMe123!', [Validators.required, Validators.minLength(6)]],
      tenantCode: ['', [Validators.required]],
      role: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  selectRole(role: UserRole): void {
    this.selectedRole = role;
    this.errorMessage = '';

    const tenantControl = this.loginForm.get('tenantCode');

    // Reset tenant selection when changing roles
    if (!this.requiresTenant) {
      this.selectedTenant = '';
      tenantControl?.clearValidators(); // Remove required if not needed
    } else {
      tenantControl?.setValidators([Validators.required]); // Add required back
    }
    tenantControl?.updateValueAndValidity(); // Update validity status
  }

  get requiresTenant(): boolean {
    // SUPER_ADMIN doesn't need to select a tenant
    return this.selectedRole !== 'SUPER_ADMIN';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formTenantCode = this.loginForm.value.tenantCode;

    if (this.requiresTenant && !formTenantCode) {
      this.errorMessage = 'Please select a hospital/clinic';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';


    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const tenantCode = this.requiresTenant ? formTenantCode : undefined;

    this.authService.login(email, password, tenantCode).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        // Load theme if user has a tenant (not SUPER_ADMIN with GLOBAL)
        if (response.user?.tenantCode && response.user.tenantCode !== 'GLOBAL') {
          this.tenantThemeService.loadThemeForTenant(response.user.tenantCode).subscribe({
            next: () => {
              this.navigateBasedOnRole(response.user?.roles || []);
            },
            error: (error) => {
              console.error('Error loading theme:', error);
              // Continue to dashboard even if theme loading fails
              this.navigateBasedOnRole(response.user?.roles || []);
            }
          });
        } else {
          // SUPER_ADMIN or no tenant - navigate directly
          this.navigateBasedOnRole(response.user?.roles || []);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);

        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else if (error.status === 403) {
          this.errorMessage = 'Access denied. Please check your credentials and tenant selection.';
        } else {
          this.errorMessage = error.error?.message || 'An error occurred during login. Please try again.';
        }
      }
    });
  }

  private navigateBasedOnRole(roles: string[]): void {
    this.isLoading = false;
    console.log('Navigating based on roles:', roles);

    if (roles.includes('ROLE_SUPER_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (roles.includes('ROLE_TENANT_ADMIN') || roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin/hospital-dashboard']);
    } else if (roles.includes('ROLE_DOCTOR')) {
      this.router.navigate(['/doctor/dashboard']);
    } else if (roles.includes('ROLE_NURSE')) {
      this.router.navigate(['/nurse/dashboard']);
    } else if (roles.includes('ROLE_EMPLOYEE')) {
      this.router.navigate(['/employee/dashboard']);
    } else if (roles.includes('ROLE_PATIENT')) {
      this.router.navigate(['/patient/dashboard']);
    } else {
      console.warn('No matching role found for navigation:', roles);
      this.errorMessage = 'Login successful but no valid role found for redirection.';
    }
  }
  register(): void {
    console.log('register');
    this.router.navigate(['register']);
  }

  selectButtonRole(roleId: string) {
    this.selectedButtonRole = roleId;
    this.loginForm.get('role')?.setValue(roleId);
    this.selectRole(roleId as UserRole);
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  forgotPassword() {
    this.router.navigate(['forgot-password']);
  }
}
