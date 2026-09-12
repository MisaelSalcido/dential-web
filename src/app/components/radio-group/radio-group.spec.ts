import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioGroup } from './radio-group';

describe('RadioGroup', () => {
  let fixture: ComponentFixture<RadioGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroup);
    fixture.componentRef.setInput('options', [
      { value: 'f', label: 'Femenino' },
      { value: 'm', label: 'Masculino' },
    ]);
  });

  function radios(): HTMLInputElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('input[type="radio"]'));
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render one radio per option', () => {
    fixture.detectChanges();
    expect(radios().length).toBe(2);
  });

  it('should check the option matching the value model', () => {
    fixture.componentRef.setInput('value', 'm');
    fixture.detectChanges();
    expect(radios()[1].checked).toBe(true);
    expect(radios()[0].checked).toBe(false);
  });

  it('should update the value model when a radio is selected', () => {
    fixture.detectChanges();
    radios()[1].checked = true;
    radios()[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('m');
  });

  it('should expose role=radiogroup', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="radiogroup"]')).toBeTruthy();
  });
});
