import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  let fixture: ComponentFixture<ProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBar],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBar);
  });

  function track(): HTMLDivElement {
    return fixture.nativeElement.querySelector('[role="progressbar"]');
  }

  function bar(): HTMLDivElement {
    return track().querySelector('div') as HTMLDivElement;
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should compute the correct fill percentage', () => {
    fixture.componentRef.setInput('value', 25);
    fixture.componentRef.setInput('max', 50);
    fixture.detectChanges();
    expect(bar().style.width).toBe('50%');
  });

  it('should clamp above max to 100%', () => {
    fixture.componentRef.setInput('value', 999);
    fixture.componentRef.setInput('max', 50);
    fixture.detectChanges();
    expect(bar().style.width).toBe('100%');
  });

  it('should expose aria progressbar attributes', () => {
    fixture.componentRef.setInput('value', 10);
    fixture.componentRef.setInput('max', 20);
    fixture.detectChanges();
    expect(track().getAttribute('aria-valuenow')).toBe('10');
    expect(track().getAttribute('aria-valuemax')).toBe('20');
  });
});
