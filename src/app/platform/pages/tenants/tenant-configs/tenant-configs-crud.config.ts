import { inject } from '@angular/core';
import { TenantConfig } from 'app/api/models/tenant-config';
import { TenantConfigService } from 'app/api/services/tenant-config.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const TENANT_CONFIGS_CRUD_CONFIG = (): CrudConfig<TenantConfig> => {
    const service = inject(TenantConfigService);

    return {
        entityName: 'menu.tenant_governance.tenant_config.singular',
        entityNamePlural: 'menu.tenant_governance.tenant_config.plural',

        getId: (entity: TenantConfig) => entity.id!,

        apiService: new OpenApiCrudAdapter<TenantConfig>(service, {
            getAll: 'getPaginatedTenantConfigs', // Using paginated as 'getAll' if standard 'getAll' is not available or suited
            getById: 'getTenantConfigById',
            create: 'createTenantConfig',
            update: 'updateTenantConfig',
            delete: 'deleteTenantConfig'
        }),

        columns: [
            { field: 'id', header: 'menu.tenant_governance.tenant_config.fields.id', sortable: true, width: '80px' },
            { field: 'tenantId', header: 'menu.tenant_governance.tenant_config.fields.tenantId', sortable: true, width: '120px' },
            { field: 'defaultDomain', header: 'menu.tenant_governance.tenant_config.fields.defaultDomain', sortable: true },
            { field: 'maxUsers', header: 'menu.tenant_governance.tenant_config.fields.maxUsers', sortable: true, width: '100px' },
            {
                field: 'allowLocal',
                header: 'menu.tenant_governance.tenant_config.fields.allowLocal',
                sortable: true,
                width: '120px',
                type: 'tag',
                tag: {
                    'true': { text: 'common.yes', color: '#4caf50' },
                    'false': { text: 'common.no', color: '#f44336' }
                }
            }
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                {
                    name: 'tenantId',
                    label: 'menu.tenant_governance.tenant_config.fields.tenantId',
                    type: 'select',
                    required: true,
                    colSpan: 1,
                    options: [],
                    icon: 'corporate_fare'
                },
                { name: 'defaultDomain', label: 'menu.tenant_governance.tenant_config.fields.defaultDomain', type: 'text', required: true, colSpan: 1, icon: 'dns' },
                { name: 'maxUsers', label: 'menu.tenant_governance.tenant_config.fields.maxUsers', type: 'number', required: true, colSpan: 1, icon: 'people' },
                { name: 'storageQuotaBytes', label: 'menu.tenant_governance.tenant_config.fields.storageQuotaBytes', type: 'number', required: true, colSpan: 1, icon: 'cloud_upload' },
                { name: 'timezone', label: 'menu.tenant_governance.tenant_config.fields.timezone', type: 'select', colSpan: 1, options: [], icon: 'access_time' },
                { name: 'locale', label: 'menu.tenant_governance.tenant_config.fields.locale', type: 'select', colSpan: 1, options: [], icon: 'translate' },
                { name: 'allowLocal', label: 'menu.tenant_governance.tenant_config.fields.allowLocal', type: 'checkbox', colSpan: 1 },
                { name: 'requireEmailVerification', label: 'menu.tenant_governance.tenant_config.fields.requireEmailVerification', type: 'checkbox', colSpan: 1 },
                { name: 'fallbackHeader', label: 'menu.tenant_governance.tenant_config.fields.fallbackHeader', type: 'text', colSpan: 2, icon: 'badge' },
                { name: 'passwordPolicyJson', label: 'menu.tenant_governance.tenant_config.fields.passwordPolicyJson', type: 'textarea', colSpan: 2 },
                { name: 'extraJson', label: 'menu.tenant_governance.tenant_config.fields.extraJson', type: 'textarea', colSpan: 2 }
            ]
        },

        enableAdd: true,
        enableEdit: true,
        enableDelete: true,

        table: {
            pageSize: 10,
            rowStriped: true,
            showToolbar: true,
            columnResizable: true,
            multiSelectable: true,
            rowSelectable: true
        }
    };
};
