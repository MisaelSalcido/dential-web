import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alert } from './alert';

describe('Alert', () => {
  let fixture: ComponentFixture<Alert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alert],
    }).compileComponents();

    fixture = TestBed.createComponent(Alert);
  });

  function container(): HTMLDivElement {
    return fixture.nativeElement.querySelector('div');
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should use role=status for info by default', () => {
    fixture.detectChanges();
    expect(container().getAttribute('role')).toBe('status');
  });

  it('should use role=alert for warning and danger variants', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    expect(container().getAttribute('role')).toBe('alert');
  });

  it('should render the title when provided', () => {
    fixture.componentRef.setInput('title', 'Posible duplicado');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Posible duplicado');
  });
});
