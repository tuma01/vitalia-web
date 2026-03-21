import { inject } from '@angular/core';
import { Role } from 'app/api/models/role';
import { CrudConfig } from '@shared/components/crud-template/crud-config';
import { HttpClient } from '@angular/common/http';

export const ROLES_CRUD_CONFIG = (): CrudConfig<Role> => {
    const http = inject(HttpClient);

    return {
        entityName: 'tenant_admin.admin.roles.singular',
        entityNamePlural: 'tenant_admin.admin.roles.plural',

        getId: (entity: Role) => entity.id!,

        apiService: {
            getAll: () => http.get<Role[]>('/api/roles/all'),
            getById: (id) => http.get<Role>(`/api/roles/${id}`),
            create: (entity) => http.post<Role>('/api/roles', entity),
            update: (id, entity) => http.put<Role>(`/api/roles/${id}`, entity),
            delete: (id) => http.delete<void>(`/api/roles/${id}`)
        },

        columns: [
            { field: 'id', header: 'tenant_admin.admin.roles.fields.id', sortable: true, width: '100px' },
            { field: 'name', header: 'tenant_admin.admin.roles.fields.name', sortable: true, width: '250px' },
            { field: 'description', header: 'tenant_admin.admin.roles.fields.description', sortable: true },
        ],

        form: {
            layout: { columns: 1 },
            fields: [
                { name: 'name', label: 'tenant_admin.admin.roles.fields.name', type: 'text', required: true, icon: 'badge' },
                { name: 'description', label: 'tenant_admin.admin.roles.fields.description', type: 'textarea', icon: 'description' }
            ]
        },

        enableAdd: false,
        enableEdit: false,
        enableDelete: false,

        table: {
            pageSize: 10,
            rowStriped: true,
            showToolbar: true,
            columnResizable: true,
            multiSelectable: false,
            rowSelectable: true,
            hideRowSelectionCheckbox: true
        }
    };
};
