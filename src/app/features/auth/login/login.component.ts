import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// PAL Components
import { UiButtonComponent } from '@shared/ui/button';
import { UiInputComponent } from '@shared/ui/input';
import { UiFormFieldComponent } from '@shared/ui/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    UiButtonComponent,
    UiInputComponent,
    UiFormFieldComponent
  ],
})
export class LoginComponent {
  private router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    if (this.loginForm.valid) {
      console.log('Login logic here', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
