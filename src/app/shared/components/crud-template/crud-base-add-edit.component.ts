import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CrudConfig } from './crud-config';
import { AddressSelectorComponent } from '../address-selector/address-selector.component';

@Injectable()
export abstract class CrudBaseAddEditComponent<T> {

    protected fb = inject(FormBuilder);
    protected snackBar = inject(MatSnackBar);
    protected router = inject(Router);
    protected translate = inject(TranslateService);
    protected activatedRoute = inject(ActivatedRoute);

    protected entityId: number | null = null;
    submitted = false;
    errorMessage = '';

    protected abstract form: FormGroup;
    protected abstract entityNameKey: string;
    protected abstract getSuccessRoute(): any[];
    protected abstract saveEntity(formData: T): Observable<T>;

    /** Override in edit components to load entity data by ID. */
    protected loadEntityData(_id: any): void { }

    /**
     * Builds a FormGroup from CrudConfig.form.fields, applying all declarative
     * validators (required, minLength, maxLength, min, max, pattern, plus raw validators[]).
     * Use this in add/edit components to avoid duplicating validation logic.
     */
    static buildFormFromConfig<T>(fb: FormBuilder, config: CrudConfig<T>): FormGroup {
        const controls: Record<string, any> = {};

        if (!config.form?.fields) {
            return fb.group({});
        }

        for (const field of config.form.fields) {
            const validators: any[] = [];

            if (field.required) validators.push(Validators.required);
            if (field.minLength != null) validators.push(Validators.minLength(field.minLength));
            if (field.maxLength != null) validators.push(Validators.maxLength(field.maxLength));
            if (field.min != null) validators.push(Validators.min(field.min));
            if (field.max != null) validators.push(Validators.max(field.max));
            if (field.pattern != null) validators.push(Validators.pattern(field.pattern as string));
            if (field.validators?.length) validators.push(...field.validators);

            const defaultValue = field.value !== undefined ? field.value : (field.type === 'number' ? null : '');
            
            if (field.type === 'address') {
                controls[field.name as string] = AddressSelectorComponent.buildAddressFormGroup(fb);
            } else {
                controls[field.name as string] = [
                    { value: defaultValue, disabled: field.disabled ?? false },
                    validators
                ];
            }
        }

        return fb.group(controls);
    }

    onSubmit(): void {
        this.submitted = true;
        this.errorMessage = '';

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.showErrorMessage('crud.validation_error');
            return;
        }

        const formData = this.form.getRawValue() as T;
        this.saveEntity(formData).subscribe({
            next: (response) => this.handleSuccess(response, 'crud.save_success'),
            error: (error) => this.handleError(error, 'crud.save_error')
        });
    }

    protected handleSuccess(response: T, messageKey: string): void {
        const entityName = this.translate.instant(this.entityNameKey);
        const itemName = (response as any).name || this.translate.instant('crud.default_item_name');

        this.snackBar.open(
            this.translate.instant(messageKey, { entity: entityName, name: itemName }),
            this.translate.instant('common.close'),
            { duration: 3000, panelClass: ['success-snackbar'] }
        );
        this.router.navigate(this.getSuccessRoute());
    }

    protected handleError(error: HttpErrorResponse, messageKey: string): void {
        this.submitted = false;
        console.error(`Error ${this.translate.instant(this.entityNameKey)}:`, error);

        const errorDetail = error.error?.message || error.message || '';
        const baseErrorMessage = this.translate.instant(messageKey, { entity: this.translate.instant(this.entityNameKey) });

        this.errorMessage = `${baseErrorMessage}${errorDetail ? ': ' + errorDetail : ''}`;
        this.snackBar.open(this.errorMessage, this.translate.instant('common.close'), {
            duration: 5000,
            panelClass: ['error-snackbar']
        });
    }

    protected showErrorMessage(translationKey: string, params?: any): void {
        this.snackBar.open(
            this.translate.instant(translationKey, params),
            this.translate.instant('common.close'),
            { duration: 3000 }
        );
    }

    getErrorMessage(controlName: string): string {
        const control = this.form.get(controlName);
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

    getControl(controlName: string): AbstractControl | null {
        return this.form.get(controlName);
    }

    resetForm(): void {
        this.form.reset();
    }
}
