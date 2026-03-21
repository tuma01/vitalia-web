import { Routes } from '@angular/router';
import { RolesListComponent } from './roles-list.component';

export const ROLES_ROUTES: Routes = [
    { path: 'list', component: RolesListComponent },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
];
