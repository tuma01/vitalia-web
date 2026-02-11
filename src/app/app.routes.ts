import { Routes } from '@angular/router';
import { MainLayout } from './tenant/layout/main-layout/main-layout';
import { PlatformLayout } from './platform/layout/platform-layout/platform-layout';
import { LoginComponent } from './tenant/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { RoleRedirectGuard } from './core/guards/role-redirect.guard';
import { platformGuard } from './core/guards/platform.guard';

export const routes: Routes = [
    // ============================================
    // 🟩 TENANT APP
    // ============================================

    // Tenant Login
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login - Vitalia' }
    },
    { path: 'auth/login', redirectTo: 'login', pathMatch: 'full' },

    // ============================================
    // 🟦 PLATFORM (SuperAdmin)
    // ============================================

    // Platform Login
    {
        path: 'platform/login',
        loadComponent: () => import('./platform/auth/login/super-admin-login.component')
            .then(m => m.SuperAdminLoginComponent),
        data: { title: 'Platform Login - Vitalia' }
    },

    // Protected routes
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                canActivate: [RoleRedirectGuard],
                children: []
            },
            {
                path: 'dashboard',
                canActivate: [RoleRedirectGuard],
                children: []
            },

            // Admin
            {
                path: 'admin',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_TENANT_ADMIN', 'ROLE_ADMIN'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./tenant/admin/dashboard/role-dashboard.component').then(m => m.RoleDashboardComponent)
                    }
                ]
            },

            // Doctor
            {
                path: 'doctor',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_DOCTOR'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./tenant/doctor/dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
                    }
                ]
            },

            // Nurse
            {
                path: 'nurse',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_NURSE'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./tenant/nurse/dashboard/nurse-dashboard.component').then(m => m.NurseDashboardComponent)
                    }
                ]
            },

            // Employee
            {
                path: 'employee',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_EMPLOYEE'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./tenant/employee/dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent)
                    }
                ]
            },

            // Patient
            {
                path: 'patient',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_PATIENT'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./tenant/patient/dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent)
                    }
                ]
            }
        ]
    },

    // ============================================
    // 🟦 PLATFORM Routes
    // ============================================
    {
        path: 'platform',
        component: PlatformLayout,
        canActivate: [authGuard, platformGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./tenant/admin/dashboard/role-dashboard.component')
                    .then(m => m.RoleDashboardComponent),
                data: { title: 'Platform Dashboard' }
            }
        ]
    },

    // Fallback
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
