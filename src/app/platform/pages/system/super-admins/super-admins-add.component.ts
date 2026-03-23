import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { SUPER_ADMINS_CRUD_CONFIG } from './super-admins-crud.config';
import { SuperAdmin } from 'app/api/models/super-admin';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { PersonFormComponent, PersonFormConfig } from '@shared/components/person-form/person-form.component';

@Component({
    selector: 'app-super-admins-add',
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
export class SuperAdminsAddComponent extends CrudBaseAddEditComponent<SuperAdmin> implements OnInit {
    protected override entityNameKey = 'platform_governance.super_admins.singular';
    public readonly config = SUPER_ADMINS_CRUD_CONFIG('add');

    private readonly _fb = inject(FormBuilder);

    /** Configuración para SuperAdmin */
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
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/system/iam/list'];
    }

    protected override saveEntity(formData: any): Observable<SuperAdmin> {
        const personData = this.personForm.value;

        // Limpieza de datos y construcción del payload para SuperAdmin
        const payload: SuperAdmin = {
            ...formData,
            ...personData,
            personType: 'SUPER_ADMIN',
            globalAccess: formData.globalAccess ?? true,
            celular: personData.telefono,
            user: {
                email: formData.userEmail, // Uso de userEmail desde el formulario
                password: formData.password,
                roles: ['ROLE_SUPER_ADMIN']
            }
        };

        delete (payload as any).password;
        delete (payload as any).changePassword;

        return this.config.apiService.create(payload);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
