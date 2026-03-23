import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { MEDICATIONS_CRUD_CONFIG } from './medications-crud.config';
import { Medication } from 'app/api/models/medication';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

@Component({
    selector: 'app-medications-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class MedicationsListComponent {
    @ViewChild('crud') private crud!: CrudTemplateComponent<Medication>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);

    config = MEDICATIONS_CRUD_CONFIG();

    constructor() {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: Medication) => this.edit(record),
                    deleteHandler: (record: Medication) => this.deleteMedication(record),
                    entityType: 'catalog.medications.singular',
                    fieldForMessage: 'genericName'
                },
                this.confirmDialog
            ) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/catalog/medications/add']);
    }

    edit(record: Medication): void {
        this.router.navigate(['/platform/catalog/medications/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteMedication(record: Medication): void {
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
