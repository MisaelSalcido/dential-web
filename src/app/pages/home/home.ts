import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../components/button/button';
import { EmptyState } from '../../components/empty-state/empty-state';
import { QuickAction } from '../../models/quick-action.model';

const QUICK_ACTIONS: QuickAction[] = [
  { key: 'new-patient', label: '＋ Nuevo paciente', variant: 'primary', targetPath: '/pacientes' },
  { key: 'search-patient', label: 'Buscar paciente', variant: 'secondary', targetPath: '/pacientes' },
];

@Component({
  selector: 'app-home',
  imports: [Button, EmptyState],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly router = inject(Router);

  protected readonly quickActions = QUICK_ACTIONS;

  protected navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }
}
