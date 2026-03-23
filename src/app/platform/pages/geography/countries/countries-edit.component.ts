import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { COUNTRIES_CRUD_CONFIG } from './countries-crud.config';
import { Country } from 'app/api/models/country';

@Component({
    selector: 'app-countries-edit',
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
export class CountriesEditComponent extends CrudBaseAddEditComponent<Country> implements OnInit {
    protected override entityNameKey = 'catalog.geography.countries.singular';
    public readonly config = COUNTRIES_CRUD_CONFIG();

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
        return ['/platform/geography/countries/list'];
    }

    protected override saveEntity(formData: Country): Observable<Country> {
        return this.config.apiService.update(this.entityId!, formData);
    }

    protected override loadEntityData(id: number): void {
        this.config.apiService.getById(id).subscribe({
            next: (country: Country) => {
                this.form.patchValue(country as any);
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
