import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild, inject, AfterViewInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MtxGridModule, MtxGrid } from '@ng-matero/extensions/grid';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { AddressSelectorComponent } from '@shared/components/address-selector/address-selector.component';
import { CrudBaseComponent } from './crud-base.component';
import { CrudConfig, CrudMode, CrudFormFieldConfig } from './crud-config';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-crud-template',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MtxGridModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatCardModule,
        TranslateModule,
        MatCheckboxModule,
        MatIconModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatRadioModule,
        MatTabsModule,
        AddressSelectorComponent
    ],
    templateUrl: './crud-template.component.html',
    styleUrls: ['./crud-template.component.scss']
})
export class CrudTemplateComponent<T> extends CrudBaseComponent<T> implements AfterViewInit, OnChanges {
    @Input() override mode: CrudMode = 'list';
    @ViewChild('tagCellTemplate', { static: true }) tagCellTemplate!: TemplateRef<any>;

    @Output() create = new EventEmitter<void>();
    @Output() edit = new EventEmitter<T>();
    @Output() delete = new EventEmitter<T>();
    @Output() bulkDelete = new EventEmitter<T[]>();
    @Output() save = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    @Input() cellTemplates: { [key: string]: TemplateRef<any> } = {};
    @Input() formGroup?: any; // The ReactiveForm from the implementation
    @Input() customFormTemplate?: TemplateRef<any>; // Optional custom template for form body
    passwordVisible: Record<string, boolean> = {};

    @ViewChild('grid') grid!: MtxGrid;

    protected override translate = inject(TranslateService);
    protected override cdr = inject(ChangeDetectorRef);

    constructor() {
        super();
    }

    /**
     * Groups fields by their sectionTitle for rendering in tabs or sections.
     * This logic ensures fields are always grouped logically based on the first occurrence of sectionTitle.
     */
    get formSections(): { title?: string; icon?: string; fields: CrudFormFieldConfig<T>[] }[] {
        const sections: { title?: string; icon?: string; fields: CrudFormFieldConfig<T>[] }[] = [];
        const fields = this.config?.form?.fields || [];

        let currentSection: { title?: string; icon?: string; fields: CrudFormFieldConfig<T>[] } = { fields: [] };

        fields.forEach(field => {
            if (field.sectionTitle) {
                // If we already have fields in the current section, push it before starting a new one
                if (currentSection.fields.length > 0 || currentSection.title) {
                    sections.push(currentSection);
                }
                currentSection = {
                    title: field.sectionTitle,
                    icon: field.sectionIcon,
                    fields: [field]
                };
            } else {
                currentSection.fields.push(field);
            }
        });

        // Push the last section
        if (currentSection.fields.length > 0 || currentSection.title) {
            sections.push(currentSection);
        }

        return sections;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cellTemplates'] || changes['config']) {
            this.assignCustomTemplates();
        }
    }

    ngAfterViewInit(): void {
        this.assignCustomTemplates();
    }

    private assignCustomTemplates(): void {
        if (!this.columns || this.columns.length === 0) return;

        let hasChanged = false;
        this.columns.forEach(col => {
            const field = col.field as string;
            
            // 1. Tag Templates (Badge mapping)
            if ((col as any).tag && !col.cellTemplate) {
                col.cellTemplate = this.tagCellTemplate;
                hasChanged = true;
            }

            // 2. Custom Templates (from parent/implementation)
            if (field && this.cellTemplates[field] && col.cellTemplate !== this.cellTemplates[field]) {
                console.log(`[CrudTemplate] 🔗 Binding custom template to column: ${field}`);
                col.cellTemplate = this.cellTemplates[field];
                hasChanged = true;
            }
        });

        if (hasChanged) {
            this.columns = [...this.columns]; // Force grid to re-render
            this.cdr.detectChanges();
        }
    }

    getErrorMessage(controlName: string): string {
        const control = this.formGroup?.get(controlName);
        if (!control || !control.errors) {
            return '';
        }

        const errors = control.errors;

        if (errors['required']) {
            return this.translate.instant('validation.required');
        }
        if (errors['minlength']) {
            return this.translate.instant('validation.minlength', { requiredLength: errors['minlength'].requiredLength });
        }
        if (errors['maxlength']) {
            return this.translate.instant('validation.maxlength', { requiredLength: errors['maxlength'].requiredLength });
        }
        if (errors['email']) {
            return this.translate.instant('validation.email');
        }
        if (errors['pattern']) {
            return this.translate.instant('validation.pattern');
        }
        return '';
    }

    togglePasswordVisibility(fieldName: string): void {
        this.passwordVisible[fieldName] = !this.passwordVisible[fieldName];
    }

    isPasswordVisible(fieldName: string): boolean {
        return !!this.passwordVisible[fieldName];
    }

    clearSelection(): void {
        this.grid.rowSelection.clear();
        this.selectedRows = [];
    }

    getFormGroup(name: string): FormGroup {
        return this.formGroup?.get(name) as FormGroup;
    }

    /**
     * Row click → toggle row selection (modern UX: clicking anywhere on a row
     * selects/deselects it, not just the checkbox).
     */
    onRowClick(event: { rowData: T; index: number }): void {
        if (!this.config.table?.multiSelectable && !this.config.table?.rowSelectable) {
            return; // selection not enabled for this config
        }
        const row = event.rowData;
        const alreadySelected = this.selectedRows.some(r => r === row);
        if (alreadySelected) {
            this.grid.rowSelection.deselect(row);
            this.selectedRows = this.selectedRows.filter(r => r !== row);
        } else {
            this.grid.rowSelection.select(row);
            this.selectedRows = [...this.selectedRows, row];
        }
    }
}
