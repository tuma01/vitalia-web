import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([403, 500].includes(error.status)) {
        router.navigateByUrl(`/${error.status}`, { skipLocationChange: true });
      } else if (error.status === 404) {
        // Ignorar 404 (recurso no encontrado), no mostrar Toast.
        // Los servicios deben manejar sus propios 404 si es necesario.
      } else {
        toast.error(error.message || 'Unexpected Error');
      }

      return throwError(() => error);
    })
  );
};

