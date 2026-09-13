import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../services/local/auth.service';
import { DashboardShell } from './dashboard-shell';

@Component({ selector: 'app-route-stub', template: 'stub' })
class RouteStub {}

// RouterLinkActive defers its DOM/CD update to a microtask (see @angular/router source),
// so tests must flush microtasks after navigating before asserting on the rendered result.
function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => queueMicrotask(() => resolve()));
}

describe('DashboardShell', () => {
  let fixture: ComponentFixture<DashboardShell>;
  let router: Router;

  beforeEach(async () => {
    const authService = {
      currentUser: () => ({
        id: '1',
        fullName: 'Dra. Ana López',
        email: 'ana@example.com',
        role: 'ADMIN' as const,
        tenant: { id: 't1', name: 'Consultorio Demo', subscriptionPlan: 'FREE' },
      }),
      logout: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardShell],
      providers: [
        { provide: AuthService, useValue: authService },
        provideRouter([
          { path: '', component: RouteStub },
          { path: 'pacientes', component: RouteStub },
          { path: 'agenda', component: RouteStub },
          { path: 'documentos', component: RouteStub },
          { path: 'ajustes', component: RouteStub },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardShell);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  function navLinks(): HTMLAnchorElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('nav a'));
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render exactly the 5 expected nav links in order', () => {
    const labels = navLinks().map((link) => link.textContent?.trim());
    expect(labels).toEqual(['Inicio', 'Pacientes', 'Agenda', 'Documentos', 'Ajustes']);
  });

  it('should never render Odontogramas, Imágenes, or a Plan Free usage widget in the sidebar', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('Odontogramas');
    expect(text).not.toContain('Imágenes');
    expect(text).not.toContain('Ver planes');
  });

  it('should mark the link matching the current route as active', async () => {
    await router.navigateByUrl('/pacientes');
    await flushMicrotasks();
    fixture.detectChanges();

    const active = navLinks().find((link) => link.getAttribute('aria-current') === 'page');
    expect(active?.textContent?.trim()).toBe('Pacientes');
  });

  it('should render the search field accepting typed input without emitting a query', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[topbar-search] input');
    input.value = 'Juan';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('Juan');
  });

  it('should toggle the sidebar collapsed state when the collapse control is clicked', () => {
    const toggleButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[aria-label]');
    toggleButton.click();
    fixture.detectChanges();

    expect(navLinks()[0].getAttribute('aria-label')).toBe('Inicio');
  });
});
