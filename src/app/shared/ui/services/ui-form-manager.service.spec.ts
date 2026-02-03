import { TestBed } from '@angular/core/testing';
import { UiFormManagerService } from './ui-form-manager.service';
import { UiFormElement, UiFormElementState } from './ui-form-manager.types';
import { ElementRef, signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

class MockFormElement implements UiFormElement {
    state = signal<UiFormElementState>({
        invalid: false,
        touched: false,
        severity: 'info'
    });

    nativeElement = {
        getBoundingClientRect: () => ({ top: this.top, left: 0 } as DOMRect),
        scrollIntoView: vi.fn()
    };

    elementRef = new ElementRef(this.nativeElement);

    constructor(public id: string, private top: number) { }

    focus = vi.fn();
    getElementRef() { return this.elementRef; }
}

describe('UiFormManagerService (Capability Registry)', () => {
    let service: UiFormManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UiFormManagerService);
    });

    it('should register and expose elements for external engines', () => {
        const nodeA = new MockFormElement('A', 500);
        const nodeB = new MockFormElement('B', 100);

        service.register('A', nodeA);
        service.register('B', nodeB);

        const elements = service.getElements();
        expect(elements).toContain(nodeA);
        expect(elements).toContain(nodeB);
        expect(elements.length).toBe(2);
    });

    it('should execute technical navigation mechanics (scroll + focus)', async () => {
        const node = new MockFormElement('Target', 200);
        vi.useFakeTimers();

        service.navigateToNode(node);

        expect(node.nativeElement.scrollIntoView).toHaveBeenCalledWith({
            behavior: 'smooth',
            block: 'center'
        });

        // El foco debe ejecutarse tras el timeout técnico del PAL
        vi.advanceTimersByTime(300);
        expect(node.focus).toHaveBeenCalled();

        vi.useRealTimers();
    });

    it('should clean up the registry on unregister', () => {
        const node = new MockFormElement('Tmp', 0);
        service.register('Tmp', node);
        expect(service.getElements().length).toBe(1);

        service.unregister('Tmp');
        expect(service.getElements().length).toBe(0);
    });
});
