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

    // Determine tenant code based on context
    let tenantCode: string | undefined;

    if (appContext.isPlatform()) {
        // Platform context (SuperAdmin) requests do NOT need X-Tenant-Code.
        // The backend identifies the user role and platform scope via token.
        return next(req);
    } 

    if (appContext.isApp()) {
        tenantCode = appContext.tenant()?.code;
    }

    if (tenantCode) {
        const clonedReq = req.clone({
            setHeaders: {
                'X-Tenant-Code': tenantCode
            }
        });
        console.log('[TenantContextInterceptor] Added X-Tenant-Code header:', tenantCode);
        return next(clonedReq);
    }

    // Platform context or no tenant → no header
    return next(req);
};
