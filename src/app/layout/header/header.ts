import { Component, EventEmitter, Output, inject, signal, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService, Language } from '../../core/services/language.service';
import { ThemeService } from '../../core/theme/theme.service';
import { SessionService } from '../../core/services/session.service';
import { Subscription } from 'rxjs';

// Material Components
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule
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
  private sessionService = inject(SessionService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private langSubscription?: Subscription;

  availableLanguages: Language[] = this.languageService.availableLanguages;
  isMobile = signal(window.innerWidth < 768);
  notificationCount = 3;
  userName = 'Usuario Demo';
  userRole = 'Administrador';

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth < 768);
    });

    this.langSubscription = this.translateService.onLangChange.subscribe(() => {
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
    this.languageService.setLanguage(langCode);
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
