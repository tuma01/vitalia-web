import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { PROVINCES_CRUD_CONFIG } from './provinces-crud.config';
import { Provincia } from 'app/api/models/provincia';
import { DepartamentoService } from 'app/api/services/departamento.service';

@Component({
    selector: 'app-provinces-add',
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
export class ProvincesAddComponent extends CrudBaseAddEditComponent<Provincia> implements OnInit {
    protected override entityNameKey = 'catalog.geography.provinces.singular';
    public readonly config = PROVINCES_CRUD_CONFIG();
    private departamentoService = inject(DepartamentoService);
    private cdr = inject(ChangeDetectorRef);

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void {
        this.loadDepartamentos();
    }

    private loadDepartamentos(): void {
        this.departamentoService.getAllDepartamentos().subscribe({
            next: (departamentos) => {
                const deptField = this.config.form?.fields.find(f => f.name === 'departamentoId');
                if (deptField) {
                    deptField.options = departamentos.map(d => ({
                        label: d.nombre || d.id?.toString() || '',
                        value: d.id
                    }));
                    this.cdr.detectChanges();
                }
            }
        });
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/geography/provinces/list'];
    }

    protected override saveEntity(formData: Provincia): Observable<Provincia> {
        return this.config.apiService.create(formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
