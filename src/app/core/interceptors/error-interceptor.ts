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
      if ([403, 404, 500].includes(error.status)) {
        router.navigateByUrl(`/${error.status}`, { skipLocationChange: true });
      } else {
        toast.error(error.message || 'Unexpected Error');
      }

      return throwError(() => error);
    })
  );
};

