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
    selector: 'app-add-pais',
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
    templateUrl: './add-pais.component.html'
})
export class AddPaisComponent extends CrudBaseAddEditComponent<Country> implements OnInit {
    protected override entityNameKey = 'entity.country';

    protected override form = this.fb.nonNullable.group({
        iso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        iso3: ['', [Validators.minLength(3), Validators.maxLength(3)]],
        name: ['', [Validators.required]],
        niceName: ['', [Validators.required]],
        numCode: [0],
        phoneCode: [0, [Validators.required]],
    });

    public readonly config = PAIS_CRUD_CONFIG();

    ngOnInit(): void { }

    protected override getSuccessRoute(): any[] {
        return ['/platform/geography/pais/paises'];
    }

    protected override saveEntity(formData: Country): Observable<Country> {
        return this.config.apiService.create(formData);
    }

    protected override loadEntityData(id: any): void { }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
