import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { LanguageService } from './core/services/language.service';
import { PreloaderService } from '@core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('vitalia-web');
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private readonly preloader = inject(PreloaderService);

  ngOnInit(): void {
    // Inicializar tema
    this.themeService.initTheme();

    this.languageService; // LanguageService se inicializa al inyectarse

    // Ocultar el preloader global
    this.preloader.hide();
  }
}
