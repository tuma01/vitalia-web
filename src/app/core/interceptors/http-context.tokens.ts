import { HttpContextToken } from '@angular/common/http';

/**
 * Token to override the default X-Tenant-Code header in TenantContextInterceptor.
 * Useful for Super-Admin operations that need to target a specific tenant 
 * or for public endpoints that already know their tenant.
 */
export const TENANT_HEADER_OVERRIDE = new HttpContextToken<string | null>(() => null);
