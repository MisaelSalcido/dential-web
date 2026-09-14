import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { Alert } from '../../../components/alert/alert';
import { Badge } from '../../../components/badge/badge';
import { Button } from '../../../components/button/button';
import { Card } from '../../../components/card/card';
import { Patient } from '../../../models/patient.model';
import { HistoriaClinicaApiService } from '../../../services/api/historia-clinica-api.service';
import { PatientApiService } from '../../../services/api/patient-api.service';

@Component({
  selector: 'app-patient-detail',
  imports: [Alert, Badge, Button, Card],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.css',
})
export class PatientDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly patientApi = inject(PatientApiService);
  private readonly historiaClinicaApi = inject(HistoriaClinicaApiService);

  private readonly patientId = toSignal(this.route.paramMap.pipe(map((params) => params.get('patientId'))), {
    initialValue: this.route.snapshot.paramMap.get('patientId'),
  });

  protected readonly patient = signal<Patient | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly startingHistoriaClinica = signal(false);

  constructor() {
    void this.loadPatient();
  }

  protected async loadPatient(): Promise<void> {
    const id = this.patientId();
    if (!id) {
      return;
    }
    this.loading.set(true);
    this.loadError.set(null);
    try {
      this.patient.set(await this.patientApi.getById(id));
    } catch {
      this.loadError.set('No se pudo cargar el paciente.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async openHistoriaClinica(): Promise<void> {
    const patient = this.patient();
    if (!patient) {
      return;
    }

    if (patient.hasHistoriaClinica) {
      await this.router.navigateByUrl(`/pacientes/${patient.id}/historia-clinica`);
      return;
    }

    this.startingHistoriaClinica.set(true);
    try {
      await this.historiaClinicaApi.start(patient.id);
      await this.router.navigateByUrl(`/pacientes/${patient.id}/historia-clinica`);
    } catch (error) {
      const body = (error as { error?: { errorCode?: string } } | undefined)?.error;
      if (body?.errorCode === 'HISTORIA_CLINICA_ALREADY_EXISTS') {
        // A Historia Clínica was already created for this patient (e.g. in another tab) between
        // this page's load and the click — the route only needs patientId, so it's reachable
        // exactly like the normal "already has one" case.
        await this.router.navigateByUrl(`/pacientes/${patient.id}/historia-clinica`);
      } else {
        this.loadError.set('No se pudo iniciar la historia clínica.');
      }
    } finally {
      this.startingHistoriaClinica.set(false);
    }
  }
}
