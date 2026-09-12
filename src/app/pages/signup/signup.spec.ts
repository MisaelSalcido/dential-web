import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../services/local/auth.service';
import { Signup } from './signup';

describe('Signup', () => {
  let fixture: ComponentFixture<Signup>;
  let authService: { signup: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authService = { signup: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [{ provide: AuthService, useValue: authService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
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
    expect(text).toContain('El nombre de la clínica es obligatorio.');
    expect(text).toContain('El nombre completo es obligatorio.');
    expect(text).toContain('El correo es obligatorio.');
    expect(text).toContain('La contraseña es obligatoria.');
    expect(authService.signup).not.toHaveBeenCalled();
  });

  it('should reject a solely-numeric password', async () => {
    setValue(0, 'Consultorio Demo');
    setValue(1, 'Dra. Ana');
    setValue(2, 'ana@example.com');
    setValue(3, '12345678');
    fixture.detectChanges();

    await submitForm();

    expect(fixture.nativeElement.textContent).toContain(
      'La contraseña debe tener al menos 8 caracteres y no ser solo números.',
    );
    expect(authService.signup).not.toHaveBeenCalled();
  });

  it('should sign up and navigate to the authenticated area on success', async () => {
    authService.signup.mockResolvedValue({
      id: '1',
      fullName: 'Dra. Ana',
      email: 'ana@example.com',
      role: 'ADMIN',
      tenant: { id: 't1', name: 'Consultorio Demo', subscriptionPlan: 'FREE' },
    });

    setValue(0, 'Consultorio Demo');
    setValue(1, 'Dra. Ana');
    setValue(2, 'ana@example.com');
    setValue(3, 'Password123');
    fixture.detectChanges();

    await submitForm();

    expect(authService.signup).toHaveBeenCalledWith({
      clinicName: 'Consultorio Demo',
      fullName: 'Dra. Ana',
      email: 'ana@example.com',
      password: 'Password123',
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should show a danger alert on duplicate email', async () => {
    authService.signup.mockRejectedValue({
      error: { errorCode: 'EMAIL_ALREADY_REGISTERED', message: 'Este correo ya está registrado.' },
    });

    setValue(0, 'Consultorio Demo');
    setValue(1, 'Dra. Ana');
    setValue(2, 'ana@example.com');
    setValue(3, 'Password123');
    fixture.detectChanges();

    await submitForm();

    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Este correo ya está registrado.');
  });
});
