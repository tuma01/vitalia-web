import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { MessageService } from '../services/message.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const messenger = inject(MessageService);
  const started = Date.now();
  let ok = '';

  return next(req).pipe(
    tap({
      next: event => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
      error: () => (ok = 'failed')
    }),
    finalize(() => {
      const elapsed = Date.now() - started;
      const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
      messenger.add(msg);
    })
  );
};
