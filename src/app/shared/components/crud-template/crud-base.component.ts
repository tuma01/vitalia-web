import { OnInit, Directive, Input, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { CrudConfig, CrudMode } from './crud-config';
import { MtxGridColumn, MtxGridColumnType } from '@ng-matero/extensions/grid';

@Directive()
export abstract class CrudBaseComponent<T> implements OnInit {
    @Input() config!: CrudConfig<T>;

    dataList: T[] = [];
    filteredData: T[] = [];
    isLoading = false;
    columns: MtxGridColumn[] = [];
    selectedRows: T[] = [];
    @Input() mode: CrudMode = 'list';

    protected translate = inject(TranslateService);

    ngOnInit(): void {
        if (!this.config) {
            throw new Error('CrudConfig is required for CrudBaseComponent');
        }
        this.initColumns();
        this.loadData();
    }

    protected initColumns(): void {
        this.columns = this.config.columns.map(col => {
            const mtxCol: MtxGridColumn = {
                ...col,
                field: col.field as string,
                type: (col.type || 'text') as MtxGridColumnType
            };

            // Only stream if header is a string (a key)
            if (typeof col.header === 'string') {
                mtxCol.header = this.translate.stream(col.header);
            }

            return mtxCol;
        });
        console.log('[CrudBase] Columns initialized:', this.columns);
    }

    loadData(): void {
        const entityName = this.config.entityNamePlural || 'entities';
        console.log(`[CrudBase] 🔍 Loading data for ${entityName}...`);
        this.isLoading = true;

        this.config.apiService.getAll()
            .pipe(finalize(() => {
                this.isLoading = false;
                console.log(`[CrudBase] 🏁 Loading complete for ${entityName}.`);
            }))
            .subscribe({
                next: (data) => {
                    console.log(`[CrudBase] ✅ Data received for ${entityName}:`, data);
                    if (Array.isArray(data)) {
                        this.dataList = data;
                        this.filteredData = [...this.dataList];
                        console.log(`[CrudBase] 📊 Displaying ${this.filteredData.length} records.`);
                    } else {
                        console.error(`[CrudBase] ❌ Expected array but received:`, data);
                        // Fallback for paginated results if needed
                        if ((data as any)?.content) {
                            this.dataList = (data as any).content;
                            this.filteredData = [...this.dataList];
                        }
                    }
                },
                error: (err) => {
                    console.error(`[CrudBase] ❌ Error loading ${entityName}:`, err);
                }
            });
    }

    onSearch(searchTerm: string): void {
        if (!searchTerm?.trim()) {
            this.filteredData = [...this.dataList];
            return;
        }

        const term = searchTerm.toLowerCase().trim();
        this.filteredData = this.dataList.filter(item => this.searchInObject(item, term));
    }

    protected searchInObject(obj: any, term: string): boolean {
        return Object.keys(obj).some(key => {
            const value = obj[key];
            if (key.startsWith('$') || value == null) return false;

            if (typeof value === 'object' && !Array.isArray(value)) {
                return this.searchInObject(value, term);
            }

            if (Array.isArray(value)) {
                return value.some(arrayItem => {
                    if (typeof arrayItem === 'object' && arrayItem !== null) {
                        return this.searchInObject(arrayItem, term);
                    }
                    return String(arrayItem).toLowerCase().includes(term);
                });
            }

            return String(value).toLowerCase().includes(term);
        });
    }

    onDelete(entity: T): void {
        if (!this.config.enableDelete) return;

        const id = this.config.getId(entity);
        const itemName = (entity as any).name || (entity as any).niceName || id;

        const message = this.translate.instant('common.confirm_delete', {
            entity: this.translate.instant(this.config.entityName),
            name: itemName
        });

        if (confirm(message)) {
            this.isLoading = true;
            this.config.apiService.delete(id)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe({
                    next: () => this.loadData(),
                    error: (err) => console.error('Error deleting entity:', err)
                });
        }
    }

    onRefresh(): void {
        this.loadData();
    }

    clearSearch(input: HTMLInputElement): void {
        input.value = '';
        this.filteredData = [...this.dataList];
    }

    onRowSelectionChange(rows: T[]): void {
        this.selectedRows = rows;
        console.log('[CrudBase] Selected rows:', this.selectedRows.length);
    }
}
