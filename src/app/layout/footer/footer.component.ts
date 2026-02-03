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
      background: var(--ui-background-surface);
      border-top: 1px solid var(--ui-color-border-subtle);
      color: var(--ui-color-text-secondary);
      transition: background-color var(--ui-motion-fast);
      
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

    .copyright {
      font-size: var(--ui-font-size-sm);
      color: var(--ui-color-text-secondary);
      
      strong {
        color: var(--ui-color-primary);
        font-weight: var(--ui-font-weight-bold);
      }
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: var(--ui-space-lg);
      
      .footer-link {
        font-size: var(--ui-font-size-sm);
        color: var(--ui-color-text-secondary);
        text-decoration: none;
        transition: color var(--ui-motion-fast);
        
        &:hover {
          color: var(--ui-color-primary);
        }
      }

      .version {
        font-size: var(--ui-font-size-xs);
        color: var(--ui-color-text-muted);
        margin-left: var(--ui-space-sm);
        padding: 2px 8px;
        background: var(--ui-background-variant);
        border-radius: var(--ui-border-radius-sm);
        border: 1px solid var(--ui-color-border-subtle);
      }
    }
  `]
})
export class FooterComponent {
  private uiConfig = inject(UiConfigService);

  brandName = computed(() => this.uiConfig.brand() === 'school' ? 'Vitalia School' : 'Vitalia Health');
  currentYear = new Date().getFullYear();
}
