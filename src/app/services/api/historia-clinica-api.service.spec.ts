import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { HistoriaClinicaApiService } from './historia-clinica-api.service';

function sampleHistoriaClinica() {
  return {
    id: 'hc1',
    status: 'DRAFT',
    antecedentesHeredofamiliares: null,
    antecedentesPersonalesPatologicos: {
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
  };
}

describe('HistoriaClinicaApiService', () => {
  let service: HistoriaClinicaApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HistoriaClinicaApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should GET the historia clinica for a patient', async () => {
    const promise = service.get('p1');

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/patients/p1/historia-clinica`);
    expect(req.request.method).toBe('GET');
    req.flush(sampleHistoriaClinica());

    const result = await promise;
    expect(result.id).toBe('hc1');
  });

  it('should POST an empty body to start a draft', async () => {
    const promise = service.start('p1');

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/patients/p1/historia-clinica`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(sampleHistoriaClinica());

    await promise;
  });

  it('should PATCH the given section payload on saveDraft', async () => {
    const payload = { antecedentesHeredofamiliares: 'Madre con diabetes tipo 2' };
    const promise = service.saveDraft('p1', payload);

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/patients/p1/historia-clinica`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush({ ...sampleHistoriaClinica(), antecedentesHeredofamiliares: payload.antecedentesHeredofamiliares });

    const result = await promise;
    expect(result.antecedentesHeredofamiliares).toBe(payload.antecedentesHeredofamiliares);
  });

  it('should POST to finalize', async () => {
    const promise = service.finalize('p1');

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/patients/p1/historia-clinica/finalize`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...sampleHistoriaClinica(), status: 'FINALIZADO' });

    const result = await promise;
    expect(result.status).toBe('FINALIZADO');
  });
});
