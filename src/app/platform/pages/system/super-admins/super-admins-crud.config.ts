import { inject } from '@angular/core';
import { SuperAdmin } from 'app/api/models/super-admin';
import { SuperAdminService } from 'app/api/services/super-admin.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

/**
 * 🛡️ SUPER_ADMINS_CRUD_CONFIG
 * Configuración para la gestión de administradores de plataforma (GLOBAL).
 */
export const SUPER_ADMINS_CRUD_CONFIG = (mode: 'add' | 'edit' | 'list' = 'list'): CrudConfig<SuperAdmin> => {
    const service = inject(SuperAdminService);

    return {
        entityName: 'platform_governance.super_admins.singular',
        entityNamePlural: 'platform_governance.super_admins.plural',

        getId: (entity: SuperAdmin) => entity.id!,

        apiService: new OpenApiCrudAdapter<SuperAdmin>(service, {
            getAll: 'getAllSuperAdmins',
            getById: 'getSuperAdminById',
            create: 'createSuperAdmin',
            update: 'updateSuperAdmin',
            delete: 'deleteSuperAdmin'
        }),

        columns: [
            { field: 'id', header: 'platform_governance.super_admins.fields.id', sortable: true, width: '80px' },
            {
                field: 'nombre',
                header: 'platform_governance.super_admins.fields.nombre',
                sortable: true,
                width: '180px'
            },
            {
                field: 'apellidoPaterno',
                header: 'platform_governance.super_admins.fields.apellidoPaterno',
                sortable: true,
                width: '180px'
            },
            {
                field: 'email',
                header: 'platform_governance.super_admins.fields.email',
                sortable: true,
                width: '220px',
                formatter: (record: SuperAdmin) => record.user?.email || '-'
            },
            {
                field: 'level',
                header: 'platform_governance.super_admins.fields.level',
                width: '120px',
                tag: {
                    'LEVEL_1': { text: 'LEVEL_1', color: 'red' },
                    'LEVEL_2': { text: 'LEVEL_2', color: 'blue' },
                    'LEVEL_3': { text: 'LEVEL_3', color: 'green' }
                }
            },
            {
                field: 'globalAccess',
                header: 'platform_governance.super_admins.fields.globalAccess',
                sortable: true,
                width: '100px',
                type: 'tag',
                tag: {
                    'true': { text: 'SÍ', color: '#2e7d32' },
                    'false': { text: 'NO', color: '#c62828' }
                },
                formatter: (record: SuperAdmin) => String(record.globalAccess)
            }
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                {
                    name: 'userEmail',
                    label: 'platform_governance.super_admins.fields.email',
                    type: 'text',
                    icon: 'email',
                    required: true,
                    colSpan: 1,
                    placeholder: 'admin@example.com'
                },
                {
                    name: 'level',
                    label: 'platform_governance.super_admins.fields.level',
                    type: 'select',
                    icon: 'admin_panel_settings',
                    required: true,
                    colSpan: 1,
                    options: [
                        { label: 'LEVEL_1 (Maestro)', value: 'LEVEL_1' },
                        { label: 'LEVEL_2 (Operador)', value: 'LEVEL_2' },
                        { label: 'LEVEL_3 (Consulta)', value: 'LEVEL_3' }
                    ]
                },
                {
                    name: 'globalAccess',
                    label: 'platform_governance.super_admins.fields.globalAccess',
                    type: 'checkbox',
                    icon: 'public',
                    colSpan: 1,
                    value: true
                },
                {
                    name: 'password',
                    label: 'platform_governance.super_admins.fields.password',
                    type: 'password',
                    icon: 'lock',
                    required: mode === 'add',
                    disabled: mode === 'edit',
                    showPasswordToggle: true,
                    placeholder: mode === 'add'
                        ? 'platform_governance.super_admins.fields.password'
                        : 'platform_governance.super_admins.fields.password_placeholder_edit',
                    hint: mode === 'edit'
                        ? 'platform_governance.super_admins.fields.password_hint'
                        : undefined,
                    colSpan: 1,
                    groupWithNext: mode === 'edit'
                },
                ...(mode === 'edit' ? [{
                    name: 'changePassword',
                    label: 'platform_governance.super_admins.fields.change_password',
                    type: 'checkbox' as const,
                    colSpan: 1
                }] : [])
            ]
        },

        enableAdd: true,
        enableEdit: true,
        enableDelete: true
    };
};
