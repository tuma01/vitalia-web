import { Injectable, signal, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TenantService } from 'app/api/services/tenant.service';

/**
 * Application context types
 */
export type AppContext = 'platform' | 'app';

/**
 * Tenant information interface
 */
export interface TenantInfo {
    id?: number;
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
 * - Context-scoped storage
 * 
 * 🔥 CRITICAL: This service MUST be initialized via APP_INITIALIZER before any other service
 * that depends on context (ThemeService, ContextStorageService, etc.)
 */
@Injectable({ providedIn: 'root' })
export class AppContextService {
    private tenantService = inject(TenantService);

    // 🔄 Reactive context stream (for services to subscribe)
    private contextSubject = new BehaviorSubject<AppContext | null>(null);
    public readonly contextChanges$: Observable<AppContext | null> = this.contextSubject.asObservable();

    private tenantSubject = new BehaviorSubject<TenantInfo | null>(null);
    public readonly tenantChanges$: Observable<TenantInfo | null> = this.tenantSubject.asObservable();

    // 📡 Signals for template usage (reactive UI)
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
        const currentSnap = this.contextSubject.value;
        const tenantSnap = this.tenantSubject.value;
        const newTenant = tenant || null;

        // 🛡️ Guard: Skip if context and tenant are identical to current
        if (currentSnap === context && 
            tenantSnap?.code === newTenant?.code && 
            tenantSnap?.id === newTenant?.id) {
            return;
        }

        this.currentContext.set(context);
        this.contextSubject.next(context); 

        if (context === 'platform') {
            this.tenantInfo.set(null);
            this.tenantSubject.next(null);
            console.log('[AppContext] ✅ Context set to PLATFORM');
        } else {
            const t = tenant || null;
            this.tenantInfo.set(t);
            this.tenantSubject.next(t);
            console.log('[AppContext] ✅ Context set to APP', tenant);
        }
    }

    /**
     * Helper to set Platform context
     */
    setPlatformContext(): void {
        this.setContext('platform');
    }

    /**
     * Helper to set Tenant context
     */
    setTenantContext(tenant?: TenantInfo): void {
        this.setContext('app', tenant);
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
     * 
     * 🔥 SMART RESET: Instead of setting to null, re-evaluates context from URL
     * to keep login page themes stable.
     */
    reset(): void {
        console.log('[AppContext] 🔄 Resetting context (logout flow)...');
        this.detectFromUrl();
    }

    /**
     * Detects context from the current URL (Platform vs Tenant)
     * Supports subdomain-based tenant resolution (e.g., hospital-a.vitalia.com)
     */
    private detectFromUrl(): void {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;

        console.log(`[AppContext] 🔍 Detecting context from URL: ${hostname}${pathname}`);

        // 1. Platform Context Detection
        if (pathname.startsWith('/platform')) {
            this.setPlatformContext();
            return;
        }

        // 2. Subdomain-based Tenant Resolution
        // Pattern: [tenant].vitalia.com or [tenant].localhost
        const parts = hostname.split('.');
        
        // If we have a subdomain (e.g., hospital-san-borja.localhost)
        if (parts.length > 1) {
            const sub = parts[0].toLowerCase();
            
            // Exclude common non-tenant subdomains
            const reserved = ['www', 'app', 'vitalia', 'platform', 'localhost'];
            
            if (!reserved.includes(sub)) {
                console.log(`[AppContext] 🌐 Tenant subdomain detected: ${sub}`);
                
                // 🚀 Sync Hydration: Try to get name from localStorage immediately
                const savedCode = localStorage.getItem('vitalia-tenant-code');
                const savedName = localStorage.getItem('vitalia-tenant-name');
                const initialTenant: TenantInfo = { code: sub };
                
                if (savedCode === sub && savedName) {
                    initialTenant.name = savedName;
                }

                this.setTenantContext(initialTenant);
                this.loadTenantDetails(sub);
                return;
            }
        }

        // 3. Default Fallback (no tenant detected yet)
        this.setTenantContext(undefined);
        console.log('[AppContext] ⚠️ No tenant detected from URL subdomain');
    }

    /**
     * Fetch full tenant details by code (publicly)
     */
    private loadTenantDetails(code: string): void {
        this.tenantService.getPublicTenantByCode({ code }).subscribe({
            next: (tenant: any) => {
                // 🛡️ Guard: Only update if we are not in platform mode
                // This prevents race conditions where an async public load overwrites a SuperAdmin session.
                if (this.currentContext() === 'platform') {
                    console.log(`[AppContext] 🛡️ Ignoring tenant details for ${code} - current context is PLATFORM`);
                    return;
                }

                console.log(`[AppContext] ✅ Tenant details loaded for: ${code}`, tenant);
                this.setTenantContext({
                    id: tenant.id,
                    code: tenant.code,
                    name: tenant.name
                });
            },
            error: (err: any) => {
                console.warn(`[AppContext] ⚠️ Could not load details for tenant: ${code}`, err);
            }
        });
    }

    /**
     * Check if context is set
     */
    hasContext(): boolean {
        return this.currentContext() !== null;
    }

    /**
     * Get context snapshot (synchronous, for guards/interceptors)
     */
    getContextSnapshot(): AppContext | null {
        return this.contextSubject.value;
    }

    /**
     * 🚨 CRITICAL: Initialize context from existing session (for app bootstrap)
     * 
     * Bootstrap order:
     * 1. APP_INITIALIZER #1 → AppContextService.initFromSession()
     * 2. APP_INITIALIZER #2 → ThemeService.initTheme()
     */
    initFromSession(): Promise<void> {
        return new Promise(resolve => {
            console.log('[AppContext] 🚀 Initializing context from session storage...');

            // Try to get user from local storage (unified key)
            const userJson = localStorage.getItem('vitalia-current-user');

            if (!userJson) {
                // No session - determine context from URL (for login pages)
                this.detectFromUrl();
                resolve();
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
                    const tenantId = sessionStorage.getItem('tenant-id');
                    const tenantCode = sessionStorage.getItem('tenant-code');
                    const tenantName = sessionStorage.getItem('tenant-name');

                    this.setContext('app', {
                        id: tenantId ? Number(tenantId) : undefined,
                        code: tenantCode || 'unknown',
                        name: tenantName || undefined
                    });
                    console.log('[AppContext] ✅ Context initialized as APP from session');
                }
            } catch (error) {
                console.error('[AppContext] ❌ Failed to parse session user:', error);
                // Fallback to URL-based detection
                const url = window.location.pathname;
                this.setContext(url.startsWith('/platform') ? 'platform' : 'app');
            }

            resolve(); // ✅ Context is now set
        });
    }
}

