import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextInput } from './text-input';

describe('TextInput', () => {
  let fixture: ComponentFixture<TextInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInput],
    }).compileComponents();

    fixture = TestBed.createComponent(TextInput);
    fixture.componentRef.setInput('label', 'Nombre');
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should associate the label with the input via a matching id', () => {
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    expect(label.getAttribute('for')).toBe(nativeInput().id);
  });

  it('should update the value model on input', () => {
    fixture.detectChanges();
    nativeInput().value = 'Ana';
    nativeInput().dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('Ana');
  });

  it('should mark aria-invalid and apply error classes when errorText is set', () => {
    fixture.componentRef.setInput('errorText', 'Campo requerido');
    fixture.detectChanges();
    expect(nativeInput().getAttribute('aria-invalid')).toBe('true');
    expect(nativeInput().className).toContain('border-danger');
  });

  it('should apply warning classes when warning is true and there is no error', () => {
    fixture.componentRef.setInput('warning', true);
    fixture.detectChanges();
    expect(nativeInput().className).toContain('border-warning');
  });
});
