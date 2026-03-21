import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpContext } from '@angular/common/http';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { INVITATIONS_CRUD_CONFIG } from './invitations-crud.config';
import { InvitationResponse } from 'app/api/models/invitation-response';
import { UserInvitationsService } from 'app/api/services/user-invitations.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';
import { TENANT_HEADER_OVERRIDE } from '@core/interceptors/http-context.tokens';

@Component({
    selector: 'app-invitations-list',
    standalone: true,
    imports: [
        CommonModule,
        CrudTemplateComponent,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        TranslateModule,
        MatSnackBarModule
    ],
    templateUrl: './invitations-list.component.html'
})
export class InvitationsListComponent implements OnInit {
    config = INVITATIONS_CRUD_CONFIG();
    
    private invitationService = inject(UserInvitationsService);
    private translate = inject(TranslateService);
    private snackBar = inject(MatSnackBar);
    private confirmDialog = inject(ConfirmDialogService);

    constructor() {
        // Adopt the standard CRUD model: Operation column injected programmatically
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    customButtons: [
                        {
                            icon: 'forward_to_inbox',
                            tooltipKey: 'tenant_admin.admin.invitations.actions.resend',
                            handler: (row) => this.resendInvitation(row),
                            disabled: (row) => row.status === 'ACCEPTED',
                            color: 'primary'
                        }
                    ],
                    entityType: 'tenant_admin.admin.invitations.singular'
                },
                this.confirmDialog
            ) as any)
        );
    }

    ngOnInit(): void {
    }

    resendInvitation(invitation: InvitationResponse): void {
        if (!invitation.id || !invitation.tenantCode) return;

        // 🔥 Pass tenantCode via HttpContext to bypass global context in the interceptor
        const context = new HttpContext().set(TENANT_HEADER_OVERRIDE, invitation.tenantCode);

        this.invitationService.resendInvitation({ id: invitation.id }, context).subscribe({
            next: () => {
                this.snackBar.open(
                    this.translate.instant('tenant_admin.admin.invitations.actions.resend_success', { email: invitation.email }),
                    'OK',
                    { duration: 5000 }
                );
            },
            error: (err) => {
                console.error('Error resending invitation:', err);
                this.snackBar.open(
                    this.translate.instant('tenant_admin.admin.invitations.actions.resend_error'),
                    'OK',
                    { duration: 5000, panelClass: ['error-snackbar'] }
                );
            }
        });
    }
}
