export type Role = 'PLATFORM_ADMIN' | 'ADMIN' | 'DENTIST' | 'ASSISTANT';

export interface TenantSummary {
  id: string;
  name: string;
  subscriptionPlan: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  tenant: TenantSummary | null;
}

export interface AuthResponse {
  accessToken: string;
  accessTokenExpiresInSeconds: number;
  user: AuthUser;
}

export interface AuthFieldError {
  field: string;
  message: string;
}

export interface AuthErrorBody {
  errorCode: string;
  message?: string;
  retryAfterSeconds?: number;
  fieldErrors?: AuthFieldError[];
}
