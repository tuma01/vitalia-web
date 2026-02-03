import { Injectable, signal, computed } from '@angular/core';

/**
 * Direcciones de lectura soportadas por el PAL
 */
export type UiDirection = 'ltr' | 'rtl';

/**
 * UiDirectionService
 * 
 * Orquestador reactivo de la dirección global de la plataforma.
 * Permite que todos los componentes PAL se adapten dinámicamente a 
 * contextos internacionales sin depender de lógica estática.
 */
@Injectable({
    providedIn: 'root'
})
export class UiDirectionService {
    /** Estado reactivo de la dirección */
    private _dir = signal<UiDirection>('ltr');

    /** Signal de sólo lectura para los consumidores */
    readonly dir = computed(() => this._dir());

    /**
     * Cambia la dirección global de la plataforma.
     */
    setDirection(direction: UiDirection): void {
        this._dir.set(direction);
        // Sincronizar con el atributo del documento para soporte de CSS Logical Properties nativo
        document.documentElement.setAttribute('dir', direction);
    }

    /**
     * Alterna entre LTR y RTL. Útil para testing y Storybook.
     */
    toggle(): void {
        this.setDirection(this._dir() === 'ltr' ? 'rtl' : 'ltr');
    }

    /**
     * Indica si la dirección actual es RTL.
     */
    isRtl = computed(() => this._dir() === 'rtl');
}
