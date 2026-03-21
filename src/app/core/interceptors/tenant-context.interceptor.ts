import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppContextService } from '../services/app-context.service';
import { TENANT_HEADER_OVERRIDE } from './http-context.tokens';

/**
 * Tenant Context Interceptor
 * 
 * Automatically adds X-Tenant-Code header to HTTP requests.
 * 1. Favors TENANT_HEADER_OVERRIDE from HttpContext (if present).
 * 2. Uses AppContextService if in 'app' mode.
 * 3. Falls back to 'GLOBAL' if in 'platform' mode (SuperAdmin).
 */
export const tenantContextInterceptor: HttpInterceptorFn = (req, next) => {
    const appContext = inject(AppContextService);
    let tenantCode: string | undefined;

    // 1. Check for manual override in HttpContext (highest priority)
    const override = req.context.get(TENANT_HEADER_OVERRIDE);
    if (override) {
        tenantCode = override;
    } 
    // 2. Otherwise use global context
    else if (appContext.isApp()) {
        tenantCode = appContext.tenant()?.code;
    }
    // 3. Super-Admin platform context -> GLOBAL fallback
    else if (appContext.isPlatform()) {
        tenantCode = 'GLOBAL';
    }

    // 🔥 Only add header if tenantCode is a valid string (not 'unknown' or empty)
    if (tenantCode && tenantCode !== 'unknown' && tenantCode.trim() !== '') {
        const clonedReq = req.clone({
            setHeaders: {
                'X-Tenant-Code': tenantCode
            }
        });
        console.log(`[TenantContextInterceptor] ✅ Set X-Tenant-Code: ${tenantCode} (source: ${override ? 'HttpContext' : 'AppContext'})`);
        return next(clonedReq);
    }

    // Default: no header
    return next(req);
};
