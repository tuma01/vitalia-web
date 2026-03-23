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
    selector: 'app-healthcare-providers-edit',
    standalone: true,
    imports: [CrudTemplateComponent, TranslateModule],
    template: `
        <app-crud-template
            mode="edit"
            [config]="config"
            [formGroup]="form"
            (save)="onSubmit()"
            (cancel)="onCancel()">
        </app-crud-template>
    `
})
export class HealthcareProvidersEditComponent extends CrudBaseAddEditComponent<HealthcareProvider> implements OnInit {
    protected override entityNameKey = 'catalog.healthcare.providers.singular';
    public readonly config = HEALTHCARE_PROVIDERS_CRUD_CONFIG();

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.queryParamMap.get('id');
        if (id) {
            this.entityId = Number(id);
            this.loadEntityData(this.entityId);
        } else {
            this.router.navigate(this.getSuccessRoute());
        }
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/catalog/healthcare-providers/list'];
    }

    protected override saveEntity(formData: HealthcareProvider): Observable<HealthcareProvider> {
        return this.config.apiService.update(this.entityId!, formData);
    }

    protected override loadEntityData(id: number): void {
        this.config.apiService.getById(id).subscribe({
            next: (data: HealthcareProvider) => {
                this.form.patchValue(data as any);
            },
            error: (err: any) => {
                this.handleError(err, 'crud.load_error');
                this.router.navigate(this.getSuccessRoute());
            }
        });
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
