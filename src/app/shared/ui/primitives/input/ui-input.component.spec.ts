import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiInputComponent } from './ui-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

describe('UiInputComponent', () => {
    let component: UiInputComponent;
    let fixture: ComponentFixture<UiInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UiInputComponent, ReactiveFormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(UiInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Host Classes', () => {
        it('should apply ui-input class', () => {
            const element = fixture.nativeElement;
            expect(element.classList.contains('ui-input')).toBe(true);
        });

        it('should apply sm size class', () => {
            component.size = 'sm';
            fixture.detectChanges();

            const element = fixture.nativeElement;
            expect(element.classList.contains('ui-input--sm')).toBe(true);
        });

        it('should apply md size class by default', () => {
            const element = fixture.nativeElement;
            expect(element.classList.contains('ui-input--md')).toBe(true);
        });

        it('should apply lg size class', () => {
            component.size = 'lg';
            fixture.detectChanges();

            const element = fixture.nativeElement;
            expect(element.classList.contains('ui-input--lg')).toBe(true);
        });

        it('should apply disabled class when disabled', () => {
            component.disabled = true;
            fixture.detectChanges();

            const element = fixture.nativeElement;
            expect(element.classList.contains('ui-input--disabled')).toBe(true);
        });

        it('should apply readonly class when readonly', () => {
            component.readonly = true;
            fixture.detectChanges();

            const element = fixture.nativeElement;
            expect(element.classList.contains('ui-input--readonly')).toBe(true);
        });
    });

    describe('Input Types', () => {
        it('should have text type by default', () => {
            const input = fixture.nativeElement.querySelector('input');
            expect(input.type).toBe('text');
        });

        it('should apply email type', () => {
            component.type = 'email';
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('input');
            expect(input.type).toBe('email');
        });

        it('should apply password type', () => {
            component.type = 'password';
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('input');
            expect(input.type).toBe('password');
        });

        it('should apply number type', () => {
            component.type = 'number';
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('input');
            expect(input.type).toBe('number');
        });

        it('should apply search type', () => {
            component.type = 'search';
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('input');
            expect(input.type).toBe('search');
        });
    });

    describe('Attributes', () => {
        it('should apply placeholder', () => {
            component.placeholder = 'Enter email';
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('input');
            expect(input.placeholder).toBe('Enter email');
        });

        it('should apply disabled attribute', () => {
            component.disabled = true;
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('input');
            expect(input.disabled).toBe(true);
        });

        it('should apply readonly attribute', () => {
            component.readonly = true;
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('input');
            expect(input.readOnly).toBe(true);
        });

        it('should apply autocomplete attribute', () => {
            component.autocomplete = 'on';
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('input');
            expect(input.getAttribute('autocomplete')).toBe('on');
        });

        it('should apply maxlength attribute', () => {
            component.maxlength = 50;
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('input');
            expect(input.getAttribute('maxlength')).toBe('50');
        });
    });

    describe('Events', () => {
        it('should emit focus event', () => {
            spyOn(component.focus, 'emit');

            const input = fixture.nativeElement.querySelector('input');
            input.dispatchEvent(new FocusEvent('focus'));

            expect(component.focus.emit).toHaveBeenCalled();
        });

        it('should emit blur event', () => {
            spyOn(component.blur, 'emit');

            const input = fixture.nativeElement.querySelector('input');
            input.dispatchEvent(new FocusEvent('blur'));

            expect(component.blur.emit).toHaveBeenCalled();
        });

        it('should emit enter event on Enter key', () => {
            spyOn(component.enter, 'emit');

            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            component.handleKeydown(event);

            expect(component.enter.emit).toHaveBeenCalledWith(event);
        });

        it('should NOT emit enter event on other keys', () => {
            spyOn(component.enter, 'emit');

            const event = new KeyboardEvent('keydown', { key: 'a' });
            component.handleKeydown(event);

            expect(component.enter.emit).not.toHaveBeenCalled();
        });
    });

    describe('ControlValueAccessor', () => {
        it('should write value', () => {
            component.writeValue('test value');
            expect(component.value).toBe('test value');
        });

        it('should handle null value', () => {
            component.writeValue(null as any);
            expect(component.value).toBe('');
        });

        it('should register onChange callback', () => {
            const fn = jasmine.createSpy('onChange');
            component.registerOnChange(fn);

            component.handleInput({ target: { value: 'test' } } as any);

            expect(fn).toHaveBeenCalledWith('test');
        });

        it('should register onTouched callback', () => {
            const fn = jasmine.createSpy('onTouched');
            component.registerOnTouched(fn);

            component.handleBlur(new FocusEvent('blur'));

            expect(fn).toHaveBeenCalled();
        });

        it('should set disabled state', () => {
            component.setDisabledState(true);
            expect(component.disabled).toBe(true);

            component.setDisabledState(false);
            expect(component.disabled).toBe(false);
        });
    });

    describe('Integration with FormControl', () => {
        it('should update FormControl value on input', () => {
            const control = new FormControl('');
            component.registerOnChange((value) => control.setValue(value));

            const input = fixture.nativeElement.querySelector('input');
            input.value = 'new value';
            input.dispatchEvent(new Event('input'));

            expect(control.value).toBe('new value');
        });

        it('should update input value when FormControl changes', () => {
            const control = new FormControl('initial');
            component.writeValue(control.value);
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('input');
            expect(input.value).toBe('initial');

            control.setValue('updated');
            component.writeValue(control.value);
            fixture.detectChanges();

            expect(input.value).toBe('updated');
        });
    });
});
