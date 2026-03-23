import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { GENDERS_CRUD_CONFIG } from './genders-crud.config';
import { Gender } from 'app/api/models/gender';

@Component({
    selector: 'app-genders-add',
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
export class GendersAddComponent extends CrudBaseAddEditComponent<Gender> implements OnInit {
    protected override entityNameKey = 'catalog.demographics.genders.singular';
    public readonly config = GENDERS_CRUD_CONFIG();

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void { }

    protected override getSuccessRoute(): any[] {
        return ['/platform/catalog/demographics/genders/list'];
    }

    protected override saveEntity(formData: Gender): Observable<Gender> {
        return this.config.apiService.create(formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
