import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

/**
 * Platform Guard
 * 
 * Protects platform routes (/platform/**) ensuring only ROLE_SUPER_ADMIN can access.
 */
export const platformGuard: CanActivateFn = (route, state) => {
    const sessionService = inject(SessionService);
    const router = inject(Router);

    if (!sessionService.hasRole('ROLE_SUPER_ADMIN')) {
        console.warn('[PlatformGuard] Access denied: User is not SuperAdmin');
        router.navigate(['/login']);
        return false;
    }

    return true;
};
