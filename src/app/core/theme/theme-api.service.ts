import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThemeDto } from '../../api/models/theme-dto';
import { ApiConfiguration } from '../../api/api-configuration';

/**
 * 🌐 Theme API Service
 * 
 * Handles all backend HTTP calls for theme data.
 * Separated from ThemeService for proper separation of concerns.
 */
@Injectable({ providedIn: 'root' })
export class ThemeApiService {
    constructor(
        private http: HttpClient,
        private apiConfig: ApiConfiguration
    ) { }

    /**
     * Fetch theme for a specific tenant.
     * Backend endpoint: GET /themes/tenant/{tenantCode} (ThemeController)
     */
    getThemeForTenant(tenantCode: string): Observable<ThemeDto> {
        const url = `${this.apiConfig.rootUrl}/themes/tenant/${tenantCode}`;
        return this.http.get<ThemeDto>(url);
    }
}
