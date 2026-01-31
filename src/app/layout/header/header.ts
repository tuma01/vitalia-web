import { Component, EventEmitter, Output, inject, signal, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu'; // Keeping for Dropdown Logic
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService, Language } from '../../core/services/language.service';
import { ThemeService, Theme } from '../../core/services/theme.service';
import { SessionService } from '../../core/services/session.service';
import { Subscription } from 'rxjs';
import { UiBadgeComponent, UiToolbarComponent, UiIconButtonComponent } from '@ui';
import { UiIconComponent } from '../../shared/ui/primitives/icon/ui-icon.component'; // PAL Icon

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    MatMenuModule,
    MatDividerModule,
    TranslateModule,
    UiBadgeComponent,
    UiToolbarComponent,
    UiIconButtonComponent,
    UiIconComponent
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnDestroy {
  @Output() toggleSidebarFn = new EventEmitter<void>();
  @Output() toggleSettingsFn = new EventEmitter<void>();

  private languageService = inject(LanguageService);
  private themeService = inject(ThemeService);
  private translateService = inject(TranslateService);
  private sessionService = inject(SessionService); // Injected SessionService
  private router = inject(Router); // Injected Router
  private cdr = inject(ChangeDetectorRef);
  private langSubscription?: Subscription;

  // Language
  availableLanguages: Language[] = this.languageService.availableLanguages;



  // Search
  searchQuery = '';
  isMobile = signal(window.innerWidth < 768);

  // Notifications (mock data)
  notificationCount = 3;

  // User info (mock data - will be replaced with auth service)
  userName = 'Usuario Demo';
  userRole = 'Administrador';

  constructor() {
    // Listen for window resize
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth < 768);
    });

    // Subscribe to language changes to force view update
    this.langSubscription = this.translateService.onLangChange.subscribe(() => {
      console.log('[Header] Language changed, triggering change detection');
      this.cdr.markForCheck();
    });

    // Subscribe to theme changes
    this.themeService.themeChange$.subscribe(() => {
      console.log('[Header] Theme changed, triggering view update');
      // Force update for styles
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  toggleSidebar(): void {
    this.toggleSidebarFn.emit();
  }

  switchLanguage(langCode: string): void {
    console.log('[Header] Switching language to:', langCode);
    this.languageService.setLanguage(langCode);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // TODO: Implement search functionality
    }
  }

  openSettings(): void {
    this.toggleSettingsFn.emit();
  }

  logout(): void {
    const isSuperAdmin = this.sessionService.hasRole('ROLE_SUPER_ADMIN');
    this.sessionService.logout();

    if (isSuperAdmin) {
      this.router.navigate(['/super-admin/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
