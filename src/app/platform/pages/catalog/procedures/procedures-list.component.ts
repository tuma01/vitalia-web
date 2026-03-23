import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { PROCEDURES_CRUD_CONFIG } from './procedures-crud.config';
import { MedicalProcedure } from 'app/api/models/medical-procedure';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

@Component({
    selector: 'app-procedures-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class ProceduresListComponent {
    @ViewChild('crud') private crud!: CrudTemplateComponent<MedicalProcedure>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);

    config = PROCEDURES_CRUD_CONFIG();

    constructor() {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: MedicalProcedure) => this.edit(record),
                    deleteHandler: (record: MedicalProcedure) => this.deleteProcedure(record),
                    entityType: 'catalog.procedures.singular',
                    fieldForMessage: 'name'
                },
                this.confirmDialog
            ) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/catalog/procedures/add']);
    }

    edit(record: MedicalProcedure): void {
        this.router.navigate(['/platform/catalog/procedures/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteProcedure(record: MedicalProcedure): void {
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
