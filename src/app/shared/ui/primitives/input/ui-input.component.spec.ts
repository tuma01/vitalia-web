import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiInputComponent } from './ui-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('UiInputComponent', () => {
    let component: UiInputComponent;
    let fixture: ComponentFixture<UiInputComponent>;
    let inputEl: HTMLInputElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiInputComponent, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(UiInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('🧪 CVA Contract', () => {
        it('should write value via writeValue', () => {
            component.writeValue('hello');
            fixture.detectChanges();
            expect(inputEl.value).toBe('hello');
            expect(component.empty()).toBe(false);
        });

        it('should handle null value in writeValue', () => {
            component.writeValue(null);
            fixture.detectChanges();
            expect(inputEl.value).toBe('');
            expect(component.empty()).toBe(true);
        });

        it('should call onChange when typing', () => {
            const onChangeSpy = vi.fn();
            component.registerOnChange(onChangeSpy);

            inputEl.value = 'test';
            inputEl.dispatchEvent(new Event('input'));

            expect(onChangeSpy).toHaveBeenCalledWith('test');
        });

        it('should call onTouched on blur', () => {
            const onTouchedSpy = vi.fn();
            component.registerOnTouched(onTouchedSpy);

            inputEl.dispatchEvent(new Event('blur'));

            expect(onTouchedSpy).toHaveBeenCalled();
        });

        it('should update disabled state via setDisabledState', () => {
            component.setDisabledState(true);
            fixture.detectChanges();

            expect(component.disabled).toBe(true);
            expect(inputEl.disabled).toBe(true);

            component.setDisabledState(false);
            fixture.detectChanges();

            expect(component.disabled).toBe(false);
            expect(inputEl.disabled).toBe(false);
        });
    });

    describe('🧪 Signals', () => {
        it('should update focused signal on focus/blur', () => {
            inputEl.dispatchEvent(new Event('focus'));
            expect(component.focused()).toBe(true);

            inputEl.dispatchEvent(new Event('blur'));
            expect(component.focused()).toBe(false);
        });

        it('should update empty signal based on value', () => {
            inputEl.value = 'abc';
            inputEl.dispatchEvent(new Event('input'));
            expect(component.empty()).toBe(false);

            inputEl.value = '';
            inputEl.dispatchEvent(new Event('input'));
            expect(component.empty()).toBe(true);
        });
    });

    describe('🧪 ARIA Bindings', () => {
        it('should bind all accessibility attributes correctly', () => {
            component.ariaDescribedBy = 'hint-id';
            component.ariaInvalid = true;
            component.ariaRequired = true;
            component.ariaLabel = 'User Email';
            fixture.detectChanges();

            expect(inputEl.getAttribute('aria-describedby')).toBe('hint-id');
            expect(inputEl.getAttribute('aria-invalid')).toBe('true');
            expect(inputEl.getAttribute('aria-required')).toBe('true');
            expect(inputEl.getAttribute('aria-label')).toBe('User Email');
        });
    });

    describe('🧪 Host Classes (Geometric Contract)', () => {
        it('should apply size classes correctly', () => {
            component.size = 'sm';
            fixture.detectChanges();
            expect(fixture.nativeElement.classList).toContain('ui-input-host--sm');

            component.size = 'lg';
            fixture.detectChanges();
            expect(fixture.nativeElement.classList).toContain('ui-input-host--lg');
        });
    });
});
