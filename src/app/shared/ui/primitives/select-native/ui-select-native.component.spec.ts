import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSelectNativeComponent } from './ui-select-native.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UiFormFieldComponent } from '../../components/form-field/ui-form-field.component';
import { vi } from 'vitest';

describe('UiSelectNativeComponent', () => {
    let component: UiSelectNativeComponent;
    let fixture: ComponentFixture<UiSelectNativeComponent>;
    let selectEl: HTMLElement;

    const mockOptions = [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Carrot', value: 'carrot' }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiSelectNativeComponent, FormsModule, ReactiveFormsModule],
            providers: [
                { provide: UiFormFieldComponent, useValue: null }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UiSelectNativeComponent);
        component = fixture.componentInstance;
        component.options = mockOptions;
        fixture.detectChanges();

        const selectContainer = fixture.debugElement.query(By.css('.ui-select-native'));
        selectEl = selectContainer ? selectContainer.nativeElement : fixture.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('🧪 CVA Contract', () => {
        it('should write value via writeValue', () => {
            component.writeValue('banana');
            fixture.detectChanges();
            expect(component.selectedOption()?.value).toBe('banana');
            expect(component.empty()).toBe(false);
        });

        it('should handle null value in writeValue', () => {
            component.writeValue(null);
            fixture.detectChanges();
            expect(component.selectedOption()).toBeNull();
            expect(component.empty()).toBe(true);
        });

        it('should call onChange when selecting an option', () => {
            const onChangeSpy = vi.fn();
            component.registerOnChange(onChangeSpy);

            component.selectOption(mockOptions[0]);

            expect(onChangeSpy).toHaveBeenCalledWith('apple');
        });

        it('should disable the component via setDisabledState', () => {
            component.setDisabledState(true);
            fixture.detectChanges();
            expect(component.disabled).toBe(true);
        });
    });

    describe('🧪 Keyboard Navigation', () => {
        beforeEach(() => {
            component.open();
            fixture.detectChanges();
        });

        it('should navigate down on ArrowDown', () => {
            const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            component.handleKeyboard(downEvent);
            expect(component.focusedIndex()).toBe(0);

            component.handleKeyboard(downEvent);
            expect(component.focusedIndex()).toBe(1);
        });

        it('should navigate up on ArrowUp', () => {
            component.focusedIndex.set(1);
            const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            component.handleKeyboard(upEvent);
            expect(component.focusedIndex()).toBe(0);
        });

        it('should select option and close on Enter', () => {
            component.focusedIndex.set(1);
            const selectSpy = vi.spyOn(component, 'selectOption');

            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            component.handleKeyboard(enterEvent);

            expect(selectSpy).toHaveBeenCalledWith(mockOptions[1]);
            expect(component.isOpen()).toBe(false);
        });

        it('should close on Escape', () => {
            const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            component.handleKeyboard(escEvent);
            expect(component.isOpen()).toBe(false);
        });
    });

    describe('🧪 Search & Filtering', () => {
        it('should filter options based on searchTerm', () => {
            component.searchTerm.set('ba');
            fixture.detectChanges();

            const filtered = component.filteredOptions();
            expect(filtered.length).toBe(1);
            expect(filtered[0].label).toBe('Banana');
        });

        it('should return all options if searchTerm is empty', () => {
            component.searchTerm.set('');
            fixture.detectChanges();
            expect(component.filteredOptions().length).toBe(3);
        });
    });

    describe('🧪 Accessibility (ARIA)', () => {
        it('should bind ARIA attributes to the trigger', () => {
            component.ariaDescribedBy = 'hint-id';
            component.ariaInvalid = true;
            component.ariaRequired = true;
            fixture.detectChanges();

            const trigger = fixture.debugElement.query(By.css('.ui-select-native__trigger')).nativeElement;
            expect(trigger.getAttribute('aria-describedby')).toBe('hint-id');
            expect(trigger.getAttribute('aria-invalid')).toBe('true');
            expect(trigger.getAttribute('aria-required')).toBe('true');
        });

        it('should update aria-activedescendant when navigating', () => {
            component.open();
            component.focusedIndex.set(1);
            fixture.detectChanges();

            const trigger = fixture.debugElement.query(By.css('.ui-select-native__trigger')).nativeElement;
            expect(trigger.getAttribute('aria-activedescendant')).toBe(`${component.id}-opt-1`);
        });
    });

    describe('🧪 Signals & State', () => {
        it('should update focused signal on focus/blur', () => {
            component.onFocus();
            expect(component.focused()).toBe(true);

            component.isOpen.set(false);
            component.onBlur({ relatedTarget: null } as any);
            expect(component.focused()).toBe(false);
        });
    });
});
