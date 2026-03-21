import { Routes } from '@angular/router';
import { UsersListComponent } from './users-list.component';
import { UsersAddComponent } from './users-add.component';
import { UsersEditComponent } from './users-edit.component';

export const USERS_ROUTES: Routes = [
    { path: 'list', component: UsersListComponent },
    { path: 'add', component: UsersAddComponent },
    { path: 'edit/:id', component: UsersEditComponent },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
];
