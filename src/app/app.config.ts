import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/local/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      try {
        await authService.refresh();
      } catch {
        // No valid session to restore (first visit, expired, or logged out) — stay signed out.
      }
    }),
  ]
};
