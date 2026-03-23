import { inject } from '@angular/core';
import { Medication } from 'app/api/models/medication';
import { MedicationService } from 'app/api/services/medication.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const MEDICATIONS_CRUD_CONFIG = (): CrudConfig<Medication> => {
    const service = inject(MedicationService);

    return {
        entityName: 'catalog.medications.singular',
        entityNamePlural: 'catalog.medications.plural',

        getId: (entity: Medication) => entity.id!,

        apiService: new OpenApiCrudAdapter<Medication>(service, {
            getAll: 'getAllMedications',
            getById: 'getMedicationById',
            create: 'createMedication',
            update: 'updateMedication',
            delete: 'deleteMedication'
        }),

        columns: [
            { field: 'id', header: 'catalog.medications.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'catalog.medications.fields.code', sortable: true, width: '120px' },
            { field: 'genericName', header: 'catalog.medications.fields.genericName', sortable: true, width: '250px' },
            { field: 'commercialName', header: 'catalog.medications.fields.commercialName', sortable: true, width: '250px' },
            {
                field: 'active',
                header: 'catalog.medications.fields.active',
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
                    label: 'catalog.medications.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'genericName',
                    label: 'catalog.medications.fields.genericName',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 200,
                    icon: 'medication'
                },
                {
                    name: 'commercialName',
                    label: 'catalog.medications.fields.commercialName',
                    type: 'text',
                    required: false,
                    colSpan: 1,
                    maxLength: 200,
                    icon: 'local_pharmacy'
                },
                {
                    name: 'concentration',
                    label: 'catalog.medications.fields.concentration',
                    type: 'text',
                    required: false,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'science'
                },
                {
                    name: 'pharmaceuticalForm',
                    label: 'catalog.medications.fields.pharmaceuticalForm',
                    type: 'text',
                    required: false,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'category'
                },
                {
                    name: 'presentation',
                    label: 'catalog.medications.fields.presentation',
                    type: 'text',
                    required: false,
                    colSpan: 1,
                    maxLength: 100,
                    icon: 'inventory_2'
                },
                {
                    name: 'active',
                    label: 'catalog.medications.fields.active',
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
