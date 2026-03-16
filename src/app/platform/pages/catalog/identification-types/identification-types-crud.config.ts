import { inject } from '@angular/core';
import { IdentificationType } from 'app/api/models/identification-type';
import { IdentificationTypeService } from 'app/api/services/identification-type.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const IDENTIFICATION_TYPES_CRUD_CONFIG = (): CrudConfig<IdentificationType> => {
    const service = inject(IdentificationTypeService);

    return {
        entityName: 'menu.catalog.identification_type.singular',
        entityNamePlural: 'menu.catalog.identification_type.plural',

        getId: (entity: IdentificationType) => entity.id!,

        apiService: new OpenApiCrudAdapter<IdentificationType>(service, {
            getAll: 'getAllIdentificationTypes',
            getById: 'getIdentificationTypeById',
            create: 'createIdentificationType',
            update: 'updateIdentificationType',
            delete: 'deleteIdentificationType'
        }),

        columns: [
            { field: 'id', header: 'menu.catalog.identification_type.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'menu.catalog.identification_type.fields.code', sortable: true, width: '120px' },
            { field: 'name', header: 'menu.catalog.identification_type.fields.name', sortable: true, width: '250px' },
            {
                field: 'active',
                header: 'menu.catalog.identification_type.fields.active',
                sortable: true,
                width: '120px',
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
                    label: 'menu.catalog.identification_type.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'menu.catalog.identification_type.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'badge'
                },
                {
                    name: 'active',
                    label: 'menu.catalog.identification_type.fields.active',
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
