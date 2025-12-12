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

            // Future role-based routes
            // {
            //     path: 'admin',
            //     canActivate: [roleGuard],
            //     data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'] },
            //     loadChildren: () => import('./features/admin/admin.routes')
            // },
            // {
            //     path: 'doctor',
            //     canActivate: [roleGuard],
            //     data: { roles: ['ROLE_DOCTOR'] },
            //     loadChildren: () => import('./features/doctor/doctor.routes')
            // },
            // {
            //     path: 'nurse',
            //     canActivate: [roleGuard],
            //     data: { roles: ['ROLE_NURSE'] },
            //     loadChildren: () => import('./features/nurse/nurse.routes')
            // },
            // {
            //     path: 'employee',
            //     canActivate: [roleGuard],
            //     data: { roles: ['ROLE_EMPLOYEE'] },
            //     loadChildren: () => import('./features/employee/employee.routes')
            // },
            // {
            //     path: 'patient',
            //     canActivate: [roleGuard],
            //     data: { roles: ['ROLE_PATIENT'] },
            //     loadChildren: () => import('./features/patient/patient.routes')
            // }
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
