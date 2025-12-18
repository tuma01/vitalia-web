import { Component, OnInit, inject, signal, afterNextRender } from '@angular/core';
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

  constructor() {
    // Use afterNextRender to avoid forcing reflow before initial paint
    afterNextRender(() => {
      this.themeService.initTheme();

      // LanguageService se inicializa al inyectarse; acceder a él asegura que no sea tree-shaken
      this.languageService;

      // Ocultar el preloader global DESPUÉS del primer render para evitar reflows masivos
      this.preloader.hide();
    });
  }

  ngOnInit(): void {
  }
}
