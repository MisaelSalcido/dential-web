import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavItem } from './nav-item';

describe('NavItem', () => {
  let fixture: ComponentFixture<NavItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavItem],
    }).compileComponents();

    fixture = TestBed.createComponent(NavItem);
    fixture.componentRef.setInput('label', 'Pacientes');
  });

  function link(): HTMLAnchorElement {
    return fixture.nativeElement.querySelector('a');
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set aria-current when active', () => {
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    expect(link().getAttribute('aria-current')).toBe('page');
    expect(link().className).toContain('bg-primary-tint');
  });

  it('should render a lock icon and aria-disabled when locked', () => {
    fixture.componentRef.setInput('locked', true);
    fixture.detectChanges();
    expect(link().getAttribute('aria-disabled')).toBe('true');
    expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
  });
});
