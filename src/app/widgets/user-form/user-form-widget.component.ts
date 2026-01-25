import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
    UiFormFieldComponent,
    UiInputComponent,
    UiSelectComponent,
    UiButtonComponent,
    UiErrorDirective,
    UiPrefixDirective,
    UiSuffixDirective,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardContentComponent,
    UiCardFooterComponent,
    UiCheckboxComponent,
    UiDialogService
} from '@ui';

@Component({
    selector: 'app-user-form-widget',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        UiFormFieldComponent,
        UiInputComponent,
        UiSelectComponent,
        UiButtonComponent,
        UiPrefixDirective,
        UiSuffixDirective,
        UiErrorDirective,
        UiCardComponent,
        UiCardHeaderComponent,
        UiCardContentComponent,
        UiCardFooterComponent,
        UiCheckboxComponent
    ],
    templateUrl: './user-form-widget.component.html',
    styleUrls: ['./user-form-widget.component.scss'],
})
export class UserFormWidgetComponent {
    form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        role: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        active: new FormControl(true),
        terms: new FormControl(false, Validators.requiredTrue)
    });

    showPassword = false;

    roleOptions = [
        { value: 'ADMIN', label: 'Admin', icon: 'admin_panel_settings' },
        { value: 'USER', label: 'User', icon: 'person' },
        { value: 'GUEST', label: 'Guest', icon: 'perm_identity' }
    ];

    constructor(private dialogService: UiDialogService) { }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    onSubmit() {
        if (this.form.valid) {
            this.dialogService.confirm({
                title: 'Crear Usuario',
                message: '¿Estás seguro que deseas crear este usuario?',
                confirmText: 'Crear Usuario',
                icon: 'person_add'
            }).subscribe((confirmed: boolean) => {
                if (confirmed) {
                    console.log('User Form Value:', this.form.value);
                    this.dialogService.alert({
                        title: 'Éxito',
                        message: 'Usuario creado correctamente',
                        icon: 'check_circle'
                    });
                    this.form.reset({ active: true }); // Keep default
                }
            });
        } else {
            this.form.markAllAsTouched();
        }
    }

    onReset() {
        if (this.form.dirty) {
            this.dialogService.confirm({
                title: 'Descartar cambios',
                message: '¿Estás seguro? Se perderán los datos ingresados.',
                confirmText: 'Descartar',
                confirmColor: 'danger',
                icon: 'delete_sweep'
            }).subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.form.reset({ active: true });
                }
            });
        } else {
            this.form.reset({ active: true });
        }
    }
}
