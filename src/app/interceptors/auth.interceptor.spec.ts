import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../services/local/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: { accessToken: ReturnType<typeof vi.fn>; refresh: ReturnType<typeof vi.fn> };
  let router: Router;
  let token: string | null;

  beforeEach(() => {
    token = 'expired-token';
    authService = {
      accessToken: vi.fn(() => token),
      refresh: vi.fn(async () => {
        token = 'fresh-token';
        return {} as never;
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should attach the bearer token from AuthService', () => {
    httpClient.get('/api/patients').subscribe();

    const req = httpMock.expectOne('/api/patients');
    expect(req.request.headers.get('Authorization')).toBe('Bearer expired-token');
    req.flush({});
  });

  it('should refresh once and retry the original request on a 401', async () => {
    let result: unknown;
    httpClient.get('/api/patients').subscribe((value) => (result = value));

    const firstReq = httpMock.expectOne('/api/patients');
    firstReq.flush({ errorCode: 'SESSION_EXPIRED' }, { status: 401, statusText: 'Unauthorized' });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const retriedReq = httpMock.expectOne('/api/patients');
    expect(retriedReq.request.headers.get('Authorization')).toBe('Bearer fresh-token');
    retriedReq.flush({ ok: true });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(authService.refresh).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: true });
  });

  it('should redirect to /login when the refresh attempt also fails', async () => {
    authService.refresh.mockRejectedValue(new Error('refresh failed'));

    let caught: unknown;
    httpClient.get('/api/patients').subscribe({ error: (error) => (caught = error) });

    const firstReq = httpMock.expectOne('/api/patients');
    firstReq.flush({ errorCode: 'SESSION_EXPIRED' }, { status: 401, statusText: 'Unauthorized' });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    expect(caught).toBeTruthy();
  });

  it('should not attempt a refresh for a 401 from the login endpoint itself', () => {
    httpClient.post('http://localhost:8080/api/auth/login', {}).subscribe({ error: () => {} });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    req.flush({ errorCode: 'INVALID_CREDENTIALS' }, { status: 401, statusText: 'Unauthorized' });

    expect(authService.refresh).not.toHaveBeenCalled();
  });
});
