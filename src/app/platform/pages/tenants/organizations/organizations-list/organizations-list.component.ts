import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { ORGANIZATIONS_CRUD_CONFIG } from '../organizations-crud.config';
import { Tenant } from 'app/api/models/tenant';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';
import { ThemeService } from 'app/api/services/theme.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

@Component({
    selector: 'app-organizations-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class OrganizationsListComponent {
    @ViewChild('crud') private crud!: CrudTemplateComponent<Tenant>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);
    private themeService = inject(ThemeService);

    config = ORGANIZATIONS_CRUD_CONFIG();

    constructor() {
        // 🛡️ SECURITY: Filter out 'GLOBAL' tenant from the UI
        // This ensures the SuperAdmin only manages client organizations.
        const originalGetAll = this.config.apiService.getAll.bind(this.config.apiService);
        this.config.apiService.getAll = () => originalGetAll().pipe(
            map((response: any) => {
                if (response && response.content) {
                    return {
                        ...response,
                        content: response.content.filter((item: any) => item.type !== 'GLOBAL')
                    };
                }
                return response;
            })
        );

        // Columna Operaciones
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: Tenant) => this.edit(record),
                    deleteHandler: (record: Tenant) => this.deleteOrganization(record),
                    entityType: 'tenant_governance.organizations.singular',
                    fieldForMessage: 'name'
                },
                this.confirmDialog
            ) as any)
        );
    }

    createNew(): void {
        this.router.navigate(['/platform/tenants/organizations/add']);
    }

    edit(record: Tenant): void {
        this.router.navigate(['/platform/tenants/organizations/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteOrganization(record: Tenant): void {
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
