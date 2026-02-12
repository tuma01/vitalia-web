import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
 * - Context-scoped storage
 * 
 * 🔥 CRITICAL: This service MUST be initialized via APP_INITIALIZER before any other service
 * that depends on context (ThemeService, ContextStorageService, etc.)
 */
@Injectable({ providedIn: 'root' })
export class AppContextService {
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
        this.currentContext.set(context);
        this.contextSubject.next(context); // 🔥 Emit to subscribers

        if (context === 'platform') {
            // Platform context has no tenant
            this.tenantInfo.set(null);
            this.tenantSubject.next(null);
            console.log('[AppContext] ✅ Context set to PLATFORM');
        } else {
            // App context requires tenant info
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
     * Detects context from the current URL
     */
    private detectFromUrl(): void {
        const url = window.location.pathname;
        if (url.startsWith('/platform')) {
            this.setContext('platform');
            console.log('[AppContext] ✅ Context set to PLATFORM from URL');
        } else {
            // Default to app context for tenant login
            this.currentContext.set('app');
            this.contextSubject.next('app');
            this.tenantInfo.set(null);
            this.tenantSubject.next(null);
            console.log('[AppContext] ✅ Context set to APP from URL (no tenant)');
        }
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
                    const tenantCode = sessionStorage.getItem('tenant-code');
                    const tenantName = sessionStorage.getItem('tenant-name');

                    this.setContext('app', {
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

