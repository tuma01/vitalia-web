import { inject } from '@angular/core';
import { InvitationResponse } from 'app/api/models/invitation-response';
import { UserInvitationsService } from 'app/api/services/user-invitations.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';
import { SessionService } from '@core/services/session.service';
import { map, of } from 'rxjs';

export const INVITATIONS_CRUD_CONFIG = (): CrudConfig<InvitationResponse> => {
    const service = inject(UserInvitationsService);
    const sessionService = inject(SessionService);

    return {
        entityName: 'tenant_admin.admin.invitations.singular',
        entityNamePlural: 'tenant_admin.admin.invitations.plural',

        getId: (entity: InvitationResponse) => entity.id!,

        apiService: {
            getAll: () => {
                const tenantCode = sessionService.getCurrentTenantCode();
                if (!tenantCode) return of([]);
                // 🚀 Professional Workflow: Show only PENDING by default to focus on actions
                return service.getInvitations({ 
                    tenantCode, 
                    pageIndex: 0, 
                    pageSize: 1000,
                    status: 'PENDING' 
                }).pipe(
                    map(res => res.content || [])
                );
            },
            getById: (id: any) => of({} as InvitationResponse),
            create: (entity: InvitationResponse) => of(entity),
            update: (id: any, entity: InvitationResponse) => of(entity),
            delete: (id: any) => of(void 0)
        },

        columns: [
            { field: 'id', header: 'tenant_admin.admin.invitations.fields.id', sortable: true, width: '70px' },
            { field: 'email', header: 'tenant_admin.admin.invitations.fields.email', sortable: true, width: '250px' },
            { field: 'roleName', header: 'tenant_admin.admin.invitations.fields.role', sortable: true, width: '150px' },
            {
                field: 'status',
                header: 'tenant_admin.admin.invitations.fields.status',
                width: '120px',
                type: 'tag',
                tag: {
                    'PENDING': { text: 'tenant_admin.admin.invitations.status.pending', color: '#f57c00' }, // Orange
                    'ACCEPTED': { text: 'tenant_admin.admin.invitations.status.accepted', color: '#43a047' }, // Professional Green
                    'EXPIRED': { text: 'tenant_admin.admin.invitations.status.expired', color: '#e53935' }, // Red
                    'CANCELLED': { text: 'tenant_admin.admin.invitations.status.cancelled', color: '#757575' } // Gray
                }
            },
            { field: 'createdAt', header: 'tenant_admin.admin.invitations.fields.createdAt', type: 'date', sortable: true, width: '160px' },
            { field: 'expiresAt', header: 'tenant_admin.admin.invitations.fields.expiresAt', type: 'date', sortable: true, width: '160px' }
        ],

        enableAdd: false, // Redirects to users-add or handled elsewhere
        enableEdit: false,
        enableDelete: false,

        table: {
            pageSize: 10,
            rowStriped: true,
            showToolbar: true,
            columnResizable: true,
            multiSelectable: false,
            rowSelectable: false
        }
    };
};
