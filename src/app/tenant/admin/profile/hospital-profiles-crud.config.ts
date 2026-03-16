import { inject } from '@angular/core';
import { TenantConfig } from 'app/api/models/tenant-config';
import { TenantConfigService } from 'app/api/services/tenant-config.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const HOSPITAL_PROFILES_CRUD_CONFIG = (): CrudConfig<TenantConfig> => {
    const service = inject(TenantConfigService);

    return {
        entityName: 'menu.tenant_admin.admin.profile.singular',
        entityNamePlural: 'menu.tenant_admin.admin.profile.plural',

        getId: (entity: TenantConfig) => entity.id!,

        apiService: new OpenApiCrudAdapter<TenantConfig>(service, {
            getAll: 'getPaginatedTenantConfigs',
            getById: 'getTenantConfigById',
            create: 'createTenantConfig',
            update: 'updateTenantConfig',
            delete: 'deleteTenantConfig'
        }),

        columns: [],

        form: {
            layout: { columns: 2 },
            fields: [
                { name: 'defaultDomain', label: 'menu.tenant_admin.admin.profile.fields.defaultDomain', type: 'text', required: true, colSpan: 1, icon: 'dns' },
                { name: 'timezone', label: 'menu.tenant_admin.admin.profile.fields.timezone', type: 'select', colSpan: 1, options: [], icon: 'access_time' },
                { name: 'locale', label: 'menu.tenant_admin.admin.profile.fields.locale', type: 'select', colSpan: 1, options: [], icon: 'translate' },
                { name: 'maxUsers', label: 'menu.tenant_admin.admin.profile.fields.maxUsers', type: 'number', colSpan: 1, icon: 'people', disabled: true },
                { name: 'storageQuotaBytes', label: 'menu.tenant_admin.admin.profile.fields.storageQuotaBytes', type: 'number', colSpan: 1, icon: 'storage', disabled: true },
                { name: 'requireEmailVerification', label: 'menu.tenant_admin.admin.profile.fields.requireEmailVerification', type: 'checkbox', colSpan: 1 },
                { name: 'fallbackHeader', label: 'menu.tenant_admin.admin.profile.fields.fallbackHeader', type: 'text', colSpan: 2, icon: 'badge' },
                { name: 'passwordPolicyJson', label: 'menu.tenant_admin.admin.profile.fields.passwordPolicyJson', type: 'textarea', colSpan: 2, icon: 'password' },
                { name: 'extraJson', label: 'menu.tenant_admin.admin.profile.fields.extraJson', type: 'textarea', colSpan: 2, icon: 'settings_ethernet' }
            ]
        },

        enableEdit: true,
        enableAdd: false,
        enableDelete: false
    };
};
