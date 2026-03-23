import { inject } from '@angular/core';
import { Tenant } from 'app/api/models/tenant';
import { TenantService } from 'app/api/services/tenant.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';
import { of } from 'rxjs';

export const ORGANIZATIONS_CRUD_CONFIG = (): CrudConfig<Tenant> => {
    const service = inject(TenantService);

    return {
        entityName: 'tenant_governance.organizations.singular',
        entityNamePlural: 'tenant_governance.organizations.plural',

        getId: (entity: Tenant) => entity.id!,

        apiService: new OpenApiCrudAdapter<Tenant>(service, {
            getAll: 'getPaginatedTenants',
            getById: 'getTenantById',
            create: 'createTenant',
            update: 'updateTenant',
            delete: 'deleteTenant'
        }),

        columns: [
            { field: 'id', header: 'tenant_governance.organizations.fields.id', sortable: true, width: '100px' },
            { field: 'code', header: 'tenant_governance.organizations.fields.code', sortable: true, width: '150px' },
            { field: 'name', header: 'tenant_governance.organizations.fields.name', sortable: true },
            { field: 'type', header: 'tenant_governance.organizations.fields.type', sortable: true, width: '120px' },
            {
                field: 'isActive',
                header: 'tenant_governance.organizations.fields.isActive',
                width: '130px',
                type: 'tag',
                tag: {
                    'true': { text: 'common.active', color: '#2e7d32' },
                    'false': { text: 'common.inactive', color: '#c62828' }
                }
            },
            {
                field: 'themeName',
                header: 'tenant_governance.organizations.fields.themeId',
                width: '160px'
            },
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                { name: 'code', label: 'tenant_governance.organizations.fields.code', type: 'text', required: true, colSpan: 1, icon: 'badge' },
                { name: 'name', label: 'tenant_governance.organizations.fields.name', type: 'text', required: true, colSpan: 1, icon: 'business' },
                {
                    name: 'type',
                    label: 'tenant_governance.organizations.fields.type',
                    type: 'select',
                    required: true,
                    colSpan: 1,
                    options: [
                        { label: 'tenant_governance.organizations.types.hospital', value: 'HOSPITAL' },
                        { label: 'tenant_governance.organizations.types.clinic', value: 'Clinic' },
                        { label: 'tenant_governance.organizations.types.pharmacy', value: 'PHARMACY' },
                        { label: 'tenant_governance.organizations.types.laboratory', value: 'LABORATORY' },
                    ],
                    icon: 'category'
                },
                {
                    name: 'themeId',
                    label: 'tenant_governance.organizations.fields.themeId',
                    type: 'select',
                    required: true,
                    colSpan: 1,
                    // We will populate this from ThemeService in the component or via a dynamic option loader
                    options: [],
                    icon: 'palette'
                },
                { name: 'isActive', label: 'tenant_governance.organizations.fields.isActive', type: 'checkbox', colSpan: 1 },
                {
                    name: 'address',
                    label: 'common.address',
                    type: 'address',
                    colSpan: 2
                },
                { name: 'description', label: 'tenant_governance.organizations.fields.description', type: 'textarea', colSpan: 2 },
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
            rowSelectable: true,
            hideRowSelectionCheckbox: false
        }
    };
};
