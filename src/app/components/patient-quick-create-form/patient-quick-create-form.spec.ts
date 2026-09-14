import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../services/local/auth.service';
import { PatientApiService } from '../../services/api/patient-api.service';
import { PatientCreateModalService } from '../../services/local/patient-create-modal.service';
import { PatientQuickCreateForm } from './patient-quick-create-form';

describe('PatientQuickCreateForm', () => {
  let fixture: ComponentFixture<PatientQuickCreateForm>;
  let patientApi: { create: ReturnType<typeof vi.fn> };
  let modalService: PatientCreateModalService;
  let authService: { currentUser: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    patientApi = { create: vi.fn() };
    authService = { currentUser: vi.fn(() => null) };

    await TestBed.configureTestingModule({
      imports: [PatientQuickCreateForm],
      providers: [
        { provide: PatientApiService, useValue: patientApi },
        { provide: AuthService, useValue: authService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientQuickCreateForm);
    modalService = TestBed.inject(PatientCreateModalService);
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
    expect(text).toContain('El nombre completo es obligatorio.');
    expect(text).toContain('La fecha de nacimiento es obligatoria.');
    expect(text).toContain('El teléfono es obligatorio.');
    expect(patientApi.create).not.toHaveBeenCalled();
  });

  it('should create the patient and navigate to their profile on success', async () => {
    setValue(0, 'Jorge Aguilar Ortiz');
    setValue(1, '1988-07-14');
    setValue(2, '5544218890');

    patientApi.create.mockResolvedValue({ id: 'p1' });

    await submitForm();

    expect(patientApi.create).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: 'Jorge Aguilar Ortiz', phone: '5544218890', birthDate: '1988-07-14' }),
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith('/pacientes/p1');
  });

  it('should show a server error and not navigate when creation fails', async () => {
    setValue(0, 'Jorge Aguilar Ortiz');
    setValue(1, '1988-07-14');
    setValue(2, '5544218890');

    patientApi.create.mockRejectedValue({ error: { errorCode: 'PLAN_LIMIT_REACHED', message: 'Límite alcanzado.' } });

    await submitForm();

    expect(fixture.nativeElement.textContent).toContain('Límite alcanzado.');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should show a locked RENAPO affordance when the tenant is on the FREE plan', () => {
    authService.currentUser.mockReturnValue({ tenant: { subscriptionPlan: 'FREE' } });
    fixture = TestBed.createComponent(PatientQuickCreateForm);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button[aria-expanded]').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Verificar RENAPO');
  });

  it('should show the duplicate warning on a 409 POSSIBLE_DUPLICATE response', async () => {
    setValue(0, 'Jorge Aguilar Ortiz');
    setValue(1, '1988-07-14');
    setValue(2, '5544218890');

    patientApi.create.mockRejectedValue({
      error: {
        errorCode: 'POSSIBLE_DUPLICATE',
        message: 'Ya existe un expediente parecido.',
        duplicateMatch: { id: 'existing1', fullName: 'Jorge Aguilar Ortiz', folio: '000001', phone: '5544218890', lastVisitAt: null },
      },
    });

    await submitForm();

    expect(fixture.nativeElement.textContent).toContain('Jorge Aguilar Ortiz');
    expect(fixture.nativeElement.textContent).toContain('000001');
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should navigate to the matched patient when "Abrir" is clicked', async () => {
    setValue(0, 'Jorge Aguilar Ortiz');
    setValue(1, '1988-07-14');
    setValue(2, '5544218890');

    patientApi.create.mockRejectedValue({
      error: {
        errorCode: 'POSSIBLE_DUPLICATE',
        duplicateMatch: { id: 'existing1', fullName: 'Jorge Aguilar Ortiz', folio: '000001', phone: '5544218890', lastVisitAt: null },
      },
    });
    await submitForm();

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const openButton = buttons.find((button) => button.textContent?.trim() === 'Abrir');
    openButton?.click();
    await fixture.whenStable();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/pacientes/existing1');
  });

  it('should resubmit with confirmDuplicate: true when "crear de todos modos" is clicked', async () => {
    setValue(0, 'Jorge Aguilar Ortiz');
    setValue(1, '1988-07-14');
    setValue(2, '5544218890');

    patientApi.create.mockRejectedValueOnce({
      error: {
        errorCode: 'POSSIBLE_DUPLICATE',
        duplicateMatch: { id: 'existing1', fullName: 'Jorge Aguilar Ortiz', folio: '000001', phone: '5544218890', lastVisitAt: null },
      },
    });
    await submitForm();

    patientApi.create.mockResolvedValueOnce({ id: 'new1' });
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const createAnywayButton = buttons.find((button) => button.textContent?.trim() === 'Es otra persona, crear de todos modos');
    createAnywayButton?.click();
    await fixture.whenStable();

    expect(patientApi.create).toHaveBeenLastCalledWith(expect.objectContaining({ confirmDuplicate: true }));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/pacientes/new1');
  });

  it('should close the modal on cancel', () => {
    const closeSpy = vi.spyOn(modalService, 'close');
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const cancelButton = buttons.find((button) => button.textContent?.trim() === 'Cancelar');
    cancelButton?.click();
    expect(closeSpy).toHaveBeenCalled();
  });

  function expandMoreDetails(): void {
    fixture.nativeElement.querySelector('button[aria-expanded]').click();
    fixture.detectChanges();
  }

  it('should render quick-add chips for alergias and insert their value on click without overwriting existing text', () => {
    expandMoreDetails();

    const chipButtons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('app-chip button'));
    expect(chipButtons.map((button) => button.textContent?.trim())).toEqual(['Penicilina', 'Látex', 'Ninguna conocida']);

    chipButtons.find((button) => button.textContent?.trim() === 'Penicilina')?.click();
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Penicilina');

    chipButtons.find((button) => button.textContent?.trim() === 'Látex')?.click();
    fixture.detectChanges();

    expect(textarea.value).toBe('Penicilina, Látex');
  });

  it('should render sexo via app-segmented-control and never a <select>', () => {
    expandMoreDetails();

    expect(fixture.nativeElement.querySelector('app-segmented-control')).toBeTruthy();
    const selects: HTMLSelectElement[] = Array.from(fixture.nativeElement.querySelectorAll('select'));
    for (const select of selects) {
      expect(select.innerHTML).not.toContain('Femenino');
      expect(select.innerHTML).not.toContain('Masculino');
    }
  });
});
