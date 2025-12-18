import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { RoleRedirectGuard } from './core/guards/role-redirect.guard';

export const routes: Routes = [
    // Public routes (no authentication required)
    { path: 'login', component: LoginComponent, data: { title: 'Login Page' } },
    {
        path: 'auth/login',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    // Super Admin Login (separate from regular login)
    {
        path: 'super-admin/login',
        loadComponent: () => import('./features/auth/super-admin-login/super-admin-login.component').then(m => m.SuperAdminLoginComponent),
        data: { title: 'Super Admin Login' }
    },

    // Protected routes (authentication required)
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard], // Protect all routes under MainLayout
        children: [
            // SMART REDIRECT: '/' and '/dashboard' now automatically send user to their specific role dashboard
            {
                path: '',
                pathMatch: 'full',
                canActivate: [RoleRedirectGuard],
                children: [] // Guard handles the redirect, no component needed
            },
            {
                path: 'dashboard',
                canActivate: [RoleRedirectGuard],
                children: []
            },

            // Role-based dashboards - FULLY MIGRATED
            {
                path: 'admin',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_TENANT_ADMIN'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
                    },
                    {
                        path: 'hospital-dashboard',
                        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
                    }
                ]
            },
            {
                path: 'doctor',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_DOCTOR'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/doctor/dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
                    }
                ]
            },
            {
                path: 'nurse',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_NURSE'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/nurse/dashboard/nurse-dashboard.component').then(m => m.NurseDashboardComponent)
                    }
                ]
            },
            {
                path: 'employee',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_EMPLOYEE'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/employee/dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent)
                    }
                ]
            },
            {
                path: 'patient',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_PATIENT'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/patient/dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent)
                    }
                ]
            },
            // Super Admin routes
            {
                path: 'super-admin',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_SUPER_ADMIN'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/super-admin/dashboard/super-admin-dashboard.component').then(m => m.SuperAdminDashboardComponent)
                    },
                    {
                        path: 'geography',
                        loadChildren: () => import('./features/super-admin/geography/geography.routes').then(m => m.routes)
                    }
                ]
            }
        ]
    },

    // Fallback route
    { path: '**', redirectTo: 'login' }
];
