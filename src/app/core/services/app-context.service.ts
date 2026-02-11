import { Injectable, signal, computed } from '@angular/core';

/**
 * Application context types
 */
export type AppContext = 'platform' | 'app';

/**
 * Tenant information interface
 */
export interface TenantInfo {
    code: string;
    name?: string;
}

/**
 * AppContextService
 * 
 * Centralized service for managing application context.
 * Determines whether the user is in PLATFORM (SuperAdmin) or APP (Tenant) context.
 * 
 * This service is the foundation for:
 * - Layout selection
 * - HTTP interceptor behavior
 * - Guard logic
 * - Feature availability
 */
@Injectable({ providedIn: 'root' })
export class AppContextService {
    // Private signals
    private currentContext = signal<AppContext | null>(null);
    private tenantInfo = signal<TenantInfo | null>(null);

    // Public readonly signals
    context = this.currentContext.asReadonly();
    tenant = this.tenantInfo.asReadonly();

    // Computed helpers
    isPlatform = computed(() => this.currentContext() === 'platform');
    isApp = computed(() => this.currentContext() === 'app');

    /**
     * Set the application context
     * 
     * @param context - 'platform' for SuperAdmin, 'app' for tenant users
     * @param tenant - Tenant information (required for 'app' context)
     */
    setContext(context: AppContext, tenant?: TenantInfo): void {
        this.currentContext.set(context);

        if (context === 'platform') {
            // Platform context has no tenant
            this.tenantInfo.set(null);
            console.log('[AppContext] Context set to PLATFORM');
        } else {
            // App context requires tenant info
            this.tenantInfo.set(tenant || null);
            console.log('[AppContext] Context set to APP', tenant);
        }
    }

    /**
     * Get tenant info, throws if not available
     * Use this when tenant is required for an operation
     */
    requireTenant(): TenantInfo {
        const tenant = this.tenantInfo();
        if (!tenant) {
            throw new Error('[AppContext] Tenant required but not set. Current context: ' + this.currentContext());
        }
        return tenant;
    }

    /**
     * Reset context (typically on logout)
     */
    reset(): void {
        this.currentContext.set(null);
        this.tenantInfo.set(null);
        console.log('[AppContext] Context reset');
    }

    /**
     * Check if context is set
     */
    hasContext(): boolean {
        return this.currentContext() !== null;
    }

    /**
     * Initialize context from existing session (for app bootstrap)
     * This runs BEFORE any other service that depends on context
     */
    initFromSession(): void {
        // Try to get user from session storage
        const userJson = sessionStorage.getItem('current-user');

        if (!userJson) {
            // No session - determine context from URL (for login pages)
            const url = window.location.pathname;

            if (url.startsWith('/platform')) {
                this.setContext('platform');
                console.log('[AppContext] ✅ Context initialized as PLATFORM from URL (no session)');
            } else {
                // Default to app context for tenant login, but NO tenant yet
                // Tenant will be set when user selects from dropdown
                this.currentContext.set('app');
                this.tenantInfo.set(null);
                console.log('[AppContext] ✅ Context initialized as APP from URL (no tenant yet)');
            }
            return;
        }

        try {
            const user = JSON.parse(userJson);

            // Determine context from user roles
            if (user.roles?.includes('ROLE_SUPER_ADMIN')) {
                this.setContext('platform');
                console.log('[AppContext] ✅ Context initialized as PLATFORM from session');
            } else {
                // Get tenant from session
                const tenantCode = sessionStorage.getItem('tenant-code');
                const tenantName = sessionStorage.getItem('tenant-name');

                this.setContext('app', {
                    code: tenantCode || 'unknown',
                    name: tenantName || undefined
                });
                console.log('[AppContext] ✅ Context initialized as APP from session');
            }
        } catch (error) {
            console.error('[AppContext] Failed to parse session user:', error);
        }
    }
}
