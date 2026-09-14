import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../services/local/auth.service';
import { HistoriaClinicaApiService } from '../../services/api/historia-clinica-api.service';
import { PatientApiService } from '../../services/api/patient-api.service';
import { HistoriaClinica } from './historia-clinica';

function sampleHistoriaClinica(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'hc1',
    status: 'DRAFT',
    antecedentesHeredofamiliares: null,
    antecedentesPersonalesPatologicos: {
      alergias: null,
      diabetes: null,
      hipertension: null,
      cardiopatias: null,
      otros: null,
      tabaquismoRefiere: false,
      tabaquismoDetalle: null,
      alcoholRefiere: false,
      alcoholDetalle: null,
      sustanciasRefiere: false,
      sustanciasDetalle: null,
    },
    antecedentesNoPatologicos: null,
    padecimientoActual: { motivoConsulta: null, descripcionPadecimiento: null },
    interrogatorioAparatosSistemas: null,
    exploracionFisica: {
      tensionArterialSistolica: null,
      tensionArterialDiastolica: null,
      frecuenciaCardiaca: null,
      frecuenciaRespiratoria: null,
      temperatura: null,
      pesoKg: null,
      tallaCm: null,
      cabezaCuello: null,
      atm: null,
      tejidosBlandos: null,
    },
    sectionCompleteness: {
      antecedentesHeredofamiliares: false,
      antecedentesPersonalesPatologicos: false,
      antecedentesNoPatologicos: false,
      padecimientoActual: false,
      interrogatorioAparatosSistemas: false,
      exploracionFisica: false,
    },
    overallCompletenessPercent: 0,
    finalizedBy: null,
    finalizedAt: null,
    createdAt: '2026-09-13T09:14:00Z',
    updatedAt: '2026-09-13T09:14:00Z',
    ...overrides,
  };
}

function samplePatient() {
  return {
    id: 'p1',
    folio: '000001',
    fullName: 'Jorge Aguilar Ortiz',
    phone: '5544218890',
    birthDate: '1988-07-14',
    edad: 38,
    curp: null,
    sexo: null,
    calleNumero: null,
    colonia: null,
    ciudad: null,
    codigoPostal: null,
    estado: null,
    alergias: null,
    hasHistoriaClinica: true,
    historiaClinicaId: 'hc1',
    createdAt: '2026-09-13T09:12:00Z',
  };
}

