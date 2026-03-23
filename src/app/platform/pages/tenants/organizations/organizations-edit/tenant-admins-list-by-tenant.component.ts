import { Component, Input, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { ADMINISTRATORS_CRUD_CONFIG } from '../../administrators/administrators-crud.config';
import { TenantAdmin } from 'app/api/models/tenant-admin';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { map } from 'rxjs';

@Component({
    selector: 'app-tenant-admins-list-by-tenant',
    standalone: true,
    imports: [CommonModule, CrudTemplateComponent],
    template: `
        <app-crud-template #crud
            [config]="config"
            (create)="createNew()"
        ></app-crud-template>
    `
})
export class TenantAdminsListByTenantComponent implements OnInit {
    @Input() tenantId!: number;
    @ViewChild('crud') private crud!: CrudTemplateComponent<TenantAdmin>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);

    config = ADMINISTRATORS_CRUD_CONFIG('list');

    ngOnInit(): void {
        this.setupConfig();
        this.setupOperations();
    }

    private setupConfig(): void {
        // Filter the getAll results to only show admins for this tenant
        const originalGetAll = this.config.apiService.getAll.bind(this.config.apiService);
        this.config.apiService.getAll = () => originalGetAll().pipe(
            map(admins => admins.filter(a => a.tenant?.id === this.tenantId))
        );

        // Optional: Hide the Tenant column since we are inside that tenant's view
        this.config.columns = this.config.columns.filter(col => col.field !== 'tenant.name');
    }

    private setupOperations(): void {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: TenantAdmin) => this.edit(record),
                    deleteHandler: (record: TenantAdmin) => this.deleteAdmin(record),
                    entityType: 'tenant_governance.administrators.singular',
                    fieldForMessage: 'nombre'
                },
                this.confirmDialog
            ) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/tenants/administrators/add'], {
            queryParams: { tenantId: this.tenantId }
        });
    }

    edit(record: TenantAdmin): void {
        this.router.navigate(['/platform/tenants/administrators/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteAdmin(record: TenantAdmin): void {
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
