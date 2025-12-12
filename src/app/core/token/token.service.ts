import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'vitalia-access-token';
  private readonly REFRESH_TOKEN_KEY = 'vitalia-refresh-token';
  private readonly isBrowser: boolean;
  private jwtHelper: JwtHelperService;

  // Observable para cambios de token (útil para sincronizar entre pestañas)
  private tokenChangedSubject = new BehaviorSubject<string | null>(null);
  public tokenChanged$ = this.tokenChangedSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.jwtHelper = new JwtHelperService();
  }

  // ========== ACCESS TOKEN ==========
  set accessToken(token: string | null) {
    if (this.isBrowser) {
      if (token) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      }
      this.tokenChangedSubject.next(token);
    }
  }

  get accessToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.ACCESS_TOKEN_KEY) : null;
  }

  // ========== REFRESH TOKEN ==========
  set refreshToken(token: string | null) {
    if (this.isBrowser) {
      if (token) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      }
    }
  }

  get refreshToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.REFRESH_TOKEN_KEY) : null;
  }

  // ========== VALIDACIÓN DE TOKENS ==========
  isAccessTokenValid(): boolean {
    const token = this.accessToken;
    if (!token) return false;

    try {
      // Verificar que el token sea válido y no esté expirado
      const isExpired = this.jwtHelper.isTokenExpired(token);
      const hasValidFormat = this.isValidTokenFormat(token);

      return !isExpired && hasValidFormat;
    } catch (error) {
      console.error('Error validando access token:', error);
      return false;
    }
  }

  isRefreshTokenValid(): boolean {
    const token = this.refreshToken;
    if (!token) return false;

    try {
      // Los refresh tokens pueden tener diferente validación
      // Depende de tu backend si incluye expiración o no
      return this.isValidTokenFormat(token);
    } catch (error) {
      console.error('Error validando refresh token:', error);
      return false;
    }
  }

  // Verifica formato básico de JWT
  private isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
      // Verificar que las partes sean base64 válido
      return parts.every(part => {
        try {
          atob(part.replace(/-/g, '+').replace(/_/g, '/'));
          return true;
        } catch {
          return false;
        }
      });
    } catch {
      return false;
    }
  }

  // ========== INFORMACIÓN DEL TOKEN ==========
  getDecodedAccessToken(): any | null {
    const token = this.accessToken;
    if (!token || !this.isAccessTokenValid()) return null;

    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  get userRoles(): string[] {
    const decoded = this.getDecodedAccessToken();
    return decoded?.authorities || decoded?.roles || decoded?.scope || [];
  }

  get userId(): string | null {
    const decoded = this.getDecodedAccessToken();
    return decoded?.sub || decoded?.userId || decoded?.id || null;
  }

  getTokenExpiration(): Date | null {
    const token = this.accessToken;
    if (!token) return null;

    try {
      return this.jwtHelper.getTokenExpirationDate(token);
    } catch {
      return null;
    }
  }

  getTokenExpiresIn(): number | null {
    const expiration = this.getTokenExpiration();
    if (!expiration) return null;

    const now = new Date();
    return Math.floor((expiration.getTime() - now.getTime()) / 1000);
  }

  isTokenAboutToExpire(thresholdSeconds: number = 300): boolean {
    const expiresIn = this.getTokenExpiresIn();
    return expiresIn !== null && expiresIn < thresholdSeconds;
  }

  // ========== GESTIÓN COMPLETA ==========
  setTokens(accessToken: string, refreshToken?: string): void {
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }

  clearTokens(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      this.tokenChangedSubject.next(null);
    }
  }

  // ========== SINCROMIZACIÓN ENTRE PESTAÑAS ==========
  initializeTokenSync(): void {
    if (!this.isBrowser) return;

    // Escuchar cambios en localStorage de otras pestañas
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === this.ACCESS_TOKEN_KEY) {
        this.tokenChangedSubject.next(event.newValue);
      }
    });
  }

  // Método para tu AuthGuard (versión simple)
  isTokenValid(): boolean {
    return this.isAccessTokenValid();
  }
}
