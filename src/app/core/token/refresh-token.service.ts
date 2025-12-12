// refresh-token.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.tokenService.refreshToken;

    if (!refreshToken || !this.tokenService.isRefreshTokenValid()) {
      return throwError(() => new Error('No valid refresh token'));
    }

    if (this.isRefreshing) {
      // Si ya se está refrescando, retorna el observable existente
      return this.refreshSubject.asObservable();
    }

    this.isRefreshing = true;

    return this.http.post<any>('/api/auth/refresh', {
      refreshToken: refreshToken
    }).pipe(
      tap(response => {
        this.tokenService.setTokens(
          response.accessToken,
          response.refreshToken
        );
        this.isRefreshing = false;
        this.refreshSubject.next(response);
      }),
      catchError(error => {
        this.isRefreshing = false;
        this.tokenService.clearTokens();
        return throwError(() => error);
      })
    );
  }

  shouldRefreshToken(): boolean {
    return this.tokenService.isTokenAboutToExpire() &&
           this.tokenService.isRefreshTokenValid();
  }
}
