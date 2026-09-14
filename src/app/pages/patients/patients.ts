import { Component, effect, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Badge } from '../../components/badge/badge';
import { Button } from '../../components/button/button';
import { Card } from '../../components/card/card';
import { EmptyState } from '../../components/empty-state/empty-state';
import { SearchField } from '../../components/search-field/search-field';
import { PatientApiService } from '../../services/api/patient-api.service';
import { PatientCreateModalService } from '../../services/local/patient-create-modal.service';

const DEBOUNCE_MS = 300;

@Component({
  selector: 'app-patients',
  imports: [Badge, Button, Card, EmptyState, RouterLink, SearchField],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients {
  private readonly patientApi = inject(PatientApiService);
  protected readonly modalService = inject(PatientCreateModalService);

  protected readonly query = signal('');
  private readonly debouncedQuery = signal('');
  private debounceTimer?: ReturnType<typeof setTimeout>;

  protected readonly searchResource = resource({
    params: () => this.debouncedQuery().trim(),
    loader: async ({ params }) => (params ? await this.patientApi.search(params) : []),
  });

  constructor() {
    effect(() => {
      const value = this.query();
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.debouncedQuery.set(value), DEBOUNCE_MS);
    });
  }

  protected openCreateModal(): void {
    this.modalService.open();
  }
}
