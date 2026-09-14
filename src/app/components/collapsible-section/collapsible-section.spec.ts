import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollapsibleSection } from './collapsible-section';

describe('CollapsibleSection', () => {
  let fixture: ComponentFixture<CollapsibleSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleSection],
    }).compileComponents();

    fixture = TestBed.createComponent(CollapsibleSection);
    fixture.componentRef.setInput('title', 'Más detalles');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should be collapsed by default', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="region"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('button')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('should expand when the header is clicked', () => {
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button') as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="region"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('button')?.getAttribute('aria-expanded')).toBe('true');
  });

  it('should render projected content only when expanded', () => {
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="region"]')).not.toBeNull();
  });
});
