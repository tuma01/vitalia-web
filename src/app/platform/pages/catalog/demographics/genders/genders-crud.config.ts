import { inject } from '@angular/core';
import { Gender } from 'app/api/models/gender';
import { GenderService } from 'app/api/services/gender.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const GENDERS_CRUD_CONFIG = (): CrudConfig<Gender> => {
    const service = inject(GenderService);

    return {
        entityName: 'menu.catalog.demographics.gender.singular',
        entityNamePlural: 'menu.catalog.demographics.gender.plural',

        getId: (entity: Gender) => entity.id!,

        apiService: new OpenApiCrudAdapter<Gender>(service, {
            getAll: 'getAllGenders',
            getById: 'getGenderById',
            create: 'createGender',
            update: 'updateGender',
            delete: 'deleteGender'
        }),

        columns: [
            { field: 'id', header: 'menu.catalog.demographics.gender.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'menu.catalog.demographics.gender.fields.code', sortable: true, width: '150px' },
            { field: 'name', header: 'menu.catalog.demographics.gender.fields.name', sortable: true, width: '300px' },
            {
                field: 'active',
                header: 'menu.catalog.demographics.gender.fields.active',
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
                    label: 'menu.catalog.demographics.gender.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'menu.catalog.demographics.gender.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'badge'
                },
                {
                    name: 'active',
                    label: 'menu.catalog.demographics.gender.fields.active',
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
