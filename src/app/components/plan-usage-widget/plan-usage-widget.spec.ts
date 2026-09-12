import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanUsageWidget } from './plan-usage-widget';

describe('PlanUsageWidget', () => {
  let fixture: ComponentFixture<PlanUsageWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanUsageWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanUsageWidget);
    fixture.componentRef.setInput('planName', 'Plan Free');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the plan name', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Plan Free');
  });

  it('should render the progress bar with the used/limit values', () => {
    fixture.componentRef.setInput('used', 3);
    fixture.componentRef.setInput('limit', 10);
    fixture.detectChanges();
    const progressBar = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('3');
    expect(progressBar.getAttribute('aria-valuemax')).toBe('10');
  });

  it('should emit ctaClicked when the CTA button is clicked', () => {
    fixture.componentRef.setInput('ctaLabel', 'Ver planes');
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.ctaClicked.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toBe(true);
  });

  it('should not render a CTA button when ctaLabel is not set', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeFalsy();
  });
});
