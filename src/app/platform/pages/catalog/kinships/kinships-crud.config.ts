import { inject } from '@angular/core';
import { Kinship } from 'app/api/models/kinship';
import { KinshipService } from 'app/api/services/kinship.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const KINSHIPS_CRUD_CONFIG = (): CrudConfig<Kinship> => {
    const service = inject(KinshipService);

    return {
        entityName: 'menu.catalog.kinship.singular',
        entityNamePlural: 'menu.catalog.kinship.plural',

        getId: (entity: Kinship) => entity.id!,

        apiService: new OpenApiCrudAdapter<Kinship>(service, {
            getAll: 'getAllKinships',
            getById: 'getKinshipById',
            create: 'createKinship',
            update: 'updateKinship',
            delete: 'deleteKinship'
        }),

        columns: [
            { field: 'id', header: 'menu.catalog.kinship.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'menu.catalog.kinship.fields.code', sortable: true, width: '120px' },
            { field: 'name', header: 'menu.catalog.kinship.fields.name', sortable: true, width: '250px' },
            {
                field: 'active',
                header: 'menu.catalog.kinship.fields.active',
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
                    label: 'menu.catalog.kinship.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'menu.catalog.kinship.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'badge'
                },
                {
                    name: 'active',
                    label: 'menu.catalog.kinship.fields.active',
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
