import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { NavItem } from './nav-item';

@Component({ selector: 'app-route-stub', template: '' })
class RouteStub {}

// RouterLinkActive defers its DOM/CD update to a microtask (see @angular/router source),
// so tests must flush microtasks after navigating before asserting on the rendered result.
function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(() => resolve()));
}

@Component({
  selector: 'app-nav-item-host',
  imports: [NavItem],
  template: `
    <app-nav-item
      label="Pacientes"
      routerLink="/pacientes"
      [locked]="locked"
      [collapsed]="collapsed"
    />
  `,
})
class NavItemHost {
  locked = false;
  collapsed = false;
}

describe('NavItem', () => {
  let fixture: ComponentFixture<NavItemHost>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavItemHost],
      providers: [
        provideRouter([
          { path: 'pacientes', component: RouteStub },
          { path: 'agenda', component: RouteStub },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavItemHost);
    router = TestBed.inject(Router);
  });

  function link(): HTMLAnchorElement {
    return fixture.nativeElement.querySelector('a');
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should mark itself active and set aria-current when the current route matches', async () => {
    fixture.detectChanges();
    await router.navigateByUrl('/pacientes');
    await flushMicrotasks();
    fixture.detectChanges();
    expect(link().getAttribute('aria-current')).toBe('page');
    expect(link().className).toContain('bg-primary-tint');
  });

  it('should not be active when the current route does not match', async () => {
    fixture.detectChanges();
    await router.navigateByUrl('/agenda');
    await flushMicrotasks();
    fixture.detectChanges();
    expect(link().getAttribute('aria-current')).toBeNull();
  });

  it('should render a lock icon and aria-disabled when locked', () => {
    fixture.componentInstance.locked = true;
    fixture.detectChanges();
    expect(link().getAttribute('aria-disabled')).toBe('true');
    expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
  });

  it('should visually collapse the label but keep an accessible name when collapsed', () => {
    fixture.componentInstance.collapsed = true;
    fixture.detectChanges();
    const label = link().querySelector('span');
    expect(label?.className).toContain('max-w-0');
    expect(label?.className).toContain('opacity-0');
    expect(link().getAttribute('aria-label')).toBe('Pacientes');
  });

  it('should keep the row height the same when collapsed and expanded', () => {
    fixture.detectChanges();
    const expandedClasses = link().className;
    fixture.componentInstance.collapsed = true;
    fixture.detectChanges();
    const collapsedClasses = link().className;
    expect(expandedClasses).toContain('h-10');
    expect(collapsedClasses).toContain('h-10');
  });
});
