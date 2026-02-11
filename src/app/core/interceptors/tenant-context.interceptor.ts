import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppContextService } from '../services/app-context.service';

/**
 * Tenant Context Interceptor
 * 
 * Automatically adds X-Tenant-ID header to HTTP requests when in APP context.
 * Platform context requests do NOT include tenant header.
 * 
 * This ensures proper multi-tenancy at the HTTP level.
 */
export const tenantContextInterceptor: HttpInterceptorFn = (req, next) => {
    const appContext = inject(AppContextService);

    // Only add tenant header if we're in APP context
    if (appContext.isApp()) {
        const tenant = appContext.tenant();

        if (tenant?.code) {
            const clonedReq = req.clone({
                setHeaders: {
                    'X-Tenant-ID': tenant.code
                }
            });

            console.log('[TenantContextInterceptor] Added X-Tenant-ID header:', tenant.code);
            return next(clonedReq);
        } else {
            console.warn('[TenantContextInterceptor] APP context but no tenant code available');
        }
    }

    // Platform context or no tenant → no header
    return next(req);
};
