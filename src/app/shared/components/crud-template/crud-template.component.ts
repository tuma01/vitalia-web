import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
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
import { MtxGridModule, MtxGrid } from '@ng-matero/extensions/grid';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CrudBaseComponent } from './crud-base.component';
import { CrudConfig, CrudMode } from './crud-config';

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
        MatDatepickerModule
    ],
    templateUrl: './crud-template.component.html',
    styleUrls: ['./crud-template.component.scss']
})
export class CrudTemplateComponent<T> extends CrudBaseComponent<T> {
    @Input() override mode: CrudMode = 'list';

    @Output() create = new EventEmitter<void>();
    @Output() edit = new EventEmitter<T>();
    @Output() delete = new EventEmitter<T>();
    @Output() bulkDelete = new EventEmitter<T[]>();
    @Output() save = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    @Input() cellTemplates: { [key: string]: TemplateRef<any> } = {};

    @ViewChild('grid') grid!: MtxGrid;

    constructor() {
        super();
    }

    clearSelection(): void {
        this.grid.rowSelection.clear();
        this.selectedRows = [];
    }
}
