import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { CIVIL_STATUSES_CRUD_CONFIG } from './civil-statuses-crud.config';
import { CivilStatus } from 'app/api/models/civil-status';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

@Component({
    selector: 'app-civil-statuses-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class CivilStatusesListComponent {
    @ViewChild('crud') private crud!: CrudTemplateComponent<CivilStatus>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);

    config = CIVIL_STATUSES_CRUD_CONFIG();

    constructor() {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: CivilStatus) => this.edit(record),
                    deleteHandler: (record: CivilStatus) => this.deleteCivilStatus(record),
                    entityType: 'catalog.demographics.civil.statuses.singular',
                    fieldForMessage: 'name'
                },
                this.confirmDialog
            ) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/catalog/demographics/civil-statuses/add']);
    }

    edit(record: CivilStatus): void {
        this.router.navigate(['/platform/catalog/demographics/civil-statuses/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteCivilStatus(record: CivilStatus): void {
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
