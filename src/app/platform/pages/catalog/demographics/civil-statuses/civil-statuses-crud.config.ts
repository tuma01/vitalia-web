import { inject } from '@angular/core';
import { CivilStatus } from 'app/api/models/civil-status';
import { CivilStatusService } from 'app/api/services/civil-status.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const CIVIL_STATUSES_CRUD_CONFIG = (): CrudConfig<CivilStatus> => {
    const service = inject(CivilStatusService);

    return {
        entityName: 'menu.catalog.demographics.civil_status.singular',
        entityNamePlural: 'menu.catalog.demographics.civil_status.plural',

        getId: (entity: CivilStatus) => entity.id!,

        apiService: new OpenApiCrudAdapter<CivilStatus>(service, {
            getAll: 'getAllCivilStatuses',
            getById: 'getCivilStatusById',
            create: 'createCivilStatus',
            update: 'updateCivilStatus',
            delete: 'deleteCivilStatus'
        }),

        columns: [
            { field: 'id', header: 'menu.catalog.demographics.civil_status.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'menu.catalog.demographics.civil_status.fields.code', sortable: true, width: '150px' },
            { field: 'name', header: 'menu.catalog.demographics.civil_status.fields.name', sortable: true, width: '300px' },
            {
                field: 'active',
                header: 'menu.catalog.demographics.civil_status.fields.active',
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
                    label: 'menu.catalog.demographics.civil_status.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'menu.catalog.demographics.civil_status.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'badge'
                },
                {
                    name: 'active',
                    label: 'menu.catalog.demographics.civil_status.fields.active',
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
