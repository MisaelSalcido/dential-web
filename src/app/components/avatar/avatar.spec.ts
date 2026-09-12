import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Avatar } from './avatar';

describe('Avatar', () => {
  let fixture: ComponentFixture<Avatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
    }).compileComponents();

    fixture = TestBed.createComponent(Avatar);
  });

  function nativeSpan(): HTMLSpanElement {
    return fixture.nativeElement.querySelector('span');
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render initials when no src is provided', () => {
    fixture.componentRef.setInput('initials', 'MS');
    fixture.detectChanges();
    expect(nativeSpan().textContent?.trim()).toBe('MS');
  });

  it('should be hidden from screen readers when no aria label is set', () => {
    fixture.detectChanges();
    expect(nativeSpan().getAttribute('aria-hidden')).toBe('true');
  });

  it('should expose role=img and the aria-label when provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Misael Salcido');
    fixture.detectChanges();
    expect(nativeSpan().getAttribute('role')).toBe('img');
    expect(nativeSpan().getAttribute('aria-label')).toBe('Misael Salcido');
  });

  it('should apply the square radius classes for the square shape', () => {
    fixture.componentRef.setInput('shape', 'square');
    fixture.detectChanges();
    expect(nativeSpan().className).toContain('rounded-xl');
  });
});
