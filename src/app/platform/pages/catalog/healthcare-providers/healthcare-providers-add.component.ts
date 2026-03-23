import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { HEALTHCARE_PROVIDERS_CRUD_CONFIG } from './healthcare-providers-crud.config';
import { HealthcareProvider } from 'app/api/models/healthcare-provider';

@Component({
    selector: 'app-healthcare-providers-add',
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
export class HealthcareProvidersAddComponent extends CrudBaseAddEditComponent<HealthcareProvider> implements OnInit {
    protected override entityNameKey = 'catalog.healthcare.providers.singular';
    public readonly config = HEALTHCARE_PROVIDERS_CRUD_CONFIG();

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void { }

    protected override getSuccessRoute(): any[] {
        return ['/platform/catalog/healthcare-providers/list'];
    }

    protected override saveEntity(formData: HealthcareProvider): Observable<HealthcareProvider> {
        return this.config.apiService.create(formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
