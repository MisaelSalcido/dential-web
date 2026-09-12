import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  let fixture: ComponentFixture<Checkbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkbox],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkbox);
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should reflect the checked model on the native input', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(nativeInput().checked).toBe(true);
  });

  it('should update the checked model when the native input changes', () => {
    fixture.detectChanges();
    nativeInput().checked = true;
    nativeInput().dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it('should set the indeterminate DOM property', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    expect(nativeInput().indeterminate).toBe(true);
  });

  it('should disable the native input when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(nativeInput().disabled).toBe(true);
  });
});
