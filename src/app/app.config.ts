import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule, TranslateLoader, Translation } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { routes } from './app.routes';
import { TokenService } from './core/token/token.service';
import { RefreshTokenService } from './core/token/refresh-token.service';
import { API_ROOT_URL } from './api/api-configuration';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import {
  baseUrlInterceptor,
  tokenInterceptor,
  settingsInterceptor,
  apiResponseInterceptor,
  errorInterceptor,
  loggingInterceptor,
  noopInterceptor
} from '@core';
import { ThemeService } from './core/theme/theme.service';
import { AppContextService } from './core/services/app-context.service';

// Loader para traducciones
export class WebpackTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) { }
  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

// 🔥 CRITICAL: Initialize context BEFORE theme (APP_INITIALIZER #1)
export function initializeContext(contextService: AppContextService) {
  return () => contextService.initFromSession();
}

// Initialize theme after context is ready (APP_INITIALIZER #2)
export function initializeTheme(themeService: ThemeService) {
  return () => themeService.initTheme();
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_ROOT_URL, useValue: environment.apiRootUrl },

    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),
    provideAnimations(),

    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,
        tokenInterceptor,
        settingsInterceptor,
        apiResponseInterceptor,
        errorInterceptor,
        loggingInterceptor,
        noopInterceptor
      ])
    ),

    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'es-ES',
        loader: { provide: TranslateLoader, useClass: WebpackTranslateLoader, deps: [HttpClient] }
      }),
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        timeOut: 5000,
        preventDuplicates: true
      })
    ),

    // 🔥 CRITICAL: APP_INITIALIZER order matters!
    // #1 - Context MUST be initialized first
    {
      provide: APP_INITIALIZER,
      useFactory: initializeContext,
      deps: [AppContextService],
      multi: true
    },

    // #2 - Theme loads AFTER context is ready
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      deps: [ThemeService],
      multi: true
    },

    TokenService,
    RefreshTokenService
  ]
};
