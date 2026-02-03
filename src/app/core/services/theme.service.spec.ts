/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ThemeService } from './theme.service';
import { DOCUMENT } from '@angular/common';
import { TenantThemeOverrides } from './ui-theme.types';
import { PAL_DEFAULT_THEME } from './ui-theme.constants';

// Inicialización segura del entorno de pruebas
const testBed = getTestBed();
if (!testBed.platform) {
    testBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
}

describe('UiThemeService Overrides (v2.7)', () => {
    let service: ThemeService;
    let doc: Document;

    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [ThemeService]
        });

        service = TestBed.inject(ThemeService);
        doc = TestBed.inject(DOCUMENT);

        // Limpiar DOM
        doc.documentElement.style.cssText = '';
        doc.documentElement.removeAttribute('data-theme');
        doc.documentElement.removeAttribute('data-mode');
        doc.body.className = '';
        localStorage.clear();

        // Sincronizar estado inicial
        TestBed.flushEffects();
    });

    it('should initialize with Vitalia brand by default', () => {
        service.initTheme();
        TestBed.flushEffects();

        expect(service.theme().meta.brand).toBe('Vitalia');
        expect(service.mode()).toBe('light');
        expect(doc.documentElement.getAttribute('data-mode')).toBe('light');
    });

    it('should apply tenant overrides on top of brand identity', () => {
        const overrides: TenantThemeOverrides = {
            primaryColor: '#FF5733',
            fontFamily: 'Verdana',
            themeMode: 'dark'
        };

        service.applyTenantTheme('vitalia', overrides);
        TestBed.flushEffects();

        expect(service.theme().meta.brand).toBe('vitalia');
        expect(service.mode()).toBe('dark');
        expect(service.theme().typography.fontFamily.base).toBe('Verdana');

        const root = doc.documentElement;
        expect(root.style.getPropertyValue('--ui-color-action-primary')).toBe('#FF5733');
        expect(root.style.getPropertyValue('--ui-color-action-primary-rgb')).toBe('255, 87, 51');
    });

    it('should preserve PAL DNA structure when using partial overrides', () => {
        service.applyTenantTheme('school', {
            secondaryColor: '#FF00FF'
        });
        TestBed.flushEffects();

        expect(service.theme().spacing.unit).toBe(PAL_DEFAULT_THEME.spacing.unit);
        expect(doc.documentElement.style.getPropertyValue('--ui-spacing-unit')).toBe(String(PAL_DEFAULT_THEME.spacing.unit));
    });

    it('should map extended palette colors correctly', () => {
        service.applyTenantTheme('vitalia', {
            linkColor: '#00FF00',
            accentColor: '#0000FF',
            warnColor: '#FFFF00'
        });
        TestBed.flushEffects();

        const root = doc.documentElement;
        expect(root.style.getPropertyValue('--ui-color-text-link')).toBe('#00FF00');
        expect(root.style.getPropertyValue('--ui-color-action-accent')).toBe('#0000FF');
        expect(root.style.getPropertyValue('--ui-color-action-error')).toBe('#FFFF00');
    });

    it('should persist and recover configuration from localStorage', () => {
        service.applyTenantTheme('vitalia', { primaryColor: '#ABCDEF' });
        TestBed.flushEffects();

        const backupService = TestBed.inject(ThemeService);
        backupService.initTheme();
        TestBed.flushEffects();

        expect(backupService.theme().color.action.primary).toBe('#ABCDEF');
    });

    it('should support custom CSS string injection', () => {
        const css = 'body { overflow: hidden; }';
        service.applyTenantTheme('vitalia', { customCss: css });
        TestBed.flushEffects();

        expect(service.theme().customCss).toBe(css);
    });
});
