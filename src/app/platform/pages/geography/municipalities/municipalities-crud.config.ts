import { inject } from '@angular/core';
import { Municipio } from 'app/api/models/municipio';
import { MunicipioService } from 'app/api/services/municipio.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const MUNICIPALITIES_CRUD_CONFIG = (): CrudConfig<Municipio> => {
    const service = inject(MunicipioService);

    return {
        entityName: 'catalog.geography.municipalities.singular',
        entityNamePlural: 'catalog.geography.municipalities.plural',

        getId: (entity: Municipio) => entity.id!,

        apiService: new OpenApiCrudAdapter<Municipio>(service, {
            getAll: 'getAllMunicipios',
            getById: 'getMunicipioById',
            create: 'createMunicipio',
            update: 'updateMunicipio',
            delete: 'deleteMunicipio'
        }),

        columns: [
            { field: 'id', header: 'common.id', sortable: true, width: '80px' },
            { field: 'nombre', header: 'catalog.geography.municipalities.fields.name', sortable: true },
            { field: 'provinciaId', header: 'catalog.geography.municipalities.fields.province', sortable: false, width: '250px' }
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                { name: 'codigoMunicipio', label: 'catalog.geography.municipalities.fields.code_municipality', type: 'number', colSpan: 1 },
                { name: 'nombre', label: 'catalog.geography.municipalities.fields.name', type: 'text', required: true, colSpan: 1 },
                { name: 'poblacion', label: 'catalog.geography.municipalities.fields.population', type: 'number', colSpan: 1 },
                { name: 'superficie', label: 'catalog.geography.municipalities.fields.surface', type: 'number', colSpan: 1 },
                { name: 'direccion', label: 'catalog.geography.municipalities.fields.address', type: 'text', colSpan: 1 },
                {
                    name: 'provinciaId',
                    label: 'catalog.geography.municipalities.fields.province',
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
