import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UiFormFieldComponent } from './ui-form-field.component';
import { UiInputComponent } from '../../primitives/input/ui-input.component';
import { UiConfigService } from '../../config/ui-config.service';
import { UiFormManagerService } from '../../services/ui-form-manager.service';
import { vi } from 'vitest';

// Mock component to test with content projection
@Component({
    standalone: true,
    imports: [UiFormFieldComponent, UiInputComponent, FormsModule],
    template: `
        <ui-form-field [label]="label" [hint]="hint" [error]="error" [required]="required">
            <ui-input [id]="inputId" [(ngModel)]="value"></ui-input>
        </ui-form-field>
    `
})
class TestHostComponent {
    label = 'Test Label';
    hint = 'Test Hint';
    error: string | null = null;
    required = false;
    inputId = 'test-input-id';
    value = '';
}

describe('UiFormFieldComponent', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let formField: UiFormFieldComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent, CommonModule],
            providers: [
                {
                    provide: UiConfigService,
                    useValue: {
                        inputAppearance: () => 'outline'
                    }
                },
                UiFormManagerService
            ]
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostComponent);
        hostComponent = hostFixture.componentInstance;

        const formFieldDebug = hostFixture.debugElement.query(By.directive(UiFormFieldComponent));
        formField = formFieldDebug.componentInstance;

        hostFixture.detectChanges();
    });

    it('should create', () => {
        expect(formField).toBeTruthy();
    });

    describe('🧪 Fused Accessibility (ARIA)', () => {
        it('should sync fieldId with child input id', () => {
            expect(formField.fieldId()).toBe(hostComponent.inputId);
        });

        it('should propagate aria-required to the child primitive', async () => {
            hostComponent.required = true;
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            hostFixture.detectChanges();

            const inputComp = hostFixture.debugElement.query(By.directive(UiInputComponent)).componentInstance;
            expect(inputComp.ariaRequired).toBe(true);
        });

        it('should propagate aria-invalid when an error is present', async () => {
            hostComponent.error = 'Required field';
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            hostFixture.detectChanges();

            const inputComp = hostFixture.debugElement.query(By.directive(UiInputComponent)).componentInstance;
            expect(inputComp.ariaInvalid).toBe(true);
        });

        it('should propagate label as aria-label if child has none', async () => {
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            hostFixture.detectChanges();

            const inputComp = hostFixture.debugElement.query(By.directive(UiInputComponent)).componentInstance;
            expect(inputComp.ariaLabel).toBe(hostComponent.label);
        });

        it('should set aria-describedby to hint when no error is present', async () => {
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            hostFixture.detectChanges();

            const inputComp = hostFixture.debugElement.query(By.directive(UiInputComponent)).componentInstance;
            expect(inputComp.ariaDescribedBy).toBe(`${hostComponent.inputId}-hint`);
        });

        it('should set aria-describedby to error when error is present (priority over hint)', async () => {
            hostComponent.error = 'Ouch!';
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            hostFixture.detectChanges();

            const inputComp = hostFixture.debugElement.query(By.directive(UiInputComponent)).componentInstance;
            expect(inputComp.ariaDescribedBy).toBe(`${hostComponent.inputId}-error`);
        });
    });

    describe('🧪 State Synchronization (Signals)', () => {
        it('should reflect focus state from child', async () => {
            const inputComp = hostFixture.debugElement.query(By.directive(UiInputComponent)).componentInstance;

            // Simulating focus on the primitive
            inputComp.focused.set(true);
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            hostFixture.detectChanges();

            expect(formField.isFocused()).toBe(true);
        });

        it('should reflect value state from child (hasValue)', async () => {
            const inputComp = hostFixture.debugElement.query(By.directive(UiInputComponent)).componentInstance;

            // Simulating non-empty state
            inputComp.empty.set(false);
            hostFixture.detectChanges();
            await hostFixture.whenStable();
            hostFixture.detectChanges();

            expect(formField.hasValue()).toBe(true);
        });

        it('should expose a reactive state signal for the Behavior Engine', () => {
            expect(formField.state().invalid).toBe(false);
            expect(formField.state().severity).toBe('info');

            hostComponent.error = 'Critical Error';
            hostFixture.detectChanges();

            expect(formField.state().invalid).toBe(true);
            expect(formField.state().severity).toBe('error');
        });
    });

    describe('🧪 Focus Delegation', () => {
        it('should delegate focus() call to child primitive', () => {
            const inputComp = hostFixture.debugElement.query(By.directive(UiInputComponent)).componentInstance;
            const focusSpy = vi.spyOn(inputComp as any, 'focus');

            formField.focus();

            expect(focusSpy).toHaveBeenCalled();
        });

        it('should focus child when host is clicked', () => {
            const inputComp = hostFixture.debugElement.query(By.directive(UiInputComponent)).componentInstance;
            const focusClickSpy = vi.spyOn(inputComp as any, 'focus');

            const hostElement = hostFixture.debugElement.query(By.css('.ui-form-field-host')).nativeElement;
            hostElement.click();

            expect(focusClickSpy).toHaveBeenCalled();
        });
    });
});
