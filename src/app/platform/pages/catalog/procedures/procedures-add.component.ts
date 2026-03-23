import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { PROCEDURES_CRUD_CONFIG } from './procedures-crud.config';
import { MedicalProcedure } from 'app/api/models/medical-procedure';

@Component({
    selector: 'app-procedures-add',
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
export class ProceduresAddComponent extends CrudBaseAddEditComponent<MedicalProcedure> implements OnInit {
    protected override entityNameKey = 'catalog.procedures.singular';
    public readonly config = PROCEDURES_CRUD_CONFIG();

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void { }

    protected override getSuccessRoute(): any[] {
        return ['/platform/catalog/procedures/list'];
    }

    protected override saveEntity(formData: MedicalProcedure): Observable<MedicalProcedure> {
        return this.config.apiService.create(formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
