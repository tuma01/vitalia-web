import { TranslateService } from '@ngx-translate/core';
import { MtxGridColumn, MtxGridColumnButton } from '@ng-matero/extensions/grid';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';

interface CustomButtonOptions {
    icon: string;
    tooltipKey: string;
    handler: (record: any) => void;
    color?: string;
    disabled?: (record: any) => boolean;
}

interface OperationColumnOptions {
    editHandler?: (record: any) => void;
    deleteHandler?: (record: any) => void;
    customButtons?: CustomButtonOptions[];
    entityType?: string;
    /** Row field name used to extract the item label for the delete dialog */
    fieldForMessage?: string;
}

export function getOperationColumn(
    translate: TranslateService,
    options: OperationColumnOptions,
    confirmDialog?: ConfirmDialogService
): MtxGridColumn {
    const buttons: MtxGridColumnButton[] = [];

    if (options.editHandler) {
        const editBtn: MtxGridColumnButton = {
            type: 'icon',
            icon: 'edit',
            text: '',         // explicit empty — prevents MtxGrid from showing row data
            tooltip: { message: translate.instant('common.edit'), position: 'above' },
            click: options.editHandler,
        };
        buttons.push(editBtn);
    }

    if (options.deleteHandler) {
        const deleteBtn: MtxGridColumnButton = {
            type: 'icon',
            icon: 'delete',
            text: '',         // explicit empty — prevents MtxGrid from showing row data
            class: 'btn-row-delete',
            tooltip: { message: translate.instant('common.delete'), position: 'above' },
            click: (record) => {
                const itemName = options.fieldForMessage
                    ? record[options.fieldForMessage]
                    : undefined;
                const entityLabel = options.entityType
                    ? translate.instant(options.entityType)
                    : undefined;

                if (confirmDialog) {
                    confirmDialog.confirm({
                        titleKey: 'common.confirm_delete_title',
                        messageKey: 'common.confirm_delete_message',
                        itemName,
                        entityLabel,
                        icon: 'delete_forever',
                        confirmColor: 'warn',
                    }).subscribe(confirmed => {
                        if (confirmed) options.deleteHandler!(record);
                    });
                } else {
                    const message = translate.instant('common.confirm_delete_generic');
                    if (confirm(message)) options.deleteHandler!(record);
                }
            },
        };
        buttons.push(deleteBtn);
    }

    if (options.customButtons) {
        buttons.push(...options.customButtons.map(btn => {
            const customBtn: MtxGridColumnButton = {
                type: 'icon',
                icon: btn.icon,
                text: '',
                tooltip: { message: translate.instant(btn.tooltipKey), position: 'above' },
                color: btn.color as any,
                click: btn.handler,
                disabled: btn.disabled
            };
            return customBtn;
        }));
    }

    // Determined width for all tables: 120px. 
    // We maintain this as a baseline to ensure absolute visual homogeneity in the 'Operations' column.
    const colWidth = Math.max(120, buttons.length * 42 + 25);

    return {
        header: translate.stream('common.operations'),
        field: 'operation',
        minWidth: colWidth,
        width: `${colWidth}px`,
        maxWidth: colWidth,
        pinned: 'right',
        type: 'button',
        buttons,
    };
}
