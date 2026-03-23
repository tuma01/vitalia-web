import { inject } from '@angular/core';
import { TenantAdmin } from 'app/api/models/tenant-admin';
import { TenantAdminManagementService } from 'app/api/services/tenant-admin-management.service';
import { TenantService } from 'app/api/services/tenant.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

/**
 * 🛡️ ADMINISTRATORS_CRUD_CONFIG
 * Alineado con la arquitectura profesional (pluralización y semántica).
 */
export const ADMINISTRATORS_CRUD_CONFIG = (mode: 'add' | 'edit' | 'list' = 'list'): CrudConfig<TenantAdmin> => {
    const service = inject(TenantAdminManagementService);
    const tenantService = inject(TenantService);

    return {
        entityName: 'tenant_governance.administrators.singular',
        entityNamePlural: 'tenant_governance.administrators.plural',

        getId: (entity: TenantAdmin) => entity.id!,

        apiService: new OpenApiCrudAdapter<TenantAdmin>(service, {
            getAll: 'getAllTenantAdmins',
            getById: 'getTenantAdminById',
            create: 'createTenantAdmin',
            update: 'updateTenantAdmin',
            delete: 'deleteTenantAdmin'
        }),

        columns: [
            { field: 'id', header: 'tenant_governance.administrators.fields.id', sortable: true, width: '80px' },
            {
                field: 'tenant.name',
                header: 'tenant_governance.administrators.fields.tenantId',
                sortable: true,
                formatter: (record: TenantAdmin) => record.tenant?.name || ''
            },
            {
                field: 'nombre',
                header: 'tenant_governance.administrators.fields.nombre',
                sortable: true,
                formatter: (record: TenantAdmin) => `${record.nombre} ${record.apellidoPaterno}`
            },
            { 
                field: 'email', 
                header: 'tenant_governance.administrators.fields.email', 
                sortable: true,
                formatter: (record: TenantAdmin) => record.user?.email || '-'
            },
            {
                field: 'adminLevel',
                header: 'tenant_governance.administrators.fields.adminLevel',
                sortable: true,
                width: '120px',
                type: 'tag',
                tag: {
                    'LEVEL_1': { text: 'tenant_governance.administrators.fields.level1_short', color: '#1976d2' },
                    'LEVEL_2': { text: 'tenant_governance.administrators.fields.level2_short', color: '#388e3c' },
                    'LEVEL_3': { text: 'tenant_governance.administrators.fields.level3_short', color: '#f57c00' }
                }
            }
        ],

        form: {
            layout: { columns: 2 },
            fields: [
                {
                    name: 'tenant',
                    label: 'tenant_governance.administrators.fields.tenantId',
                    type: 'select',
                    icon: 'business',
                    required: true,
                    colSpan: 1,
                    options: []
                },
                {
                    name: 'adminLevel',
                    label: 'tenant_governance.administrators.fields.adminLevel',
                    type: 'select',
                    icon: 'admin_panel_settings',
                    required: true,
                    colSpan: 1,
                    options: [
                        { label: 'tenant_governance.administrators.fields.level1', value: 'LEVEL_1' },
                        { label: 'tenant_governance.administrators.fields.level2', value: 'LEVEL_2' },
                        { label: 'tenant_governance.administrators.fields.level3', value: 'LEVEL_3' }
                    ]
                },
                {
                    name: 'password',
                    label: 'tenant_governance.administrators.fields.password',
                    type: 'password',
                    icon: 'lock',
                    required: mode === 'add',
                    disabled: mode === 'edit',
                    showPasswordToggle: true,
                    placeholder: mode === 'add'
                        ? 'tenant_governance.administrators.fields.password'
                        : 'tenant_governance.administrators.fields.password_placeholder_edit',
                    hint: mode === 'edit'
                        ? 'tenant_governance.administrators.fields.password_hint'
                        : undefined,
                    colSpan: 1,
                    groupWithNext: mode === 'edit'
                },
                ...(mode === 'edit' ? [{
                    name: 'changePassword',
                    label: 'tenant_governance.administrators.fields.change_password',
                    type: 'checkbox' as const,
                    colSpan: 1
                }] : []),
                {
                    name: 'userEmail',
                    label: 'tenant_governance.administrators.fields.email',
                    type: 'text',
                    icon: 'email',
                    required: true,
                    colSpan: 1,
                    placeholder: 'admin@example.com'
                },
                {
                    name: 'displayRole',
                    label: 'tenant_governance.administrators.fields.role_info',
                    type: 'text',
                    icon: 'verified_user',
                    disabled: true,
                    colSpan: 1,
                    value: 'Administrador de Organización'
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
