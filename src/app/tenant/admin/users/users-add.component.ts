import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { UserTenantRole } from 'app/api/models/user-tenant-role';
import { USERS_CRUD_CONFIG } from './users-crud.config';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RoleService } from 'app/api/services/role.service';
import { UserInvitationsService } from 'app/api/services/user-invitations.service';
import { SessionService } from '@core/services/session.service';
import { AppContextService } from '@core/services/app-context.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-add',
  standalone: true,
  imports: [CrudTemplateComponent, TranslateModule],
  template: `
    <!-- Subtitle per user's request, placed elegantly above the standard form -->
    <div style="padding: 0 24px 20px 24px; color: var(--text-secondary);">
      {{ 'tenant_admin.admin.users.invite.subtitle' | translate }}
    </div>
    
    <app-crud-template
        mode="add"
        [config]="config"
        [formGroup]="form"
        (save)="onSubmit()"
        (cancel)="onCancel()">
    </app-crud-template>
  `
})
export class UsersAddComponent extends CrudBaseAddEditComponent<UserTenantRole> implements OnInit {
  protected override entityNameKey = 'tenant_admin.admin.users.singular';
  public readonly config = USERS_CRUD_CONFIG();

  private rolesService = inject(RoleService);
  private invitationService = inject(UserInvitationsService);
  private sessionService = inject(SessionService);
  private appContext = inject(AppContextService);
  protected override router = inject(Router);

  protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
    inject(FormBuilder), this.config
  );

  ngOnInit(): void {
    // Load roles dynamically for the dropdown mapping
    this.rolesService.getAllRoles().subscribe({
      next: (roles) => {
        const roleField = this.config.form?.fields?.find(f => f.name === 'role.name');
        if (roleField) {
          (roleField as any).options = roles
            .filter(r => r.name !== 'ROLE_SUPER_ADMIN') // Prevent escalating to Super Admin
            .map(r => ({ label: r.name!, value: r.name! }));
        }
      }
    });

    // Set active field default to true
    const activeControl = this.form.get('active');
    if (activeControl) {
      activeControl.setValue(true);
    }
  }

  protected override getSuccessRoute(): any[] {
    return ['/admin/admin/users/list'];
  }

  protected override saveEntity(formData: any): Observable<any> {
    const tenant = this.appContext.requireTenant();
    
    // Convert formData to createInvitation request pattern while keeping the UI standard
    return this.invitationService.createInvitation({
      body: {
        email: formData['user.email'],
        nombre: formData['nombre'],
        apellidoPaterno: formData['apellidoPaterno'],
        roleName: formData['role.name'],
        personType: formData['personType'],
        tenantCode: tenant.code
      }
    });
  }

  onCancel(): void {
    this.router.navigate(this.getSuccessRoute());
  }
}
