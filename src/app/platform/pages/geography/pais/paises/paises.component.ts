import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { PAIS_CRUD_CONFIG } from '../pais-crud.config';
import { Country } from 'app/api/models/country';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-paises',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
      (edit)="edit($event)"
    ></app-crud-template>
  `
})
export class PaisesComponent {
    private router = inject(Router);
    private translate = inject(TranslateService);

    config = PAIS_CRUD_CONFIG();

    constructor() {
        // Add operation column and link it to the engine's logic
        this.config.columns.push(
            (getOperationColumn(this.translate, {
                editHandler: (record: Country) => this.edit(record),
                deleteHandler: (record: Country) => {
                    // Logic handled within the grid buttons if needed, 
                    // or by the engine's onDelete if called via event.
                },
                entityType: 'entity.country',
                fieldForMessage: 'name'
            }) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/geography/pais/addPais']);
    }

    edit(record: Country): void {
        this.router.navigate(['/platform/geography/pais/editPais'], {
            queryParams: { id: record.id },
        });
    }
}
