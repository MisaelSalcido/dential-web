import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthApiService, LoginPayload, SignupPayload } from '../api/auth-api.service';
import { AuthResponse, AuthUser } from '../../models/auth-user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApiService);

  readonly accessToken = signal<string | null>(null);
  readonly currentUser = signal<AuthUser | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  async login(payload: LoginPayload): Promise<AuthUser> {
    const response = await this.authApi.login(payload);
    this.applySession(response);
    return response.user;
  }

  async signup(payload: SignupPayload): Promise<AuthUser> {
    const response = await this.authApi.signup(payload);
    this.applySession(response);
    return response.user;
  }

  async refresh(): Promise<AuthUser> {
    try {
      const response = await this.authApi.refresh();
      this.applySession(response);
      return response.user;
    } catch (error) {
      this.clearSession();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authApi.logout();
    } finally {
      this.clearSession();
    }
  }

  private applySession(response: AuthResponse): void {
    this.accessToken.set(response.accessToken);
    this.currentUser.set(response.user);
  }

  private clearSession(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
  }
}
