import { inject } from '@angular/core';
import { Departamento } from 'app/api/models/departamento';
import { DepartamentoService } from 'app/api/services/departamento.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const DEPARTMENTS_CRUD_CONFIG = (): CrudConfig<Departamento> => {
    const service = inject(DepartamentoService);

    return {
        entityName: 'catalog.geography.departments.singular',
        entityNamePlural: 'catalog.geography.departments.plural',

        getId: (entity: Departamento) => entity.id!,

        apiService: new OpenApiCrudAdapter<Departamento>(service, {
            getAll: 'getAllDepartamentos',
            getById: 'getDepartamentoById',
            create: 'createDepartamento',
            update: 'updateDepartamento',
            delete: 'deleteDepartamento'
        }),

        columns: [
            { field: 'id', header: 'common.id', sortable: true, width: '80px' },
            { field: 'nombre', header: 'catalog.geography.departments.fields.name', sortable: true },
            { field: 'countryId', header: 'catalog.geography.departments.fields.country', sortable: false, width: '250px' }
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                { name: 'nombre', label: 'catalog.geography.departments.fields.name', type: 'text', required: true, colSpan: 1 },
                { name: 'poblacion', label: 'catalog.geography.departments.fields.population', type: 'number', colSpan: 1 },
                { name: 'superficie', label: 'catalog.geography.departments.fields.surface', type: 'number', colSpan: 1 },
                {
                    name: 'countryId',
                    label: 'catalog.geography.departments.fields.country',
                    type: 'select',
                    required: true,
                    colSpan: 1,
                    options: [] // To be populated dynamically in components if needed
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
