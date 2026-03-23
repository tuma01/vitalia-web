import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { AddressSelectorComponent } from '@shared/components/address-selector/address-selector.component';
import { ORGANIZATIONS_CRUD_CONFIG } from '../organizations-crud.config';
import { Tenant } from 'app/api/models/tenant';
import { ThemeService } from 'app/api/services/theme.service';

@Component({
    selector: 'app-organizations-add',
    standalone: true,
    imports: [CrudTemplateComponent, ReactiveFormsModule],
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
export class OrganizationsAddComponent extends CrudBaseAddEditComponent<Tenant> implements OnInit {
    protected override entityNameKey = 'tenant_governance.organizations.singular';
    public readonly config = ORGANIZATIONS_CRUD_CONFIG();
    private themeService = inject(ThemeService);
    private readonly _fb = inject(FormBuilder);

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void {
        this.loadThemes();
    }

    private loadThemes(): void {
        this.themeService.getAllThemes().subscribe(themes => {
            const themeField = this.config.form?.fields.find(f => f.name === 'themeId');
            if (themeField) {
                themeField.options = themes.map(t => ({ label: t.name!, value: t.id! }));
            }
        });
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/tenants/organizations/list'];
    }

    protected override saveEntity(formData: any): Observable<Tenant> {
        // formData now includes the 'address' object automatically from the FormGroup
        return this.config.apiService.create(formData);
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
