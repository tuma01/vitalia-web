import { inject } from '@angular/core';
import { UserTenantRole } from 'app/api/models/user-tenant-role';
import { UserTenantRoleService } from 'app/api/services/user-tenant-role.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';
import { SessionService } from '@core/services/session.service';
import { map } from 'rxjs';

export const USERS_CRUD_CONFIG = (): CrudConfig<UserTenantRole> => {
    const service = inject(UserTenantRoleService);
    const sessionService = inject(SessionService);

    return {
        entityName: 'tenant_admin.admin.users.singular',
        entityNamePlural: 'tenant_admin.admin.users.plural',

        getId: (entity: UserTenantRole) => entity.id!,

        apiService: (() => {
            const adapter = new OpenApiCrudAdapter<UserTenantRole>(service, {
                getAll: 'getAllUserTenantRoles',
                getById: 'getUserTenantRoleById',
                create: 'createUserTenantRole',
                update: 'updateUserTenantRole',
                delete: 'deleteUserTenantRole'
            });

            return {
                ...adapter,
                getAll: () => service.getAllUserTenantRoles().pipe(
                    map(users => {
                        const isSuperAdmin = sessionService.hasRole('ROLE_SUPER_ADMIN');
                        if (isSuperAdmin) return users;
                        
                        // Filter out SuperAdmins for non-superadmin users
                        return users.filter(u => u.role?.name !== 'ROLE_SUPER_ADMIN');
                    })
                ),
                getById: (id: any) => adapter.getById(id),
                create: (entity: UserTenantRole) => adapter.create(entity),
                update: (id: any, entity: UserTenantRole) => adapter.update(id, entity),
                delete: (id: any) => adapter.delete(id)
            };
        })(),

        columns: [
            { field: 'id', header: 'tenant_admin.admin.users.fields.id', sortable: true, width: '80px' },
            { field: 'user.email', header: 'tenant_admin.admin.users.fields.email', sortable: true },
            { field: 'role.name', header: 'tenant_admin.admin.users.fields.role', sortable: true, width: '150px' },
            {
                field: 'active',
                header: 'tenant_admin.admin.users.fields.status',
                width: '120px',
                type: 'tag',
                tag: {
                    'true': { text: 'common.active', color: '#2e7d32' },
                    'false': { text: 'common.inactive', color: '#c62828' }
                }
            },
            { field: 'assignedAt', header: 'tenant_admin.admin.users.fields.assignedAt', type: 'date', sortable: true, width: '160px' },
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                { 
                    name: 'user.email', 
                    label: 'tenant_admin.admin.users.fields.email', 
                    type: 'text', 
                    required: true, 
                    colSpan: 1, 
                    icon: 'email' 
                },
                {
                    name: 'nombre',
                    label: 'tenant_admin.admin.users.fields.nombre',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    icon: 'badge'
                },
                {
                    name: 'apellidoPaterno',
                    label: 'tenant_admin.admin.users.fields.apellidoPaterno',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    icon: 'badge'
                },
                {
                    name: 'personType',
                    label: 'tenant_admin.admin.users.fields.personType',
                    type: 'select',
                    required: true,
                    colSpan: 1,
                    options: [
                        { label: 'common.person_types.admin', value: 'ADMIN' },
                        { label: 'common.person_types.employee', value: 'EMPLOYEE' },
                        { label: 'common.person_types.nurse', value: 'NURSE' },
                        { label: 'common.person_types.doctor', value: 'DOCTOR' },
                        { label: 'common.person_types.patient', value: 'PATIENT' }
                    ],
                    icon: 'psychology'
                },
                {
                    name: 'role.name',
                    label: 'tenant_admin.admin.users.fields.role',
                    type: 'select',
                    required: true,
                    colSpan: 1,
                    options: [],
                    icon: 'verified_user'
                },
                { name: 'active', label: 'common.active', type: 'checkbox', colSpan: 1 }
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
