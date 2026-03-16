import { inject } from '@angular/core';
import { BloodType } from 'app/api/models/blood-type';
import { BloodTypeService } from 'app/api/services/blood-type.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const BLOOD_TYPES_CRUD_CONFIG = (): CrudConfig<BloodType> => {
    const service = inject(BloodTypeService);

    return {
        entityName: 'menu.catalog.blood_type.singular',
        entityNamePlural: 'menu.catalog.blood_type.plural',

        getId: (entity: BloodType) => entity.id!,

        apiService: new OpenApiCrudAdapter<BloodType>(service, {
            getAll: 'getAllBloodTypes',
            getById: 'getBloodTypeById',
            create: 'createBloodType',
            update: 'updateBloodType',
            delete: 'deleteBloodType'
        }),

        columns: [
            { field: 'id', header: 'menu.catalog.blood_type.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'menu.catalog.blood_type.fields.code', sortable: true, width: '120px' },
            { field: 'name', header: 'menu.catalog.blood_type.fields.name', sortable: true, width: '300px' },
            {
                field: 'active',
                header: 'menu.catalog.blood_type.fields.active',
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
                    label: 'menu.catalog.blood_type.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 10,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'menu.catalog.blood_type.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 50,
                    icon: 'badge'
                },
                {
                    name: 'active',
                    label: 'menu.catalog.blood_type.fields.active',
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
