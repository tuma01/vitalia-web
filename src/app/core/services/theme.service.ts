import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface Theme {
    name: string;
    className: string;
    displayName: string;
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'vitalia-theme';

    // Available themes matching files in src/assets/themes
    availableThemes: Theme[] = [
        { name: 'light-theme', className: 'light-theme', displayName: 'Light Mode' },
        { name: 'dark-theme', className: 'dark-theme', displayName: 'Dark Mode' },
        { name: 'indigo-pink', className: 'indigo-pink', displayName: 'Indigo & Pink' },
        { name: 'deeppurple-amber', className: 'deeppurple-amber', displayName: 'Deep Purple & Amber' },
        { name: 'pink-bluegrey', className: 'pink-bluegrey', displayName: 'Pink & Blue-Grey' },
        { name: 'purple-green', className: 'purple-green', displayName: 'Purple & Green' }
    ];

    constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object) { }

    initTheme(): void {
        if (isPlatformBrowser(this.platformId)) {
            const savedTheme = localStorage.getItem(this.THEME_KEY);
            if (savedTheme) {
                this.setTheme(savedTheme);
            }
        }
    }

    private themeChangeSubject = new BehaviorSubject<string>(this.getCurrentTheme());
    themeChange$ = this.themeChangeSubject.asObservable();

    setTheme(themeName: string): void {
        const theme = this.availableThemes.find(t => t.className === themeName);
        if (!theme) return;

        if (isPlatformBrowser(this.platformId)) {
            const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

            if (themeLink) {
                themeLink.href = `assets/themes/${themeName}.css`;
                localStorage.setItem(this.THEME_KEY, themeName);
                this.themeChangeSubject.next(themeName);

                // CRITICAL: Add body class to track theme type for header styling
                const body = this.document.body;
                body.classList.remove('theme-light', 'theme-dark', 'theme-colored');

                if (themeName === 'light-theme') {
                    body.classList.add('theme-light');
                    console.log('Applied theme-light class');
                } else if (themeName === 'dark-theme') {
                    body.classList.add('theme-dark');
                    console.log('Applied theme-dark class');
                } else {
                    body.classList.add('theme-colored');
                    console.log('Applied theme-colored class for:', themeName);
                }
            }
        }
    }

    getCurrentTheme(): string {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.THEME_KEY) || 'indigo-pink';
        }
        return 'indigo-pink';
    }
}
