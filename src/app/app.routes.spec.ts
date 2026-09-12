import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { AuthService } from './services/local/auth.service';

describe('app routes', () => {
  it('should redirect an unauthenticated visit to "/" to /login instead of rendering a blank page', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    const router = TestBed.inject(Router);
    expect(router.url).toBe('/login');
  });

  it('should redirect an unknown URL to "/" (and, unauthenticated, on to /login)', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/some/unknown/path');

    const router = TestBed.inject(Router);
    expect(router.url).toBe('/login');
  });

  it('should render Home at "/" for an authenticated user', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });

    const authService = TestBed.inject(AuthService);
    // Simulate an already-restored session without going through a real HTTP login.
    authService.currentUser.set({
      id: '1',
      fullName: 'Dra. Ana López',
      email: 'ana@example.com',
      role: 'ADMIN',
      tenant: null,
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    const router = TestBed.inject(Router);
    expect(router.url).toBe('/');
  });
});
