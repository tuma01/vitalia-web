import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { IDENTIFICATION_TYPES_CRUD_CONFIG } from './identification-types-crud.config';
import { IdentificationType } from 'app/api/models/identification-type';

@Component({
    selector: 'app-identification-types-edit',
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
export class IdentificationTypesEditComponent extends CrudBaseAddEditComponent<IdentificationType> implements OnInit {
    protected override entityNameKey = 'catalog.identification.types.singular';
    public readonly config = IDENTIFICATION_TYPES_CRUD_CONFIG();

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
        return ['/platform/catalog/identification-types/list'];
    }

    protected override saveEntity(formData: IdentificationType): Observable<IdentificationType> {
        return this.config.apiService.update(this.entityId!, formData);
    }

    protected override loadEntityData(id: number): void {
        this.config.apiService.getById(id).subscribe({
            next: (data: IdentificationType) => {
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
