import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { GENDERS_CRUD_CONFIG } from './genders-crud.config';
import { Gender } from 'app/api/models/gender';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

@Component({
    selector: 'app-genders-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class GendersListComponent {
    @ViewChild('crud') private crud!: CrudTemplateComponent<Gender>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);

    config = GENDERS_CRUD_CONFIG();

    constructor() {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: Gender) => this.edit(record),
                    deleteHandler: (record: Gender) => this.deleteGender(record),
                    entityType: 'catalog.demographics.genders.singular',
                    fieldForMessage: 'name'
                },
                this.confirmDialog
            ) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/catalog/demographics/genders/add']);
    }

    edit(record: Gender): void {
        this.router.navigate(['/platform/catalog/demographics/genders/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteGender(record: Gender): void {
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
