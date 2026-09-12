import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SegmentedControl } from './segmented-control';

describe('SegmentedControl', () => {
  let fixture: ComponentFixture<SegmentedControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentedControl],
    }).compileComponents();

    fixture = TestBed.createComponent(SegmentedControl);
    fixture.componentRef.setInput('options', [
      { value: 'day', label: 'Día' },
      { value: 'week', label: 'Semana' },
    ]);
  });

  function buttons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button'));
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render one button per option', () => {
    fixture.detectChanges();
    expect(buttons().length).toBe(2);
  });

  it('should mark the selected option as aria-checked', () => {
    fixture.componentRef.setInput('value', 'week');
    fixture.detectChanges();
    expect(buttons()[1].getAttribute('aria-checked')).toBe('true');
    expect(buttons()[0].getAttribute('aria-checked')).toBe('false');
  });

  it('should select an option on click', () => {
    fixture.detectChanges();
    buttons()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('week');
  });

  it('should move selection to the next option on ArrowRight', () => {
    fixture.componentRef.setInput('value', 'day');
    fixture.detectChanges();
    buttons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('week');
  });

  it('should cycle back to the first option on ArrowRight from the last', () => {
    fixture.componentRef.setInput('value', 'week');
    fixture.detectChanges();
    buttons()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('day');
  });

  it('should give only the active segment a tabindex of 0', () => {
    fixture.componentRef.setInput('value', 'week');
    fixture.detectChanges();
    expect(buttons()[0].tabIndex).toBe(-1);
    expect(buttons()[1].tabIndex).toBe(0);
  });
});
