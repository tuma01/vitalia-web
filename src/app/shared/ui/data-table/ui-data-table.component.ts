import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { UiInputComponent } from '../input/ui-input.component';
import { UiButtonComponent } from '../button/ui-button.component';
import { UiCheckboxComponent } from '../checkbox/ui-checkbox.component';
import { UiFormFieldComponent } from '../form-field/ui-form-field.component';
import { UiPrefixDirective } from '../form-field/ui-form-field.directives';
import { UiProgressSpinnerComponent } from '../progress-spinner/ui-progress-spinner.component';
import { UiTagComponent } from '../tag/ui-tag.component';
import { UiTagVariant } from '../tag/ui-tag.types';
import { UiTableAction, UiTableColumn } from './ui-data-table.types';
import { UiDialogService } from '../dialog/ui-dialog.service';
import { DEFAULT_PAL_I18N, UiTableI18n } from '../ui-i18n.types';

@Component({
    selector: 'ui-data-table',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        UiInputComponent,
        UiButtonComponent,
        UiCheckboxComponent,
        UiFormFieldComponent,
        UiPrefixDirective,
        MatMenuModule,
        MatDividerModule,
        UiProgressSpinnerComponent,
        UiTagComponent
    ],
    templateUrl: './ui-data-table.component.html',
    styleUrls: ['./ui-data-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MatPaginatorIntl]
})
export class UiDataTableComponent<T> implements OnChanges {
    @Input() data: T[] = [];
    @Input() columns: UiTableColumn<T>[] = [];
    @Input() actions: UiTableAction<T>[] = [];
    @Input() loading = false;
    @Input() pageSize = 10;
    @Input() pageSizeOptions = [5, 10, 25, 100];
    @Input() selectable = false;
    @Input() searchable = true;
    @Input() exportable = true;
    @Input() stickyHeader = true;
    @Input() set i18n(value: Partial<UiTableI18n>) {
        this._i18n = { ...DEFAULT_PAL_I18N.table, ...value };
        this.updatePaginatorLabels();
    }
    get i18n(): UiTableI18n {
        return this._i18n;
    }

    private _i18n: UiTableI18n = DEFAULT_PAL_I18N.table;

    @Output() rowClick = new EventEmitter<T>();
    @Output() selectionChange = new EventEmitter<T[]>();
    @Output() bulkDelete = new EventEmitter<T[]>();

    private dialogService = inject(UiDialogService);
    private cdr = inject(ChangeDetectorRef);
    private paginatorIntl = inject(MatPaginatorIntl);

    dataSource = new MatTableDataSource<T>([]);
    displayedColumns: string[] = [];
    selection = new SelectionModel<T>(true, []);
    hiddenColumns = new Set<string>();

