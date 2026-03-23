import { inject } from '@angular/core';
import { Vaccine } from 'app/api/models/vaccine';
import { VaccineService } from 'app/api/services/vaccine.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const VACCINES_CRUD_CONFIG = (): CrudConfig<Vaccine> => {
    const service = inject(VaccineService);

    return {
        entityName: 'catalog.vaccines.singular',
        entityNamePlural: 'catalog.vaccines.plural',

        getId: (entity: Vaccine) => entity.id!,

        apiService: new OpenApiCrudAdapter<Vaccine>(service, {
            getAll: 'getAllVaccines',
            getById: 'getVaccineById',
            create: 'createVaccine',
            update: 'updateVaccine',
            delete: 'deleteVaccine'
        }),

        columns: [
            { field: 'id', header: 'catalog.vaccines.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'catalog.vaccines.fields.code', sortable: true, width: '150px' },
            { field: 'name', header: 'catalog.vaccines.fields.name', sortable: true, width: '300px' },
            {
                field: 'active',
                header: 'catalog.vaccines.fields.active',
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
                    label: 'catalog.vaccines.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'catalog.vaccines.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 200,
                    icon: 'badge'
                },
                {
                    name: 'active',
                    label: 'catalog.vaccines.fields.active',
                    type: 'radio',
                    colSpan: 2,
                    options: [
                        { label: 'common.active', value: true },
                        { label: 'common.inactive', value: false }
                    ]
                },
                {
                    name: 'description',
                    label: 'catalog.vaccines.fields.description',
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
