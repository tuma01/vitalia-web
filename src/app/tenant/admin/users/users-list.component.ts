import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { UserTenantRole } from 'app/api/models/user-tenant-role';
import { USERS_CRUD_CONFIG } from './users-crud.config';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, CrudTemplateComponent],
  template: `
    <app-crud-template #crud
      [config]="config"
      [mode]="'list'"
      (create)="onCreate()">
    </app-crud-template>
  `
})
export class UsersListComponent implements OnInit {
  @ViewChild('crud') private crud!: CrudTemplateComponent<UserTenantRole>;

  private router = inject(Router);
  private translate = inject(TranslateService);
  private confirmDialog = inject(ConfirmDialogService);
  private snackBar = inject(MatSnackBar);

  config = USERS_CRUD_CONFIG();

  constructor() {
    this.config.columns.push(
      (getOperationColumn(
        this.translate,
        {
          editHandler: (record: UserTenantRole) => this.onEdit(record),
          deleteHandler: (record: UserTenantRole) => this.onDelete(record),
          entityType: 'tenant_admin.admin.users.singular',
          fieldForMessage: 'user.email'
        },
        this.confirmDialog
      ) as any)
    );
  }

  ngOnInit(): void {}

  onCreate(): void {
    this.router.navigate(['/admin/admin/users/add']);
  }

  onEdit(user: UserTenantRole): void {
    this.router.navigate(['/admin/admin/users/edit', user.id]);
  }

  onDelete(record: UserTenantRole): void {
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
