import { inject } from '@angular/core';
import { BloodType } from 'app/api/models/blood-type';
import { BloodTypeService } from 'app/api/services/blood-type.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const BLOOD_TYPES_CRUD_CONFIG = (): CrudConfig<BloodType> => {
    const service = inject(BloodTypeService);

    return {
        entityName: 'catalog.blood.types.singular',
        entityNamePlural: 'catalog.blood.types.plural',

        getId: (entity: BloodType) => entity.id!,

        apiService: new OpenApiCrudAdapter<BloodType>(service, {
            getAll: 'getAllBloodTypes',
            getById: 'getBloodTypeById',
            create: 'createBloodType',
            update: 'updateBloodType',
            delete: 'deleteBloodType'
        }),

        columns: [
            { field: 'id', header: 'catalog.blood.types.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'catalog.blood.types.fields.code', sortable: true, width: '120px' },
            { field: 'name', header: 'catalog.blood.types.fields.name', sortable: true, width: '300px' },
            {
                field: 'active',
                header: 'catalog.blood.types.fields.active',
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
                    label: 'catalog.blood.types.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 10,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'catalog.blood.types.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 50,
                    icon: 'badge'
                },
                {
                    name: 'active',
                    label: 'catalog.blood.types.fields.active',
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
