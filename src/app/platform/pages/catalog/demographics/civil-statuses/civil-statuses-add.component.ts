import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { CIVIL_STATUSES_CRUD_CONFIG } from './civil-statuses-crud.config';
import { CivilStatus } from 'app/api/models/civil-status';

@Component({
    selector: 'app-civil-statuses-add',
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
export class CivilStatusesAddComponent extends CrudBaseAddEditComponent<CivilStatus> implements OnInit {
    protected override entityNameKey = 'catalog.demographics.civil.statuses.singular';
    public readonly config = CIVIL_STATUSES_CRUD_CONFIG();

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void { }

    protected override getSuccessRoute(): any[] {
        return ['/platform/catalog/demographics/civil-statuses/list'];
    }

    protected override saveEntity(formData: CivilStatus): Observable<CivilStatus> {
        return this.config.apiService.create(formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
