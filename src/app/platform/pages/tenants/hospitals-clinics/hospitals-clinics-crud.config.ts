import { inject } from '@angular/core';
import { Tenant } from 'app/api/models/tenant';
import { TenantService } from 'app/api/services/tenant.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const HOSPITALS_CLINICS_CRUD_CONFIG = (): CrudConfig<Tenant> => {
    const service = inject(TenantService);

    return {
        entityName: 'tenant_governance.organizations.singular',
        entityNamePlural: 'tenant_governance.organizations.plural',

        getId: (entity: Tenant) => entity.id!,

        apiService: new OpenApiCrudAdapter<Tenant>(service, {
            getAll: 'getAllTenants',
            getById: 'getTenantById',
            create: 'createTenant',
            update: 'updateTenant',
            delete: 'deleteTenant'
        }),

        columns: [
            {
                field: 'id',
                header: 'tenant_governance.organizations.fields.id',
                sortable: true,
                width: '70px'
            },
            {
                field: 'code',
                header: 'tenant_governance.organizations.fields.code',
                sortable: true,
                width: '120px'
            },
            {
                field: 'name',
                header: 'tenant_governance.organizations.fields.name',
                sortable: true
            },
            {
                field: 'type',
                header: 'tenant_governance.organizations.fields.type',
                sortable: true,
                width: '130px',
                type: 'tag',
                tag: {
                    'HOSPITAL': { text: 'tenant_governance.organizations.types.hospital', color: '#1565c0' },
                    'CLINIC': { text: 'tenant_governance.organizations.types.clinic', color: '#2e7d32' },
                    'LABORATORY': { text: 'tenant_governance.organizations.types.laboratory', color: '#6a1b9a' },
                    'PHARMACY': { text: 'tenant_governance.organizations.types.pharmacy', color: '#e65100' },
                    'GLOBAL': { text: 'tenant_governance.organizations.types.global', color: '#37474f' }
                }
            },
            {
                field: 'isActive',
                header: 'tenant_governance.organizations.fields.isActive',
                sortable: true,
                width: '110px',
                type: 'tag',
                tag: {
                    'true': { text: 'common.active', color: '#4caf50' },
                    'false': { text: 'common.inactive', color: '#f44336' }
                }
            }
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                {
                    name: 'code',
                    label: 'tenant_governance.organizations.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 100
                },
                {
                    name: 'name',
                    label: 'tenant_governance.organizations.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 100
                },
                {
                    name: 'type',
                    label: 'tenant_governance.organizations.fields.type',
                    type: 'select',
                    icon: 'local_hospital',
                    required: true,
                    colSpan: 1,
                    options: [
                        { label: 'tenant_governance.organizations.types.hospital', value: 'HOSPITAL' },
                        { label: 'tenant_governance.organizations.types.clinic', value: 'CLINIC' },
                        { label: 'tenant_governance.organizations.types.laboratory', value: 'LABORATORY' },
                        { label: 'tenant_governance.organizations.types.pharmacy', value: 'PHARMACY' },
                        { label: 'tenant_governance.organizations.types.global', value: 'GLOBAL' }
                    ]
                },
                {
                    name: 'isActive',
                    label: 'tenant_governance.organizations.fields.isActive',
                    type: 'radio',
                    colSpan: 1,
                    options: [
                        { label: 'common.active', value: true },
                        { label: 'common.inactive', value: false }
                    ]
                },
                {
                    name: 'description',
                    label: 'tenant_governance.organizations.fields.description',
                    type: 'text',
                    required: false,
                    colSpan: 2,
                    maxLength: 500
                }
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
