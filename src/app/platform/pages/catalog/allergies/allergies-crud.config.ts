import { inject } from '@angular/core';
import { Allergy } from 'app/api/models/allergy';
import { AllergyService } from 'app/api/services/allergy.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const ALLERGIES_CRUD_CONFIG = (): CrudConfig<Allergy> => {
    const service = inject(AllergyService);

    return {
        entityName: 'catalog.allergies.singular',
        entityNamePlural: 'catalog.allergies.plural',

        getId: (entity: Allergy) => entity.id!,

        apiService: new OpenApiCrudAdapter<Allergy>(service, {
            getAll: 'getAllAllergies',
            getById: 'getAllergyById',
            create: 'createAllergy',
            update: 'updateAllergy',
            delete: 'deleteAllergy'
        }),

        columns: [
            { field: 'id', header: 'catalog.allergies.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'catalog.allergies.fields.code', sortable: true, width: '120px' },
            { field: 'name', header: 'catalog.allergies.fields.name', sortable: true, width: '300px' },
            { field: 'type', header: 'catalog.allergies.fields.type', sortable: true, width: '150px' },
            {
                field: 'active',
                header: 'catalog.allergies.fields.active',
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
                    label: 'catalog.allergies.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'catalog.allergies.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'badge'
                },
                {
                    name: 'type',
                    label: 'catalog.allergies.fields.type',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 50,
                    icon: 'category'
                },
                {
                    name: 'active',
                    label: 'catalog.allergies.fields.active',
                    type: 'radio',
                    colSpan: 1,
                    options: [
                        { label: 'common.active', value: true },
                        { label: 'common.inactive', value: false }
                    ]
                },
                {
                    name: 'description',
                    label: 'catalog.allergies.fields.description',
                    type: 'textarea',
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
