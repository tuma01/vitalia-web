import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { ICD10_CRUD_CONFIG } from './icd10-crud.config';
import { Icd10 } from 'app/api/models/icd-10';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

@Component({
    selector: 'app-icd10-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class Icd10ListComponent {
    @ViewChild('crud') private crud!: CrudTemplateComponent<Icd10>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);

    config = ICD10_CRUD_CONFIG();

    constructor() {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: Icd10) => this.edit(record),
                    deleteHandler: (record: Icd10) => this.deleteIcd10(record),
                    entityType: 'catalog.icd10.singular',
                    fieldForMessage: 'description'
                },
                this.confirmDialog
            ) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/catalog/icd10/add']);
    }

    edit(record: Icd10): void {
        this.router.navigate(['/platform/catalog/icd10/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteIcd10(record: Icd10): void {
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
