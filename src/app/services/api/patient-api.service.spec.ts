import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { PatientApiService } from './patient-api.service';

describe('PatientApiService', () => {
  let service: PatientApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PatientApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST the payload to /patients on create', async () => {
    const payload = { fullName: 'Jorge Aguilar Ortiz', phone: '5544218890', birthDate: '1988-07-14' };
    const promise = service.create(payload);

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/patients`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({
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
    });

    const result = await promise;
    expect(result.folio).toBe('000001');
  });

  it('should GET /patients/{id} on getById', async () => {
    const promise = service.getById('p1');

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/patients/p1`);
    expect(req.request.method).toBe('GET');

    req.flush({
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
    });

    const result = await promise;
    expect(result.id).toBe('p1');
  });

  it('should GET /patients/search?q= and unwrap results on search', async () => {
    const promise = service.search('Jorge');

    const req = httpMock.expectOne((request) => request.url === `${environment.apiBaseUrl}/patients/search`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe('Jorge');

    req.flush({
      results: [
        { id: 'p1', fullName: 'Jorge Aguilar Ortiz', folio: '000001', phone: '5544218890', edad: 38, hasAllergies: false, lastVisitAt: null },
      ],
    });

    const result = await promise;
    expect(result).toHaveLength(1);
    expect(result[0].fullName).toBe('Jorge Aguilar Ortiz');
  });
});
