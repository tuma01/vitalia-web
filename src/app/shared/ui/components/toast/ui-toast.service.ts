import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef, GlobalPositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { UiToastComponent } from './ui-toast.component';
import { UiToastConfig, UiToastPosition } from './ui-toast.types';

@Injectable({
    providedIn: 'root'
})
export class UiToastService {
    private overlays = new Map<UiToastPosition, OverlayRef>();

    constructor(private overlay: Overlay, private injector: Injector) { }

    /** Display a success toast */
    success(message: string, title?: string, config?: Partial<UiToastConfig>) {
        this.show({ ...config, type: 'success', message, title });
    }

    /** Display an error toast */
    error(message: string, title?: string, config?: Partial<UiToastConfig>) {
        this.show({ ...config, type: 'error', message, title });
    }

    /** Display an info toast */
    info(message: string, title?: string, config?: Partial<UiToastConfig>) {
        this.show({ ...config, type: 'info', message, title });
    }

    /** Display a warning toast */
    warning(message: string, title?: string, config?: Partial<UiToastConfig>) {
        this.show({ ...config, type: 'warning', message, title });
    }

    /** Core method to show a toast */
    show(config: UiToastConfig): void {
        const position = config.position || 'top-right';
        const overlayRef = this.getOverlayRef(position);

        const componentRef = overlayRef.attach(new ComponentPortal(UiToastComponent, null, this.injector));
        componentRef.instance.config = config;

        componentRef.instance.closed.subscribe(() => {
            this.removeToast(overlayRef, componentRef);
        });
    }

    private getOverlayRef(position: UiToastPosition): OverlayRef {
        if (this.overlays.has(position)) {
            return this.overlays.get(position)!;
        }

        const positionStrategy = this.createPositionStrategy(position);
        const overlayRef = this.overlay.create({
            positionStrategy,
            panelClass: 'ui-toast-container'
        });

        this.overlays.set(position, overlayRef);
        return overlayRef;
    }

    private createPositionStrategy(position: UiToastPosition): GlobalPositionStrategy {
        const strategy = this.overlay.position().global();

        if (position.includes('top')) strategy.top('20px');
        if (position.includes('bottom')) strategy.bottom('20px');
        if (position.includes('left')) strategy.left('20px');
        if (position.includes('right')) strategy.right('20px');
        if (position.includes('center')) strategy.centerHorizontally();

        return strategy;
    }

    private removeToast(overlayRef: OverlayRef, componentRef: ComponentRef<UiToastComponent>): void {
        componentRef.destroy();
        if (overlayRef.hasAttached() === false) {
            // Logic to clean up overlay if empty (optional, depending on UX for stacking)
        }
    }
}
