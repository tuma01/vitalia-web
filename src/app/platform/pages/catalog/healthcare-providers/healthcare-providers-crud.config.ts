import { inject } from '@angular/core';
import { HealthcareProvider } from 'app/api/models/healthcare-provider';
import { HealthcareProviderService } from 'app/api/services/healthcare-provider.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const HEALTHCARE_PROVIDERS_CRUD_CONFIG = (): CrudConfig<HealthcareProvider> => {
    const service = inject(HealthcareProviderService);

    return {
        entityName: 'menu.catalog.healthcare_provider.singular',
        entityNamePlural: 'menu.catalog.healthcare_provider.plural',

        getId: (entity: HealthcareProvider) => entity.id!,

        apiService: new OpenApiCrudAdapter<HealthcareProvider>(service, {
            getAll: 'getAllProviders',
            getById: 'getProviderById',
            create: 'createProvider',
            update: 'updateProvider',
            delete: 'deleteProvider'
        }),

        columns: [
            { field: 'id', header: 'menu.catalog.healthcare_provider.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'menu.catalog.healthcare_provider.fields.code', sortable: true, width: '120px' },
            { field: 'name', header: 'menu.catalog.healthcare_provider.fields.name', sortable: true, width: '250px' },
            { field: 'taxId', header: 'menu.catalog.healthcare_provider.fields.taxId', sortable: true, width: '150px' },
            { field: 'email', header: 'menu.catalog.healthcare_provider.fields.email', sortable: true, width: '200px' },
            { field: 'phone', header: 'menu.catalog.healthcare_provider.fields.phone', sortable: true, width: '150px' },
            {
                field: 'active',
                header: 'menu.catalog.healthcare_provider.fields.active',
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
                    label: 'menu.catalog.healthcare_provider.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'taxId',
                    label: 'menu.catalog.healthcare_provider.fields.taxId',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 50,
                    icon: 'badge'
                },
                {
                    name: 'name',
                    label: 'menu.catalog.healthcare_provider.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 2,
                    maxLength: 200,
                    icon: 'badge'
                },
                {
                    name: 'email',
                    label: 'menu.catalog.healthcare_provider.fields.email',
                    type: 'text',
                    required: false,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'email'
                },
                {
                    name: 'phone',
                    label: 'menu.catalog.healthcare_provider.fields.phone',
                    type: 'text',
                    required: false,
                    colSpan: 1,
                    maxLength: 50,
                    icon: 'phone'
                },
                {
                    name: 'active',
                    label: 'menu.catalog.healthcare_provider.fields.active',
                    type: 'radio',
                    colSpan: 2,
                    options: [
                        { label: 'common.active', value: true },
                        { label: 'common.inactive', value: false }
                    ]
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
