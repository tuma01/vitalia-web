import { inject } from '@angular/core';
import { Country } from 'app/api/models/country';
import { CountryService } from 'app/api/services/country.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const COUNTRIES_CRUD_CONFIG = (): CrudConfig<Country> => {
    const service = inject(CountryService);

    return {
        // Aligned with catalog.geography.countries structure
        entityName: 'catalog.geography.countries.singular',
        entityNamePlural: 'catalog.geography.countries.plural',

        getId: (entity: Country) => entity.id!,

        apiService: new OpenApiCrudAdapter<Country>(service, {
            getAll: 'getAllCountries',
            getById: 'getCountryById',
            create: 'createCountry',
            update: 'updateCountry',
            delete: 'deleteCountry'
        }),

        columns: [
            { field: 'id', header: 'common.id', sortable: true, width: '80px' },
            { field: 'iso', header: 'catalog.geography.countries.fields.code', sortable: true, width: '100px' },
            { field: 'niceName', header: 'catalog.geography.countries.fields.niceName', sortable: true },
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                { name: 'iso', label: 'catalog.geography.countries.fields.code', type: 'text', required: true, colSpan: 1, minLength: 2, maxLength: 2 },
                { name: 'iso3', label: 'catalog.geography.countries.fields.code3', type: 'text', colSpan: 1, minLength: 3, maxLength: 3 },
                { name: 'name', label: 'catalog.geography.countries.fields.name', type: 'text', required: true, colSpan: 1 },
                { name: 'niceName', label: 'catalog.geography.countries.fields.niceName', type: 'text', required: true, colSpan: 1 },
                { name: 'numCode', label: 'catalog.geography.countries.fields.numCode', type: 'number', colSpan: 1 },
                { name: 'phoneCode', label: 'catalog.geography.countries.fields.phoneCode', type: 'number', required: true, colSpan: 1 },
                { name: 'currency', label: 'catalog.geography.countries.fields.currency', type: 'text', colSpan: 1 },
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
