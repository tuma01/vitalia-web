import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <span class="copyright">
          &copy; {{ currentYear }} Vitalia Health All rights reserved.
        </span>
        
        <div class="footer-links">
          <a href="#" class="footer-link">Support</a>
          <a href="#" class="footer-link">Privacy</a>
          <a href="#" class="footer-link">Terms</a>
          <span class="version">v1.2.0</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      margin-top: auto;
    }

    .app-footer {
      padding: 1rem 2rem;
      background: var(--mat-sys-surface, #ffffff);
      border-top: 1px solid var(--mat-sys-outline-variant, #e2e8f0);
      color: var(--mat-sys-outline);
      
      .footer-content {
        max-width: 1600px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      @media (max-width: 768px) {
        .footer-content {
          flex-direction: column;
          text-align: center;
        }
      }
    }

    .copyright {
      font-size: 0.875rem;
      
      strong {
        color: var(--mat-sys-primary);
        font-weight: 600;
      }
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      
      .footer-link {
        font-size: 0.875rem;
        color: var(--mat-sys-outline);
        text-decoration: none;
        &:hover {
          color: var(--mat-sys-primary);
        }
      }

      .version {
        font-size: 0.75rem;
        color: var(--mat-sys-outline);
        opacity: 0.8;
        padding: 2px 8px;
        background: var(--mat-sys-surface-variant);
        border-radius: 4px;
      }
    }
  `]
})
export class FooterComponent {
  private themeService = inject(ThemeService);
  currentYear = new Date().getFullYear();
}
