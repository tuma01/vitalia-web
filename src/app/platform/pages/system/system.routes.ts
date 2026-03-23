import { Routes } from '@angular/router';
import { PlatformShellComponent } from '../../shared/components/platform-shell/platform-shell.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'audit',
                component: PlatformShellComponent,
                data: { title: 'menu.audit_logs', icon: 'policy' }
            },
            {
                path: 'security',
                component: PlatformShellComponent,
                data: { title: 'menu.security_policies', icon: 'admin_panel_settings' }
            },
            {
                path: 'iam',
                children: [
                    {
                        path: '',
                        redirectTo: 'list',
                        pathMatch: 'full'
                    },
                    {
                        path: 'list',
                        loadComponent: () => import('./super-admins/super-admins-list.component').then(m => m.SuperAdminsListComponent),
                        data: { title: 'menu.platform.governance.super.admins.list', icon: 'list' }
                    },
                    {
                        path: 'add',
                        loadComponent: () => import('./super-admins/super-admins-add.component').then(m => m.SuperAdminsAddComponent),
                        data: { title: 'menu.platform.governance.super.admins.add', icon: 'add' }
                    },
                    {
                        path: 'edit',
                        loadComponent: () => import('./super-admins/super-admins-edit.component').then(m => m.SuperAdminsEditComponent),
                        data: { title: 'menu.platform.governance.super.admins.edit', icon: 'edit' }
                    }
                ]
            },
            {
                path: 'consent',
                component: PlatformShellComponent,
                data: { title: 'menu.consent_registry', icon: 'gavel' }
            }
        ]
    }
];
