import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleRedirectGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated()) {
        // Basic redirect logic - for pilot we can just let them through or send to pilot
        // For now, let's send to pilot if no specific role logic is ready
        return router.createUrlTree(['/pilot']);
    }

    return router.createUrlTree(['/login']);
};
