import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    private permissions = signal<string[]>([]);

    setPermissions(perms: string[]) {
        this.permissions.set(perms);
    }

    has(permission?: string): boolean {
        if (!permission) return true;
        return this.permissions().includes(permission);
    }
}
