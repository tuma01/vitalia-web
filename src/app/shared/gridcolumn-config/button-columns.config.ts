import { TranslateService } from '@ngx-translate/core';
import { MtxGridColumn, MtxGridColumnButton, MtxGridButtonType } from '@ng-matero/extensions/grid';
import { ThemePalette } from '@angular/material/core';

interface CustomButtonOptions {
    icon: string;
    tooltipKey: string;
    handler: (record: any) => void;
    color?: string;
}

interface OperationColumnOptions {
    editHandler?: (record: any) => void;
    deleteHandler?: (record: any) => void;
    customButtons?: CustomButtonOptions[];
    entityType?: string;
    fieldForMessage?: string;
}

export function getOperationColumn(
    translate: TranslateService,
    options: OperationColumnOptions
): MtxGridColumn {
    const buttons: MtxGridColumnButton[] = [];

    if (options.editHandler) {
        buttons.push({
            type: 'icon' as MtxGridButtonType,
            icon: 'edit',
            tooltip: translate.stream('common.edit'),
            click: options.editHandler,
        });
    }

    if (options.deleteHandler) {
        buttons.push({
            type: 'icon' as MtxGridButtonType,
            icon: 'delete',
            color: 'warn',
            tooltip: translate.stream('common.delete'),
            click: (record) => {
                let message: string;
                if (options.entityType && options.fieldForMessage) {
                    message = translate.instant('common.confirm_delete', {
                        entity: translate.instant(options.entityType),
                        name: record[options.fieldForMessage]
                    });
                } else {
                    message = translate.instant('common.confirm_delete_generic');
                }
                if (confirm(message)) {
                    options.deleteHandler!(record);
                }
            },
        });
    }

    if (options.customButtons) {
        buttons.push(...options.customButtons.map(btn => ({
            type: 'icon' as MtxGridButtonType,
            icon: btn.icon,
            tooltip: translate.stream(btn.tooltipKey),
            color: btn.color as ThemePalette,
            click: btn.handler,
        })));
    }

    return {
        header: translate.stream('common.operations'),
        field: 'operation',
        minWidth: 150,
        width: '120px',
        pinned: 'right',
        type: 'button',
        buttons,
    };
}
