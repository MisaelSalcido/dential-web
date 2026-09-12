import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dot } from './dot';

describe('Dot', () => {
  let fixture: ComponentFixture<Dot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dot],
    }).compileComponents();

    fixture = TestBed.createComponent(Dot);
  });

  function nativeSpan(): HTMLSpanElement {
    return fixture.nativeElement.querySelector('span');
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply the primary color by default', () => {
    fixture.detectChanges();
    expect(nativeSpan().className).toContain('bg-primary');
  });

  it('should apply pulse animation when requested', () => {
    fixture.componentRef.setInput('pulse', true);
    fixture.detectChanges();
    expect(nativeSpan().className).toContain('animate-pulse');
  });
});
