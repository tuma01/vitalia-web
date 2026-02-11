import { Injectable } from '@angular/core';
import { AppContextService, AppContext } from './app-context.service';
import { combineLatest } from 'rxjs';

/**
 * Context-Scoped Storage Service (V3 - Absolute Tenant Isolation)
 * 
 * Wraps localStorage to automatically scope keys by application context (platform vs tenant).
 * This ensures that Platform and Tenant settings don't interfere with each other.
 * 
 * 🔥 CRITICAL: This service subscribes to AppContextService.contextChanges$ to stay in sync.
 * The context MUST be initialized via APP_INITIALIZER before this service is used.
 * 
 * Storage key format: `${prefix}_${version}_${key}`
 * Format examples:
 * - 'platform_v3_theme'
 * - 'app_HOSP_A_v3_theme'
 * - 'app_no-tenant_v3_theme' (login page)
 */
@Injectable({ providedIn: 'root' })
export class ContextStorageService {
    private readonly VERSION = 'v3'; // 🔥 BUMP TO V3 to force clear state
    private currentPrefix = '__NOCTX__';

    constructor(private appContext: AppContextService) {
        // 🔄 Use combineLatest for atomic prefix updates
        combineLatest([
            this.appContext.contextChanges$,
            this.appContext.tenantChanges$
        ]).subscribe(([context, tenant]) => {
            if (!context) {
                this.currentPrefix = '__NOCTX__';
            } else if (context === 'platform') {
                this.currentPrefix = 'platform';
            } else {
                const code = tenant?.code || 'no-tenant';
                this.currentPrefix = `app_${code}`;
            }
            console.log('[ContextStorage] 🔑 New Storage Prefix:', this.currentPrefix);
        });
    }

    /**
     * Builds a context-scoped key with versioning
     * 
     * @param key - The base key (e.g., 'theme', 'headerColor')
     * @returns Scoped key (e.g., 'platform_v2_theme', 'app_v2_theme')
     * 
     * 🚨 If context is not set yet (during bootstrap), uses '__NOCTX__' prefix
     * to prevent crashes while still being detectable in DevTools.
     */
    private buildKey(key: string): string {
        return `${this.currentPrefix}_${this.VERSION}_${key}`;
    }

    /**
     * Sets an item in localStorage with context scope
     */
    setItem(key: string, value: string): void {
        localStorage.setItem(this.buildKey(key), value);
    }

    /**
     * Gets an item from localStorage with context scope
     */
    getItem(key: string): string | null {
        return localStorage.getItem(this.buildKey(key));
    }

    /**
     * Removes an item from localStorage with context scope
     */
    removeItem(key: string): void {
        localStorage.removeItem(this.buildKey(key));
    }

    /**
     * Clears all items for the CURRENT prefix
     */
    clearContext(): void {
        const prefix = `${this.currentPrefix}_${this.VERSION}_`;

        // Find and remove all keys with current prefix
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('[ContextStorage] 🧹 Cleared', keysToRemove.length, 'items for prefix:', prefix);
    }

    /**
     * Get current prefix (for debugging)
     */
    getCurrentPrefix(): string {
        return this.currentPrefix;
    }
}

