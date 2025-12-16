import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthenticationService } from '../../api/services/authentication.service';
import { AuthenticationResponse } from '../../api/models/authentication-response';
import { UserSummary } from '../../api/models/user-summary';
import { Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { SessionService } from './session.service';

/**
 * Enhanced authentication service wrapper
 * Provides additional functionality on top of the generated AuthenticationService
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private authApiService: AuthenticationService,
    private router: Router,
    // @Inject(PLATFORM_ID) private platformId: Object,
    private tokenService: TokenService,
    private sessionService: SessionService
  ) { }

  /**
   * Perform login and store tokens
   */
  login(email: string, password: string, tenantCode?: string): Observable<AuthenticationResponse> {
    // Only include tenantCode if it's provided (not undefined)
    const body: any = {
      email,
      password
    };

    // Add tenantCode only if it's defined
    if (tenantCode !== undefined) {
      body.tenantCode = tenantCode;
    }

    console.log('[AuthService] Logging in with:', body);

    // --- SIMULACIÓN DE ROLES (SOLO PARA DESARROLLO) ---
    const normalizedEmail = email.trim().toLowerCase();

    // console.log(`[AuthService Debug] Input email: '${email}'`);
    // console.log(`[AuthService Debug] Normalized: '${normalizedEmail}'`);
    // console.log(`[AuthService Debug] Is Nurse? ${normalizedEmail === 'nurse@test.com'}`);

    if (normalizedEmail === 'doctor@test.com') {
      return this.mockLoginResponse('ROLE_DOCTOR', 'Dr. Gregory House', tenantCode);
    }
    if (normalizedEmail === 'nurse@test.com') {
      console.log('[AuthService Debug] Intercepting Nurse Login');
      return this.mockLoginResponse('ROLE_NURSE', 'Enf. Florence Nightingale', tenantCode);
    }
    if (normalizedEmail === 'patient@test.com') {
      return this.mockLoginResponse('ROLE_PATIENT', 'Patient John Doe', tenantCode);
    }
    if (normalizedEmail === 'employee@test.com') {
      return this.mockLoginResponse('ROLE_EMPLOYEE', 'Employee Jane Smith', tenantCode);
    }

    return this.authApiService.login({
      body
    });
  }

  /**
   * Perform logout
   */
  logout(): void {
    const refreshToken = this.tokenService.refreshToken;

    if (refreshToken) {
      this.authApiService.logout({ refreshToken }).subscribe({
        next: () => this.performLogout(),
        complete: () => this.performLogout(),
        error: () => this.performLogout()
      });
    } else {
      this.performLogout();
    }
  }

  private performLogout(): void {
    // ✅ Delegar a SessionService
    this.sessionService.logout();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthenticationResponse> {
    const refreshToken = this.tokenService.refreshToken;
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.authApiService.refresh({ refreshToken }).pipe(
      tap(response => {
        if (response.tokens) {
          this.tokenService.setTokens(
            response.tokens.accessToken!,
            response.tokens.refreshToken!
          );
        }
      })
    );
  }

  /**
   * Check if user is authenticated (with server validation)
   */
  isAuthenticated(): Observable<boolean> {
    // 1. Quick local validation (Standard for SPAs)
    // We trust the token is valid if it exists and hasn't expired according to its claims.
    // If the server rejects it later (401), the HttpInterceptor should handle the logout.
    const isValid = this.tokenService.isAccessTokenValid();
    return of(isValid);
  }

  /**
   * Quick local authentication check (no HTTP call)
   */
  isAuthenticatedSync(): boolean {
    return this.tokenService.isAccessTokenValid();
  }

  getCurrentUser(): UserSummary | null {
    return this.sessionService.getCurrentUser();
  }

  currentUserRole(): string {
    const user = this.getCurrentUser();
    if (!user) return '';

    // Tu UserSummary debería tener roles: string[] o un rol único
    if (Array.isArray(user.roles) && user.roles.length > 0) {
      return user.roles[0];  // primer rol
    }

    // Si el usuario tuviera un único role (string)
    return (user as any).role ?? '';
  }

  /**
   * Store user data in localStorage
   */
  private storeUser(user: UserSummary): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear user data
   */
  private clearUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('tenantTheme');
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.tokenService.accessToken;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    // if (!isPlatformBrowser(this.platformId)) return null;
    return this.tokenService.refreshToken;
  }

  /**
   * Navigate based on user roles
   */
  navigateBasedOnRole(): void {
    const user = this.sessionService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Usar los helpers de SessionService
    if (this.sessionService.hasRole('ROLE_SUPER_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (this.sessionService.hasAnyRole(['ROLE_ADMIN', 'ROLE_TENANT_ADMIN'])) {
      this.router.navigate(['/admin/hospital-dashboard']);
    } else if (this.sessionService.hasRole('ROLE_DOCTOR')) {
      this.router.navigate(['/doctor/dashboard']);
    } else if (this.sessionService.hasRole('ROLE_NURSE')) {
      this.router.navigate(['/nurse/dashboard']);
    } else if (this.sessionService.hasRole('ROLE_EMPLOYEE')) {
      this.router.navigate(['/employee/dashboard']);
    } else if (this.sessionService.hasRole('ROLE_PATIENT')) {
      this.router.navigate(['/patient/portal']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Genera una respuesta simulada para pruebas
   */
  private mockLoginResponse(role: string, name: string, tenant?: string): Observable<AuthenticationResponse> {
    const mockUser: UserSummary = {
      id: 999,
      email: role === 'ROLE_DOCTOR' ? 'doctor@test.com' : 'nurse@test.com',
      personName: name,
      roles: [role],
      tenantCode: tenant || 'HOSPITAL_CENTRAL', // Default tenant
      personType: role.replace('ROLE_', '') as any
    };

    const mockResponse: AuthenticationResponse = {
      tokens: {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        // expiresIn: 3600 // Eliminar si da error en tipos
      },
      user: mockUser
    };

    return of(mockResponse).pipe(
      tap(() => {
        this.sessionService.login({
          accessToken: mockResponse.tokens!.accessToken!,
          refreshToken: mockResponse.tokens!.refreshToken,
          user: mockUser
        });
        console.log(`[AuthService] MOCKED login successful for ${role}`);
      })
    );
  }
}
