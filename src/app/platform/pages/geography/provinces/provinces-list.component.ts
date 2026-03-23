import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { PROVINCES_CRUD_CONFIG } from './provinces-crud.config';
import { Provincia } from 'app/api/models/provincia';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';
import { DepartamentoService } from 'app/api/services/departamento.service';
import { Departamento } from 'app/api/models/departamento';

@Component({
    selector: 'app-provinces-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class ProvincesListComponent implements OnInit {
    @ViewChild('crud') private crud!: CrudTemplateComponent<Provincia>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);
    private departamentoService = inject(DepartamentoService);

    config = PROVINCES_CRUD_CONFIG();
    private departamentos: Departamento[] = [];

    constructor() {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: Provincia) => this.edit(record),
                    deleteHandler: (record: Provincia) => this.deleteProvincia(record),
                    entityType: 'catalog.geography.provinces.singular',
                    fieldForMessage: 'nombre'
                },
                this.confirmDialog
            ) as any)
        );
    }

    ngOnInit(): void {
        this.loadDepartamentos();
    }

    private loadDepartamentos(): void {
        this.departamentoService.getAllDepartamentos().subscribe({
            next: (departamentos) => {
                this.departamentos = departamentos;
                this.updateDepartamentoFormatter();
            }
        });
    }

    private updateDepartamentoFormatter(): void {
        const deptCol = this.config.columns.find(c => c.field === 'departamentoId');
        if (deptCol) {
            deptCol.formatter = (row: Provincia) => {
                const dept = this.departamentos.find(d => d.id === row.departamentoId);
                return dept ? dept.nombre : (row.departamentoId?.toString() || '');
            };
            this.crud.refreshColumns();
        }
    }

    createNew(): void {
        this.router.navigate(['/platform/geography/provinces/add']);
    }

    edit(record: Provincia): void {
        this.router.navigate(['/platform/geography/provinces/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteProvincia(record: Provincia): void {
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
