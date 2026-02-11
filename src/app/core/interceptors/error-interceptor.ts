import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../token/token.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastrService);
  const tokenService = inject(TokenService); // Inject TokenService

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 🛡️ SKIP global side-effects for Authentication requests
      // This allows LoginComponent to show its own specialized error messages.
      const isAuthRequest = req.url.includes('/auth/');

      if (isAuthRequest) {
        return throwError(() => error);
      }

      // Ignore 401 for Mock Users to allow simulation without logout
      const isMockToken = tokenService.accessToken?.startsWith('mock-');
      if (error.status === 401 && isMockToken) {
        console.warn('[ErrorInterceptor] Ignoring 401 for Mock Token');
        return throwError(() => error);
      }

      if ([403, 500].includes(error.status)) {
        router.navigateByUrl(`/${error.status}`, { skipLocationChange: true });
      } else if (error.status === 401) {
        toast.error('Session expired. Please login again.');
        router.navigate(['/auth/login']);
      } else if (error.status === 404) {
        // Ignorar 404 (recurso no encontrado), no mostrar Toast.
      } else if (error.status === 400) {
        // Ignorar 400 (Bad Request) - Dejar que el componente maneje la validación.
      } else {
        toast.error(error.message || 'Unexpected Error');
      }

      return throwError(() => error);
    })
  );
};

