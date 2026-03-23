import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { ADMINISTRATORS_CRUD_CONFIG } from './administrators-crud.config';
import { TenantAdmin } from 'app/api/models/tenant-admin';
import { TenantService } from 'app/api/services/tenant.service';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { PersonFormComponent, PersonFormConfig } from '@shared/components/person-form/person-form.component';

@Component({
    selector: 'app-administrators-add',
    standalone: true,
    imports: [CrudTemplateComponent, TranslateModule, ReactiveFormsModule, PersonFormComponent],
    template: `
        <app-crud-template
            mode="add"
            [config]="config"
            [formGroup]="form"
            (save)="onSubmit()"
            (cancel)="onCancel()">
            <div form>
                <app-person-form [parentForm]="personForm" [config]="personConfig"></app-person-form>
            </div>
        </app-crud-template>
    `
})
export class AdministratorsAddComponent extends CrudBaseAddEditComponent<TenantAdmin> implements OnInit {
    protected override entityNameKey = 'tenant_governance.administrators.singular';
    public readonly config = ADMINISTRATORS_CRUD_CONFIG('add');

    private tenantService = inject(TenantService);
    private readonly _fb = inject(FormBuilder);

    /** Configuración para el Administrador (Campos Críticos) */
    public personConfig: PersonFormConfig = {
        showIdentification: true,
        isIdentificationRequired: true,
        showMiddleName: true,
        showMaidenName: false,
        showBirthDate: true,
        isBirthDateRequired: true,
        showGender: true,
        isGenderRequired: true,
        showPhone: true,
        isPhoneRequired: true,
        showPersonalEmail: false
    };

    /** Sub-formulario de Persona */
    public personForm: FormGroup = PersonFormComponent.buildPersonFormGroup(this._fb, this.personConfig);

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        this._fb, this.config
    );

    ngOnInit(): void {
        this.loadTenants();
    }

    private loadTenants(): void {
        const preselectedTenantId = this.activatedRoute.snapshot.queryParamMap.get('tenantId');

        this.tenantService.getAllTenants().subscribe(tenants => {
            const tenantField = this.config.form?.fields.find((f: any) => f.name === 'tenant');
            if (tenantField) {
                const options = tenants
                    .filter(t => t.type !== 'GLOBAL')
                    .map(t => ({
                        label: t.name || '',
                        value: t
                    }));
                tenantField.options = options;

                if (preselectedTenantId) {
                    const selectedTenant = tenants.find(t => String(t.id) === preselectedTenantId);
                    if (selectedTenant) {
                        this.form.patchValue({ tenant: selectedTenant });
                        tenantField.disabled = true;
                    }
                }
            }
        });
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/tenants/administrators/list'];
    }

    protected override saveEntity(formData: any): Observable<TenantAdmin> {
        const personData = this.personForm.value;

        const payload: TenantAdmin = {
            ...formData,
            ...personData,
            tenant: { id: formData.tenant.id },
            personType: 'ADMIN',
            celular: personData.telefono,
            user: {
                email: formData.userEmail, // Uso de userEmail
                password: formData.password,
                roles: ['ROLE_ADMIN']
            }
        };

        // Limpiar campos auxiliares
        delete (payload as any).userEmail;
        delete (payload as any).password;

        return this.config.apiService.create(payload);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
