import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';
import { AppContextService } from '../services/app-context.service';

export const RoleRedirectGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const context = inject(AppContextService);

    if (auth.isAuthenticatedSync()) {
        const user = auth.getCurrentUser();
        if (!user) {
            console.warn('[RoleRedirectGuard] Logged in but no user found.');
            return router.createUrlTree(['/login']);
        }

        // 🏆 PRIORIDAD 0: Respetar el rol activo en sesión
        const session = inject(SessionService);
        const activeRole = session.getActiveRoleSync();
        console.log(`[RoleRedirectGuard] activeRole from session: ${activeRole}`);
        console.log(`[RoleRedirectGuard] user roles:`, user.roles);

        if (activeRole && user.roles?.includes(activeRole)) {
            console.log(`[RoleRedirectGuard] Redirecting to activeRole dashboard: ${activeRole}`);

            // 🛡️ REGLA: Redirección por dominio (Platform vs Tenant)
            if (activeRole === 'ROLE_SUPER_ADMIN') {
                console.log('[RoleRedirectGuard] SuperAdmin detected. Setting context to PLATFORM.');
                context.setPlatformContext(); // Corregido: Usar AppContextService directamente
                return router.createUrlTree(['/platform/dashboard']);
            }

            if (activeRole === 'ROLE_ADMIN' || activeRole === 'ROLE_TENANT_ADMIN') {
                return router.createUrlTree(['/admin/dashboard']);
            }
            if (activeRole === 'ROLE_DOCTOR') return router.createUrlTree(['/doctor/dashboard']);
            if (activeRole === 'ROLE_NURSE') return router.createUrlTree(['/nurse/dashboard']);
            if (activeRole === 'ROLE_EMPLOYEE') return router.createUrlTree(['/employee/dashboard']);
            if (activeRole === 'ROLE_PATIENT') return router.createUrlTree(['/patient/dashboard']);
        }

        // Redirigir según rol (discovery fallback)
        console.log('[RoleRedirectGuard] Falling back to discovery logic.');
        if (Array.isArray(user.roles)) {
            if (user.roles.includes('ROLE_SUPER_ADMIN')) {
                context.setPlatformContext();
                return router.createUrlTree(['/platform/dashboard']);
            }
            if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_TENANT_ADMIN')) {
                return router.createUrlTree(['/admin/dashboard']);
            }
            if (user.roles.includes('ROLE_DOCTOR')) return router.createUrlTree(['/doctor/dashboard']);
            if (user.roles.includes('ROLE_NURSE')) return router.createUrlTree(['/nurse/dashboard']);
            if (user.roles.includes('ROLE_EMPLOYEE')) return router.createUrlTree(['/employee/dashboard']);
            if (user.roles.includes('ROLE_PATIENT')) return router.createUrlTree(['/patient/dashboard']);
        }

        console.warn('[RoleRedirectGuard] No specific role redirection found. Defaulting to Admin.');
        return router.createUrlTree(['/admin/dashboard']); // Fallback default
    }

    return router.createUrlTree(['/login']);
};
