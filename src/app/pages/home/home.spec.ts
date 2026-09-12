import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../services/local/auth.service';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;

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
      imports: [Home],
      providers: [{ provide: AuthService, useValue: authService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should welcome the signed-in user by name', () => {
    expect(fixture.nativeElement.textContent).toContain('Dra. Ana López');
  });

  it('should show the plan badge and role subtitle in the topbar', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Plan FREE');
    expect(text).toContain('Administrador');
  });

  it('should render the topbar logout action', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.some((button) => button.textContent?.includes('Cerrar sesión'))).toBe(true);
  });
});
