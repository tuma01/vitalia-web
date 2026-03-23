import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { TENANT_CONFIGS_CRUD_CONFIG } from './tenant-configs-crud.config';
import { TenantConfig } from 'app/api/models/tenant-config';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

@Component({
    selector: 'app-tenant-configs-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class TenantConfigsListComponent {
    @ViewChild('crud') private crud!: CrudTemplateComponent<TenantConfig>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);

    config = TENANT_CONFIGS_CRUD_CONFIG();

    constructor() {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: TenantConfig) => this.edit(record),
                    deleteHandler: (record: TenantConfig) => this.deleteTenantConfig(record),
                    entityType: 'tenant_config.singular',
                    fieldForMessage: 'id' // Using id as fallback if name is not applicable
                },
                this.confirmDialog
            ) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/tenants/tenant-configs/add']);
    }

    edit(record: TenantConfig): void {
        this.router.navigate(['/platform/tenants/tenant-configs/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteTenantConfig(record: TenantConfig): void {
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
