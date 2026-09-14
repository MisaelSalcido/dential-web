import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { HistoriaClinicaApiService } from '../../../services/api/historia-clinica-api.service';
import { PatientApiService } from '../../../services/api/patient-api.service';
import { PatientDetail } from './patient-detail';

function samplePatient(overrides: Partial<Record<string, unknown>> = {}) {
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
    hasHistoriaClinica: false,
    historiaClinicaId: null,
    createdAt: '2026-09-13T09:12:00Z',
    ...overrides,
  };
}

describe('PatientDetail', () => {
  let fixture: ComponentFixture<PatientDetail>;
  let patientApi: { getById: ReturnType<typeof vi.fn> };
  let historiaClinicaApi: { start: ReturnType<typeof vi.fn> };
  let router: Router;

  function setup(patientData = samplePatient()): void {
    patientApi = { getById: vi.fn().mockResolvedValue(patientData) };
    historiaClinicaApi = { start: vi.fn() };

    TestBed.configureTestingModule({
      imports: [PatientDetail],
      providers: [
        { provide: PatientApiService, useValue: patientApi },
        { provide: HistoriaClinicaApiService, useValue: historiaClinicaApi },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ patientId: 'p1' })),
            snapshot: { paramMap: convertToParamMap({ patientId: 'p1' }) },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(PatientDetail);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  }

  it('should create and load the patient by route id', async () => {
    setup();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(patientApi.getById).toHaveBeenCalledWith('p1');
    expect(fixture.nativeElement.textContent).toContain('Jorge Aguilar Ortiz');
    expect(fixture.nativeElement.textContent).toContain('000001');
  });

  it('should show an allergy badge when the patient has allergies', async () => {
    setup(samplePatient({ alergias: 'Penicilina' }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Penicilina');
  });

  it('should start the historia clinica and navigate when none exists yet', async () => {
    setup(samplePatient({ hasHistoriaClinica: false }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    historiaClinicaApi.start.mockResolvedValue({ id: 'hc1' });

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(historiaClinicaApi.start).toHaveBeenCalledWith('p1');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/pacientes/p1/historia-clinica');
  });

  it('should redirect to the existing historia clinica when start returns 409 HISTORIA_CLINICA_ALREADY_EXISTS', async () => {
    setup(samplePatient({ hasHistoriaClinica: false }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    historiaClinicaApi.start.mockRejectedValue({ error: { errorCode: 'HISTORIA_CLINICA_ALREADY_EXISTS' } });

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/pacientes/p1/historia-clinica');
  });

  it('should navigate directly to the historia clinica when one already exists', async () => {
    setup(samplePatient({ hasHistoriaClinica: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(historiaClinicaApi.start).not.toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/pacientes/p1/historia-clinica');
  });
});
