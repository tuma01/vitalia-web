import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LanguageService } from '@core/services/language.service';

export function settingsInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // const languageService = inject(LanguageService);
  // const lang = languageService.getCurrentLanguage() || 'es-ES';

  if (req.url.startsWith('/assets/')) return next(req);
  // inyecta LanguageService dentro de función para evitar circular dependency
  let lang = 'es-ES';

  try {
    const languageService = inject(LanguageService);
    lang = languageService.getCurrentLanguage() || lang;
  } catch (e) {
    console.warn('LanguageService not available yet');
  }

  return next(req.clone({ setHeaders: { 'Accept-Language': lang } }));
}
