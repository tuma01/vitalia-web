import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule, TranslateLoader, Translation } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { TenantThemeService } from './core/services/tenant-theme.service';
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

// Loader para traducciones
export class WebpackTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) { }
  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

// Inicializa theme del tenant al startup
export function initializeTheme(themeService: TenantThemeService, authService: AuthService) {
  return () => {
    const user = authService.getCurrentUser();
    // Skip for mock users
    if (user?.email?.includes('@test.com')) {
      return Promise.resolve();
    }

    if (user && user.tenantCode && user.tenantCode !== 'GLOBAL') {
      return themeService.loadThemeForTenant(user.tenantCode).toPromise();
    }
    return Promise.resolve();
  };
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
        defaultLanguage: 'es-ES',
        loader: { provide: TranslateLoader, useClass: WebpackTranslateLoader, deps: [HttpClient] }
      })
    ),

    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        timeOut: 5000,
        preventDuplicates: true
      })
    ),

    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      deps: [TenantThemeService, AuthService],
      multi: true
    },

    TokenService,
    RefreshTokenService
  ]
};
