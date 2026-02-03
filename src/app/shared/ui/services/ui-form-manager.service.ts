import { Injectable } from '@angular/core';
import { UiFormElement } from './ui-form-manager.types';

/**
 * UiFormManagerService
 * 
 * El "UX Behavior Engine" del PAL. 
 * Ya no solo busca errores; resuelve el foco basándose en el estado reactivo 
 * de los nodos (Signals) y reglas declarativas de comportamiento.
 */
@Injectable({
    providedIn: 'root'
})
export class UiFormManagerService {
    /** Registro de nodos activos en el formulario */
    private registry = new Map<string, UiFormElement>();

    /** 
     * Registra un nodo en el motor de comportamiento.
     */
    register(id: string, element: UiFormElement): void {
        this.registry.set(id, element);
    }

    /**
     * Elimina un nodo del registro.
     */
    unregister(id: string): void {
        this.registry.delete(id);
    }

    /**
     * Expone todos los elementos registrados para que motores externos (Feature Layer)
     * puedan aplicar sus propias reglas de resolución UX.
     */
    getElements(): UiFormElement[] {
        return Array.from(this.registry.values());
    }

    /**
     * Helper Técnico: Ejecuta el efecto visual de navegación (scroll + foco).
     * El PAL sabe CÓMO navegar, pero no decide A DÓNDE.
     */
    navigateToNode(node: UiFormElement): void {
        node.getElementRef().nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Delay para permitir que el scroll termine suavemente antes del foco
        setTimeout(() => {
            node.focus();
        }, 300);
    }

    /**
     * Resuelve el foco basado en una regla de negocio.
     */
    resolveFocus(rule: import('./ui-form-manager.types').UiFocusRule): void {
        const elements = this.getElements();

        if (rule === 'FIRST_INVALID') {
            const firstInvalid = elements.find(el => el.state().invalid);
            if (firstInvalid) this.navigateToNode(firstInvalid);
        }
        else if (rule === 'HIGHEST_SEVERITY') {
            // Prioridad: error > warning > info
            const priorityMap: Record<string, number> = { error: 3, warning: 2, info: 1 };

            const critical = elements
                .filter(el => el.state().invalid)
                .sort((a, b) => {
                    const sevA = priorityMap[a.state().severity] || 0;
                    const sevB = priorityMap[b.state().severity] || 0;
                    return sevB - sevA; // Descending
                })[0];

            if (critical) this.navigateToNode(critical);
        }
    }
}
