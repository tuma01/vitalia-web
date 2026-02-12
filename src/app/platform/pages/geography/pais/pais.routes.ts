import { Routes } from '@angular/router';
import { PaisesComponent } from './paises/paises.component';
import { AddPaisComponent } from './add-pais/add-pais.component';
import { EditPaisComponent } from './edit-pais/edit-pais.component';

export const routes: Routes = [
    { path: 'paises', component: PaisesComponent },
    { path: 'addPais', component: AddPaisComponent },
    { path: 'editPais', component: EditPaisComponent },
    { path: '', redirectTo: 'paises', pathMatch: 'full' }
];
