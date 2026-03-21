import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { HOSPITAL_PROFILES_CRUD_CONFIG } from './hospital-profiles-crud.config';
import { TenantConfigService } from 'app/api/services/tenant-config.service';
import { TenantConfig } from 'app/api/models/tenant-config';
import { AppContextService } from '@core/services/app-context.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getTimezones, getAppLocales } from '@shared/utils/i18n-utils';

@Component({
    selector: 'app-hospital-profiles-edit',
    standalone: true,
    imports: [CommonModule, CrudTemplateComponent, TranslateModule, MatProgressSpinnerModule],
    template: `
        @if (entityId) {
            <app-crud-template 
                mode="edit" 
                [config]="config" 
                [formGroup]="form"
                (save)="onSubmit()"
                (cancel)="onCancel()">
            </app-crud-template>
        } @else if (loading) {
            <div class="vt-loader-container h-64 flex items-center justify-center">
                <mat-spinner diameter="40"></mat-spinner>
            </div>
        } @else {
            <div class="p-8 text-center vt-error-container">
                <p class="text-red-500 font-medium">No se pudo determinar el ID de configuración del hospital.</p>
            </div>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HospitalProfilesEditComponent extends CrudBaseAddEditComponent<TenantConfig> implements OnInit {
    protected override entityNameKey = 'tenant_admin.admin.profile.singular';
    public readonly config = HOSPITAL_PROFILES_CRUD_CONFIG();
    private appContext = inject(AppContextService);
    private tenantConfigService = inject(TenantConfigService);
    private cdr = inject(ChangeDetectorRef);
    
    loading = true;

    protected override form: FormGroup = CrudBaseAddEditComponent.buildFormFromConfig(
        inject(FormBuilder), this.config
    );

    ngOnInit(): void {
        this.loadTimezones();
        this.loadLocales();
        this.detectCurrentHospital();
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

    private detectCurrentHospital(): void {
        this.loading = true;
        this.tenantConfigService.getMyTenantConfig().subscribe({
            next: (config) => {
                this.entityId = config.id ?? null;
                this.form.patchValue(config as any);
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error('[HospitalProfile] Error loading current config:', err);
                this.loading = false;
                this.cdr.markForCheck();
            }
        });
    }

    protected override loadEntityData(id: any): void {
        this.config.apiService.getById(id).subscribe({
            next: (data) => {
                this.form.patchValue(data as any);
                this.loading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.handleError(err, 'crud.load_error');
                this.loading = false;
                this.cdr.markForCheck();
            }
        });
    }

    protected override getSuccessRoute(): any[] {
        return ['/admin/profile']; // Stay on same page or go to dashboard
    }

    protected override saveEntity(formData: TenantConfig): Observable<TenantConfig> {
        return this.config.apiService.update(this.entityId!, formData);
    }

    onCancel(): void {
        // Just reload or reset
        if (this.entityId) {
            this.loadEntityData(this.entityId);
        }
    }
}
