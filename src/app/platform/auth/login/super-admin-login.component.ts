import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Material Components
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Core Services
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
    selector: 'app-super-admin-login',
    standalone: true,
    templateUrl: './super-admin-login.component.html',
    styleUrls: ['./super-admin-login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatProgressBarModule,
        MatSnackBarModule
    ]
})
export class SuperAdminLoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);
    public themeService = inject(ThemeService);

    isLoading = signal(false);
    hidePassword = signal(true);

    loginForm = new FormGroup({
        email: new FormControl('superadmin-dev@test.com', [Validators.required, Validators.email]),
        password: new FormControl('dev-password', [Validators.required, Validators.minLength(6)]),
        rememberMe: new FormControl(false)
    });

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);

        const { email, password } = this.loginForm.value;

        console.log('[SuperAdminLogin] Attempting login with email:', email, 'and tenantCode: GLOBAL');

        // SuperAdmin login sends tenantCode 'GLOBAL'
        this.authService.login(email!, password!, 'GLOBAL').subscribe({
            next: (response) => {
                console.log('[SuperAdminLogin] Login response:', response);
                this.isLoading.set(false);

                // Verificar que es SuperAdmin
                if (!response.user?.roles?.includes('ROLE_SUPER_ADMIN')) {
                    console.warn('[SuperAdminLogin] User is not SuperAdmin:', response.user?.roles);
                    this.snackBar.open(
                        'Access denied. Platform login is only for SuperAdmin.',
                        'Close',
                        { duration: 5000, panelClass: ['error-snackbar'] }
                    );
                    this.authService.logout();
                    return;
                }

                console.log('[SuperAdminLogin] SuperAdmin verified, navigating to platform dashboard');
                this.snackBar.open(
                    'Welcome to Vitalia Platform',
                    'Close',
                    { duration: 3000, panelClass: ['success-snackbar'] }
                );

                // Navegar a platform dashboard
                this.router.navigate(['/platform/dashboard']);
            },
            error: (error) => {
                console.error('[SuperAdminLogin] Login error:', error);
                this.isLoading.set(false);

                let errorMessage = 'Login failed. Please try again.';

                if (error.status === 401) {
                    errorMessage = 'Invalid credentials';
                } else if (error.status === 404) {
                    errorMessage = 'User not found';
                } else if (error.status === 500) {
                    errorMessage = 'Server error. Please contact support.';
                } else if (error.status === 0) {
                    errorMessage = 'Network error. Please check your connection.';
                }

                console.error('[SuperAdminLogin] Error message:', errorMessage);
                this.snackBar.open(errorMessage, 'Close', {
                    duration: 5000,
                    panelClass: ['error-snackbar']
                });
            }
        });
    }

    togglePasswordVisibility(): void {
        this.hidePassword.update(v => !v);
    }
}
