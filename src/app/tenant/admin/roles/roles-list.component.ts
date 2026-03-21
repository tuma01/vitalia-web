import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { ROLES_CRUD_CONFIG } from './roles-crud.config';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, CrudTemplateComponent],
  template: `
    <app-crud-template
      [config]="config"
      [mode]="'list'">
    </app-crud-template>
  `
})
export class RolesListComponent implements OnInit {
  config = ROLES_CRUD_CONFIG();

  ngOnInit(): void {}
}
