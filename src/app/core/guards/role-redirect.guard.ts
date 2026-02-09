import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleRedirectGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticatedSync()) {
        const user = auth.getCurrentUser();
        if (!user) return router.createUrlTree(['/login']);

        // Redirigir según rol
        if (Array.isArray(user.roles)) {
            if (user.roles.includes('ROLE_SUPER_ADMIN')) return router.createUrlTree(['/admin/dashboard']);
            if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_TENANT_ADMIN')) {
                return router.createUrlTree(['/admin/dashboard']);
            }
            if (user.roles.includes('ROLE_DOCTOR')) return router.createUrlTree(['/doctor/dashboard']);
            if (user.roles.includes('ROLE_NURSE')) return router.createUrlTree(['/nurse/dashboard']);
            if (user.roles.includes('ROLE_EMPLOYEE')) return router.createUrlTree(['/employee/dashboard']);
            if (user.roles.includes('ROLE_PATIENT')) return router.createUrlTree(['/patient/dashboard']);
        }

        return router.createUrlTree(['/admin/dashboard']); // Fallback default
    }

    return router.createUrlTree(['/login']);
};
