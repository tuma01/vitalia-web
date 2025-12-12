import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Role Guard - Protects routes based on user roles
 * Usage in routes:
 * {
 *   path: 'admin',
 *   canActivate: [roleGuard],
 *   data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'] }
 * }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (!user) {
        router.navigate(['/login']);
        return false;
    }

    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
        // No specific roles required, just authentication
        return true;
    }

    // Check if user has at least one of the required roles
    const hasRole = user.roles?.some((role: string) => requiredRoles.includes(role));

    if (hasRole) {
        return true;
    }

    // User doesn't have required role, redirect to unauthorized page
    router.navigate(['/unauthorized']);
    return false;
};
