import { inject } from '@angular/core';
import { Gender } from 'app/api/models/gender';
import { GenderService } from 'app/api/services/gender.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const GENDERS_CRUD_CONFIG = (): CrudConfig<Gender> => {
    const service = inject(GenderService);

    return {
        entityName: 'catalog.demographics.genders.singular',
        entityNamePlural: 'catalog.demographics.genders.plural',

        getId: (entity: Gender) => entity.id!,

        apiService: new OpenApiCrudAdapter<Gender>(service, {
            getAll: 'getAllGenders',
            getById: 'getGenderById',
            create: 'createGender',
            update: 'updateGender',
            delete: 'deleteGender'
        }),

        columns: [
            { field: 'id', header: 'catalog.demographics.genders.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'catalog.demographics.genders.fields.code', sortable: true, width: '150px' },
            { field: 'name', header: 'catalog.demographics.genders.fields.name', sortable: true, width: '300px' },
            {
                field: 'active',
                header: 'catalog.demographics.genders.fields.active',
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
                    label: 'catalog.demographics.genders.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'catalog.demographics.genders.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'badge'
                },
                {
                    name: 'active',
                    label: 'catalog.demographics.genders.fields.active',
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
