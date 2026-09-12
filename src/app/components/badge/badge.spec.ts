import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Badge } from './badge';

describe('Badge', () => {
  let fixture: ComponentFixture<Badge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Badge],
    }).compileComponents();

    fixture = TestBed.createComponent(Badge);
  });

  function nativeSpan(): HTMLSpanElement {
    return fixture.nativeElement.querySelector('span');
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply neutral classes by default', () => {
    fixture.detectChanges();
    expect(nativeSpan().className).toContain('bg-neutral-tint');
  });

  it('should apply danger classes', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    expect(nativeSpan().className).toContain('bg-danger-tint');
  });
});
