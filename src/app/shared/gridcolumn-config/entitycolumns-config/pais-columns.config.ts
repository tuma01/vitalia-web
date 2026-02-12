import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';

export function getPaisColumns(translate: TranslateService): MtxGridColumn[] {
    return [
        {
            header: translate.stream('country.iso'),
            field: 'iso',
            minWidth: 80,
        },
        {
            header: translate.stream('country.iso3'),
            field: 'iso3',
            minWidth: 80,
        },
        {
            header: translate.stream('country.name'),
            field: 'name',
            sortable: true,
            minWidth: 120,
        },
        {
            header: translate.stream('country.niceName'),
            field: 'niceName',
            minWidth: 120,
        },
        {
            header: translate.stream('country.numCode'),
            field: 'numCode',
            minWidth: 100,
        },
        {
            header: translate.stream('country.phoneCode'),
            field: 'phoneCode',
            minWidth: 100,
        }
    ];
}
