import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { StatCardConfig } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat-card"
         [class.clickable]="data.route"
         [ngClass]="'bg-' + data.color"
         (click)="navigate()">

      <div class="icon-wrapper">
        <mat-icon>{{ data.icon }}</mat-icon>
      </div>

      <div class="content">
        <p class="label">{{ data.titleKey | translate }}</p>
        <h2 class="value">{{ data.value }}</h2>
      </div>

    </div>
  `,
  styles: [`
    :host {
        display: block;
        height: 100%;
    }

    .stat-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border-radius: 16px;
        cursor: default;
        transition: transform .15s ease, box-shadow .15s ease;
        background-color: var(--mat-sys-surface);
        border: 1px solid var(--mat-sys-outline-variant);

        &.clickable {
            cursor: pointer;
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
        }

        // Variantes de color sutiles (Containers M3)
        &.bg-primary-container {
            background-color: var(--mat-sys-primary-container);
            color: var(--mat-sys-on-primary-container);
            .icon-wrapper { background-color: rgba(255,255,255,0.4); }
            .label { color: var(--mat-sys-on-primary-container); opacity: 0.8; }
        }
        &.bg-secondary-container {
            background-color: var(--mat-sys-secondary-container);
            color: var(--mat-sys-on-secondary-container);
            .icon-wrapper { background-color: rgba(255,255,255,0.4); }
             .label { color: var(--mat-sys-on-secondary-container); opacity: 0.8; }
        }
        &.bg-tertiary-container {
            background-color: var(--mat-sys-tertiary-container);
            color: var(--mat-sys-on-tertiary-container);
            .icon-wrapper { background-color: rgba(255,255,255,0.4); }
             .label { color: var(--mat-sys-on-tertiary-container); opacity: 0.8; }
        }
        &.bg-error-container {
            background-color: var(--mat-sys-error-container);
            color: var(--mat-sys-on-error-container);
             .icon-wrapper { background-color: rgba(255,255,255,0.4); }
             .label { color: var(--mat-sys-on-error-container); opacity: 0.8; }
        }
    }

    .icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: var(--mat-sys-surface-container-high);
    }

    .label {
        margin: 0;
        font-size: 0.85rem;
        color: var(--mat-sys-on-surface-variant);
        font-weight: 500;
    }

    .value {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 1.2;
    }
  `]
})
export class StatCardComponent {
  @Input({ required: true }) data!: StatCardConfig;
  private router = inject(Router);

  navigate() {
    if (this.data.route) {
      this.router.navigate([this.data.route]);
    }
  }
}
