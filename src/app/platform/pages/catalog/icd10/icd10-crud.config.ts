import { inject } from '@angular/core';
import { Icd10 } from 'app/api/models/icd-10';
import { Icd10DiagnosisService } from 'app/api/services/icd-10-diagnosis.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const ICD10_CRUD_CONFIG = (): CrudConfig<Icd10> => {
    const service = inject(Icd10DiagnosisService);

    return {
        entityName: 'catalog.icd10.singular',
        entityNamePlural: 'catalog.icd10.plural',

        getId: (entity: Icd10) => entity.id!,

        apiService: new OpenApiCrudAdapter<Icd10>(service, {
            getAll: 'getAllIcd10',
            getById: 'getIcd10ById',
            create: 'createIcd10',
            update: 'updateIcd10',
            delete: 'deleteIcd10'
        }),

        columns: [
            { field: 'id', header: 'catalog.icd10.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'catalog.icd10.fields.code', sortable: true, width: '120px' },
            { field: 'description', header: 'catalog.icd10.fields.description', sortable: true, width: '400px' },
            {
                field: 'active',
                header: 'catalog.icd10.fields.active',
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
                    label: 'catalog.icd10.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'active',
                    label: 'catalog.icd10.fields.active',
                    type: 'radio',
                    colSpan: 1,
                    options: [
                        { label: 'common.active', value: true },
                        { label: 'common.inactive', value: false }
                    ]
                },
                {
                    name: 'description',
                    label: 'catalog.icd10.fields.description',
                    type: 'textarea',
                    required: true,
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
