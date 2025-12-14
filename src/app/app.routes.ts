import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    // Public routes (no authentication required)
    { path: 'login', component: LoginComponent, data: { title: 'Login Page' } },
    {
        path: 'auth/login',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    // Protected routes (authentication required)
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard], // Protect all routes under MainLayout
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },

            // Role-based dashboards - Mapped to shared Dashboard component for now
            // TODO: Create specific dashboard components for each role
            {
                path: 'admin',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_TENANT_ADMIN'] },
                children: [
                    { path: 'dashboard', component: Dashboard },
                    { path: 'hospital-dashboard', component: Dashboard }
                ]
            },
            {
                path: 'doctor',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_DOCTOR'] },
                children: [
                    { path: 'dashboard', component: Dashboard }
                ]
            },
            {
                path: 'nurse',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_NURSE'] },
                children: [
                    { path: 'dashboard', component: Dashboard }
                ]
            },
            {
                path: 'employee',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_EMPLOYEE'] },
                children: [
                    { path: 'dashboard', component: Dashboard }
                ]
            },
            {
                path: 'patient',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_PATIENT'] },
                children: [
                    { path: 'dashboard', component: Dashboard }
                ]
            }
        ]
    },

    // Unauthorized page (TODO: Create UnauthorizedComponent)
    // {
    //     path: 'unauthorized',
    //     loadComponent: () => import('./features/auth/unauthorized/unauthorized').then(m => m.UnauthorizedComponent)
    // },

    // Fallback route
    { path: '**', redirectTo: 'login' }
];
