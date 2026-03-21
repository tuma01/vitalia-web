import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ToastrService } from 'ngx-toastr';
import { UserInvitationsService } from 'app/api/services/user-invitations.service';
import { InvitationResponse } from 'app/api/models/invitation-response';
import { AppContextService } from 'app/core/services/app-context.service';

@Component({
  selector: 'app-complete-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private invitationService = inject(UserInvitationsService);
  private translateService = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  private appContext = inject(AppContextService);

  token: string = '';
  invitation: InvitationResponse | null = null;
  loading: boolean = true;
  error: string | null = null;
  submitting: boolean = false;
  hidePassword = true;

  form: FormGroup = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: [''],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telefono: ['']
  });

  ngOnInit(): void {
    // Expected URL format: /complete-registration?token={uuid}
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.setError(this.translateService.instant('auth.complete_registration.error_missing_token'));
      } else {
        this.validateToken();
      }
    });
  }

  get translatedRole(): string {
    if (!this.invitation?.roleName) return 'Usuario';
    return this.translateService.instant('auth.roles.' + this.invitation.roleName) || this.invitation.roleName;
  }

  private validateToken(): void {
    this.loading = true;
    console.log('[CompleteRegistration] 🚀 Starting token validation call for token:', this.token);
    
    this.invitationService.validateToken1({ token: this.token }).subscribe({
      next: (res: any) => {
        console.log('[CompleteRegistration] ✅ Token validation SUCCESS', res);
        
        // 🔄 Avoid NG0100 by updating state in next tick
        setTimeout(() => {
            // 🛡️ Handles backend wrapper ApiResponse<T> where the actual object is inside .data
            this.invitation = res.data ? res.data : res;
            
            // 🔥 CRITICAL: Set the App Context with the REAL tenant from the invitation
            // This ensures subsequent calls (like acceptInvitation) send the correct X-Tenant-Code
            if (this.invitation?.tenantCode) {
                console.log('[CompleteRegistration] 🌐 Setting dynamic tenant context:', this.invitation.tenantCode);
                this.appContext.setTenantContext({ 
                    code: this.invitation.tenantCode,
                    name: this.invitation.tenantName
                });
            }
            
            if (this.invitation?.email) {
                this.form.patchValue({ 
                    email: this.invitation.email,
                    nombre: this.invitation.nombre,
                    apellidoPaterno: this.invitation.apellidoPaterno
                });
            }
            
            this.loading = false;
            this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('[CompleteRegistration) ❌ Token validation ERROR', err);
        
        // 🔄 Avoid NG0100 by updating state in next tick
        setTimeout(() => {
            this.loading = false;
            this.setError(this.translateService.instant('auth.complete_registration.error_invalid_token'));
            this.cdr.detectChanges();
        });
      },
      complete: () => {
        console.log('[CompleteRegistration] 🏁 Token validation COMPLETE signal received');
      }
    });

    console.log('[CompleteRegistration] ⏳ Subscribe triggered, waiting for response...');
  }

  private setError(msg: string): void {
    this.error = msg;
    this.toastr.error(msg, this.translateService.instant('auth.complete_registration.titles.invalid_invitation'));
  }

  onSubmit(): void {
    if (this.form.invalid || !this.invitation) return;

    this.submitting = true;

    const formValues = this.form.getRawValue();

    this.invitationService.acceptInvitation({
      body: {
        token: this.token,
        tenantCode: this.invitation.tenantCode!, // 🔥 Explicit association
        loginEmail: formValues.email,
        password: formValues.password,
        nombre: formValues.nombre,
        apellidoPaterno: formValues.apellidoPaterno,
        apellidoMaterno: formValues.apellidoMaterno || undefined,
        telefono: formValues.telefono || undefined
      }
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.toastr.success(this.translateService.instant('auth.complete_registration.success_message'));
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        const errMessage = err?.error?.message || this.translateService.instant('auth.complete_registration.error_incomplete');
        console.error('Registration error', err);
        
        // 🔄 Avoid NG0100 by updating state in next tick
        setTimeout(() => {
            this.submitting = false;
            this.toastr.error(errMessage, this.translateService.instant('auth.complete_registration.titles.registration_error'));
            this.cdr.detectChanges();
        });
      }
    });
  }
}
