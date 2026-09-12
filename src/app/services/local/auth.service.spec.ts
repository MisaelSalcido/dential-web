import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AuthApiService } from '../api/auth-api.service';
import { AuthResponse } from '../../models/auth-user.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let authApi: {
    login: ReturnType<typeof vi.fn>;
    signup: ReturnType<typeof vi.fn>;
    refresh: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  const sampleResponse: AuthResponse = {
    accessToken: 'token-abc',
    accessTokenExpiresInSeconds: 3600,
    user: { id: '1', fullName: 'Ana', email: 'a@b.com', role: 'ADMIN', tenant: null },
  };

  beforeEach(() => {
    authApi = { login: vi.fn(), signup: vi.fn(), refresh: vi.fn(), logout: vi.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthApiService, useValue: authApi }],
    });

    service = TestBed.inject(AuthService);
  });

  it('should populate session signals on successful login', async () => {
    authApi.login.mockResolvedValue(sampleResponse);

    await service.login({ email: 'a@b.com', password: 'secret123' });

    expect(service.accessToken()).toBe('token-abc');
    expect(service.currentUser()).toEqual(sampleResponse.user);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear local signals after a successful logout', async () => {
    authApi.login.mockResolvedValue(sampleResponse);
    await service.login({ email: 'a@b.com', password: 'secret123' });

    authApi.logout.mockResolvedValue(undefined);
    await service.logout();

    expect(authApi.logout).toHaveBeenCalled();
    expect(service.accessToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should clear local signals even when the logout network call fails', async () => {
    authApi.login.mockResolvedValue(sampleResponse);
    await service.login({ email: 'a@b.com', password: 'secret123' });

    authApi.logout.mockRejectedValue(new Error('network error'));

    await expect(service.logout()).rejects.toThrow('network error');

    expect(service.accessToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
  });

  it('should clear the session when a refresh attempt fails', async () => {
    authApi.login.mockResolvedValue(sampleResponse);
    await service.login({ email: 'a@b.com', password: 'secret123' });

    authApi.refresh.mockRejectedValue({ error: { errorCode: 'SESSION_EXPIRED' } });

    await expect(service.refresh()).rejects.toBeTruthy();
    expect(service.currentUser()).toBeNull();
    expect(service.accessToken()).toBeNull();
  });
});
