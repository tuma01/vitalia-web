import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { mergeMap, of, throwError } from 'rxjs';

export function apiResponseInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const toast = inject(ToastrService);

  if (!req.url.includes('/api/')) {
    return next(req);
  }

  return next(req).pipe(
    mergeMap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const body = event.body;

        // Validación segura del cuerpo
        if (
          body &&
          typeof body === 'object' &&
          'code' in body &&
          typeof body.code === 'number'
        ) {
          if (body.code !== 0) {
            const msg = (body as any).msg || 'API error';
            toast.error(msg);
            return throwError(() => new Error(msg));
          }
        }
      }

      return of(event);
    })
  );
}