describe('HistoriaClinica', () => {
  let fixture: ComponentFixture<HistoriaClinica>;
  let historiaClinicaApi: { get: ReturnType<typeof vi.fn>; saveDraft: ReturnType<typeof vi.fn>; finalize: ReturnType<typeof vi.fn> };
  let patientApi: { getById: ReturnType<typeof vi.fn> };
  let authService: { currentUser: ReturnType<typeof vi.fn> };

  function setup(role: string): void {
    historiaClinicaApi = {
      get: vi.fn().mockResolvedValue(sampleHistoriaClinica()),
      saveDraft: vi.fn(),
      finalize: vi.fn(),
    };
    patientApi = { getById: vi.fn().mockResolvedValue(samplePatient()) };
    authService = { currentUser: vi.fn(() => ({ role })) };

    TestBed.configureTestingModule({
      imports: [HistoriaClinica],
      providers: [
        { provide: HistoriaClinicaApiService, useValue: historiaClinicaApi },
        { provide: PatientApiService, useValue: patientApi },
        { provide: AuthService, useValue: authService },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => 'p1' }),
            snapshot: { paramMap: { get: () => 'p1' } },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(HistoriaClinica);
  }

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenStable();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('should create and load the historia clinica and patient ficha', async () => {
    setup('DENTIST');
    await settle();

    expect(historiaClinicaApi.get).toHaveBeenCalledWith('p1');
    expect(patientApi.getById).toHaveBeenCalledWith('p1');
    expect(fixture.nativeElement.textContent).toContain('Historia clínica');
  });

  it('should show the Finalizar action only for a DENTIST', async () => {
    setup('DENTIST');
    await settle();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.some((button) => button.textContent?.includes('Finalizar'))).toBe(true);
  });

  it('should hide the Finalizar action for a non-DENTIST', async () => {
    setup('ASSISTANT');
    await settle();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.some((button) => button.textContent?.includes('Finalizar'))).toBe(false);
  });

  it('should save a draft with the Guardar action', async () => {
    setup('DENTIST');
    await settle();
    historiaClinicaApi.saveDraft.mockResolvedValue(sampleHistoriaClinica({ antecedentesHeredofamiliares: 'Sin antecedentes' }));

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.find((button) => button.textContent?.includes('Guardar'))!.click();
    await settle();

    expect(historiaClinicaApi.saveDraft).toHaveBeenCalledWith('p1', expect.any(Object));
  });

  it('should surface incomplete sections inline on a 422 from finalize', async () => {
    setup('DENTIST');
    await settle();
    historiaClinicaApi.finalize.mockRejectedValue({
      error: { errorCode: 'HISTORIA_CLINICA_INCOMPLETE', incompleteSections: ['padecimientoActual'] },
    });

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.find((button) => button.textContent?.includes('Finalizar'))!.click();
    await settle();

    expect(fixture.nativeElement.textContent).toContain('Padecimiento actual');
  });

  it('should update status to FINALIZADO on a successful finalize', async () => {
    setup('DENTIST');
    await settle();
    historiaClinicaApi.finalize.mockResolvedValue(
      sampleHistoriaClinica({ status: 'FINALIZADO', finalizedBy: { userId: 'u1', name: 'Dr. Juan', cedula: '12345678' } }),
    );

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.find((button) => button.textContent?.includes('Finalizar'))!.click();
    await settle();

    expect(fixture.nativeElement.textContent).toContain('Finalizada');
  });

  function expandSection(title: string): void {
    const headers: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button[aria-expanded]'));
    const header = headers.find((button) => button.textContent?.trim().startsWith(title));
    header?.click();
    fixture.detectChanges();
  }

  it('should render quick-add chips for antecedentes personales patológicos and insert their value on click', async () => {
    setup('DENTIST');
    await settle();
    expandSection('Antecedentes personales patológicos');

    const chipButtons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('app-chip button'));
    const labels = chipButtons.map((button) => button.textContent?.trim());
    expect(labels).toEqual(expect.arrayContaining(['Diabetes', 'Hipertensión', 'Cardiopatías']));

    chipButtons.find((button) => button.textContent?.trim() === 'Diabetes')?.click();
    fixture.detectChanges();

    const labelElements: HTMLLabelElement[] = Array.from(fixture.nativeElement.querySelectorAll('label'));
    const diabetesLabel = labelElements.find((label) => label.textContent?.trim() === 'Diabetes');
    const diabetesInput = document.getElementById(diabetesLabel?.htmlFor ?? '') as HTMLInputElement | null;
    expect(diabetesInput?.value).toBe('Sí');
  });

  it('should render a quick-add chip for alergias and insert its value into the alergias field on click', async () => {
    setup('DENTIST');
    await settle();
    expandSection('Antecedentes personales patológicos');

    const chipButtons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('app-chip button'));
    expect(chipButtons.map((button) => button.textContent?.trim())).toEqual(
      expect.arrayContaining(['Penicilina', 'Látex', 'Ninguna conocida']),
    );

    chipButtons.find((button) => button.textContent?.trim() === 'Penicilina')?.click();
    fixture.detectChanges();

    const labelElements: HTMLLabelElement[] = Array.from(fixture.nativeElement.querySelectorAll('label'));
    const alergiasLabel = labelElements.find((label) => label.textContent?.trim() === 'Alergias');
    const alergiasTextarea = document.getElementById(alergiasLabel?.htmlFor ?? '') as HTMLTextAreaElement | null;
    expect(alergiasTextarea?.value).toBe('Penicilina');
  });

  it('should save the alergias field as part of the antecedentesPersonalesPatologicos payload', async () => {
    setup('DENTIST');
    await settle();
    historiaClinicaApi.saveDraft.mockResolvedValue(sampleHistoriaClinica());

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.find((button) => button.textContent?.includes('Guardar'))!.click();
    await settle();

    expect(historiaClinicaApi.saveDraft).toHaveBeenCalledWith(
      'p1',
      expect.objectContaining({
        antecedentesPersonalesPatologicos: expect.objectContaining({ alergias: null }),
      }),
    );
  });

  it('should render tabaquismo, alcohol, and sustancias via app-segmented-control and never a <select>', async () => {
    setup('DENTIST');
    await settle();
    expandSection('Antecedentes personales patológicos');

    const segmentedControls = fixture.nativeElement.querySelectorAll('app-segmented-control');
    expect(segmentedControls.length).toBeGreaterThanOrEqual(3);
    expect(fixture.nativeElement.querySelectorAll('select').length).toBe(0);
  });
});
