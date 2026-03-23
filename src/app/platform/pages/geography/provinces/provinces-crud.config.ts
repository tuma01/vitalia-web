import { inject } from '@angular/core';
import { Provincia } from 'app/api/models/provincia';
import { ProvinciaService } from 'app/api/services/provincia.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const PROVINCES_CRUD_CONFIG = (): CrudConfig<Provincia> => {
    const service = inject(ProvinciaService);

    return {
        entityName: 'catalog.geography.provinces.singular',
        entityNamePlural: 'catalog.geography.provinces.plural',

        getId: (entity: Provincia) => entity.id!,

        apiService: new OpenApiCrudAdapter<Provincia>(service, {
            getAll: 'getAllProvincias',
            getById: 'getProvinciaById',
            create: 'createProvincia',
            update: 'updateProvincia',
            delete: 'deleteProvincia'
        }),

        columns: [
            { field: 'id', header: 'common.id', sortable: true, width: '80px' },
            { field: 'nombre', header: 'catalog.geography.provinces.fields.name', sortable: true },
            { field: 'departamentoId', header: 'catalog.geography.provinces.fields.department', sortable: false, width: '250px' }
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                { name: 'nombre', label: 'catalog.geography.provinces.fields.name', type: 'text', required: true, colSpan: 1 },
                { name: 'poblacion', label: 'catalog.geography.provinces.fields.population', type: 'number', colSpan: 1 },
                { name: 'superficie', label: 'catalog.geography.provinces.fields.surface', type: 'number', colSpan: 1 },
                {
                    name: 'departamentoId',
                    label: 'catalog.geography.provinces.fields.department',
                    type: 'select',
                    required: true,
                    colSpan: 1,
                    options: [] // To be populated dynamically
                },
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
