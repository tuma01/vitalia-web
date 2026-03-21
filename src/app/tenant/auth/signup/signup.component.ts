import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { TenantService } from '../../../api/services/tenant.service';
import { Tenant } from '../../../api/models/tenant';
import { AppContextService } from '../../../core/services/app-context.service';
import { ROLE_COLORS } from '@core/constants/role-colors';
import { AuthenticationService } from '../../../api/services/authentication.service';

interface RoleOption {
  value: string; // The backend personType enum value
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, TranslateModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressBarModule
  ],
})
export default class SignupComponent implements OnInit {
  private router = inject(Router);
  private tenantApiService = inject(TenantService);
  private authService = inject(AuthenticationService);
  private toastService = inject(ToastrService);
  private translateService = inject(TranslateService);
  public appContext = inject(AppContextService);

  tenants = signal<Tenant[]>([]);
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  signupForm = new FormGroup({
    tenantCode: new FormControl<string>('', [Validators.required]),
    nombre: new FormControl<string>('', [Validators.required]),
    apellidoPaterno: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)])
  });

  ngOnInit() {
    this.loadTenants();
  }

  get isSubdomain(): boolean {
    // Basic check for subdomain presence, e.g. "hospital-san-borja.localhost" vs "localhost"
    const host = window.location.hostname;
    // We assume if it has a dot and is not an IP address, it might be a subdomain
    // For localhost, "xxx.localhost" has a dot. "localhost" does not.
    return host !== 'localhost' && host !== '127.0.0.1' && !host.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
  }

  loadTenants(): void {
    this.tenantApiService.getPublicAllTenants().subscribe({
      next: (tenants) => {
        const publicTenants = tenants.filter(t => t.type !== 'GLOBAL');
        this.tenants.set(publicTenants);

        // 1. If we are STRICTLY inside a subdomain, lock the tenant and hide the selector
        if (this.isSubdomain) {
          const detectedTenant = this.appContext.tenant();
          if (detectedTenant?.code && publicTenants.some(t => t.code === detectedTenant.code)) {
            this.signupForm.patchValue({ tenantCode: detectedTenant.code }, { emitEvent: false });
          }
          return;
        }

        // 2. If we are on public ROOT domain (e.g. localhost), we ALWAYS SHOW the selector.
        // We can pre-fill it with last interaction as a courtesy, but we do NOT hide it.
        const lastTenantCode = localStorage.getItem('vitalia-tenant-code');
        if (lastTenantCode && publicTenants.some(t => t.code === lastTenantCode)) {
          this.signupForm.patchValue({ tenantCode: lastTenantCode }, { emitEvent: false });
        } else if (publicTenants.length === 1 && publicTenants[0].code) {
          const firstCode = publicTenants[0].code;
          this.signupForm.patchValue({ tenantCode: firstCode }, { emitEvent: false });
        }
      },
      error: () => {
        this.toastService.error('Error al cargar la lista de hospitales');
      }
    });
  }

  onSignup(): void {
    if (this.isLoading()) return;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.toastService.warning(this.translateService.instant('auth.signup.error_incomplete'));
      return;
    }

    const { email, password, tenantCode, nombre, apellidoPaterno } = this.signupForm.value;

    if (!email || !password || !tenantCode || !nombre || !apellidoPaterno) return;

    this.isLoading.set(true);

    this.authService.register({
      body: {
        email,
        password,
        tenantCode,
        personType: 'PATIENT', // 🛡️ FLujo Profesional: Auto-registro === PACIENTE
        nombre,
        apellidoPaterno
      }
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success(this.translateService.instant('crud.save_success', { entity: 'Paciente' }));
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        const backendMsg = err.error?.message || err.error?.error || err.message;
        this.toastService.error(`${this.translateService.instant('crud.save_error', { entity: 'Paciente' })}: ${backendMsg}`);
      }
    });
  }

  togglePassword() {
    this.showPassword.update(value => !value);
  }
}
