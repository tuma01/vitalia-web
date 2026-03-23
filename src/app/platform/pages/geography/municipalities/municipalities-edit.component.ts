import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { MUNICIPALITIES_CRUD_CONFIG } from './municipalities-crud.config';
import { Municipio } from 'app/api/models/municipio';
import { ProvinciaService } from 'app/api/services/provincia.service';

@Component({
    selector: 'app-edit-municipalities',
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
export class MunicipalitiesEditComponent extends CrudBaseAddEditComponent<Municipio> implements OnInit {
    protected override entityNameKey = 'catalog.geography.municipalities.singular';
    public readonly config = MUNICIPALITIES_CRUD_CONFIG();
    private provinciaService = inject(ProvinciaService);
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
            provincias: this.provinciaService.getAllProvincias(),
            municipio: this.config.apiService.getById(id)
        }).subscribe({
            next: ({ provincias, municipio }) => {
                const provField = this.config.form?.fields.find(f => f.name === 'provinciaId');
                if (provField) {
                    provField.options = provincias.map(p => ({
                        label: p.nombre || p.id?.toString() || '',
                        value: p.id
                    }));
                }
                this.form.patchValue(municipio as any);
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.handleError(err, 'crud.load_error');
                this.router.navigate(this.getSuccessRoute());
            }
        });
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/geography/municipalities/list'];
    }

    protected override saveEntity(formData: Municipio): Observable<Municipio> {
        return this.config.apiService.update(this.entityId!, formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
