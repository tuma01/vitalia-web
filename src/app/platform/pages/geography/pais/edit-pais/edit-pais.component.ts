import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { Country } from 'app/api/models/country';
import { PAIS_CRUD_CONFIG } from '../pais-crud.config';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-edit-pais',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        CrudTemplateComponent
    ],
    templateUrl: '../add-pais/add-pais.component.html'
})
export class EditPaisComponent extends CrudBaseAddEditComponent<Country> implements OnInit {
    protected override entityNameKey = 'entity.country';

    protected override form = this.fb.nonNullable.group({
        id: [null as number | null],
        iso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        iso3: ['', [Validators.minLength(3), Validators.maxLength(3)]],
        name: ['', [Validators.required]],
        niceName: ['', [Validators.required]],
        numCode: [0],
        phoneCode: [0, [Validators.required]],
    });

    public readonly config = PAIS_CRUD_CONFIG();

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
        return ['/platform/geography/pais/paises'];
    }

    protected override saveEntity(formData: Country): Observable<Country> {
        return this.config.apiService.update(this.entityId!, formData);
    }

    protected override loadEntityData(id: number): void {
        this.config.apiService.getById(id).subscribe({
            next: (country) => {
                this.form.patchValue(country as any);
            },
            error: (err) => {
                this.handleError(err as any, 'crud.load_error');
                this.router.navigate(this.getSuccessRoute());
            }
        });
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
