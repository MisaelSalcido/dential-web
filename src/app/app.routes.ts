import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard-shell/dashboard-shell').then((m) => m.DashboardShell),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
      { path: 'pacientes', loadComponent: () => import('./pages/patients/patients').then((m) => m.Patients) },
      { path: 'agenda', loadComponent: () => import('./pages/agenda/agenda').then((m) => m.Agenda) },
      { path: 'documentos', loadComponent: () => import('./pages/documents/documents').then((m) => m.Documents) },
      { path: 'ajustes', loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings) },
    ],
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
