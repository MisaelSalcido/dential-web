import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
  },
  { path: '**', redirectTo: '' },
];
