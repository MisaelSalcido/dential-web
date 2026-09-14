import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PatientSummary } from '../../models/patient.model';
import { PatientCreateModalService } from '../../services/local/patient-create-modal.service';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-patient-search-results',
  imports: [Badge, RouterLink],
  templateUrl: './patient-search-results.html',
  styleUrl: './patient-search-results.css',
})
export class PatientSearchResults {
  private readonly modalService = inject(PatientCreateModalService);

  results = input<PatientSummary[]>([]);
  loading = input<boolean>(false);
  query = input<string>('');

  resultSelected = output<void>();

  protected openCreateWithQuery(): void {
    this.modalService.open(this.query());
    this.resultSelected.emit();
  }

  protected select(): void {
    this.resultSelected.emit();
  }
}
