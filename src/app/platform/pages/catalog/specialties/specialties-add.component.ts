import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { SPECIALTIES_CRUD_CONFIG } from './specialties-crud.config';
import { MedicalSpecialty } from 'app/api/models/medical-specialty';

@Component({
    selector: 'app-specialties-add',
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
export class SpecialtiesAddComponent extends CrudBaseAddEditComponent<MedicalSpecialty> implements OnInit {
    protected override entityNameKey = 'catalog.specialties.singular';
    public readonly config = SPECIALTIES_CRUD_CONFIG();

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void { }

    protected override getSuccessRoute(): any[] {
        return ['/platform/catalog/specialties/list'];
    }

    protected override saveEntity(formData: MedicalSpecialty): Observable<MedicalSpecialty> {
        return this.config.apiService.create(formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