    private searchSubject = new Subject<string>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && this.data) {
            this.dataSource.data = this.data;
            if (this.paginator) this.dataSource.paginator = this.paginator;
            if (this.sort) this.dataSource.sort = this.sort;
            this.selection.clear();
        }

        if (changes['columns'] || changes['actions'] || changes['selectable']) {
            this.updateDisplayedColumns();
        }
    }

    ngOnInit() {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(value => {
            this.dataSource.filter = value.trim().toLowerCase();
        });

        this.selection.changed.subscribe(() => {
            this.selectionChange.emit(this.selection.selected);
            this.cdr.markForCheck();
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    private updateDisplayedColumns() {
        const visibleCols = this.columns
            .filter(c => !this.hiddenColumns.has(c.key))
            .map(c => c.key);

        if (this.selectable) {
            visibleCols.unshift('__select');
        }

        if (this.actions.length > 0) {
            visibleCols.push('__actions');
        }
        this.displayedColumns = visibleCols;
    }

    private updatePaginatorLabels() {
        this.paginatorIntl.itemsPerPageLabel = 'Elementos por página:';
        this.paginatorIntl.nextPageLabel = 'Siguiente';
        this.paginatorIntl.previousPageLabel = 'Anterior';
        this.paginatorIntl.firstPageLabel = 'Primera página';
        this.paginatorIntl.lastPageLabel = 'Última página';
        this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length === 0 || pageSize === 0) {
                return `0 de ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            const endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;
            return `${startIndex + 1} - ${endIndex} de ${length}`;
        };
        this.paginatorIntl.changes.next();
    }

    toggleColumnVisibility(columnKey: string) {
        if (this.hiddenColumns.has(columnKey)) {
            this.hiddenColumns.delete(columnKey);
        } else {
            this.hiddenColumns.add(columnKey);
        }
        this.updateDisplayedColumns();
    }

    isColumnVisible(columnKey: string): boolean {
        return !this.hiddenColumns.has(columnKey);
    }

    applyFilter(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input) {
            this.searchSubject.next(input.value);
        }
    }

    /** Get only the rows currently displayed on the current page. */
    private getCurrentPageData(): T[] {
        const { pageIndex, pageSize } = this.paginator;
        const startIndex = pageIndex * pageSize;
        return this.dataSource.filteredData.slice(startIndex, startIndex + pageSize);
    }

    /** Whether the number of selected elements matches the total number of rows on the CURRENT PAGE. */
    isAllSelected() {
        const pageData = this.getCurrentPageData();
        return pageData.every(row => this.selection.isSelected(row));
    }

    /** Selects all rows on the CURRENT PAGE if they are not all selected; otherwise clear those specific rows. */
    toggleAllRows() {
        const pageData = this.getCurrentPageData();
        if (this.isAllSelected()) {
            this.selection.deselect(...pageData);
        } else {
            this.selection.select(...pageData);
        }
    }

    exportToCsv() {
        const dataToExport = this.dataSource.filteredData;
        if (!dataToExport || dataToExport.length === 0) return;

        const headers = this.columns.map(c => `"${c.header}"`).join(',');
        const rows = dataToExport.map(row => {
            return this.columns.map(c => {
                const val = this.getValue(row, c);
                return `"${val}"`;
            }).join(',');
        });

        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'export_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    clearSelection() {
        this.selection.clear();
    }

    onBulkDelete() {
        const count = this.selection.selected.length;
        this.dialogService.confirm({
            title: this.i18n.bulkDeleteConfirmTitle || 'Eliminar elementos',
            message: this.i18n.bulkDeleteConfirmMessage?.toString() || `¿Estás seguro de que deseas eliminar ${count} elementos seleccionados?`,
            confirmText: this.i18n.bulkDeleteConfirmButton || 'Eliminar',
            confirmColor: 'danger',
            icon: 'delete_sweep'
        }).subscribe(confirmed => {
            if (confirmed) {
                this.bulkDelete.emit(this.selection.selected);
                this.selection.clear();
                this.cdr.markForCheck();
            }
        });
    }

    onRowClick(row: T) {
        this.rowClick.emit(row);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValue(row: T, col: UiTableColumn<T>): any {
        let value: any;
        if (col.cell) {
            value = col.cell(row);
        } else {
            value = (row as any)[col.key];
        }

        if (value === null || value === undefined) return '';

        if (col.type === 'currency' && typeof value === 'number') {
            return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
        }

        if (col.type === 'date' && (value instanceof Date || !isNaN(Date.parse(value)))) {
            return new Intl.DateTimeFormat('es-ES').format(new Date(value));
        }

        return value;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBadgeClass(value: any): UiTagVariant {
        if (!value) return 'neutral';
        const v = String(value).toLowerCase();
        if (v === 'active' || v === 'success' || v === 'true' || v === 'activo') return 'success';
        if (v === 'inactive' || v === 'error' || v === 'false' || v === 'inactivo') return 'danger';
        if (v === 'pending' || v === 'warning' || v === 'pendiente') return 'warning';
        return 'neutral';
    }

    getBadgeIcon(value: any): string {
        if (!value) return '';
        const v = String(value).toLowerCase();
        if (v === 'active' || v === 'success' || v === 'true' || v === 'activo') return 'task_alt';
        if (v === 'inactive' || v === 'error' || v === 'false' || v === 'inactivo') return 'do_not_disturb_on';
        if (v === 'pending' || v === 'warning' || v === 'pendiente') return 'pending_actions';
        return 'info';
    }
}
