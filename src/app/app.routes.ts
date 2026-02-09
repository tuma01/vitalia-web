import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { RoleRedirectGuard } from './core/guards/role-redirect.guard';

export const routes: Routes = [
    // Public routes
    { path: 'login', component: LoginComponent, data: { title: 'Login' } },
    { path: 'auth/login', redirectTo: 'login', pathMatch: 'full' },

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
                data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_TENANT_ADMIN'] },
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () => import('./features/admin/dashboard/role-dashboard.component').then(m => m.RoleDashboardComponent)
                    }
                ]
            },

            // Doctor - COMMENTED OUT (dashboard deleted)
            // {
            //     path: 'doctor',
            //     canActivate: [roleGuard],
            //     data: { roles: ['ROLE_DOCTOR'] },
            //     children: [
            //         {
            //             path: 'dashboard',
            //             loadComponent: () => import('./features/doctor/dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
            //         }
            //     ]
            // },

            // Nurse
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

            // Employee
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

            // Patient
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
            }
        ]
    },

    // Fallback
    { path: '**', redirectTo: 'login' }
];
