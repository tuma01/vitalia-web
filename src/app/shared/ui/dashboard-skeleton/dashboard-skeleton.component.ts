import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="skeleton-container">
      <header class="skeleton-header">
        <div class="line title"></div>
        <div class="line subtitle"></div>
      </header>

      <div class="skeleton-grid stats">
        <div class="skeleton-card stat" *ngFor="let i of [1,2,3,4]"></div>
      </div>

      <div class="skeleton-grid content">
        <div class="skeleton-card activity"></div>
        <div class="skeleton-card actions"></div>
      </div>
    </div>
  `,
    styles: [`
    .skeleton-container {
      padding: 1.5rem 0;
      animation: fadeIn 0.3s ease-out;
    }

    .skeleton-header {
      margin-bottom: 2rem;
    }

    .line {
      background: var(--mat-sys-surface-container-high);
      border-radius: 4px;
      position: relative;
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.05),
          transparent
        );
        animation: shimmer 1.5s infinite;
      }
    }

    .title { width: 200px; height: 2rem; margin-bottom: 0.5rem; }
    .subtitle { width: 300px; height: 1rem; }

    .skeleton-grid {
      display: grid;
      gap: 1.5rem;
      margin-bottom: 2rem;

      &.stats {
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      }

      &.content {
        grid-template-columns: 1.5fr 1fr;
        @media (max-width: 1024px) {
          grid-template-columns: 1fr;
        }
      }
    }

    .skeleton-card {
      background: var(--mat-sys-surface-container-high);
      border-radius: 12px;
      height: 100px;
      position: relative;
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.05),
          transparent
        );
        animation: shimmer 1.5s infinite;
      }

      &.activity { height: 400px; }
      &.actions { height: 250px; }
    }

    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton-card::after,
      .line::after {
        animation: none;
      }
    }
  `]
})
export class DashboardSkeletonComponent { }
