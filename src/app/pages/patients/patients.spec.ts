import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { PatientApiService } from '../../services/api/patient-api.service';
import { PatientCreateModalService } from '../../services/local/patient-create-modal.service';
import { Patients } from './patients';

function sampleResult(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'p1',
    fullName: 'Jorge Aguilar Ortiz',
    folio: '000001',
    phone: '5544218890',
    edad: 38,
    hasAllergies: false,
    lastVisitAt: null,
    ...overrides,
  };
}

describe('Patients', () => {
  let fixture: ComponentFixture<Patients>;
  let patientApi: { search: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    patientApi = { search: vi.fn().mockResolvedValue([]) };

    await TestBed.configureTestingModule({
      imports: [Patients],
      providers: [provideRouter([]), { provide: PatientApiService, useValue: patientApi }],
    }).compileComponents();

    fixture = TestBed.createComponent(Patients);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Pacientes heading', () => {
    expect(fixture.nativeElement.textContent).toContain('Pacientes');
  });

  it('should show an empty prompt before typing a query', () => {
    expect(fixture.nativeElement.textContent).toContain('Busca un paciente');
  });

  it('should open the create modal when "Nuevo paciente" is clicked', () => {
    const modalService = TestBed.inject(PatientCreateModalService);
    const openSpy = vi.spyOn(modalService, 'open');

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(openSpy).toHaveBeenCalled();
  });

  it('should search after typing and render results', async () => {
    patientApi.search.mockResolvedValue([sampleResult()]);

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
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
});
