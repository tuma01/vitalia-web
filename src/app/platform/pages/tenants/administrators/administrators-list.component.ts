import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { ADMINISTRATORS_CRUD_CONFIG } from './administrators-crud.config';
import { TenantAdmin } from 'app/api/models/tenant-admin';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

@Component({
    selector: 'app-administrators-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class AdministratorsListComponent {
    @ViewChild('crud') private crud!: CrudTemplateComponent<TenantAdmin>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);

    config = ADMINISTRATORS_CRUD_CONFIG('list');

    constructor() {
        // Columna Operaciones
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: TenantAdmin) => this.edit(record),
                    deleteHandler: (record: TenantAdmin) => this.deleteAdministrator(record),
                    entityType: 'tenant_governance.administrators.singular',
                    fieldForMessage: 'nombre'
                },
                this.confirmDialog
            ) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/tenants/administrators/add']);
    }

    edit(record: TenantAdmin): void {
        this.router.navigate(['/platform/tenants/administrators/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteAdministrator(record: TenantAdmin): void {
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
