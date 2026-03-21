import { Routes } from '@angular/router';
import { InvitationsListComponent } from './invitations-list.component';

export const INVITATIONS_ROUTES: Routes = [
    {
        path: '',
        component: InvitationsListComponent,
        data: { title: 'tenant_admin.admin.invitations.plural' }
    }
];
