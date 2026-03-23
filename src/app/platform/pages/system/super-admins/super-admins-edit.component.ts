import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { SUPER_ADMINS_CRUD_CONFIG } from './super-admins-crud.config';
import { SuperAdmin } from 'app/api/models/super-admin';
import { forkJoin, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { PersonFormComponent, PersonFormConfig } from '@shared/components/person-form/person-form.component';

@Component({
    selector: 'app-super-admins-edit',
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
export class SuperAdminsEditComponent extends CrudBaseAddEditComponent<SuperAdmin> implements OnInit {
    protected override entityNameKey = 'platform_governance.super_admins.singular';
    public readonly config = SUPER_ADMINS_CRUD_CONFIG('edit');

    private readonly _fb = inject(FormBuilder);
    private entity?: SuperAdmin;

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
        this.config.apiService.getById(id).subscribe({
            next: (entity) => {
                this.entity = entity;
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
        // Manejado en initData
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/system/iam/list'];
    }

    protected override saveEntity(formData: any): Observable<SuperAdmin> {
        const personData = this.personForm.value;

        const payload: SuperAdmin = {
            ...formData,
            ...personData,
            id: this.entityId!,
            personType: 'SUPER_ADMIN',
            globalAccess: formData.globalAccess ?? true,
            celular: personData.telefono,
            user: {
                id: this.entity?.user?.id,
                email: formData.userEmail, // Uso de userEmail
                password: formData.password || undefined,
                roles: ['ROLE_SUPER_ADMIN']
            }
        };

        const isChangingPassword = this.form.get('changePassword')?.value;
        if (!isChangingPassword || !payload.user?.password || payload.user?.password === '••••••••') {
            delete payload.user?.password;
        }

        // Delete formatting keys not needed in entity root
        delete (payload as any).userEmail;
        delete (payload as any).password;
        delete (payload as any).changePassword;

        return this.config.apiService.update(this.entityId!, payload);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
