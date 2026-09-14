import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../components/button/button';
import { EmptyState } from '../../components/empty-state/empty-state';
import { QuickAction } from '../../models/quick-action.model';
import { PatientCreateModalService } from '../../services/local/patient-create-modal.service';

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
  private readonly patientCreateModalService = inject(PatientCreateModalService);

  protected readonly quickActions = QUICK_ACTIONS;

  protected handleQuickAction(action: QuickAction): void {
    if (action.key === 'new-patient') {
      this.patientCreateModalService.open();
      return;
    }
    this.router.navigateByUrl(action.targetPath);
  }
}
