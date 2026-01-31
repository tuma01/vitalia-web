import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiConfigService } from '../../shared/ui/config/ui-config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <span class="copyright">
          &copy; {{ currentYear }} <strong>{{ brandName() }}</strong>. All rights reserved.
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
      margin-top: auto; // Push to bottom if flex container
    }

    .app-footer {
      padding: var(--ui-space-md) var(--ui-space-xl);
      // Light Mode: Neutral gray (darker than body #f4f6f8)
      background: #e5e5e5; 
      border-top: 1px solid var(--ui-color-border-subtle);
      transition: background-color 0.3s ease;
      
      .footer-content {
        max-width: 1600px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--ui-space-md);
      }

      @media (max-width: 768px) {
        .footer-content {
          flex-direction: column;
          text-align: center;
        }
      }
    }

    // Explicit Dark Mode Override using :host-context for encapsulation safety
    :host-context(.theme-dark) .app-footer {
        background-color: #1e1e1e !important; // VS Code Editor Background (Standard Dark)
        border-top-color: #2b2b2b !important; // Subtle Border
        color: #cccccc !important; // Lighter text
    }

    .copyright {
      font-size: 0.875rem;
      color: var(--ui-color-text-secondary);
      
      strong {
        color: var(--ui-color-primary);
      }
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: var(--ui-space-lg);
      
      .footer-link {
        font-size: 0.875rem;
        color: var(--ui-color-text-secondary);
        text-decoration: none;
        transition: color 0.2s;
        
        &:hover {
          color: var(--ui-color-primary);
        }
      }

      .version {
        font-size: 0.75rem;
        color: var(--ui-color-text-tertiary);
        margin-left: var(--ui-space-sm);
        padding: 2px 6px;
        background: var(--ui-background-default);
        border-radius: 4px;
      }
    }
  `]
})
export class FooterComponent {
  private uiConfig = inject(UiConfigService);

  brandName = computed(() => this.uiConfig.brand() === 'school' ? 'Vitalia School' : 'Vitalia Health');
  currentYear = new Date().getFullYear();
}
