import { inject } from '@angular/core';
import { MedicalProcedure } from 'app/api/models/medical-procedure';
import { MedicalProcedureService } from 'app/api/services/medical-procedure.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const PROCEDURES_CRUD_CONFIG = (): CrudConfig<MedicalProcedure> => {
    const service = inject(MedicalProcedureService);

    return {
        entityName: 'menu.catalog.procedures.singular',
        entityNamePlural: 'menu.catalog.procedures.plural',

        getId: (entity: MedicalProcedure) => entity.id!,

        apiService: new OpenApiCrudAdapter<MedicalProcedure>(service, {
            getAll: 'getAllProcedures',
            getById: 'getProcedureById',
            create: 'createProcedure',
            update: 'updateProcedure',
            delete: 'deleteProcedure'
        }),

        columns: [
            { field: 'id', header: 'menu.catalog.procedures.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'menu.catalog.procedures.fields.code', sortable: true, width: '120px' },
            { field: 'name', header: 'menu.catalog.procedures.fields.name', sortable: true, width: '350px' },
            { field: 'type', header: 'menu.catalog.procedures.fields.type', sortable: true, width: '150px' },
            {
                field: 'active',
                header: 'menu.catalog.procedures.fields.active',
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
                    label: 'menu.catalog.procedures.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'menu.catalog.procedures.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 200,
                    icon: 'badge'
                },
                {
                    name: 'type',
                    label: 'menu.catalog.procedures.fields.type',
                    type: 'text',
                    required: false,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'category'
                },
                {
                    name: 'active',
                    label: 'menu.catalog.procedures.fields.active',
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
