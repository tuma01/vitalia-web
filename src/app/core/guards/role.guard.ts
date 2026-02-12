import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Role Guard - Protects routes based on user roles (Tenant Domain)
 * Blocks SUPER_ADMIN from accidentally entering tenant routes.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();
    const userRole = authService.currentUserRole();

    if (!user) {
        router.navigate(['/login']);
        return false;
    }

    // 🚫 SUPER ADMIN NO PUEDE ENTRAR A TENANT (Domain Isolation)
    if (userRole === 'ROLE_SUPER_ADMIN') {
        console.warn('[RoleGuard] SuperAdmin attempted to access tenant route. Redirecting to platform.');
        router.navigate(['/platform/dashboard']);
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
