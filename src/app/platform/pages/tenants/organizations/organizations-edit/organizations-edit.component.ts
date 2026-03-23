import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { AddressSelectorComponent } from '@shared/components/address-selector/address-selector.component';
import { ORGANIZATIONS_CRUD_CONFIG } from '../organizations-crud.config';
import { Tenant } from 'app/api/models/tenant';
import { ThemeService } from 'app/api/services/theme.service';

import { MatTabsModule } from '@angular/material/tabs';
import { TenantAdminsListByTenantComponent } from './tenant-admins-list-by-tenant.component';

@Component({
    selector: 'app-organizations-edit',
    standalone: true,
    imports: [
        CommonModule,
        CrudTemplateComponent,
        TranslateModule,
        ReactiveFormsModule,
        AddressSelectorComponent,
        MatTabsModule,
        TenantAdminsListByTenantComponent
    ],
    template: `
        <mat-tab-group color="primary" animationDuration="0ms">
            <!-- TAB 1: Información General -->
            <mat-tab [label]="'tenant_governance.organizations.tabs.general' | translate">
                <div class="p-4">
                    <app-crud-template
                        mode="edit"
                        [config]="config"
                        [formGroup]="form"
                        (save)="onSubmit()"
                        (cancel)="onCancel()">
                        <!-- Address section rendered outside the CRUD grid, in the manual [form] slot -->
                        <div form>
                            <app-address-selector [addressForm]="addressForm"></app-address-selector>
                        </div>
                    </app-crud-template>
                </div>
            </mat-tab>

            <!-- TAB 2: Administradores -->
            <mat-tab [label]="'tenant_governance.organizations.tabs.admins' | translate">
                <div class="p-4">
                    <app-tenant-admins-list-by-tenant [tenantId]="entityId!"></app-tenant-admins-list-by-tenant>
                </div>
            </mat-tab>
        </mat-tab-group>
    `,
    styles: [`
        :host ::ng-deep .mat-mdc-tab-body-wrapper {
            margin-top: 16px;
        }
    `]
})
export class OrganizationsEditComponent extends CrudBaseAddEditComponent<Tenant> implements OnInit {
    protected override entityNameKey = 'tenant_governance.organizations.singular';
    public readonly config = ORGANIZATIONS_CRUD_CONFIG();
    private themeService = inject(ThemeService);
    private readonly _fb = inject(FormBuilder);

    /** Address sub-FormGroup — managed by AddressSelectorComponent */
    addressForm: FormGroup = AddressSelectorComponent.buildAddressFormGroup(this._fb);

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.queryParamMap.get('id');
        if (id) {
            this.entityId = Number(id);
            this.loadThemes();
            this.loadEntityData(this.entityId);
        } else {
            this.router.navigate(this.getSuccessRoute());
        }
    }

    private loadThemes(): void {
        this.themeService.getAllThemes().subscribe(themes => {
            const themeField = this.config.form?.fields.find(f => f.name === 'themeId');
            if (themeField) {
                const options = themes.map(t => ({ label: t.name!, value: t.id! }));
                const currentValue = this.form.get('themeId')?.value;
                if (currentValue && !options.find(o => o.value === currentValue)) {
                    this.themeService.getThemeById({ id: currentValue }).subscribe(t => {
                        options.push({ label: `${t.name!} (Personalizado)`, value: t.id! });
                        themeField.options = [...options];
                    });
                } else {
                    themeField.options = options;
                }
            }
        });
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/tenants/organizations/list'];
    }

    protected override saveEntity(formData: any): Observable<Tenant> {
        const addressValues = this.addressForm.value;
        const payload: Tenant = {
            ...formData,
            address: {
                direccion: addressValues.direccion,
                ciudad: addressValues.ciudad || undefined,
                numero: addressValues.numero || undefined,
                piso: addressValues.piso || undefined,
                casillaPostal: addressValues.casillaPostal || undefined,
                countryId: addressValues.countryId || undefined,
                departamentoId: addressValues.departamentoId || undefined,
                provinciaId: addressValues.provinciaId || undefined,
                municipioId: addressValues.municipioId || undefined,
            }
        };
        return this.config.apiService.update(this.entityId!, payload);
    }

    protected override loadEntityData(id: number): void {
        this.config.apiService.getById(id).subscribe({
            next: (tenant: Tenant) => {
                // Patch main form fields
                this.form.patchValue(tenant as any);

                // Restore address sub-form from nested address object
                if (tenant.address) {
                    this.addressForm.patchValue({
                        countryId: tenant.address.countryId ?? null,
                        departamentoId: tenant.address.departamentoId ?? null,
                        provinciaId: tenant.address.provinciaId ?? null,
                        municipioId: tenant.address.municipioId ?? null,
                        direccion: tenant.address.direccion ?? '',
                        ciudad: tenant.address.ciudad ?? '',
                        numero: tenant.address.numero ?? '',
                        piso: tenant.address.piso ?? null,
                        casillaPostal: tenant.address.casillaPostal ?? '',
                    });
                }
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
