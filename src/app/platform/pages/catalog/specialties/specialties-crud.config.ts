import { inject } from '@angular/core';
import { MedicalSpecialty } from 'app/api/models/medical-specialty';
import { MedicalSpecialtyService } from 'app/api/services/medical-specialty.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const SPECIALTIES_CRUD_CONFIG = (): CrudConfig<MedicalSpecialty> => {
    const service = inject(MedicalSpecialtyService);

    return {
        entityName: 'catalog.specialties.singular',
        entityNamePlural: 'catalog.specialties.plural',

        getId: (entity: MedicalSpecialty) => entity.id!,

        apiService: new OpenApiCrudAdapter<MedicalSpecialty>(service, {
            getAll: 'getAllSpecialties',
            getById: 'getSpecialtyById',
            create: 'createSpecialty',
            update: 'updateSpecialty',
            delete: 'deleteSpecialty'
        }),

        columns: [
            { field: 'id', header: 'catalog.specialties.fields.id', sortable: true, width: '80px' },
            { field: 'code', header: 'catalog.specialties.fields.code', sortable: true, width: '120px' },
            { field: 'name', header: 'catalog.specialties.fields.name', sortable: true, width: '250px' },
            { field: 'targetProfession', header: 'catalog.specialties.fields.targetProfession', sortable: true, width: '150px' },
            {
                field: 'active',
                header: 'catalog.specialties.fields.active',
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
                    label: 'catalog.specialties.fields.code',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 20,
                    icon: 'qr_code'
                },
                {
                    name: 'name',
                    label: 'catalog.specialties.fields.name',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    maxLength: 200,
                    icon: 'badge'
                },
                {
                    name: 'targetProfession',
                    label: 'catalog.specialties.fields.targetProfession',
                    type: 'select',
                    required: true,
                    colSpan: 1,
                    icon: 'group',
                    options: [
                        { label: 'catalog.specialties.fields.targetProfession_options.doctor', value: 'DOCTOR' },
                        { label: 'catalog.specialties.fields.targetProfession_options.nurse', value: 'NURSE' },
                        { label: 'catalog.specialties.fields.targetProfession_options.both', value: 'BOTH' }
                    ]
                },
                {
                    name: 'active',
                    label: 'catalog.specialties.fields.active',
                    type: 'radio',
                    colSpan: 1,
                    options: [
                        { label: 'common.active', value: true },
                        { label: 'common.inactive', value: false }
                    ]
                },
                {
                    name: 'description',
                    label: 'catalog.specialties.fields.description',
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
