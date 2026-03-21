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
    // 🔓 PUBLIC ROUTES
    // ============================================
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login - Vitalia' }
    },
    {
        path: 'signup',
        loadComponent: () => import('./tenant/auth/signup/signup.component')
            .then(m => m.default),
        data: { title: 'Registrarse - Vitalia' }
    },
    {
        path: 'complete-registration',
        loadComponent: () => import('./tenant/auth/complete-registration/complete-registration.component')
            .then(m => m.CompleteRegistrationComponent),
        data: { title: 'Completar Registro - Vitalia' }
    },
    {
        path: 'platform/login',
        loadComponent: () => import('./platform/auth/login/super-admin-login.component')
            .then(m => m.SuperAdminLoginComponent),
        data: { title: 'Platform Login - Vitalia' }
    },
    { path: 'auth/login', redirectTo: 'login', pathMatch: 'full' },



    // ============================================
    // 🟦 PLATFORM DOMAIN (SuperAdmin)
    // ============================================
    {
        path: 'platform',
        component: PlatformLayout,
        canActivate: [authGuard, platformGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./tenant/admin/dashboard/role-dashboard.component') // Temporalmente compartiendo componente
                    .then(m => m.RoleDashboardComponent),
                data: { title: 'Platform Dashboard' }
            },
            {
                path: 'geography',
                loadChildren: () => import('./platform/pages/geography/geography.routes').then(m => m.routes),
            },
            {
                path: 'tenants',
                loadChildren: () => import('./platform/pages/tenants/tenants.routes').then(m => m.routes),
            },
            {
                path: 'catalog',
                loadChildren: () => import('./platform/pages/catalog/catalog.routes').then(m => m.routes),
            },
            {
                path: 'system',
                loadChildren: () => import('./platform/pages/system/system.routes').then(m => m.routes),
            },
            {
                path: 'interop',
                loadChildren: () => import('./platform/pages/interop/interop.routes').then(m => m.routes),
            },
            {
                path: 'analytics',
                loadChildren: () => import('./platform/pages/analytics/analytics.routes').then(m => m.routes),
            },
            {
                path: 'communication',
                loadChildren: () => import('./platform/pages/communication/communication.routes').then(m => m.routes),
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // ============================================
    // 🟩 TENANT DOMAIN (Admin, Doctor, Patient, etc)
    // ============================================
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            // Redirection logic for root
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

            // Admin / Management
            {
                path: 'admin',
                canActivate: [roleGuard],
                data: { roles: ['ROLE_TENANT_ADMIN', 'ROLE_ADMIN'] },
                loadChildren: () => import('./tenant/admin/admin.routes').then(m => m.ADMIN_ROUTES)
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
    // 🛠️ UTILS & FALLBACK
    // ============================================
    { 
        path: '403', 
        loadComponent: () => import('./shared/components/error-page/error-page.component').then(m => m.ErrorPageComponent), 
        data: { title: 'Acceso Denegado', code: '403', icon: 'security', message: 'No tienes los permisos necesarios para acceder a este recurso.', color: 'warn' } 
    },
    { 
        path: '404', 
        loadComponent: () => import('./shared/components/error-page/error-page.component').then(m => m.ErrorPageComponent), 
        data: { title: 'No Encontrado', code: '404', icon: 'search_off', message: 'Lo sentimos, la página que estás buscando no existe o ha sido movida.', color: 'primary' } 
    },
    { 
        path: '500', 
        loadComponent: () => import('./shared/components/error-page/error-page.component').then(m => m.ErrorPageComponent), 
        data: { title: 'Error del Servidor', code: '500', icon: 'dns', message: 'Lo sentimos, ha ocurrido un error interno en el servidor. Inténtalo de nuevo más tarde.', color: 'warn' } 
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: '404' }
];
