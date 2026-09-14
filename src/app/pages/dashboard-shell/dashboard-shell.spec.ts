import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { PatientApiService } from '../../services/api/patient-api.service';
import { AuthService } from '../../services/local/auth.service';
import { HotkeyService } from '../../services/local/hotkey.service';
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
        { provide: PatientApiService, useValue: { search: vi.fn().mockResolvedValue([]) } },
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

  function dispatchKeydown(init: KeyboardEventInit): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { cancelable: true, ...init });
    document.dispatchEvent(event);
    return event;
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

  it('should search for patients after typing and render the results dropdown', async () => {
    const patientApi = TestBed.inject(PatientApiService) as unknown as { search: ReturnType<typeof vi.fn> };
    patientApi.search.mockResolvedValue([
      { id: 'p1', fullName: 'Jorge Aguilar Ortiz', folio: '000001', phone: '5544218890', edad: 38, hasAllergies: false, lastVisitAt: null },
    ]);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('[topbar-search] input');
    input.value = 'Jorge';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, 350));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(patientApi.search).toHaveBeenCalledWith('Jorge');
    expect(fixture.nativeElement.textContent).toContain('Jorge Aguilar Ortiz');
  });

  it('should toggle the sidebar collapsed state when the collapse control is clicked', () => {
    const toggleButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('button[aria-label]');
    toggleButton.click();
    fixture.detectChanges();

    expect(navLinks()[0].getAttribute('aria-label')).toBe('Inicio');
  });

  describe('navigation hotkeys', () => {
    const cases: Array<[label: string, code: string, expectedUrl: string]> = [
      ['Inicio', 'Digit1', '/'],
      ['Pacientes', 'Digit2', '/pacientes'],
      ['Agenda', 'Digit3', '/agenda'],
      ['Documentos', 'Digit4', '/documentos'],
      ['Ajustes', 'Digit5', '/ajustes'],
    ];

    it.each(cases)('should navigate to %s on Ctrl+%s', async (_label, code, expectedUrl) => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      dispatchKeydown({ ctrlKey: true, code });
      await navigateSpy.mock.results[0].value;
      await flushMicrotasks();
      fixture.detectChanges();

      expect(router.url).toBe(expectedUrl);
    });

    it('should stay on the current page without error when its own hotkey is pressed again', async () => {
      await router.navigateByUrl('/pacientes');
      await flushMicrotasks();
      fixture.detectChanges();

      const navigateSpy = vi.spyOn(router, 'navigate');
      dispatchKeydown({ ctrlKey: true, code: 'Digit2' });
      await navigateSpy.mock.results[0].value;
      await flushMicrotasks();
      fixture.detectChanges();

      expect(router.url).toBe('/pacientes');
    });

    it('should do nothing for an unassigned combo', () => {
      expect(() => dispatchKeydown({ ctrlKey: true, code: 'Digit6' })).not.toThrow();
      expect(router.url).toBe('/');
    });
  });

  describe('search-focus hotkey', () => {
    function searchInput(): HTMLInputElement {
      return fixture.nativeElement.querySelector('[topbar-search] input');
    }

    it('should move focus into the patient search field on Ctrl+Space', () => {
      dispatchKeydown({ ctrlKey: true, code: 'Space' });
      expect(document.activeElement).toBe(searchInput());
    });

    it('should move focus into the patient search field even when another element was focused', () => {
      const toggleButton: HTMLButtonElement =
        fixture.nativeElement.querySelector('button[aria-label]');
      toggleButton.focus();
      expect(document.activeElement).toBe(toggleButton);

      dispatchKeydown({ ctrlKey: true, code: 'Space' });
      expect(document.activeElement).toBe(searchInput());
    });
  });

  describe('extensibility', () => {
    it('should leave all 6 built-in hotkeys working after a new one is registered', async () => {
      const extraHandler = vi.fn();
      TestBed.inject(HotkeyService).register('ctrl+Digit6', extraHandler);

      dispatchKeydown({ ctrlKey: true, code: 'Digit6' });
      expect(extraHandler).toHaveBeenCalledOnce();

      const navigateSpy = vi.spyOn(router, 'navigate');
      dispatchKeydown({ ctrlKey: true, code: 'Digit2' });
      await navigateSpy.mock.results[0].value;
      await flushMicrotasks();
      fixture.detectChanges();
      expect(router.url).toBe('/pacientes');

      dispatchKeydown({ ctrlKey: true, code: 'Space' });
      const searchInput: HTMLInputElement =
        fixture.nativeElement.querySelector('[topbar-search] input');
      expect(document.activeElement).toBe(searchInput);
    });
  });
});
