import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// import { AuthService } from './core/services/auth.service';
import { firstValueFrom } from 'rxjs';

/**
 * Auth Guard - Protects routes that require authentication
 * Redirects to /login if user is not authenticated
 */
export const authGuard: CanActivateFn = async(route, state) => {
    const authService = inject(AuthService);
    // const tokenService = inject(TokenService);
    const router = inject(Router);

    // Espera a que el observable termine
    const isAuth = await firstValueFrom(authService.isAuthenticated());

    if (isAuth) {
        return true;
    }

    // Store the attempted URL for redirecting after login
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });

    return false;
};
