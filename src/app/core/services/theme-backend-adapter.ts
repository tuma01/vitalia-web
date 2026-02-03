import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BrandDesignTokens } from './ui-theme.types';
import { ThemeDto } from '../../api/models/theme-dto';

/**
 * 🔌 Theme Backend Adapter
 * 
 * Adapta los themes desde la API del backend al formato interno de ThemeService.
 * Usa el ThemeDto oficial generado por ng-openapi-gen.
 * Maneja fallbacks y errores de forma robusta.
 */

@Injectable({ providedIn: 'root' })
export class ThemeBackendAdapter {
    private readonly API_BASE = '/api/tenants';

    constructor(private http: HttpClient) { }

    /**
     * Carga el theme de un tenant desde el backend.
     * 
     * @param tenantId ID del tenant
     * @returns Observable con Partial<BrandDesignTokens> o null si no existe
     */
    loadThemeForTenant(tenantId: string): Observable<Partial<BrandDesignTokens> | null> {
        return this.http.get<ThemeDto>(`${this.API_BASE}/${tenantId}/theme`).pipe(
            map(dto => this.adaptTheme(dto)),
            catchError(error => {
                console.warn(
                    `[ThemeBackendAdapter] No theme found for tenant "${tenantId}". Using default fallback.`,
                    error
                );
                return of(null);
            })
        );
    }

    /**
     * Adapta el ThemeDto del backend al formato interno BrandDesignTokens.
     * 
     * NOTA: Este método adapta los campos del backend y parsea propertiesJson.
     * El ThemeService usará UiThemeRuntimeBuilder para completar el resto de tokens.
     */
    private adaptTheme(dto: ThemeDto): Partial<BrandDesignTokens> {
        // Parsear propertiesJson si viene como string
        let customProperties: Record<string, string> | undefined;
        if (dto.propertiesJson) {
            try {
                customProperties = JSON.parse(dto.propertiesJson);
            } catch (error) {
                console.warn('[ThemeBackendAdapter] Failed to parse propertiesJson', error);
                customProperties = undefined;
            }
        }

        return {
            name: dto.name,
            logoUrl: dto.logoUrl,
            customCss: dto.customCss,
            customProperties,
            brand: {
                primary: dto.primaryColor || '#1976d2',      // Fallback a Material default
                secondary: dto.secondaryColor || '#dc004e',
                accent: dto.accentColor || '#9c27b0'
            },
            // Campos adicionales que pueden usarse en el theme
            text: dto.textColor ? {
                primary: dto.textColor,
                secondary: dto.textColor,
                disabled: dto.textColor,
                inverse: '#ffffff',
                link: dto.linkColor
            } : undefined,
            surface: dto.backgroundColor ? {
                background: dto.backgroundColor,
                card: dto.backgroundColor,
                elevated: dto.backgroundColor,
                overlay: 'rgba(0,0,0,0.32)'
            } : undefined,
            typography: dto.fontFamily ? {
                fontFamily: dto.fontFamily
            } : undefined
            // Los demás campos (feedback, radius, etc.) 
            // serán completados por UiThemeRuntimeBuilder
        };
    }

    /**
     * Valida que el DTO tenga los campos mínimos requeridos.
     */
    private validateThemeDTO(dto: ThemeDto): boolean {
        return !!(
            dto.code &&
            dto.name &&
            dto.active !== false  // Solo validar si está activo
        );
    }
}
