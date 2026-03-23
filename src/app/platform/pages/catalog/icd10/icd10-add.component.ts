import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { ICD10_CRUD_CONFIG } from './icd10-crud.config';
import { Icd10 } from 'app/api/models/icd-10';

@Component({
    selector: 'app-icd10-add',
    standalone: true,
    imports: [CrudTemplateComponent, TranslateModule],
    template: `
        <app-crud-template
            mode="add"
            [config]="config"
            [formGroup]="form"
            (save)="onSubmit()"
            (cancel)="onCancel()">
        </app-crud-template>
    `
})
export class Icd10AddComponent extends CrudBaseAddEditComponent<Icd10> implements OnInit {
    protected override entityNameKey = 'catalog.icd10.singular';
    public readonly config = ICD10_CRUD_CONFIG();

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void { }

    protected override getSuccessRoute(): any[] {
        return ['/platform/catalog/icd10/list'];
    }

    protected override saveEntity(formData: Icd10): Observable<Icd10> {
        return this.config.apiService.create(formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
