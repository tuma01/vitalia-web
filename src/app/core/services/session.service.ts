import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from "rxjs";
import { TokenService } from "../token/token.service";
import { AuthService } from "./auth.service";
import { UserRegisterRequest, UserSummary } from "../../api/models";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  // ✅ Usar UserSummary (lo que devuelve la API)
  private userSubject = new BehaviorSubject<UserSummary | null>(null);
  public readonly user$ = this.userSubject.asObservable();

  constructor(
    private tokenService: TokenService,
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
  }

  /**
   * Cierra sesión completamente
   */
  logout(): void {
    this.tokenService.clearTokens();
    this.clearUser();
  }

  /**
   * Verifica si hay sesión activa (solo verificación local)
   */
  isAuthenticated(): boolean {
    return this.tokenService.isAccessTokenValid() && !!this.getCurrentUser();
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
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.userSubject.next(user);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      // En modo incógnito o storage lleno, al menos mantener en memoria
      this.userSubject.next(user);
    }
  }

  private clearUser(): void {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('tenantTheme');
    } catch (error) {
      console.error('Error clearing user from localStorage:', error);
    } finally {
      this.userSubject.next(null);
    }
  }

  private getUserFromStorage(): UserSummary | null {
    try {
      const userString = localStorage.getItem('currentUser');
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
      if (event.key === 'currentUser') {
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
