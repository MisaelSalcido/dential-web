import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../models/auth-user.model';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  clinicName: string;
  fullName: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload, { withCredentials: true }),
    );
  }

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    return firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/signup`, payload, { withCredentials: true }),
    );
  }

  async refresh(): Promise<AuthResponse> {
    return firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, {}, { withCredentials: true }),
    );
  }

  async logout(): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${this.baseUrl}/logout`, {}, { withCredentials: true }));
  }
}
