import { Injectable } from '@angular/core';
import { AppContextService } from './app-context.service';

/**
 * Context-Scoped Storage Service
 * 
 * Wraps localStorage to automatically scope keys by application context (platform vs tenant).
 * This ensures that Platform and Tenant settings don't interfere with each other.
 * 
 * Example:
 * - Platform context: 'theme' → 'platform_theme'
 * - Tenant context: 'theme' → 'tenant_theme'
 */
@Injectable({ providedIn: 'root' })
export class ContextStorageService {

    constructor(private appContext: AppContextService) { }

    /**
     * Builds a context-scoped key
     * @param key - The base key (e.g., 'theme', 'headerColor')
     * @returns Scoped key (e.g., 'platform_theme', 'tenant_theme')
     */
    private buildKey(key: string): string {
        const context = this.appContext.context();

        // If no context yet, return unprefixed key (graceful degradation)
        if (!context) {
            console.warn('[ContextStorage] No context set yet, using unprefixed key:', key);
            return key;
        }

        // Map 'app' to 'tenant' for storage keys
        const prefix = context === 'platform' ? 'platform' : 'tenant';
        return `${prefix}_${key}`;
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
     * Clears all items for the current context
     */
    clearContext(): void {
        const context = this.appContext.context() || 'tenant';
        const prefix = `${context}_`;

        // Find and remove all keys with current context prefix
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
}
