import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { DEPARTMENTS_CRUD_CONFIG } from './departments-crud.config';
import { Departamento } from 'app/api/models/departamento';
import { CountryService } from 'app/api/services/country.service';

@Component({
    selector: 'app-departments-edit',
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
export class DepartmentsEditComponent extends CrudBaseAddEditComponent<Departamento> implements OnInit {
    protected override entityNameKey = 'catalog.geography.departments.singular';
    public readonly config = DEPARTMENTS_CRUD_CONFIG();
    private countryService = inject(CountryService);
    private cdr = inject(ChangeDetectorRef);

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.queryParamMap.get('id');
        if (id) {
            this.entityId = Number(id);
            this.loadInitialData(this.entityId);
        } else {
            this.router.navigate(this.getSuccessRoute());
        }
    }

    private loadInitialData(id: number): void {
        forkJoin({
            countries: this.countryService.getAllCountries(),
            departamento: this.config.apiService.getById(id)
        }).subscribe({
            next: ({ countries, departamento }) => {
                const countryField = this.config.form?.fields.find(f => f.name === 'countryId');
                if (countryField) {
                    countryField.options = countries.map(c => ({
                        label: (c.name || c.niceName || c.id?.toString() || ''),
                        value: c.id
                    }));
                }
                this.form.patchValue(departamento as any);
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.handleError(err, 'crud.load_error');
                this.router.navigate(this.getSuccessRoute());
            }
        });
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/geography/departments/list'];
    }

    protected override saveEntity(formData: Departamento): Observable<Departamento> {
        return this.config.apiService.update(this.entityId!, formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
