import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { ADMINISTRATORS_CRUD_CONFIG } from './administrators-crud.config';
import { TenantAdmin } from 'app/api/models/tenant-admin';
import { TenantService } from 'app/api/services/tenant.service';
import { forkJoin, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { PersonFormComponent, PersonFormConfig } from '@shared/components/person-form/person-form.component';

@Component({
    selector: 'app-administrators-edit',
    standalone: true,
    imports: [CrudTemplateComponent, TranslateModule, ReactiveFormsModule, PersonFormComponent],
    template: `
        <app-crud-template
            mode="edit"
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
export class AdministratorsEditComponent extends CrudBaseAddEditComponent<TenantAdmin> implements OnInit {
    protected override entityNameKey = 'tenant_governance.administrators.singular';
    public readonly config = ADMINISTRATORS_CRUD_CONFIG('edit');

    private tenantService = inject(TenantService);
    private readonly _fb = inject(FormBuilder);
    private entity?: TenantAdmin;

    /** Configuración para Edición */
    public personConfig: PersonFormConfig = {
        showIdentification: true,
        isIdentificationRequired: true,
        showMiddleName: true,
        showMaidenName: true,
        showBirthDate: true,
        isBirthDateRequired: false,
        showGender: true,
        isGenderRequired: true,
        showCivilStatus: true,
        showPhone: true,
        isPhoneRequired: true,
        showPersonalEmail: true
    };

    /** Sub-formulario de Persona */
    public personForm: FormGroup = PersonFormComponent.buildPersonFormGroup(this._fb, this.personConfig);

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        this._fb, this.config
    );

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.queryParamMap.get('id');
        if (id) {
            this.entityId = Number(id);
            this.initData(this.entityId);
        } else {
            this.router.navigate(this.getSuccessRoute());
        }
    }

    private initData(id: number): void {
        forkJoin({
            tenants: this.tenantService.getAllTenants(),
            entity: this.config.apiService.getById(id)
        }).subscribe({
            next: ({ tenants, entity }) => {
                this.entity = entity;

                const tenantField = this.config.form?.fields.find((f: any) => f.name === 'tenant');
                const filteredTenants = tenants.filter(t => t.type !== 'GLOBAL');
                const mappedOptions = filteredTenants.map(t => ({ label: t.name || '', value: t }));
                if (tenantField) {
                    tenantField.options = mappedOptions;
                }

                this.form.patchValue(entity as any);
                if (entity.user) {
                    this.form.patchValue({ userEmail: entity.user.email });
                }

                const personData = { ...entity };
                if (entity.fechaNacimiento) {
                    const [year, month, day] = (entity.fechaNacimiento as string).split('-').map(Number);
                    personData.fechaNacimiento = new Date(year, month - 1, day) as any;
                }
                this.personForm.patchValue(personData as any);

                const hadPassword = !!entity.user?.password;
                const passwordMask = hadPassword ? '••••••••' : '';
                this.form.patchValue({ password: passwordMask });

                const matchedTenant = filteredTenants.find(t => t.id === entity.tenant?.id);
                if (matchedTenant) {
                    this.form.patchValue({ tenant: matchedTenant });
                }

                this.form.get('changePassword')?.valueChanges.subscribe(checked => {
                    const pwdCtrl = this.form.get('password');
                    if (checked) {
                        pwdCtrl?.setValue('');
                        pwdCtrl?.enable();
                    } else {
                        pwdCtrl?.disable();
                        pwdCtrl?.setValue(passwordMask);
                    }
                });
            },
            error: (err: any) => {
                this.handleError(err, 'crud.load_error');
                this.router.navigate(this.getSuccessRoute());
            }
        });
    }

    protected override loadEntityData(id: number): void {
        // Handled in initData
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/tenants/administrators/list'];
    }

    protected override saveEntity(formData: any): Observable<TenantAdmin> {
        const personData = this.personForm.value;

        const payload: TenantAdmin = {
            ...formData,
            ...personData,
            id: this.entityId!,
            tenant: { id: formData.tenant.id },
            personType: 'ADMIN',
            celular: personData.telefono,
            user: {
                id: this.entity?.user?.id,
                email: formData.userEmail, // Uso de userEmail
                password: formData.password || undefined,
                roles: ['ROLE_ADMIN']
            }
        };

        const isChangingPassword = this.form.get('changePassword')?.value;
        if (!isChangingPassword || !payload.user?.password || payload.user?.password === '••••••••') {
            delete payload.user?.password;
        }

        // Limpiar claves auxiliares
        delete (payload as any).userEmail;
        delete (payload as any).password;

        return this.config.apiService.update(this.entityId!, payload);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
