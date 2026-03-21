import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/role-dashboard.component').then(m => m.RoleDashboardComponent),
        data: { title: 'dashboard.title' }
    },
    {
        path: 'admin',
        children: [
            {
                path: 'profile',
                loadChildren: () => import('./profile/hospital-profiles.routes').then(m => m.HOSPITAL_PROFILES_ROUTES)
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES)
            },
            {
                path: 'roles',
                loadChildren: () => import('./roles/roles.routes').then(m => m.ROLES_ROUTES)
            },
            {
                path: 'invitations',
                loadChildren: () => import('./invitations/invitations.routes').then(m => m.INVITATIONS_ROUTES)
            }
        ]
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
