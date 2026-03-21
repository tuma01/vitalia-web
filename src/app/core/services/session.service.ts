import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from "rxjs";
import { signal } from '@angular/core';
import { TokenService } from "../token/token.service";
import { AuthService } from "./auth.service";
import { UserRegisterRequest, UserSummary } from "../../api/models";
import { AppContextService } from "./app-context.service";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // ✅ Usar UserSummary (lo que devuelve la API)
  private userSubject = new BehaviorSubject<UserSummary | null>(null);
  public readonly user$ = this.userSubject.asObservable();
  public readonly user = signal<UserSummary | null>(null);

  // 🏆 Persistent Active Role (for dashboard redirection)
  private activeRoleSubject = new BehaviorSubject<string | null>(null);
  public readonly activeRole$ = this.activeRoleSubject.asObservable();
  public readonly activeRole = signal<string | null>(null);

  constructor(
    private tokenService: TokenService,
    private appContext: AppContextService, // 🔥 Inject context service
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeFromStorage();
      this.initializeStorageSync();
    }
  }

  // ========== API PÚBLICA ==========

  /**
   * Inicia sesión completa
   * 
   * 🔥 CRITICAL: This sets the application context based on user roles
   * Context must be set BEFORE any service reads from ContextStorageService
   */
  login(loginData: {
    accessToken: string;
    refreshToken?: string;
    user: UserSummary;
  }): void {
    // 1. Guardar tokens (incluyendo fechas de expiración si están disponibles)
    this.tokenService.setTokens(
      loginData.accessToken,
      loginData.refreshToken
    );

    // 2. Guardar usuario
    this.setUser(loginData.user);

    // 3. 🔥 SET CONTEXT based on user roles
    if (loginData.user.roles?.includes('ROLE_SUPER_ADMIN')) {
      this.appContext.setContext('platform');
      console.log('[SessionService] 🔥 Context set to PLATFORM for super admin');
    } else {
      // Tenant user - set app context with tenant info
      const tenantInfo = {
        id: loginData.user.tenantId,
        code: loginData.user.tenantCode || '',
        name: loginData.user.tenantName || loginData.user.tenantCode || 'Vitalia'
      };

      this.appContext.setContext('app', tenantInfo);

      // Store in storage for context initialization on refresh
      localStorage.setItem('vitalia-current-user', JSON.stringify(loginData.user));
      localStorage.setItem('vitalia-tenant-code', loginData.user.tenantCode || '');
      
      // Store in sessionStorage for AppContextService.initFromSession
      sessionStorage.setItem('tenant-id', loginData.user.tenantId?.toString() || '');
      sessionStorage.setItem('tenant-code', loginData.user.tenantCode || '');
      sessionStorage.setItem('tenant-name', loginData.user.tenantName || '');

      console.log('[SessionService] 🔥 Context set to APP for tenant:', tenantInfo.code, 'ID:', tenantInfo.id);
    }
  }

  /**
   * Cierra sesión completamente
   * 
   * 🔥 CRITICAL: This resets the application context
   * Services subscribed to contextChanges$ will react and reset their state
   */
  logout(): void {
    this.tokenService.clearTokens();
    this.clearUser();

    // 🔥 RESET CONTEXT - this triggers contextChanges$ subscribers
    this.appContext.reset();
    this.setActiveRole(null);
    console.log('[SessionService] 🔥 Context reset on logout');
  }

  /**
   * Verifica si hay sesión activa (solo verificación local)
   */
  isAuthenticated(): boolean {
    return this.tokenService.isAccessTokenValid() && !!this.getCurrentUser();
  }

  /**
   * Sincroniza el estado de la sesión tras un refresco de token exitoso
   */
  handleTokenRefresh(): void {
    const storedUser = this.getUserFromStorage();
    if (storedUser) {
      console.log('[SessionService] Syncing session after token refresh');
      this.userSubject.next(storedUser);
      this.user.set(storedUser);
    }
  }

  /**
   * Gestiona el rol activo para redirecciones de dashboard
   */
  setActiveRole(role: string | null): void {
    if (role) {
      localStorage.setItem('vitalia-active-role', role);
    } else {
      localStorage.removeItem('vitalia-active-role');
    }
    this.activeRoleSubject.next(role);
    this.activeRole.set(role);
  }

  getActiveRoleSync(): string | null {
    return this.activeRoleSubject.getValue();
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): UserSummary | null {
    return this.userSubject.getValue();
  }

  /**
   * Obtiene los roles del usuario actual
   */
  getCurrentUserRoles(): string[] {
    const user = this.getCurrentUser();
    return user?.roles || [];
  }

  /**
   * Obtiene el tenant del usuario actual
   */
  getCurrentTenantCode(): string | undefined {
    return this.getCurrentUser()?.tenantCode;
  }

  /**
   * Obtiene el tipo de persona del usuario actual
   */
  getCurrentPersonType(): UserSummary['personType'] | undefined {
    return this.getCurrentUser()?.personType;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    return this.getCurrentUserRoles().includes(role);
  }

  /**
   * Verifica si el usuario tiene al menos uno de los roles especificados
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Actualiza datos del usuario
   */
  updateUser(userUpdates: Partial<UserSummary>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser: UserSummary = {
        ...currentUser,
        ...userUpdates
      };
      this.setUser(updatedUser);
    }
  }

  // ========== MÉTODOS PRIVADOS ==========

  private initializeFromStorage(): void {
    const tokenValid = this.tokenService.isAccessTokenValid();
    const storedUser = this.getUserFromStorage();

    console.log('[SessionService] initializing...', { tokenValid, hasUser: !!storedUser });

    if (tokenValid && storedUser) {
      this.userSubject.next(storedUser);
      this.user.set(storedUser); // 🔥 Fix: Sync signal on rehydration

      // Restore active role if present
      const storedRole = localStorage.getItem('vitalia-active-role');
      if (storedRole) {
        this.activeRoleSubject.next(storedRole);
        this.activeRole.set(storedRole);
      }
    } else if (tokenValid && !storedUser) {
      // Token válido pero no hay usuario -> sesión inconsistente
      console.warn('[SessionService] Valid token but no user found in storage. Clearing session.');
      this.logout();
    } else if (!tokenValid && storedUser) {
      // Usuario almacenado pero token inválido -> limpiar
      console.warn('[SessionService] User found but token is invalid/missing. Clearing session.');
      this.clearUser();
    }
    // Si no hay token ni usuario, no hacer nada (ya está en null)
  }

  private setUser(user: UserSummary): void {
    try {
      localStorage.setItem('vitalia-current-user', JSON.stringify(user));
      this.userSubject.next(user);
      this.user.set(user);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      // En modo incógnito o storage lleno, al menos mantener en memoria
      this.userSubject.next(user);
    }
  }

  private clearUser(): void {
    try {
      localStorage.removeItem('vitalia-current-user');
      // 🛡️ DO NOT remove vitalia-tenant-code here.
      // We keep it as a 'hint' for the login page to remember the last used hospital.
      localStorage.removeItem('tenantTheme');
    } catch (error) {
      console.error('Error clearing user from localStorage:', error);
    } finally {
      this.userSubject.next(null);
      this.user.set(null);
    }
  }

  private getUserFromStorage(): UserSummary | null {
    try {
      const userString = localStorage.getItem('vitalia-current-user');
      if (!userString) return null;

      const user = JSON.parse(userString) as UserSummary;

      // Validación básica del objeto
      if (typeof user !== 'object' || user === null) {
        console.warn('Invalid user object in storage');
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  private initializeStorageSync(): void {
    if (typeof window === 'undefined') return; // SSR

    // Escuchar cambios en localStorage de otras pestañas
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === 'vitalia-current-user') {
        this.handleUserStorageChange(event);
      }

      // También escuchar cambios en el token si es necesario
      if (event.key === this.getTokenStorageKey()) {
        this.handleTokenStorageChange(event);
      }
    });
  }

  private handleUserStorageChange(event: StorageEvent): void {
    try {
      const user = event.newValue ? JSON.parse(event.newValue) as UserSummary : null;

      // Validar que el usuario tiene estructura mínima
      if (user && (typeof user.id !== 'number' || !user.email)) {
        console.warn('Invalid user structure from storage event');
        return;
      }

      this.userSubject.next(user);
    } catch (error) {
      console.error('Error handling user storage change:', error);
    }
  }

  private handleTokenStorageChange(event: StorageEvent): void {
    // Si el token fue eliminado en otra pestaña, cerrar sesión
    if (!event.newValue && event.oldValue) {
      console.log('Token removed in another tab. Logging out.');
      this.clearUser();
    }
  }

  private getTokenStorageKey(): string {
    // Usa la misma clave que TokenService
    return 'vitalia-access-token';
  }
}
