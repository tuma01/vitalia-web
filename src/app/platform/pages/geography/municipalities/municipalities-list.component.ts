import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { MUNICIPALITIES_CRUD_CONFIG } from './municipalities-crud.config';
import { Municipio } from 'app/api/models/municipio';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';
import { ProvinciaService } from 'app/api/services/provincia.service';
import { Provincia } from 'app/api/models/provincia';

@Component({
    selector: 'app-municipalities-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class MunicipalitiesListComponent implements OnInit {
    @ViewChild('crud') private crud!: CrudTemplateComponent<Municipio>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);
    private provinciaService = inject(ProvinciaService);

    config = MUNICIPALITIES_CRUD_CONFIG();
    private provincias: Provincia[] = [];

    constructor() {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: Municipio) => this.edit(record),
                    deleteHandler: (record: Municipio) => this.deleteMunicipio(record),
                    entityType: 'catalog.geography.municipalities.singular',
                    fieldForMessage: 'nombre'
                },
                this.confirmDialog
            ) as any)
        );
    }

    ngOnInit(): void {
        this.loadProvincias();
    }

    private loadProvincias(): void {
        this.provinciaService.getAllProvincias().subscribe({
            next: (provincias) => {
                this.provincias = provincias;
                this.updateProvinciaFormatter();
            }
        });
    }

    private updateProvinciaFormatter(): void {
        const provCol = this.config.columns.find(c => c.field === 'provinciaId');
        if (provCol) {
            provCol.formatter = (row: Municipio) => {
                const prov = this.provincias.find(p => p.id === row.provinciaId);
                return prov ? prov.nombre : (row.provinciaId?.toString() || '');
            };
            this.crud.refreshColumns();
        }
    }

    createNew(): void {
        this.router.navigate(['/platform/geography/municipalities/add']);
    }

    edit(record: Municipio): void {
        this.router.navigate(['/platform/geography/municipalities/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteMunicipio(record: Municipio): void {
        this.config.apiService.delete(record.id!).subscribe({
            next: () => {
                this.snackBar.open(
                    this.translate.instant('common.delete_success'),
                    undefined, { duration: 3000, panelClass: 'success-snackbar' }
                );
                this.crud.loadData();
            },
            error: () => this.snackBar.open(
                this.translate.instant('common.delete_error'),
                this.translate.instant('common.close'),
                { duration: 5000, panelClass: 'error-snackbar' }
            )
        });
    }
}
