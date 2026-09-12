import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST credentials to /auth/login with credentials included', async () => {
    const promise = service.login({ email: 'a@b.com', password: 'secret123' });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual({ email: 'a@b.com', password: 'secret123' });

    req.flush({
      accessToken: 'token-abc',
      accessTokenExpiresInSeconds: 3600,
      user: { id: '1', fullName: 'Ana', email: 'a@b.com', role: 'ADMIN', tenant: null },
    });

    const response = await promise;
    expect(response.accessToken).toBe('token-abc');
    expect(response.user.role).toBe('ADMIN');
  });

  it('should POST to /auth/signup with the signup payload', async () => {
    const payload = { clinicName: 'Consultorio', fullName: 'Ana', email: 'a@b.com', password: 'secret123' };
    const promise = service.signup(payload);

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signup`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual(payload);

    req.flush({
      accessToken: 'token-abc',
      accessTokenExpiresInSeconds: 3600,
      user: { id: '1', fullName: 'Ana', email: 'a@b.com', role: 'ADMIN', tenant: { id: 't1', name: 'Consultorio', subscriptionPlan: 'FREE' } },
    });

    await promise;
  });

  it('should POST to /auth/refresh with no body', async () => {
    const promise = service.refresh();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);

    req.flush({
      accessToken: 'token-def',
      accessTokenExpiresInSeconds: 3600,
      user: { id: '1', fullName: 'Ana', email: 'a@b.com', role: 'ADMIN', tenant: null },
    });

    await promise;
  });

  it('should POST to /auth/logout with credentials included', async () => {
    const promise = service.logout();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    req.flush(null, { status: 204, statusText: 'No Content' });

    await promise;
  });
});
