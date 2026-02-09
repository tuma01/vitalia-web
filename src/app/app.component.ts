import { Component, OnInit, inject, signal, afterNextRender, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme/theme.service';
import { LanguageService } from './core/services/language.service';
import { PreloaderService } from '@core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @HostBinding('attr.lang') get lang() { return this.languageService.currentLanguage(); }

  protected readonly title = signal('vitalia-web');
  private themeService = inject(ThemeService);
  private languageService = inject(LanguageService);
  private readonly preloader = inject(PreloaderService);

  constructor() {
    afterNextRender(() => {
      // 🚀 Inicializar sistema de temas (carga desde localStorage o default)
      this.themeService.initTheme();

      // Asegurar que el servicio de lenguaje esté activo
      this.languageService.currentLanguage();

      // Ocultar preloader
      this.preloader.hide();
    });
  }

  ngOnInit(): void {
  }
}
