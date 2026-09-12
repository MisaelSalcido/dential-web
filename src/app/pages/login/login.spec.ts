import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../services/local/auth.service';
import { Login } from './login';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = { login: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [{ provide: AuthService, useValue: authService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture.detectChanges();
  });

  function inputs(): HTMLInputElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('input'));
  }

  function setValue(index: number, value: string): void {
    const input = inputs()[index];
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  async function submitForm(): Promise<void> {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show validation errors and not call the API when submitting an empty form', async () => {
    await submitForm();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('El correo es obligatorio.');
    expect(text).toContain('La contraseña es obligatoria.');
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should log in and navigate to the authenticated area on success', async () => {
    authService.login.mockResolvedValue({
      id: '1',
      fullName: 'Ana',
      email: 'a@b.com',
      role: 'ADMIN',
      tenant: null,
    });

    setValue(0, 'a@b.com');
    setValue(1, 'secret123');
    fixture.detectChanges();

    await submitForm();

    expect(authService.login).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret123' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should show a danger alert on invalid credentials', async () => {
    authService.login.mockRejectedValue({
      error: { errorCode: 'INVALID_CREDENTIALS', message: 'Correo o contraseña incorrectos.' },
    });

    setValue(0, 'a@b.com');
    setValue(1, 'wrongpass');
    fixture.detectChanges();

    await submitForm();

    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Correo o contraseña incorrectos.');
  });
});
