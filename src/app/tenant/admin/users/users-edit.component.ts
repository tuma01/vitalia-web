import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { UserTenantRole } from 'app/api/models/user-tenant-role';
import { USERS_CRUD_CONFIG } from './users-crud.config';
import { SessionService } from '@core/services/session.service';

@Component({
    selector: 'app-users-edit',
    standalone: true,
    imports: [CommonModule, CrudTemplateComponent, TranslateModule],
    template: `
        <app-crud-template
            mode="edit"
            [config]="config"
            [formGroup]="form"
            (save)="onSubmit()"
            (cancel)="onCancel()">
        </app-crud-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersEditComponent extends CrudBaseAddEditComponent<UserTenantRole> implements OnInit {
    protected override entityNameKey = 'tenant_admin.admin.users.singular';
    public readonly config = USERS_CRUD_CONFIG();
    private sessionService = inject(SessionService);
    private cdr = inject(ChangeDetectorRef);

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void {
        this.form.get('user.email')?.disable();
        this.populateRoles();
    }

    private populateRoles(): void {
        const roleField = this.config.form?.fields.find(f => f.name === 'role.name');
        if (roleField) {
            const roles = [
                { label: 'Tenant Admin', value: 'ROLE_TENANT_ADMIN' },
                { label: 'Doctor', value: 'ROLE_DOCTOR' },
                { label: 'Nurse', value: 'ROLE_NURSE' },
                { label: 'Employee', value: 'ROLE_EMPLOYEE' }
            ];

            if (this.sessionService.hasRole('ROLE_SUPER_ADMIN')) {
                roles.unshift({ label: 'Super Admin', value: 'ROLE_SUPER_ADMIN' });
            }

            roleField.options = roles;
        }
    }

    protected override loadEntityData(id: any): void {
        this.config.apiService.getById(id).subscribe({
            next: (data) => {
                this.form.patchValue({
                    'user.email': data.user?.email,
                    'role.name': data.role?.name,
                    'active': data.active
                });
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.handleError(err, 'crud.load_error');
                this.cdr.markForCheck();
            }
        });
    }

    protected override getSuccessRoute(): any[] {
        return ['/admin/admin/users/list'];
    }

    protected override saveEntity(formData: any): Observable<UserTenantRole> {
        const dto = {
            id: this.entityId,
            role: { name: formData['role.name'] },
            active: formData.active
        };
        return this.config.apiService.update(this.entityId!, dto as any);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
