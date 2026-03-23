import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { TENANT_CONFIGS_CRUD_CONFIG } from './tenant-configs-crud.config';
import { TenantConfig } from 'app/api/models/tenant-config';
import { TenantService } from 'app/api/services/tenant.service';
import { getTimezones, getAppLocales } from '@shared/utils/i18n-utils';

@Component({
    selector: 'app-tenant-configs-edit',
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
export class TenantConfigsEditComponent extends CrudBaseAddEditComponent<TenantConfig> implements OnInit {
    protected override entityNameKey = 'tenant_config.singular';
    public readonly config = TENANT_CONFIGS_CRUD_CONFIG();
    private tenantService = inject(TenantService);
    private cdr = inject(ChangeDetectorRef);

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void {
        this.loadTenants();
        this.loadTimezones();
        this.loadLocales();
        const id = this.activatedRoute.snapshot.queryParamMap.get('id');
        if (id) {
            this.entityId = Number(id);
            this.loadEntityData(this.entityId);
        } else {
            this.router.navigate(this.getSuccessRoute());
        }
    }

    private loadTimezones(): void {
        const timezoneField = this.config.form?.fields.find(f => f.name === 'timezone');
        if (timezoneField) {
            timezoneField.options = getTimezones();
        }
    }

    private loadLocales(): void {
        const localeField = this.config.form?.fields.find(f => f.name === 'locale');
        if (localeField) {
            localeField.options = getAppLocales();
        }
    }

    protected override getSuccessRoute(): any[] {
        return ['/platform/tenants/tenant-configs/list'];
    }

    protected override saveEntity(formData: TenantConfig): Observable<TenantConfig> {
        return this.config.apiService.update(this.entityId!, formData);
    }

    protected override loadEntityData(id: number): void {
        this.config.apiService.getById(id).subscribe({
            next: (data: TenantConfig) => {
                this.form.patchValue(data as any);
            },
            error: (err: any) => {
                this.handleError(err, 'crud.load_error');
                this.router.navigate(this.getSuccessRoute());
            }
        });
    }

    private loadTenants(): void {
        this.tenantService.getAllTenants().subscribe({
            next: (tenants) => {
                const tenantField = this.config.form?.fields.find(f => f.name === 'tenantId');
                if (tenantField) {
                    tenantField.options = tenants
                        .filter(t => t.type !== 'GLOBAL')
                        .map(t => ({
                            label: `${t.name} (ID: ${t.id})`,
                            value: t.id
                        }));
                    this.cdr.detectChanges();
                }
            }
        });
    }

    onCancel(): void {
        this.router.navigate(this.getSuccessRoute());
    }
}
