import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { TokenService } from '../token/token.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  const accessToken = tokenService.accessToken;

  // Añadir access token
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = tokenService.refreshToken;
      if (!refreshToken || !tokenService.isRefreshTokenValid()) {
        tokenService.clearTokens();
        return throwError(() => error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            const newAccessToken = response?.tokens?.accessToken;

            if (!newAccessToken) {
              tokenService.clearTokens();
              return throwError(() => error);
            }

            refreshTokenSubject.next(newAccessToken);
            isRefreshing = false;

            return next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`
                }
              })
            );
          }),
          catchError(refreshErr => {
            tokenService.clearTokens();
            isRefreshing = false;
            return throwError(() => refreshErr);
          })
        );
      } else {
        return refreshTokenSubject.pipe(
          filter(t => t !== null),
          take(1),
          switchMap(t =>
            next(
              req.clone({
                setHeaders: { Authorization: `Bearer ${t}` }
              })
            )
          )
        );
      }
    })
  );
};
