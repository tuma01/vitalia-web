import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="error-container">
      <mat-icon [color]="color" class="error-icon">{{ icon }}</mat-icon>
      <h1>{{ code }}</h1>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <button mat-raised-button color="primary" (click)="goBack()">
        <mat-icon>home</mat-icon> Volver al Inicio
      </button>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      background-color: var(--mdc-theme-background, #fafafa);
    }
    .error-icon {
      font-size: 96px;
      width: 96px;
      height: 96px;
      margin-bottom: 24px;
    }
    h1 { font-size: 72px; font-weight: 300; margin: 0; color: var(--mdc-theme-text-primary-on-background, #333); }
    h2 { font-size: 24px; margin: 0 0 16px 0; color: var(--mdc-theme-text-secondary-on-background, #666); }
    p { font-size: 16px; margin-bottom: 32px; color: var(--mdc-theme-text-secondary-on-background, #666); max-width: 500px; }
  `]
})
export class ErrorPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  code = 'Error';
  icon = 'error_outline';
  title = 'Ha ocurrido un error';
  message = 'Ocurrió un problema inesperado.';
  color = 'warn';

  constructor() {
    this.route.data.subscribe(data => {
      if (data['code']) this.code = data['code'];
      if (data['icon']) this.icon = data['icon'];
      if (data['title']) this.title = data['title'];
      if (data['message']) this.message = data['message'];
      if (data['color']) this.color = data['color'];
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
