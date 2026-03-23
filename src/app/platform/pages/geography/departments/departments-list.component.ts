import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { DEPARTMENTS_CRUD_CONFIG } from './departments-crud.config';
import { Departamento } from 'app/api/models/departamento';
import { getOperationColumn } from '@shared/gridcolumn-config';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared/services/confirm-dialog.service';
import { CountryService } from 'app/api/services/country.service';
import { Country } from 'app/api/models/country';

@Component({
    selector: 'app-departments-list',
    standalone: true,
    imports: [CrudTemplateComponent],
    template: `
    <app-crud-template #crud
      [config]="config"
      (create)="createNew()"
    ></app-crud-template>
  `
})
export class DepartmentsListComponent implements OnInit {
    @ViewChild('crud') private crud!: CrudTemplateComponent<Departamento>;

    private router = inject(Router);
    private translate = inject(TranslateService);
    private confirmDialog = inject(ConfirmDialogService);
    private snackBar = inject(MatSnackBar);
    private countryService = inject(CountryService);

    config = DEPARTMENTS_CRUD_CONFIG();
    private countries: Country[] = [];

    constructor() {
        this.config.columns.push(
            (getOperationColumn(
                this.translate,
                {
                    editHandler: (record: Departamento) => this.edit(record),
                    deleteHandler: (record: Departamento) => this.deleteDepartamento(record),
                    entityType: 'catalog.geography.departments.singular',
                    fieldForMessage: 'nombre'
                },
                this.confirmDialog
            ) as any)
        );
    }

    ngOnInit(): void {
        this.loadCountries();
    }

    private loadCountries(): void {
        this.countryService.getAllCountries().subscribe({
            next: (countries) => {
                this.countries = countries;
                this.updateCountryFormatter();
            }
        });
    }

    private updateCountryFormatter(): void {
        const countryCol = this.config.columns.find(c => c.field === 'countryId');
        if (countryCol) {
            countryCol.formatter = (row: Departamento) => {
                const country = this.countries.find(c => c.id === row.countryId);
                return country ? country.name : (row.countryId?.toString() || '');
            };
            this.crud.refreshColumns();
        }
    }

    createNew(): void {
        this.router.navigate(['/platform/geography/departments/add']);
    }

    edit(record: Departamento): void {
        this.router.navigate(['/platform/geography/departments/edit'], {
            queryParams: { id: record.id },
        });
    }

    private deleteDepartamento(record: Departamento): void {
        this.config.apiService.delete(record.id!).subscribe({
            next: () => {
                this.snackBar.open(
                    this.translate.instant('common.delete_success'),
                    undefined, { duration: 3000, panelClass: 'success-snackbar' }
                );
                this.crud.loadData();
            },
            error: () => this.snackBar.open(
                this.translate.instant('common.delete_error'),
                this.translate.instant('common.close'),
                { duration: 5000, panelClass: 'error-snackbar' }
            )
        });
    }
}
