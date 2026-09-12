import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/local/auth.service';

const AUTH_ENDPOINT_SEGMENTS = ['/auth/login', '/auth/signup', '/auth/refresh', '/auth/logout'];

function isAuthEndpoint(url: string): boolean {
  return AUTH_ENDPOINT_SEGMENTS.some((segment) => url.includes(segment));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const withToken = (request: typeof req) => {
    const token = authService.accessToken();
    return token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
  };

  return next(withToken(req)).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;
      if (!isUnauthorized || isAuthEndpoint(req.url)) {
        return throwError(() => error);
      }

      return from(authService.refresh()).pipe(
        switchMap(() => next(withToken(req))),
        catchError((refreshError: unknown) => {
          void router.navigateByUrl('/login');
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
